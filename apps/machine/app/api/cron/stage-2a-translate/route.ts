export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const maxDuration = 800

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { extractMetadata } from '@/lib/metadata-extractor'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

const BYLINE_BY_APP: Record<string, string> = {
  crypto: 'Redacção ZYPERIA Crypto',
  intelligence: 'Redacção ZYPERIA Intelligence',
  onlinebiz: 'Redacção ZYPERIA OnlineBiz',
}

const DISCLAIMER_BY_APP: Record<string, string> = {
  crypto: `\n\n---\n\n## Sobre este artigo\n\nEste artigo foi investigado com base em fontes verificadas e dados actualizados de ${new Date().getFullYear()}.\n\n*Aviso: Este conteúdo é apenas para fins informativos e educativos. Não constitui aconselhamento financeiro ou de investimento.*`,
  intelligence: `\n\n---\n\n## Sobre este artigo\n\nEste artigo foi investigado com base em fontes verificadas e dados actualizados de ${new Date().getFullYear()}.\n\n*Aviso: Este conteúdo é apenas para fins informativos e educativos.*`,
  onlinebiz: `\n\n---\n\n## Sobre este artigo\n\nEste artigo foi investigado com base em fontes verificadas e dados actualizados de ${new Date().getFullYear()}.\n\n*Aviso: Este conteúdo é apenas para fins informativos e educativos. Os resultados mencionados podem variar.*`,
}

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function generateSlug(title: string): string {
  const raw = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (raw.length <= 100) return raw || `artigo-${Date.now()}`
  const truncated = raw.slice(0, 100)
  const lastDash = truncated.lastIndexOf('-')
  const safe = lastDash > 60 ? truncated.slice(0, lastDash) : truncated
  return safe || `artigo-${Date.now()}`
}

function resolveGenerationApproach(contentType: string): string {
  if (contentType === 'tipo1' || contentType === 'breaking_news') return 'breaking_news'
  if (contentType === 'tipo2' || contentType === 'youtube_newsletter') return 'youtube_newsletter'
  return 'evergreen'
}

const TRANSLATION_RULES = `REGRAS ABSOLUTAS DE TRADUÇÃO:
- Traduzes frase a frase para português europeu (PT-PT, não PT-BR)
- Mesmo número aproximado de palavras que o original (±10%)
- NUNCA acrescentas explicações, exemplos, analogias ou contexto novo
- NUNCA expandes parágrafos — traduzes apenas o que está escrito
- NUNCA omites informação que esteja na fonte
- Preservas todos os factos, dados, números e nomes próprios exactamente
- NUNCA inventas informação que não está na fonte
- Se o original é informal, mantém informal; se é técnico, mantém técnico
- Não suavizas opiniões nem polís afirmações fortes do autor original`

function getSystemPrompt(contentType: string): string {
  const base = `És um tradutor profissional especializado em conteúdo editorial.
A tua função é traduzir fielmente para português europeu, sem reescrever.

${TRANSLATION_RULES}`

  if (contentType === 'tipo1') {
    return `${base}

CONTEXTO TIPO 1 — NOTÍCIA:
- Esta é uma notícia ou anúncio oficial
- A fonte original será citada explicitamente no artigo
- Mantém o tom de notícia: factual, directo, sem editorialização`
  }

  if (contentType === 'tipo2') {
    return `${base}

CONTEXTO TIPO 2 — TRANSCRIÇÃO:
- A fonte é uma transcrição de vídeo ou newsletter
- NÃO mencionas o nome do canal, criador, host, podcast ou newsletter
- Onde a fonte diga "no meu canal" / "neste vídeo" / "subscrevam", omites essas referências
- Onde a fonte diga "eu acho" / "eu testei", mantens em primeira pessoa`
  }

  return `${base}

CONTEXTO TIPO 3 — ARTIGO EVERGREEN:
- A fonte é um artigo escrito em inglês sobre o tema
- NÃO mencionas o site, autor, blog ou publicação de origem
- Onde a fonte diga "como expliquei aqui" / "no meu artigo anterior", omites essas referências
- Mantens links externos para sites de terceiros se existirem na fonte`
}

function getTranslationPrompt(sourceContent: string, topic: string, contentType: string): string {
  return `Tema: ${topic}

---FONTE PARA TRADUZIR---
${sourceContent}
---FIM DA FONTE---

Começa com o título em português (linha "# Título"). Se a fonte tem título próprio, traduz esse título fielmente. Se não tem, cria um título descritivo do tema "${topic}" — sem frases promocionais, sem números no início.

Devolve APENAS o texto traduzido, sem comentários sobre a tradução.`
}

const SCRAMBLE_SYSTEM_PROMPT = `És um operador linguístico do ZYPERIA. A tua função é UMA: aplicar transformações sintácticas e lexicais a um artigo em português, preservando exactamente a mesma informação.

NÃO és um editor. NÃO és um escritor. NÃO és um revisor. NÃO interpretas, não opinas, não enriqueces, não simplificas, não suavizas. És um operador.

Operas sobre TEXTO. Aplicas REGRAS. Devolves o RESULTADO.

A definição operacional do teu trabalho:
"Output deve conter exactamente a mesma informação que o input, mas dito de forma sintáctica e lexicalmente diferente."

Mesma informação = mesmos factos, mesmos números, mesmos nomes, mesmas afirmações, mesmas ressalvas, mesma ordem dos argumentos centrais.
Diferente forma = palavras diferentes (sinónimos), ordem de cláusulas diferente, voz diferente, fronteiras de frases diferentes.`

function getScramblePrompt(article: string): string {
  return `ARTIGO PARA OPERAR:
---INÍCIO---
${article}
---FIM---

OPERAÇÕES PERMITIDAS (aplica quando faz sentido, deixa intacto quando não):

A) SUBSTITUIÇÃO LEXICAL
- Trocar palavra por sinónimo PT-PT directo, mantendo o mesmo registo (formal/informal) e a mesma precisão técnica.
- PROIBIDO: trocar termos técnicos por aproximações leigas
- PROIBIDO: trocar nomes próprios, marcas, organizações, produtos

B) REORDENAÇÃO SINTÁCTICA
- Trocar voz activa ↔ passiva
- Trocar ordem de cláusulas
- Anteceder/posteriorizar circunstâncias

C) FRONTEIRAS DE FRASE
- Juntar duas frases curtas ou dividir uma longa
- PROIBIDO: juntar/dividir de forma que perca informação

D) REORDENAÇÃO DE LISTAS
- Apenas em listas sem ordem semântica
- PROIBIDO: reordenar listas cronológicas, de prioridade, ou comparativas

E) REORDENAÇÃO DE PARÁGRAFOS
- Apenas entre parágrafos paralelos (mesma categoria)
- PROIBIDO: trocar parágrafos que dependam uns dos outros
- Em caso de dúvida: NÃO trocar

PROIBIÇÕES ABSOLUTAS:
1. NUNCA acrescentar informação que não esteja no input
2. NUNCA remover informação do input
3. NUNCA alterar dados (números, datas, nomes próprios)
4. NUNCA mudar: título, headings, formatação markdown, tom geral, nível técnico
5. NUNCA acrescentar voz editorial inventada

DEVOLVE APENAS O ARTIGO REFORMULADO. Sem preâmbulos, sem comentários, sem explicações. Apenas o texto.`
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('app') || 'crypto'

  console.log(`\n=== STAGE 2a: TRANSLATE & INSERT (${appId}) ===`)
  console.log(`Started at: ${new Date().toISOString()}`)

  try {
    const { data: research } = await getSupabase()
      .from('content_research')
      .select('*')
      .eq('app_id', appId)
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (!research) {
      console.log('Sem conteúdo pendente para', appId)
      return NextResponse.json({ success: true, reason: 'Sem conteúdo pendente' })
    }

    const researchData = research.research_data as any
    const sourceContent = researchData?.sourceContent
    const sourceUrl = researchData?.sourceUrl || ''
    const topic = research.topic
    const contentType = researchData?.content_type || 'tipo3'

    if (!sourceContent || sourceContent.length < 500) {
      console.log(`Sem sourceContent suficiente — marcando processado`)
      await getSupabase().from('content_research').update({ processed: true }).eq('id', research.id)
      return NextResponse.json({ success: false, reason: 'Sem sourceContent suficiente' })
    }

    console.log(`[Stage 2a] Traduzindo: "${topic}" (${sourceContent.length} chars)`)

    const systemPrompt = getSystemPrompt(contentType)
    const userPrompt = getTranslationPrompt(sourceContent, topic, contentType)

    const response = await getAnthropic().messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const translated = response.content[0].type === 'text' ? response.content[0].text : ''
    console.log(`[Stage 2a] Tradução concluída: ${translated.length} chars (in=${response.usage?.input_tokens} out=${response.usage?.output_tokens})`)

    if (!translated || translated.length < 500) {
      throw new Error(`Tradução insuficiente: ${translated.length} chars`)
    }

    // Passo 2b: Adicionar disclaimer fixo
    const disclaimer = DISCLAIMER_BY_APP[appId] ?? DISCLAIMER_BY_APP['crypto']
    const contentWithDisclaimer = translated + disclaimer

    const titleMatch = contentWithDisclaimer.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : topic
    const slug = generateSlug(title)

    // Passo 3b: Extrair metadata (keywords, meta_description, tags)
    console.log(`[Stage 2a] A extrair metadata...`)
    let keywords: string[] = []
    let meta_description = ''
    let tags: string[] = []
    try {
      const metadata = await extractMetadata(appId, title, contentWithDisclaimer)
      keywords = metadata.keywords ?? []
      meta_description = metadata.meta_description ?? ''
      tags = metadata.tags ?? []
      console.log(`[Stage 2a] Metadata: ${keywords.length} keywords, ${tags.length} tags, meta ${meta_description.length} chars`)
    } catch (e: any) {
      console.warn(`[Stage 2a] Metadata extraction falhou (non-fatal): ${e.message}`)
    }

    const { data: post, error: insertError } = await getSupabase()
      .from('blog_posts')
      .insert({
        app_id: appId,
        title,
        slug,
        content: contentWithDisclaimer,
        status: 'pending_review',
        source_url: sourceUrl || null,
        created_at: new Date().toISOString(),
        author_byline: BYLINE_BY_APP[appId] || 'Redacção ZYPERIA',
        reading_time_minutes: calculateReadingTime(contentWithDisclaimer),
        generation_approach: resolveGenerationApproach(contentType),
        keywords: keywords.length > 0 ? keywords : null,
        meta_description: meta_description || null,
        tags: tags.length > 0 ? tags : null,
      })
      .select('id')
      .single()

    if (insertError) throw new Error(`Erro ao inserir artigo: ${insertError.message}`)

    await getSupabase().from('content_research').update({ processed: true }).eq('id', research.id)

    console.log(`✓ Artigo criado: "${title}" (${contentWithDisclaimer.length} chars)`)

    return NextResponse.json({
      success: true,
      type: contentType,
      app: appId,
      title,
      slug,
      id: post?.id,
      content_length: translated.length,
    })

  } catch (error: any) {
    console.error('Erro no Stage 2a:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
