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
A tua função é verificar a qualidade da tradução para português.

ARTIGO (título: "${article.title}"):
${contentSnippet}

Avalia APENAS:
1. FIDELIDADE — A tradução preserva fidedignamente os factos, dados e números do original?
   - Nenhum facto foi omitido ou distorcido?
   - Os números e estatísticas estão correctos?
   - O significado é fiel ao original?

2. FLUÊNCIA — O português é fluente, natural e legível?
   - Não parece tradução automática óbvia?
   - A prosa flui naturalmente?
   - O vocabulário é apropriado e consistente?

NÃO avalies: contexto lusófono, exemplos locais, originalidade da adaptação, ângulo único.

Responde APENAS com JSON válido. Usa aspas duplas. Sem caracteres especiais nas strings.
Formato exacto:
{"scores":{"fidelidade":0,"fluencia":0},"issues":["issue 1","issue 2"]}
Substitui 0 pelos scores reais (1-10). Maximum 3 issues curtos (menos de 80 caracteres cada).
Sem aspas simples, sem hífens duplos, sem caracteres especiais dentro das strings dos issues.

Score >= 6 é aprovação para tradução. Scores < 6 só se houver problemas reais.`

  const promptEditor = `És o EDITOR — persona de revisão editorial do ZYPERIA.
A tua função é verificar a estrutura e coerência do artigo.

ARTIGO (título: "${article.title}"):
${contentSnippet}

Avalia APENAS:
1. COMPLETUDE — O artigo tem estrutura clara de início, meio e fim?
   - Tem introdução que contextualiza o tema?
   - Tem desenvolvimento com ideias conectadas?
   - Tem conclusão que encerra o artigo?
   - Os parágrafos estão completos (não cortados no meio)?

2. COERÊNCIA — Os factos são consistentes e lógicos entre si?
   - Não há contradições internas?
   - O argumento flui logicamente?
   - Os factos citados são plausíveis?

NÃO avalies: contexto lusófono, adaptação local, tom criativo, originalidade da escrita.

Responde APENAS com JSON válido. Usa aspas duplas. Sem caracteres especiais nas strings.
Formato exacto:
{"scores":{"completude":0,"coerencia":0},"issues":["issue 1","issue 2"]}
Substitui 0 pelos scores reais (1-10). Maximum 3 issues curtos (menos de 80 caracteres cada).
Sem aspas simples, sem hífens duplos, sem caracteres especiais dentro das strings dos issues.

Score >= 6 é aprovação para estrutura. Scores < 6 só se houver problemas reais.`

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

  // Word count
  const wordCount = content.split(/\s+/).length
  if (wordCount < 800) issues.push(`Demasiado curto: ${wordCount} palavras (mínimo 800)`)
  if (wordCount > 3000) issues.push(`Demasiado longo: ${wordCount} palavras (máximo 3000)`)

  // Headings H2
  const h2Count = (content.match(/^## .+/gm) || []).length
  if (h2Count < 3) issues.push(`Poucos headings H2: ${h2Count} (mínimo 3)`)

  // Outbound links
  const linkCount = (content.match(/\[.+?\]\(https?:\/\/.+?\)/g) || []).length
  if (linkCount < 2) issues.push(`Poucos links externos: ${linkCount} (mínimo 2)`)

  // Palavras proibidas
  const lowerContent = content.toLowerCase()
  for (const palavra of PALAVRAS_PROIBIDAS) {
    if (lowerContent.includes(palavra.toLowerCase())) {
      issues.push(`Palavra proibida encontrada: "${palavra}"`)
    }
  }

  // Disclaimer financeiro
  const hasDisclaimer =
    lowerContent.includes('não é aconselhamento financeiro') ||
    lowerContent.includes('não constitui aconselhamento') ||
    lowerContent.includes('not financial advice')

  if (article.app_name === 'crypto' && !hasDisclaimer) {
    issues.push('Disclaimer financeiro obrigatório em conteúdo crypto ausente')
  }

  // Disclosure IA
  const hasAIDisclosure =
    lowerContent.includes('assistência de ia') ||
    lowerContent.includes('gerado com ia') ||
    lowerContent.includes('ai-assisted') ||
    lowerContent.includes('inteligência artificial')

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
