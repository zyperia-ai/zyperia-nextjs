/**
 * @deprecated Use stage-2a-translate + stage-2b-merge instead.
 * Este endpoint ainda existe para compatibilidade mas atinge timeout 300s
 * para artigos grandes. Mantido temporariamente para o caso de roll-back.
 * Remover após 8.6E.
 */

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
  const base = `És um tradutor profissional especializado em conteúdo editorial.
A tua função é traduzir fielmente para português europeu, sem reescrever.

${TRANSLATION_RULES}`

  if (contentType === 'tipo1') {
    return `${base}

CONTEXTO TIPO 1 — NOTÍCIA:
- Esta é uma notícia ou anúncio oficial
- A fonte original será citada explicitamente no artigo (instrução virá no user message)
- Mantém o tom de notícia: factual, directo, sem editorialização`
  }

  if (contentType === 'tipo2') {
    return `${base}

CONTEXTO TIPO 2 — TRANSCRIÇÃO:
- A fonte é uma transcrição de vídeo ou newsletter
- NÃO mencionas o nome do canal, criador, host, podcast ou newsletter
- Onde a fonte diga "no meu canal" / "neste vídeo" / "subscrevam", omites essas referências
- Onde a fonte diga "eu acho" / "eu testei", mantens em primeira pessoa (a tradução é do conteúdo, não atribuída a ninguém)`
  }

  return `${base}

CONTEXTO TIPO 3 — ARTIGO EVERGREEN:
- A fonte é um artigo escrito em inglês sobre o tema
- NÃO mencionas o site, autor, blog ou publicação de origem
- Onde a fonte diga "como expliquei aqui" / "no meu artigo anterior", omites essas referências
- Mantens links externos para sites de terceiros (documentação oficial, papers académicos, sites de empresas mencionadas) se existirem na fonte`
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
    : 'CONTEÚDO COMPLETO'

  const citationLine = contentType === 'tipo1' && sourceRef
    ? `Quando o conteúdo apresenta factos verificáveis (anúncios, declarações, dados), atribui à fonte: "Segundo ${sourceRef}..." ou equivalente. Não inventes citações que não estejam implícitas no original.`
    : ''

  const structureLine = isFirst
    ? `Começa com o título em português (linha "# Título"). Se a fonte tem título próprio, traduz esse título fielmente. Se não tem (ex.: transcrição), cria um título descritivo do tema "${topic}" — sem frases promocionais, sem números no início, sem cliques.`
    : `Continua directamente do ponto onde a parte anterior terminou. Não repetes título nem introdução.`

  const closingLine = isLast
    ? `Esta é a última parte. Termina exactamente como a fonte termina. Se a fonte termina abruptamente, a tradução também termina aí — não acrescentes conclusão própria. Não escreves "em conclusão", "para terminar", "resumindo".`
    : `Esta NÃO é a última parte. Termina no fim do parágrafo do source que coube neste chunk. NÃO escreves conclusão, NÃO escreves "para concluir", NÃO antecipas o que vem a seguir.`

  const contextLine = previousContext
    ? `\nÚLTIMAS LINHAS DA TRADUÇÃO ANTERIOR (apenas para coerência terminológica e tom — NÃO repetir):\n${previousContext.slice(-300)}\n`
    : ''

  return `[${position}]
Tema: ${topic}
${citationLine}
${contextLine}
---FONTE PARA TRADUZIR---
${chunk}
---FIM DA FONTE---

${structureLine}
${closingLine}

Devolve APENAS o texto traduzido, sem comentários sobre a tradução.`
}

// ── Prompt de merge ───────────────────────────────────────────────────────────

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

// ── Helpers determinísticos para validar scramble ─────────────────────────────

function extractTitle(text: string): string {
  const m = text.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : ''
}

function extractHeadings(text: string): string[] {
  return Array.from(text.matchAll(/^#{1,6}\s+(.+)$/gm)).map(m => m[1].trim())
}

function extractNumbers(text: string): string[] {
  return Array.from(text.matchAll(/\b\d+(?:[.,]\d+)*(?:[%MKB]|\s*(?:milhões|milhares|mil|biliões|por\s+cento))?\b/gi)).map(m => m[0].trim())
}

function extractProperNouns(text: string): string[] {
  // captura sequências de palavras com inicial maiúscula, EXCLUINDO início de frase
  // heurística: nome próprio = palavra com maiúscula que tenha pelo menos 4 chars,
  // OU duas+ palavras com maiúscula consecutivas
  const candidates = new Set<string>()

  // Stop-words que aparecem em início de frase (PT-PT)
  const sentenceStarters = new Set([
    'Por', 'Na', 'No', 'Nos', 'Nas', 'Em', 'Para', 'Com', 'De', 'Da', 'Do', 'Dos', 'Das',
    'A', 'O', 'As', 'Os', 'Um', 'Uma', 'Uns', 'Umas',
    'Isto', 'Isso', 'Aquilo', 'Este', 'Esta', 'Estes', 'Estas',
    'Esse', 'Essa', 'Esses', 'Essas', 'Aquele', 'Aquela',
    'Mas', 'Se', 'Ou', 'E', 'Quando', 'Onde', 'Como', 'Porque', 'Porquê',
    'Hoje', 'Ontem', 'Amanhã', 'Depois', 'Antes', 'Agora',
    'Embora', 'Ainda', 'Já', 'Não', 'Sim', 'Talvez',
    'Adicionalmente', 'Além', 'Ap', 'Cortar', 'Mais',
  ])

  // Sequências de 2+ palavras consecutivas em maiúscula (quase sempre nomes próprios)
  const multiWord = Array.from(text.matchAll(/\b([A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ]+)+)\b/g))
  for (const m of multiWord) candidates.add(m[1].trim())

  // Palavras isoladas em maiúscula com 4+ chars que NÃO são stop-words
  const single = Array.from(text.matchAll(/\b([A-ZÀ-Ý][a-zà-ÿ]{3,})\b/g))
  for (const m of single) {
    const word = m[1].trim()
    if (!sentenceStarters.has(word)) candidates.add(word)
  }

  // Acrónimos (BTC, ETF, SEC, etc.)
  const acronyms = Array.from(text.matchAll(/\b([A-Z]{2,})\b/g))
  for (const m of acronyms) candidates.add(m[1].trim())

  return Array.from(candidates)
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length
}

// ── Prompt do scramble ────────────────────────────────────────────────────────

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
- Exemplo: "rápido" → "veloz", "mostrar" → "evidenciar"
- PROIBIDO: trocar termos técnicos por aproximações leigas ou vice-versa
  ✗ "blockchain" → "rede de blocos"
  ✗ "ETF" → "fundo cotado"
- PROIBIDO: trocar nomes próprios, marcas, organizações, produtos
  ✗ "Bitcoin" → "BTC" (e vice-versa também não)
  ✗ "OpenAI" → "a empresa de Sam Altman"

B) REORDENAÇÃO SINTÁCTICA
- Trocar voz activa ↔ passiva: "A SEC aprovou X" ↔ "X foi aprovado pela SEC"
- Trocar ordem de cláusulas: "Quando X aconteceu, Y reagiu" → "Y reagiu quando X aconteceu"
- Anteceder/posteriorizar circunstâncias: "Em 2024, o mercado subiu" ↔ "O mercado subiu em 2024"

C) FRONTEIRAS DE FRASE
- Juntar duas frases curtas: "X subiu. Foi notável." → "X subiu notavelmente." OU "X subiu, o que foi notável."
- Dividir uma frase longa: "X aconteceu, levando a Y, que por sua vez causou Z." → "X aconteceu. Isto levou a Y, que por sua vez causou Z."
- PROIBIDO: juntar frases que percam informação no processo
- PROIBIDO: dividir uma frase de tal forma que o leitor perca o nexo

D) REORDENAÇÃO DE LISTAS
- Em listas/enumerações sem ordem semântica, trocar a ordem dos itens.
- Exemplo: "Bitcoin, Ethereum, Solana" → "Ethereum, Solana, Bitcoin"
- PROIBIDO: reordenar listas com ordem semântica
  ✗ Lista cronológica: "2020, 2021, 2022" — manter ordem
  ✗ Lista de prioridade: "primeiro... depois... finalmente" — manter ordem
  ✗ Lista comparativa: "o mais barato é A, o intermédio é B, o mais caro é C" — manter ordem

E) REORDENAÇÃO DE PARÁGRAFOS
- Só permitido entre parágrafos paralelos: parágrafos que descrevem itens da mesma categoria (ex.: "vantagem 1", "vantagem 2", "vantagem 3").
- PROIBIDO: trocar parágrafos que dependam uns dos outros.
  ✗ Parágrafo 1 introduz um conceito, parágrafo 2 explica esse conceito — NÃO trocar
  ✗ Parágrafo 1 faz pergunta, parágrafo 2 responde — NÃO trocar
  ✗ Parágrafo 1 estabelece causa, parágrafo 2 mostra efeito — NÃO trocar
- Em caso de dúvida: NÃO trocar.

PROIBIÇÕES ABSOLUTAS (qualquer violação destrói o output):

1. NUNCA acrescentar informação que não esteja no input. Inclui:
- Frases novas, mesmo que sejam transições ("Como vamos ver", "Por outras palavras")
- Exemplos novos, comparações novas, analogias novas
- Conclusões, takeaways, resumos finais
- Disclaimers, avisos, "é importante notar"
- Opiniões, avaliações, juízos de valor
- Contextualizações ("em Portugal isto significa...", "para o mercado lusófono...")

2. NUNCA remover informação do input. Inclui:
- Não cortar parágrafos
- Não cortar exemplos do autor original
- Não cortar ressalvas, condicionais ("se", "caso", "excepto")
- Não cortar atribuições ("segundo X", "de acordo com Y")

3. NUNCA alterar dados:
- Números: "10%" continua "10%", "$2.5M" continua "$2.5M"
- Datas: "em 2024" continua "em 2024"
- Nomes próprios: "Sam Altman" continua "Sam Altman"
- Citações directas (entre aspas): cópia exacta
- Termos técnicos com tradução estabelecida: manter consistência

4. NUNCA mudar:
- O título (linha que começa com "# ")
- A presença ou ausência de headings (## H2, ### H3)
- A formatação markdown (negrito, itálico, listas)
- O tom geral (formal continua formal, informal continua informal)
- O nível técnico (técnico continua técnico, divulgativo continua divulgativo)

5. NUNCA acrescentar voz editorial inventada:
- Não escrever "neste artigo vamos ver"
- Não escrever "como expliquei acima"
- Não escrever "o leitor deve saber que"
- Não escrever em primeira pessoa do plural ("nós") se o original não escreve

REGRA DA DÚVIDA:
Quando não tens a certeza se uma transformação respeita as regras, NÃO a apliques. Deixa essa parte do texto intacta.

CHECK FINAL ANTES DE DEVOLVERES:
1. Todas as frases do output expressam algo que está no input?
2. Todas as frases do input estão expressas no output?
3. Todos os números, datas, nomes próprios estão presentes e iguais?
4. O título é exactamente o mesmo?
5. Os headings são os mesmos?
6. O número de parágrafos é o mesmo (ou diferente apenas se uniste/dividiste frases)?
7. Não acrescentei nada que não estava lá?

Se respondeste "não" a alguma destas, refaz o output.

DEVOLVE APENAS O ARTIGO REFORMULADO. Sem preâmbulos, sem comentários, sem "aqui está", sem explicações. Apenas o texto.`
}

// ── Função scrambleArticle com salvaguardas determinísticas + fail-safe ──────

async function scrambleArticle(translatedArticle: string): Promise<{ output: string; scrambleApplied: boolean; reason?: string }> {
  const inputWords = countWords(translatedArticle)
  const inputTitle = extractTitle(translatedArticle)
  const inputHeadings = extractHeadings(translatedArticle)
  const inputNumbers = extractNumbers(translatedArticle)
  const inputProperNouns = extractProperNouns(translatedArticle)

  console.log(`[Scramble] Input: ${inputWords} palavras, ${inputHeadings.length} headings, ${inputNumbers.length} números, ${inputProperNouns.length} nomes próprios`)

  let scrambled: string
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8192,
      system: SCRAMBLE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: getScramblePrompt(translatedArticle) }],
    })
    scrambled = response.content[0].type === 'text' ? response.content[0].text : ''
    console.log(`[Scramble] Output recebido: in=${response.usage?.input_tokens} out=${response.usage?.output_tokens}`)
  } catch (e: any) {
    console.warn(`[Scramble] Erro na chamada Claude: ${e.message} — devolvendo tradução fiel`)
    return { output: translatedArticle, scrambleApplied: false, reason: 'API error' }
  }

  if (!scrambled || scrambled.length < 100) {
    console.warn(`[Scramble] Output vazio ou muito curto — devolvendo tradução fiel`)
    return { output: translatedArticle, scrambleApplied: false, reason: 'Output vazio' }
  }

  // Salvaguarda 1: ratio de palavras
  const outputWords = countWords(scrambled)
  const wordRatio = outputWords / inputWords
  if (wordRatio < 0.85 || wordRatio > 1.15) {
    console.warn(`[Scramble] Ratio fora de limites (${wordRatio.toFixed(2)}: ${inputWords} → ${outputWords}) — devolvendo tradução fiel`)
    return { output: translatedArticle, scrambleApplied: false, reason: `Word ratio ${wordRatio.toFixed(2)}` }
  }

  // Salvaguarda 2: título inalterado
  const outputTitle = extractTitle(scrambled)
  if (outputTitle !== inputTitle) {
    console.warn(`[Scramble] Título alterado: "${inputTitle}" → "${outputTitle}" — devolvendo tradução fiel`)
    return { output: translatedArticle, scrambleApplied: false, reason: 'Título alterado' }
  }

  // Salvaguarda 3: números preservados
  const outputNumbers = extractNumbers(scrambled)
  const missingNumbers = inputNumbers.filter(n => !outputNumbers.some(o => o.replace(/\s+/g, '') === n.replace(/\s+/g, '')))
  if (missingNumbers.length > 0) {
    console.warn(`[Scramble] Números perdidos: ${missingNumbers.join(', ')} — devolvendo tradução fiel`)
    return { output: translatedArticle, scrambleApplied: false, reason: `Números perdidos: ${missingNumbers.length}` }
  }

  // Salvaguarda 4: nomes próprios preservados (com tolerância de 2)
  const outputProperNouns = extractProperNouns(scrambled)
  const missingNouns = inputProperNouns.filter(n => !outputProperNouns.includes(n))
  if (missingNouns.length > 2) {
    console.warn(`[Scramble] Nomes próprios perdidos (>2): ${missingNouns.slice(0, 5).join(', ')} — devolvendo tradução fiel`)
    return { output: translatedArticle, scrambleApplied: false, reason: `Nomes perdidos: ${missingNouns.length}` }
  }

  // Salvaguarda 5: número de headings preservado
  const outputHeadings = extractHeadings(scrambled)
  if (outputHeadings.length !== inputHeadings.length) {
    console.warn(`[Scramble] Número de headings alterado (${inputHeadings.length} → ${outputHeadings.length}) — devolvendo tradução fiel`)
    return { output: translatedArticle, scrambleApplied: false, reason: 'Headings alterados' }
  }

  console.log(`[Scramble] ✅ Aplicado com sucesso (${inputWords} → ${outputWords} palavras, ratio ${wordRatio.toFixed(2)})`)
  return { output: scrambled, scrambleApplied: true }
}

// ── Processa conteúdo: chunks → tradução → merge → scramble → guarda ────────

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

    // Salvaguarda chunk truncado: se output < 30% do input em palavras, pede retry uma vez
    const inputWords = chunks[i].split(/\s+/).filter(w => w.length > 0).length
    const outputWords = translated ? translated.split(/\s+/).filter(w => w.length > 0).length : 0
    const ratio = outputWords / Math.max(inputWords, 1)

    let finalTranslated = translated
    if (!translated || translated.length < 50 || ratio < 0.3) {
      console.warn(`Chunk ${i + 1} suspeito (${outputWords}/${inputWords} palavras, ratio ${ratio.toFixed(2)}) — retry`)
      const retry = await translateChunk(
        chunks[i], i, chunks.length, topic, contentType, sourceRef, appId, previousContext
      )
      if (!retry || retry.length < 50) {
        throw new Error(`Chunk ${i + 1} devolveu conteudo insuficiente após retry`)
      }
      finalTranslated = retry
    }

    // Aplicar scramble nível 6 ao chunk individual
    console.log(`A aplicar scramble ao chunk ${i + 1}/${chunks.length}...`)
    const scrambleResult = await scrambleArticle(finalTranslated)
    const scrambledChunk = scrambleResult.output
    console.log(`Chunk ${i + 1} scramble: ${scrambleResult.scrambleApplied ? 'aplicado ✓' : `skipped (${scrambleResult.reason})`}`)

    translatedParts.push(scrambledChunk)
    previousContext = scrambledChunk
    console.log(`Chunk ${i + 1} processado: ${scrambledChunk.length} chars`)
  }

  console.log(`Fazendo merge de ${translatedParts.length} parte(s)...`)
  const finalContent = await mergeChunks(translatedParts, contentType, sourceRef)
  console.log(`Artigo final: ${finalContent.length} chars`)

  // Scramble já foi aplicado por chunk; finalContent é o output final
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
