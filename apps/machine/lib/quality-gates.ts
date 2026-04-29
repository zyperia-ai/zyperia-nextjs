import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export interface QualityResult {
  approved: boolean
  layer: number
  reason?: string
  scores?: Record<string, number>
  issues?: string[]
  originality_score?: number
}

export interface ArticlePayload {
  id: string
  content: string
  title: string
  app_name: string
}

// ─── CAMADA 1: AUTO-REVIEW CLAUDE ─────────────────────────────────────────────

export async function camada1AutoReview(article: ArticlePayload): Promise<QualityResult> {
  const contentSnippet = article.content.slice(0, 4000)

  const prompttradutor = `És o TRADUTOR — persona de revisão editorial do ZYPERIA.

CONTEXTO IMPORTANTE: O ZYPERIA publica APENAS traduções fiéis de fontes originais, com scramble lexical e sintáctico mínimo. O sistema gera artigos a partir de fontes em inglês, traduzindo para português europeu sem adições, sem exemplos novos, sem contexto adicional, sem conclusões inventadas. Não há "adaptação cultural", não há "ângulo lusófono". É tradução, não criação.

A tua função é detectar problemas DE TRADUÇÃO no artigo abaixo.

ARTIGO (título: "${article.title}"):
${contentSnippet}

Avalia:

1. FLUÊNCIA (1-10) — O português é PT-PT correcto e natural?
   - Soa a português europeu (não brasileiro)
   - Não tem traduções literais óbvias ("realizar uma compra" em vez de "comprar")
   - Vocabulário técnico apropriado e consistente
   - Sintaxe natural, não decalcada do inglês

2. INTEGRIDADE (1-10) — O artigo está estruturalmente íntegro?
   - Frases completas (nada cortado a meio)
   - Parágrafos coesos
   - Sem caracteres estranhos, sem placeholders ("[INSERIR]"), sem mistura de línguas
   - Sem auto-referências do tipo "subscreve o meu canal", "como vimos no meu artigo anterior", "neste vídeo"

SINAIS DE ALARME (cada um reduz scores):
- Frases que soam a "considerações finais" inventadas pelo modelo
- "Em suma", "concluindo", "para terminar" se parecem postiços
- Contextualizações tipo "em Portugal isto significa..." (proibido por design)
- Disclaimers ou aviso adicionados pelo modelo
- Promessas ou linguagem de marketing ("vais aprender X", "neste artigo")

NÃO avalies: originalidade, criatividade, ângulo único, contexto lusófono, exemplos locais. NADA disso é desejado.

Responde APENAS com JSON válido. Aspas duplas. Sem caracteres especiais nas strings.
Formato exacto:
{"scores":{"fluencia":0,"integridade":0},"issues":["issue 1","issue 2"]}
Substitui 0 pelos scores reais (1-10). Máximo 3 issues curtos (menos de 80 caracteres cada).

Score >= 6 é aprovação. Scores < 6 só se houver problemas reais.`

  const promptEditor = `És o EDITOR — persona de revisão editorial do ZYPERIA.

CONTEXTO IMPORTANTE: O ZYPERIA publica traduções fiéis de fontes originais. Um artigo pode terminar abruptamente se a fonte termina abruptamente. Pode começar in medias res se a fonte começa assim. NÃO se exige estrutura editorial canónica. Exige-se que a tradução não esteja partida.

A tua função é verificar que o artigo está USÁVEL — não cortado, não corrompido, sem contradições internas.

ARTIGO (título: "${article.title}"):
${contentSnippet}

Avalia:

1. COMPLETUDE TÉCNICA (1-10) — O artigo está utilizável?
   - Não está cortado a meio de uma frase
   - Não está cortado a meio de uma lista ou secção
   - Tem pelo menos um parágrafo desenvolvido (>3 frases)
   - O título existe e faz sentido em relação ao corpo

2. COERÊNCIA INTERNA (1-10) — Os factos são consistentes entre si?
   - Não há contradições óbvias dentro do artigo
   - Os números mencionados são plausíveis (ex.: percentagens entre 0-100, datas razoáveis)
   - Os nomes próprios mantêm-se consistentes ao longo do artigo
   - As referências internas funcionam (se diz "como veremos abaixo", há algo abaixo)

NÃO avalies:
- "Tem boa introdução / boa conclusão" (não exigimos estrutura editorial canónica)
- Contexto lusófono, adaptação local, tom criativo, originalidade
- Comprimento absoluto (artigo de 600 palavras pode estar perfeito, artigo de 2500 idem)
- Headings — a presença ou ausência de H2 não é defeito

PENALIZAÇÕES (reduzem scores):
- Artigo termina a meio de uma frase ou enumeração
- Caracteres estranhos não traduzidos (ex.: "&amp;", "[citation needed]")
- Mistura de inglês e português no mesmo parágrafo
- Texto duplicado (mesmo parágrafo aparece duas vezes)

Responde APENAS com JSON válido. Aspas duplas. Sem caracteres especiais nas strings.
Formato exacto:
{"scores":{"completude":0,"coerencia":0},"issues":["issue 1","issue 2"]}
Substitui 0 pelos scores reais (1-10). Máximo 3 issues curtos (menos de 80 caracteres cada).

Score >= 6 é aprovação. Scores < 6 só se houver problemas reais e visíveis.`

  // Correr as 2 personas em paralelo
  const [resTradutor, resEditor] = await Promise.all([
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompttradutor }],
    }),
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: promptEditor }],
    }),
  ])

  const parseResponse = (res: typeof resTradutor): { scores: Record<string, number>; issues: string[] } | null => {
    const raw = res.content[0].type === 'text' ? res.content[0].text : ''
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('[Quality] Nenhum JSON encontrado no raw:', raw.substring(0, 100))
        return null
      }
      return JSON.parse(jsonMatch[0])
    } catch (e) {
      console.error('[Quality] Parse error:', e, 'Raw:', raw.substring(0, 200))
      return null
    }
  }

  const parsedTradutor = parseResponse(resTradutor)
  const parsedEditor = parseResponse(resEditor)

  // Se alguma persona falhou a parsear, rejeitar
  if (!parsedTradutor || !parsedEditor) {
    return {
      approved: false,
      layer: 1,
      reason: 'Uma ou mais personas do council falhou a parsear resposta JSON',
      issues: ['Erro de parsing no council de review'],
    }
  }

  // Consolidar scores e issues das 2 personas
  const allScores: Record<string, number> = {
    ...parsedTradutor.scores,
    ...parsedEditor.scores,
  }

  const allIssues: string[] = [
    ...parsedTradutor.issues,
    ...parsedEditor.issues,
  ]

  const minScore = Math.min(...Object.values(allScores))
  const approved = minScore >= 6

  return {
    approved,
    layer: 1,
    scores: allScores,
    issues: allIssues,
    reason: approved
      ? undefined
      : `Council rejeitou. Score mínimo: ${minScore}/10. Issues: ${allIssues.filter(Boolean).join('; ')}`,
  }
}

// ─── CAMADA 2: VALIDAÇÕES ESTRUTURAIS ─────────────────────────────────────────

const PALAVRAS_PROIBIDAS = [
  'guaranteed', '100% safe', 'make money fast', 'garante lucro',
  'ganho garantido', 'sem risco', 'retorno garantido', 'get rich',
  'hackeado', 'pump', 'to the moon', 'lambo',
]

export function camada2Estrutural(article: ArticlePayload): QualityResult {
  const issues: string[] = []
  const content = article.content

  // Word count — limites alargados para acomodar tradução fiel
  // Stage 1 aceita fontes 500-4000 palavras EN; EN→PT expande ~10-15%
  const wordCount = content.split(/\s+/).length
  if (wordCount < 400) issues.push(`Artigo demasiado curto: ${wordCount} palavras (mínimo 400)`)
  if (wordCount > 5000) issues.push(`Artigo demasiado longo: ${wordCount} palavras (máximo 5000)`)

  // Título H1 obrigatório (uma única vez)
  const h1Count = (content.match(/^#\s+.+/gm) || []).length
  if (h1Count === 0) issues.push('Falta título H1 (# Título)')
  if (h1Count > 1) issues.push(`Múltiplos H1 detectados: ${h1Count} (deve haver apenas 1)`)

  // Sinais de truncação — último char deve ser pontuação final
  const trimmed = content.trimEnd()
  const lastChar = trimmed.slice(-1)
  if (!['.', '!', '?', '"', '»', ')', ':'].includes(lastChar)) {
    issues.push(`Artigo termina sem pontuação final (último char: "${lastChar}")`)
  }

  // Mistura inglês/português óbvia (heurística simples)
  const englishMarkers = [
    /\bthe\s+(?:article|content|following|above|below)\b/gi,
    /\bin\s+conclusion\b/gi,
    /\bto\s+sum\s+up\b/gi,
    /\b(?:subscribe|follow\s+me|click\s+here)\b/gi,
  ]
  const englishHits = englishMarkers.filter(p => p.test(content)).length
  if (englishHits >= 2) {
    issues.push(`Possíveis fragmentos não traduzidos detectados (${englishHits} marcadores)`)
  }

  // Palavras proibidas (segurança legal/ética — manter)
  const lowerContent = content.toLowerCase()
  for (const palavra of PALAVRAS_PROIBIDAS) {
    if (lowerContent.includes(palavra.toLowerCase())) {
      issues.push(`Palavra proibida encontrada: "${palavra}"`)
    }
  }

  // Disclaimer financeiro (só crypto)
  const hasDisclaimer =
    lowerContent.includes('não é aconselhamento financeiro') ||
    lowerContent.includes('não constitui aconselhamento') ||
    lowerContent.includes('não é conselho financeiro') ||
    lowerContent.includes('not financial advice')

  if (article.app_name === 'crypto' && !hasDisclaimer) {
    issues.push('Disclaimer financeiro obrigatório em conteúdo crypto ausente')
  }

  // Disclosure IA — aceita o bloco "Sobre este artigo" injectado pelo Stage 5
  const hasAIDisclosure =
    lowerContent.includes('assistência de ia') ||
    lowerContent.includes('gerado com ia') ||
    lowerContent.includes('inteligência artificial') ||
    lowerContent.includes('com recurso a inteligência') ||
    lowerContent.includes('sobre este artigo') ||
    lowerContent.includes('ai-assisted')

  if (!hasAIDisclosure) {
    issues.push('Disclosure de conteúdo gerado com IA ausente')
  }

  const approved = issues.length === 0

  return {
    approved,
    layer: 2,
    issues,
    reason: approved ? undefined : `${issues.length} validação(ões) falhada(s)`,
  }
}

// ─── CAMADA 3: PLAGIARISM (ORIGINALITY.AI) ────────────────────────────────────

export async function camada3Plagiarism(article: ArticlePayload): Promise<QualityResult> {
  const apiKey = process.env.ORIGINALITY_API_KEY

  // Se não há API key, skip com aviso (não bloqueia — sem key = sem check)
  if (!apiKey) {
    console.warn('[Camada 3] ORIGINALITY_API_KEY não configurada — skip plagiarism check')
    return { approved: true, layer: 3, reason: 'Skipped — sem API key' }
  }

  try {
    const response = await fetch('https://api.originality.ai/api/v1/scan/ai', {
      method: 'POST',
      headers: {
        'X-OAI-API-KEY': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        content: article.content.slice(0, 3500),
        aiModelVersion: 'bert',
        storeScan: false,
      }),
    })

    if (!response.ok) {
      console.error('[Camada 3] Originality.ai error:', response.status)
      return { approved: true, layer: 3, reason: `API error ${response.status} — skip` }
    }

    const data = await response.json() as { score?: { original?: number } }
    // Originality.ai retorna score 0-1 para "original" (1 = totalmente original)
    const originalityScore = Math.round((data.score?.original ?? 1) * 100)

    const approved = originalityScore >= 80

    return {
      approved,
      layer: 3,
      originality_score: originalityScore,
      reason: approved
        ? undefined
        : `Originalidade insuficiente: ${originalityScore}% (mínimo 80%)`,
    }
  } catch (err) {
    console.error('[Camada 3] Erro:', err)
    return { approved: true, layer: 3, reason: 'Erro de rede — skip' }
  }
}

// ─── CAMADA 4: QUALITY GATE (REJEIÇÃO + LOG) ──────────────────────────────────

export async function camada4QualityGate(
  article: ArticlePayload,
  results: QualityResult[]
): Promise<QualityResult> {
  const failed = results.filter((r) => !r.approved)

  if (failed.length === 0) {
    return { approved: true, layer: 4 }
  }

  const firstFail = failed[0]

  // Inserir em rejected_articles
  const { error } = await getSupabase().from('rejected_articles').insert({
    blog_post_id: article.id,
    rejection_layer: firstFail.layer,
    rejection_reason: firstFail.reason ?? 'Motivo desconhecido',
    camada1_scores: results.find((r) => r.layer === 1)?.scores ?? null,
    camada2_failures: results.find((r) => r.layer === 2)?.issues ?? null,
    camada3_originality_score: results.find((r) => r.layer === 3)?.originality_score ?? null,
    raw_content: article.content.slice(0, 5000),
    app_name: article.app_name,
  })

  if (error) {
    console.error('[Camada 4] Erro ao inserir rejected_articles:', error.message)
  }

  // Actualizar status do artigo para 'rejected'
  await getSupabase()
    .from('blog_posts')
    .update({ status: 'rejected' })
    .eq('id', article.id)

  return {
    approved: false,
    layer: 4,
    reason: `Rejeitado na Camada ${firstFail.layer}: ${firstFail.reason}`,
    issues: failed.map((r) => `[Camada ${r.layer}] ${r.reason}`),
  }
}

// ─── PIPELINE COMPLETO DE QUALITY ────────────────────────────────────────────

export async function runQualityPipeline(article: ArticlePayload): Promise<{
  approved: boolean
  reason?: string
  results: QualityResult[]
}> {
  console.log(`[Quality] Iniciando pipeline para: ${article.title}`)

  const results: QualityResult[] = []

  // Camada 1
  const c1 = await camada1AutoReview(article)
  results.push(c1)
  if (!c1.approved) {
    const gate = await camada4QualityGate(article, results)
    return { approved: false, reason: gate.reason, results }
  }

  // Camada 2
  const c2 = camada2Estrutural(article)
  results.push(c2)
  if (!c2.approved) {
    const gate = await camada4QualityGate(article, results)
    return { approved: false, reason: gate.reason, results }
  }

  // Camada 3
  const c3 = await camada3Plagiarism(article)
  results.push(c3)
  if (!c3.approved) {
    const gate = await camada4QualityGate(article, results)
    return { approved: false, reason: gate.reason, results }
  }

  console.log(`[Quality] ✅ Aprovado: ${article.title}`)
  return { approved: true, results }
}
