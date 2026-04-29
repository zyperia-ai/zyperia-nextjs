export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { ollamaComplete, ollamaHealthy } from '@/lib/ollama-client'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

const USE_LOCAL_LLM = process.env.USE_LOCAL_LLM === 'true'

function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
  return slug || `artigo-${Date.now()}`
}

function getMergePrompt(parts: string[], contentType: string, sourceRef: string): string {
  const citationNote = contentType === 'tipo1' && sourceRef
    ? `\n- Mantés todas as citações à fonte "${sourceRef}" que existam nas partes. Não acrescentas novas.`
    : '\n- Não incluis referências a fontes originais (nem nomes de canais, blogs, autores).'

  return `Tens ${parts.length} partes traduzidas do mesmo artigo em ordem. Une-as num único artigo coerente em português.

${parts.map((p, i) => `=== PARTE ${i + 1} ===\n${p}`).join('\n\n')}
=== FIM ===

REGRAS DE UNIÃO:
- Mantés TODO o conteúdo de todas as partes — não omites nada
- O resultado deve ter aproximadamente o mesmo número de palavras que a soma das partes
- Garantes exactamente 1 título H1 (# Título) no início; remove H1 duplicados que apareçam no meio
- Onde uma parte termina e a seguinte começa, juntas-as com uma transição mínima — apenas o necessário para fluência. NUNCA acrescentas parágrafos novos de ligação.
- Remove repetições óbvias entre partes (ex.: a parte 2 reapresentar o tema que a parte 1 já apresentou). Repetições intencionais do autor (retórica, ênfase) preservam-se.
- O artigo termina exactamente onde a última parte termina. Se a última parte termina abruptamente porque a fonte assim o faz, NÃO acrescentas conclusão. NÃO escreves "Em conclusão", "Resumindo", "Para terminar".${citationNote}

PROIBIÇÕES ABSOLUTAS:
- NUNCA inventas factos, exemplos, dados ou afirmações que não estejam nas partes
- NUNCA acrescentas considerações finais, opiniões ou contexto adicional
- NUNCA mencionas que isto é uma tradução ou que existem partes

Devolve APENAS o artigo final, começando pela linha "# Título".`
}

async function mergeChunks(parts: string[], contentType: string, sourceRef: string): Promise<string> {
  if (parts.length === 1) return parts[0]

  const userPrompt = getMergePrompt(parts, contentType, sourceRef)

  if (USE_LOCAL_LLM) {
    try {
      const healthy = await ollamaHealthy()
      if (healthy) {
        const result = await ollamaComplete({
          userPrompt,
          maxTokens: 8192,
          temperature: 0.3,
        })
        console.log(`[Stage 2b] Merge (Ollama): in=${result.inputTokens} out=${result.outputTokens} duration=${result.durationMs}ms`)
        return result.text.trim()
      }
    } catch (error: any) {
      console.warn(`[Stage 2b] Ollama falhou (${error.message}) — fallback Haiku`)
    }
  }

  const response = await getAnthropic().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages: [{ role: 'user', content: userPrompt }],
  })
  console.log(`[Stage 2b] Merge (Haiku fallback): in=${response.usage?.input_tokens} out=${response.usage?.output_tokens}`)
  return response.content[0].type === 'text' ? response.content[0].text : parts.join('\n\n')
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('app') || 'crypto'

  console.log(`\n=== STAGE 2b: MERGE (${appId}) ===`)

  try {
    const { data: research } = await getSupabase()
      .from('content_research')
      .select('*')
      .eq('app_id', appId)
      .eq('processed', true)
      .order('created_at', { ascending: true })

    if (!research || research.length === 0) {
      return NextResponse.json({ success: true, reason: 'Sem research processado' })
    }

    let target: any = null
    for (const r of research) {
      const { data: chunks } = await getSupabase()
        .from('translation_chunks')
        .select('blog_post_id')
        .eq('research_id', r.id)
        .limit(1)
        .single()

      if (!chunks?.blog_post_id) {
        target = r
        break
      }
    }

    if (!target) {
      return NextResponse.json({ success: true, reason: 'Tudo já com blog_post associado' })
    }

    const researchData = target.research_data as any
    const sourceUrl = researchData?.sourceUrl || ''
    const contentType = researchData?.content_type || 'tipo3'
    const topic = target.topic

    const { data: chunks } = await getSupabase()
      .from('translation_chunks')
      .select('chunk_index, translated_chunk')
      .eq('research_id', target.id)
      .eq('status', 'translated')
      .order('chunk_index', { ascending: true })

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({ success: false, reason: 'Sem chunks prontos' })
    }

    const parts = chunks.map(c => c.translated_chunk!).filter(Boolean)
    console.log(`A juntar ${parts.length} parte(s) para "${topic}"`)

    const finalContent = await mergeChunks(parts, contentType, '')
    console.log(`Artigo final: ${finalContent.length} chars`)

    const titleMatch = finalContent.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : topic
    const slug = generateSlug(title)

    const { data: post, error } = await getSupabase()
      .from('blog_posts')
      .insert({
        app_id: appId,
        title,
        slug,
        content: finalContent,
        status: 'draft',
        source_url: sourceUrl || null,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) throw new Error(`Erro ao inserir artigo: ${error.message}`)

    await getSupabase()
      .from('translation_chunks')
      .update({ blog_post_id: post?.id })
      .eq('research_id', target.id)

    console.log(`✓ ${contentType} publicado em draft: "${title}"`)

    return NextResponse.json({
      success: true,
      type: contentType,
      app: appId,
      title,
      slug,
      id: post?.id,
      chunks_merged: parts.length,
      content_length: finalContent.length,
    })

  } catch (error: any) {
    console.error('Erro no Stage 2b:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
