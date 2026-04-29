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

  const promptCetico = `És o Céptico — persona de revisão editorial do ZYPERIA.
A tua função é verificar a integridade do artigo.

ARTIGO (título: "${article.title}"):
${contentSnippet}

Verifica:
- O artigo vai além do óbvio ou é conteúdo genérico que existe em milhares de blogs?
- Há afirmações que claramente não têm base factual?
- Para artigos de breaking news: o artigo inventa detalhes que a fonte não confirmou?
- Para artigos de transformação: a transformação é real ou é apenas paráfrase?
- Os factos apresentados são plausíveis e coerentes entre si?

Responde APENAS com JSON válido. Usa aspas duplas. Sem caracteres especiais nas strings.
Formato exacto:
{"scores":{"integridade":0,"originalidade":0},"issues":["issue 1","issue 2"]}
Substitui 0 pelos scores reais (1-10). Maximum 3 issues curtos (menos de 80 caracteres cada).
Sem aspas simples, sem hífens duplos, sem caracteres especiais dentro das strings dos issues.

Score 7+ só se o artigo passa genuinamente nestes critérios.`

  const promptLeitor = `És o Leitor — persona de revisão editorial do ZYPERIA.
Representas um lusófono entre 25-45 anos (Portugal, Brasil, Angola, Cabo Verde).
Não és especialista no tema. Tens educação média e curiosidade genuína.

ARTIGO (título: "${article.title}"):
${contentSnippet}

Verifica:
- Consegues beneficiar deste artigo sem conhecimento prévio do tema?
- Todo o jargão técnico está explicado na primeira vez que aparece?
- O artigo menciona como o tema se aplica especificamente ao teu país lusófono?
- A linguagem é clara e directa, sem ser condescendente?
- O artigo tem uma conclusão clara com algo que podes fazer hoje?

Responde APENAS com JSON válido. Usa aspas duplas. Sem caracteres especiais nas strings.
Formato exacto:
{"scores":{"acessibilidade":0,"contexto_lusofono":0},"issues":["issue 1","issue 2"]}
Substitui 0 pelos scores reais (1-10). Maximum 3 issues curtos (menos de 80 caracteres cada).
Sem aspas simples, sem hífens duplos, sem caracteres especiais dentro das strings dos issues.

Score 7+ só se um lusófono iniciante consegue genuinamente beneficiar do artigo.`

  const promptEditor = `És o Editor — persona de revisão editorial do ZYPERIA.
Tens 15 anos de experiência em media digital lusófona.
Sabes exactamente o que separa conteúdo editorial de qualidade de conteúdo medíocre.

ARTIGO (título: "${article.title}"):
${contentSnippet}
APP: ${article.app_name}

Verifica:
- A voz é consistente e autêntica — soa como um editor sénior lusófono, não como IA genérica?
- A transformação é suficiente — ou é óbvio que veio de uma fonte anglófona?
- O ângulo lusófono é genuinamente diferente e acrescenta valor que a fonte original não tem?
- O artigo está completo — introdução, desenvolvimento e conclusão sem secções a meio?
- O título promete algo que o artigo cumpre completamente?

Responde APENAS com JSON válido. Usa aspas duplas. Sem caracteres especiais nas strings.
Formato exacto:
{"scores":{"voz_editorial":0,"transformacao":0},"issues":["issue 1","issue 2"]}
Substitui 0 pelos scores reais (1-10). Maximum 3 issues curtos (menos de 80 caracteres cada).
Sem aspas simples, sem hífens duplos, sem caracteres especiais dentro das strings dos issues.

Score 7+ só se publicarias isto com o teu nome como editor sénior.`

  // Correr as 3 personas em paralelo
  const [resCetico, resLeitor, resEditor] = await Promise.all([
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: promptCetico }],
    }),
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: promptLeitor }],
    }),
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: promptEditor }],
    }),
  ])

  const parseResponse = (res: typeof resCetico): { scores: Record<string, number>; issues: string[] } | null => {
    const raw = res.content[0].type === 'text' ? res.content[0].text : ''
    try {
      // Extrair o primeiro bloco JSON válido da resposta
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

  const parsedCetico = parseResponse(resCetico)
  const parsedLeitor = parseResponse(resLeitor)
  const parsedEditor = parseResponse(resEditor)

  // Se alguma persona falhou a parsear, rejeitar
  if (!parsedCetico || !parsedLeitor || !parsedEditor) {
    return {
      approved: false,
      layer: 1,
      reason: 'Uma ou mais personas do council falhou a parsear resposta JSON',
      issues: ['Erro de parsing no council de review'],
    }
  }

  // Consolidar scores e issues das 3 personas
  const allScores: Record<string, number> = {
    ...parsedCetico.scores,
    ...parsedLeitor.scores,
    ...parsedEditor.scores,
  }

  const allIssues: string[] = [
    ...parsedCetico.issues,
    ...parsedLeitor.issues,
    ...parsedEditor.issues,
  ]

  const minScore = Math.min(...Object.values(allScores))
  const approved = minScore >= 7

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
