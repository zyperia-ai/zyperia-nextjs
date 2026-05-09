import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Embedding functions (inlined from apps/lib/embeddings.ts)
async function generateEmbedding(text: string): Promise<number[]> {
  const voyageKey = process.env.VOYAGE_API_KEY

  if (!voyageKey) {
    throw new Error('VOYAGE_API_KEY não configurada no .env.local')
  }

  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${voyageKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'voyage-4-lite',
      input: text.slice(0, 8000),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Voyage AI error: ${error}`)
  }

  const data = await response.json() as any
  const embedding = data.data[0].embedding

  // Respeitar rate limit de 3 RPM (~20s entre chamadas, usando 25s por segurança)
  await new Promise(resolve => setTimeout(resolve, 25000))

  return embedding
}

function textForEmbedding(article: {
  title: string
  excerpt?: string | null
  content: string
}): string {
  return `${article.title}\n\n${article.excerpt || ''}\n\n${article.content.slice(0, 2000)}`
}

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const anthropicKey = process.env.ANTHROPIC_API_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const anthropic = new Anthropic({ apiKey: anthropicKey })

const BACKUP_FILE = path.join(process.cwd(), 'apps/scripts/internal-linking-v2-backup.json')

const BLOG_URLS: { [key: string]: string } = {
  crypto: 'https://crypto.zyperia.ai',
  intelligence: 'https://intelligence.zyperia.ai',
  onlinebiz: 'https://onlinebiz.zyperia.ai',
}

interface Article {
  id: string
  app_id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  internal_link_count: number
  content_embedding: number[] | null
}

interface LinkSuggestion {
  phrase: string
  target_slug: string
  target_title: string
}

async function generateAndStoreEmbeddings(): Promise<number> {
  console.log('Gerando embeddings para artigos publicados sem embedding...\n')

  const { data: articles, error } = await supabase
    .from('blog_posts')
    .select('id, app_id, title, slug, content, excerpt, internal_link_count')
    .eq('status', 'published')
    .is('content_embedding', null)
    .limit(100)

  if (error) {
    console.error('Erro ao buscar artigos:', error.message)
    return 0
  }

  let generatedCount = 0

  for (const article of articles || []) {
    try {
      const textToEmbed = textForEmbedding({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
      })

      const embedding = await generateEmbedding(textToEmbed)

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ content_embedding: embedding })
        .eq('id', article.id)

      if (updateError) {
        console.error(`❌ Erro ao atualizar ${article.slug}:`, updateError.message)
      } else {
        console.log(`✅ Embedding gerado: ${article.title}`)
        generatedCount++
      }
    } catch (err) {
      console.error(`❌ Erro ao gerar embedding para ${article.slug}:`, err)
    }
  }

  return generatedCount
}

async function findRelatedArticles(
  articleId: string,
  blogId: string,
  embedding: number[],
  count = 10
): Promise<any[]> {
  try {
    const { data: relatedArticles, error } = await supabase
      .rpc('match_articles', {
        query_embedding: embedding,
        match_blog_id: blogId,
        exclude_article_id: articleId,
        match_count: count,
      })

    if (error) {
      console.error('Erro ao buscar artigos relacionados:', error.message)
      return []
    }

    return relatedArticles || []
  } catch (err) {
    console.error('Erro na busca de artigos relacionados:', err)
    return []
  }
}

async function suggestAndApplyLinks(
  article: Article,
  relatedArticles: any[],
  blogUrl: string
): Promise<{ applied: LinkSuggestion[]; ignored: LinkSuggestion[] }> {
  const applied: LinkSuggestion[] = []
  const ignored: LinkSuggestion[] = []

  if (relatedArticles.length === 0) {
    return { applied, ignored }
  }

  const articlesList = relatedArticles
    .map((a) => `slug: ${a.slug} | title: ${a.title} | excerpt: ${a.excerpt?.substring(0, 100) || 'N/A'}`)
    .join('\n')

  const prompt = `You are an SEO specialist. Find 2-3 natural places in this article
where linking to a related article would genuinely help the reader.

Current article: ${article.title}
Content (first 1000 chars): ${article.content.substring(0, 1000)}

Related articles available:
${articlesList}

Rules:
- Only suggest links genuinely relevant in context
- Never link to the same article twice
- Anchor text must be an EXACT phrase existing in the article
- Max 3 suggestions
- Return JSON only:
{ links: [{ phrase: 'exact phrase', target_slug: 'slug', target_title: 'title' }] }`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return { applied, ignored }
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { applied, ignored }
    }

    const parsed = JSON.parse(jsonMatch[0])
    const suggestions = parsed.links || []

    for (const suggestion of suggestions) {
      // 1. Verificar se a phrase existe no conteúdo
      const phraseRegex = new RegExp(`\\b${suggestion.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
      if (!phraseRegex.test(article.content)) {
        ignored.push(suggestion)
        continue
      }

      // 2. Verificar se já existe link para este alvo
      const { data: existingLink } = await supabase
        .from('article_internal_links')
        .select('id')
        .eq('source_id', article.id)
        .eq('target_id', relatedArticles.find((a) => a.slug === suggestion.target_slug)?.id)
        .maybeSingle()

      if (existingLink) {
        ignored.push(suggestion)
        continue
      }

      // 3. Verificar se já tem 5 ou mais links
      if (article.internal_link_count >= 5) {
        ignored.push(suggestion)
        continue
      }

      // 4. Aplicar o link
      const newContent = article.content.replace(
        phraseRegex,
        `[${suggestion.phrase}](${blogUrl}/articles/${suggestion.target_slug})`
      )

      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          content: newContent,
          internal_link_count: article.internal_link_count + 1,
        })
        .eq('id', article.id)

      if (updateError) {
        console.error(`Erro ao atualizar artigo:`, updateError.message)
        ignored.push(suggestion)
        continue
      }

      // 5. Registar o link
      const targetArticle = relatedArticles.find((a) => a.slug === suggestion.target_slug)
      if (targetArticle) {
        await supabase.from('article_internal_links').insert({
          source_id: article.id,
          target_id: targetArticle.id,
          anchor_text: suggestion.phrase,
        })
      }

      applied.push(suggestion)
      article.internal_link_count++
      article.content = newContent
    }
  } catch (err) {
    console.error('Erro ao chamar Haiku:', err)
  }

  return { applied, ignored }
}

async function updateBacklinks(
  newArticle: Article,
  newArticleEmbedding: number[],
  blogId: string,
  blogUrl: string
): Promise<number> {
  console.log(`\n🔄 Atualizando backlinks para: ${newArticle.slug}`)

  let backlinkCount = 0
  const relatedArticles = await findRelatedArticles(newArticle.id, blogId, newArticleEmbedding, 3)

  for (const relatedArticle of relatedArticles) {
    const { data: existingArticle } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', relatedArticle.id)
      .maybeSingle()

    if (!existingArticle || existingArticle.internal_link_count >= 5) {
      continue
    }

    const prompt = `You are an SEO specialist. This is a related article that should link to the new article below.

Related article title: ${relatedArticle.title}
Related article content (first 1000 chars): ${existingArticle.content.substring(0, 1000)}

New article: ${newArticle.title}
New article slug: ${newArticle.slug}

Find exactly ONE natural place in the related article where a link to the new article would help the reader.
The anchor text must be an EXACT phrase from the related article content.

Return JSON only:
{ link: { phrase: 'exact phrase', target_slug: '${newArticle.slug}', target_title: '${newArticle.title}' } }`

    try {
      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      const content = message.content[0]
      if (content.type !== 'text') {
        continue
      }

      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        continue
      }

      const parsed = JSON.parse(jsonMatch[0])
      const suggestion = parsed.link

      if (!suggestion) {
        continue
      }

      // Verificar se a phrase existe
      const phraseRegex = new RegExp(
        `\\b${suggestion.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`
      )
      if (!phraseRegex.test(existingArticle.content)) {
        continue
      }

      // Aplicar o link
      const newContent = existingArticle.content.replace(
        phraseRegex,
        `[${suggestion.phrase}](${blogUrl}/articles/${suggestion.target_slug})`
      )

      await supabase
        .from('blog_posts')
        .update({
          content: newContent,
          internal_link_count: existingArticle.internal_link_count + 1,
        })
        .eq('id', existingArticle.id)

      await supabase.from('article_internal_links').insert({
        source_id: existingArticle.id,
        target_id: newArticle.id,
        anchor_text: suggestion.phrase,
      })

      console.log(`  ✅ Backlink adicionado a: ${relatedArticle.title}`)
      backlinkCount++
    } catch (err) {
      console.error(`  ❌ Erro ao processar backlinks:`, err)
    }
  }

  return backlinkCount
}

async function backupArticle(article: Article, originalContent: string) {
  let backups: any[] = []

  if (fs.existsSync(BACKUP_FILE)) {
    const data = fs.readFileSync(BACKUP_FILE, 'utf-8')
    backups = JSON.parse(data)
  }

  backups.push({
    article_id: article.id,
    article_slug: article.slug,
    app_id: article.app_id,
    timestamp: new Date().toISOString(),
    original_content: originalContent,
  })

  fs.writeFileSync(BACKUP_FILE, JSON.stringify(backups, null, 2))
}

async function processFullMode(): Promise<void> {
  console.log('🚀 Modo FULL — Processando todos os artigos publicados\n')

  // 1. Gerar embeddings
  const embeddingCount = await generateAndStoreEmbeddings()
  console.log(`\n✅ ${embeddingCount} embeddings gerados\n`)

  // 2. Para cada artigo publicado, sugerir links
  const { data: allArticles } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .not('content_embedding', 'is', null)

  if (!allArticles || allArticles.length === 0) {
    console.log('Nenhum artigo com embedding encontrado')
    return
  }

  let totalLinksApplied = 0
  const appGroups = new Map<string, any[]>()

  for (const article of allArticles) {
    if (!appGroups.has(article.app_id)) {
      appGroups.set(article.app_id, [])
    }
    appGroups.get(article.app_id)!.push(article)
  }

  for (const [appId, articles] of appGroups) {
    console.log(`\n========== Processando ${appId} ==========`)
    const blogUrl = BLOG_URLS[appId]

    for (const article of articles) {
      console.log(`\n[${article.slug}] Buscando artigos relacionados...`)

      const relatedArticles = await findRelatedArticles(
        article.id,
        appId,
        article.content_embedding,
        10
      )

      if (relatedArticles.length === 0) {
        console.log('  Nenhum artigo relacionado encontrado')
        continue
      }

      const originalContent = article.content
      const { applied } = await suggestAndApplyLinks(article, relatedArticles, blogUrl)

      if (applied.length > 0) {
        await backupArticle(article, originalContent)
        totalLinksApplied += applied.length

        console.log(`  ✅ ${applied.length} links aplicados`)
        applied.forEach((link) => {
          console.log(`    - "${link.phrase}" → ${link.target_slug}`)
        })
      }
    }
  }

  console.log(`\n========== RESUMO ==========`)
  console.log(`Total de links aplicados: ${totalLinksApplied}`)
  console.log('✅ Processamento completo')
}

async function processNewMode(slug: string): Promise<void> {
  console.log(`🚀 Modo NEW — Processando artigo: ${slug}\n`)

  const { data: article, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !article) {
    console.error(`❌ Artigo não encontrado: ${slug}`)
    return
  }

  // 1. Gerar embedding se não existir
  if (!article.content_embedding) {
    console.log('Gerando embedding...')
    const textToEmbed = textForEmbedding({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
    })

    const embedding = await generateEmbedding(textToEmbed)
    await supabase
      .from('blog_posts')
      .update({ content_embedding: embedding })
      .eq('id', article.id)

    article.content_embedding = embedding
    console.log('✅ Embedding gerado\n')
  }

  // 2. Sugerir links para este artigo
  console.log('Buscando artigos relacionados...')
  const relatedArticles = await findRelatedArticles(
    article.id,
    article.app_id,
    article.content_embedding,
    10
  )

  if (relatedArticles.length === 0) {
    console.log('Nenhum artigo relacionado encontrado')
  } else {
    const blogUrl = BLOG_URLS[article.app_id]
    const originalContent = article.content
    const { applied } = await suggestAndApplyLinks(article, relatedArticles, blogUrl)

    if (applied.length > 0) {
      await backupArticle(article, originalContent)
      console.log(`✅ ${applied.length} links aplicados`)
      applied.forEach((link) => {
        console.log(`  - "${link.phrase}" → ${link.target_slug}`)
      })
    }
  }

  // 3. Atualizar backlinks
  const backlinkCount = await updateBacklinks(article, article.content_embedding, article.app_id, BLOG_URLS[article.app_id])
  console.log(`✅ ${backlinkCount} backlinks criados`)
  console.log('\n✅ Processamento completo')
}

async function main() {
  const args = process.argv.slice(2)
  const mode = args.find((a) => a.startsWith('--mode='))?.split('=')[1] || 'full'
  const slug = args.find((a) => a.startsWith('--slug='))?.split('=')[1]

  try {
    if (mode === 'full') {
      await processFullMode()
    } else if (mode === 'new' && slug) {
      await processNewMode(slug)
    } else {
      console.log('Uso:')
      console.log('  npx ts-node apps/scripts/internal-linking-v2.ts --mode=full')
      console.log('  npx ts-node apps/scripts/internal-linking-v2.ts --mode=new --slug=article-slug')
    }
  } catch (error) {
    console.error('❌ Erro:', error)
    process.exit(1)
  }
}

// Exportar função para uso directo em endpoints
export async function processNewArticleForLinking(slug: string): Promise<{ success: boolean; error?: any }> {
  try {
    console.log(`🚀 Processando internal linking para: ${slug}`)
    await processNewMode(slug)
    return { success: true }
  } catch (error) {
    console.error('❌ Erro ao processar linking:', error)
    return { success: false, error }
  }
}

// CLI entry point
if (require.main === module) {
  main()
}
