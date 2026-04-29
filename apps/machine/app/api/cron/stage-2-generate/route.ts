export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { splitIntoChunks } from '@/lib/chunker'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// ── Helper: fetch do artigo completo ──────────────────────────────────────────

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ZyperiaBot/1.0' },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return ''
    const html = await response.text()
    const clean = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#\d+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return clean
  } catch {
    return ''
  }
}

// ── Helper: gera slug seguro com fallback ─────────────────────────────────────

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

// ── System prompts por tipo ───────────────────────────────────────────────────

function getSystemPrompt(contentType: string): string {
  if (contentType === 'tipo1') {
    return `És um tradutor especializado. Traduz fielmente para português europeu.
REGRAS ABSOLUTAS:
- Traduz TODO o conteúdo da fonte — não omites nada
- Preservas todos os factos, dados e números do original
- Citas a fonte quando apresentas factos: "Segundo [fonte]..."
- NUNCA inventas informação que não está na fonte
- NUNCA acrescenta informação que não existe na fonte`
  }

  if (contentType === 'tipo2') {
    return `És um tradutor e editor especializado. Traduz fielmente para português europeu.
REGRAS ABSOLUTAS:
- Traduz TODO o conteúdo — não omites nada
- Preservas todos os factos, dados e números do original
- Adaptas minimamente a estrutura de parágrafos para não ser plágio
  (reordena parágrafos, parafraseia frases mantendo o mesmo significado)
- NUNCA mencionas o canal, criador ou newsletter de origem
- NUNCA inventas informação que não está na fonte
- NUNCA acrescenta informação que não existe na fonte`
  }

  return `És um tradutor e editor especializado. Traduz fielmente para português europeu.
REGRAS ABSOLUTAS:
- Traduz TODO o conteúdo — não omites nada
- Preservas todos os factos, dados e números do original
- Adaptas minimamente a estrutura de parágrafos para não ser plágio
  (reordena parágrafos, parafraseia frases mantendo o mesmo significado)
- NUNCA mencionas ou citas as fontes EN originais
- NUNCA inventas informação que não está na fonte
- NUNCA acrescenta informação que não existe na fonte`
}

// ── Prompt por chunk ──────────────────────────────────────────────────────────

function getChunkPrompt(
  chunk: string,
  chunkIndex: number,
  totalChunks: number,
  topic: string,
  contentType: string,
  sourceRef: string,
  previousContext: string
): string {
  const isFirst = chunkIndex === 0
  const isLast = chunkIndex === totalChunks - 1
  const position = totalChunks > 1
    ? `PARTE ${chunkIndex + 1} DE ${totalChunks}`
    : 'CONTEUDO COMPLETO'

  const citationLine = contentType === 'tipo1' && sourceRef
    ? `Quando apresentas factos usa: "Segundo ${sourceRef}..."`
    : ''

  const structureLine = isFirst
    ? `Comeca com titulo em portugues (# Titulo) seguido do corpo do artigo.`
    : `Continua directamente — nao repetes titulo nem introducao.`

  const closingLine = isLast
    ? `Termina com uma conclusao natural que encerra o artigo.`
    : `Termina no fim de um paragrafo completo. NAO escreves conclusao.`

  const contextLine = previousContext
    ? `\nCONTEXTO DA PARTE ANTERIOR (manter coerencia):\n${previousContext.slice(-300)}\n`
    : ''

  return `[${position}]
Tema: ${topic}
${citationLine}
${contextLine}
---CONTEUDO PARA TRADUZIR---
${chunk}
---FIM---

${structureLine}
${closingLine}

Escreve directamente o texto traduzido.`
}

// ── Prompt de merge ───────────────────────────────────────────────────────────

function getMergePrompt(parts: string[], contentType: string, sourceRef: string): string {
  const citationNote = contentType === 'tipo1' && sourceRef
    ? `\nManten todas as citacoes a fonte "${sourceRef}" que existem nas partes.`
    : '\nNao incluis referencias as fontes originais.'

  return `Une estas ${parts.length} partes num artigo unico e coeso em portugues.

${parts.map((p, i) => `=== PARTE ${i + 1} ===\n${p}`).join('\n\n')}
=== FIM ===

REGRAS:
- Manten TODO o conteudo de todas as partes — nao omites nada
- Garante transicoes naturais entre partes
- Remove repeticoes acidentais se existirem
- Garante exactamente 1 titulo H1 (# Titulo) no inicio do artigo
- Termina com conclusao clara${citationNote}

Escreve o artigo final completo.`
}

// ── Traduz um chunk ───────────────────────────────────────────────────────────

async function translateChunk(
  chunk: string,
  chunkIndex: number,
  totalChunks: number,
  topic: string,
  contentType: string,
  sourceRef: string,
  appId: string,
  previousContext: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    system: getSystemPrompt(contentType),
    messages: [{
      role: 'user',
      content: getChunkPrompt(chunk, chunkIndex, totalChunks, topic, contentType, sourceRef, previousContext),
    }],
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  console.log(`[Stage 2] Chunk ${chunkIndex + 1}/${totalChunks}: in=${response.usage?.input_tokens} out=${response.usage?.output_tokens} stop=${response.stop_reason}`)
  return text
}

// ── Faz merge dos chunks ──────────────────────────────────────────────────────

async function mergeChunks(parts: string[], contentType: string, sourceRef: string): Promise<string> {
  if (parts.length === 1) return parts[0]
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 8192,
    messages: [{ role: 'user', content: getMergePrompt(parts, contentType, sourceRef) }],
  })
  console.log(`[Stage 2] Merge: in=${response.usage?.input_tokens} out=${response.usage?.output_tokens} stop=${response.stop_reason}`)
  return response.content[0].type === 'text' ? response.content[0].text : parts.join('\n\n')
}

// ── Processa conteúdo: chunks → tradução → merge → guarda ────────────────────

async function processContent(
  sourceContent: string,
  topic: string,
  contentType: string,
  sourceRef: string,
  appId: string,
  sourceUrl: string
): Promise<{ title: string; slug: string; id: string; chunks: number; contentLength: number }> {

  const chunks = splitIntoChunks(sourceContent)
  console.log(`Dividido em ${chunks.length} chunk(s):`)
  chunks.forEach((c, i) => console.log(`  Chunk ${i + 1}: ${c.length} chars`))

  const translatedParts: string[] = []
  let previousContext = ''

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Traduzindo chunk ${i + 1}/${chunks.length}...`)
    const translated = await translateChunk(
      chunks[i], i, chunks.length, topic, contentType, sourceRef, appId, previousContext
    )
    if (!translated || translated.length < 50) {
      throw new Error(`Chunk ${i + 1} devolveu conteudo insuficiente`)
    }
    translatedParts.push(translated)
    previousContext = translated
    console.log(`Chunk ${i + 1} traduzido: ${translated.length} chars`)
  }

  console.log(`Fazendo merge de ${translatedParts.length} parte(s)...`)
  const finalContent = await mergeChunks(translatedParts, contentType, sourceRef)
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

  return { title, slug, id: post?.id, chunks: chunks.length, contentLength: finalContent.length }
}

// ── Handler principal ─────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('app') || 'crypto'

  console.log(`\n=== STAGE 2: CONTENT GENERATION (${appId}) ===`)
  console.log(`Started at: ${new Date().toISOString()}`)

  try {
    // ── PRIORIDADE 1: Breaking news (TIPO 1) ──────────────────────────────────
    const { data: breaking } = await getSupabase()
      .from('breaking_queue')
      .select('*')
      .eq('app_id', appId)
      .eq('processed', false)
      .order('priority', { ascending: false })
      .limit(1)
      .single()

    if (breaking) {
      console.log(`[Stage 2] TIPO 1 breaking: "${breaking.title}"`)

      // Fetch do artigo completo usando source_url
      let sourceContent = ''
      if (breaking.source_url && breaking.source_url.startsWith('http')) {
        console.log(`Fazendo fetch do artigo completo: ${breaking.source_url.slice(0, 60)}`)
        sourceContent = await fetchArticleContent(breaking.source_url)
        const wordCount = sourceContent.split(/\s+/).filter(w => w.length > 0).length
        console.log(`Artigo completo: ${wordCount} palavras`)
      }

      // Fallback: usa conteúdo da breaking_queue se fetch falhar ou for pequeno
      if (!sourceContent || sourceContent.split(/\s+/).length < 200) {
        console.log(`Fetch insuficiente — usando conteudo da breaking_queue`)
        sourceContent = `${breaking.title}\n\n${breaking.content || ''}`
      }

      const sourceRef = breaking.source_url || breaking.source_type || 'fonte'
      await getSupabase().from('breaking_queue').update({ processed: true }).eq('id', breaking.id)

      const result = await processContent(sourceContent, breaking.title, 'tipo1', sourceRef, appId, breaking.source_url)
      console.log(`TIPO 1 publicado em draft: "${result.title}"`)
      return NextResponse.json({ success: true, type: 'tipo1', app: appId, ...result })
    }

    // ── PRIORIDADE 2: YouTube/Newsletter (TIPO 2) ──────────────────────────────
    const { data: video } = await getSupabase()
      .from('content_queue')
      .select('*')
      .eq('app_id', appId)
      .eq('processed', false)
      .order('detected_at', { ascending: true })
      .limit(1)
      .single()

    if (video && video.transcript && video.transcript.length > 500) {
      console.log(`[Stage 2] TIPO 2 YouTube: "${video.video_title}"`)
      await getSupabase().from('content_queue').update({ processed: true }).eq('id', video.id)

      const result = await processContent(video.transcript, video.video_title, 'tipo2', '', appId, '')
      console.log(`TIPO 2 publicado em draft: "${result.title}"`)
      return NextResponse.json({ success: true, type: 'tipo2', app: appId, ...result })
    }

    if (video && (!video.transcript || video.transcript.length <= 500)) {
      console.log(`TIPO 2 sem transcricao suficiente — a saltar para TIPO 3`)
      await getSupabase().from('content_queue').update({ processed: true }).eq('id', video.id)
    }

    // ── PRIORIDADE 3: Evergreen (TIPO 3) ──────────────────────────────────────
    const { data: research } = await getSupabase()
      .from('content_research')
      .select('*')
      .eq('app_id', appId)
      .or('processed.is.null,processed.eq.false')
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (!research) {
      console.log('Sem conteudo pendente para', appId)
      return NextResponse.json({ success: true, reason: 'Sem conteudo pendente' })
    }

    const researchData = research.research_data as any
    const sourceContent = researchData?.sourceContent
    const sourceUrl = researchData?.sourceUrl || ''

    if (!sourceContent || sourceContent.length < 500) {
      console.log(`Sem sourceContent suficiente para "${research.topic}" — a marcar como processado`)
      // Marca como processado=true para não ficar em loop
      await getSupabase().from('content_research').update({ processed: true }).eq('id', research.id)
      return NextResponse.json({ success: false, reason: 'Sem sourceContent suficiente' })
    }

    console.log(`[Stage 2] TIPO 3 evergreen: "${research.topic}" (${sourceContent.length} chars)`)

    const result = await processContent(sourceContent, research.topic, 'tipo3', '', appId, sourceUrl)
    await getSupabase().from('content_research').update({ processed: true }).eq('id', research.id)

    console.log(`TIPO 3 publicado em draft: "${result.title}"`)
    return NextResponse.json({ success: true, type: 'tipo3', app: appId, ...result })

  } catch (error: any) {
    console.error('Erro no Stage 2:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
