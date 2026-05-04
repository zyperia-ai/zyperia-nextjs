import Anthropic from '@anthropic-ai/sdk'

const KEYWORDS_BY_APP: Record<string, string[]> = {
  crypto: [
    'BITCOIN', 'ETHEREUM', 'ALTCOINS', 'STABLECOINS', 'NFT',
    'DEFI', 'MINING', 'ON-CHAIN', 'LAYER2', 'WEB3',
    'SEGURANCA', 'REGULACAO', 'TRADING', 'MACRO', 'ADOPCAO',
  ],
  intelligence: [
    'OPENAI', 'ANTHROPIC', 'GOOGLE-AI', 'XAI', 'META-AI', 'DEEPSEEK',
    'LLM', 'AGENTS', 'RAG', 'MCP', 'MULTIMODAL',
    'PRODUTIVIDADE', 'AUTOMACAO', 'ETICA-IA', 'REGULACAO-IA',
  ],
  onlinebiz: [
    'SAAS', 'MICRO-SAAS', 'E-COMMERCE', 'AFFILIATE', 'AGENCY',
    'INDIE-HACKERS', 'BOOTSTRAPPING', 'SIDE-HUSTLE', 'CREATOR-ECONOMY',
    'NEWSLETTER', 'SEO', 'PAID-ADS', 'CONTENT-MARKETING',
    'AI-BUSINESS', 'MONETIZACAO',
  ],
}

export interface ExtractedMetadata {
  keywords: string[]
  meta_description: string
  tags: string[]
}

function buildPrompt(appId: string, title: string, content: string): string {
  const allowed = KEYWORDS_BY_APP[appId] || []
  const excerpt = content.slice(0, 4000)

  return `És um especialista em SEO para conteúdo editorial lusófono (Portugal, Brasil, Angola, Moçambique). O teu objectivo é maximizar a visibilidade orgânica deste artigo nos motores de pesquisa.

Analisa o artigo e devolve APENAS um objecto JSON válido. Sem texto antes ou depois. Sem markdown. Sem code fences.

ESQUEMA OBRIGATÓRIO:
{
  "keywords": ["CATEGORIA_1", "CATEGORIA_2", "CATEGORIA_3"],
  "meta_description": "string de exactamente 150-160 caracteres",
  "tags": ["tag-1", "tag-2", "tag-3", "tag-4", "tag-5", "tag-6", "tag-7"]
}

REGRAS KEYWORDS (campo crítico para indexação):
- Escolhe 2 a 3 categorias EXCLUSIVAMENTE desta lista: ${JSON.stringify(allowed)}
- Prioriza as categorias mais específicas ao tema central do artigo
- Nunca repitas categorias
- Se o artigo aborda múltiplos temas, escolhe as categorias mais relevantes para o tema principal

REGRAS META DESCRIPTION (campo crítico para CTR):
- EXACTAMENTE entre 150 e 160 caracteres — conta os caracteres
- Inclui a keyword principal de forma natural na primeira metade da frase
- Responde à intenção de pesquisa: o que o leitor vai aprender/descobrir?
- Usa linguagem activa e directa — evita voz passiva
- Inclui um elemento de urgência ou relevância quando justificado pelo conteúdo
- Nunca repetes o título literalmente
- Nunca usas: "Descubra", "Saiba mais", "Clique aqui", "Neste artigo"
- Termina sempre com ponto final

REGRAS TAGS (campo crítico para descoberta interna e long-tail SEO):
- Exactamente 5 a 7 tags
- Mistura obrigatória: 2-3 tags broad (tema geral) + 2-3 tags específicas (subtema/ângulo único) + 1-2 tags geográficas/temporais se relevante
- Formato: minúsculas, hífens em vez de espaços, sem acentos, sem caracteres especiais
- As tags específicas devem capturar o ângulo único do artigo — não apenas o tema geral
- Exemplos de boa mistura para artigo sobre regulação cripto: "bitcoin", "regulacao-cripto", "africa-do-sul-bitcoin", "confisco-criptomoedas", "chaves-privadas-governo", "liberdade-financeira"

ARTIGO PARA ANALISAR:
TÍTULO: ${title}

CONTEÚDO:
${excerpt}

JSON:`
}

function parseJSON(raw: string): ExtractedMetadata | null {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1))
    if (!Array.isArray(parsed.keywords)) return null
    if (typeof parsed.meta_description !== 'string') return null
    if (!Array.isArray(parsed.tags)) return null
    return parsed as ExtractedMetadata
  } catch {
    return null
  }
}

function validate(meta: ExtractedMetadata, appId: string): ExtractedMetadata {
  const allowed = new Set(KEYWORDS_BY_APP[appId] || [])
  const keywords = meta.keywords.filter(k => allowed.has(k)).slice(0, 3)
  const meta_description = meta.meta_description.slice(0, 160)
  const tags = meta.tags
    .filter(t => typeof t === 'string' && t.length > 0)
    .map(t => t.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    )
    .filter(t => t.length > 2)
    .slice(0, 7)
  return { keywords, meta_description, tags }
}

export async function extractMetadata(
  appId: string,
  title: string,
  content: string
): Promise<ExtractedMetadata> {
  const prompt = buildPrompt(appId, title, content)

  // Haiku 4.5 — modelo locked
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')
    const parsed = parseJSON(text)
    if (parsed) return validate(parsed, appId)
    console.warn('[metadata-extractor] JSON inválido, usando defaults')
  } catch (e) {
    console.warn('[metadata-extractor] Haiku error:', (e as Error).message)
  }

  // Defaults de segurança
  return {
    keywords: [],
    meta_description: title.slice(0, 160),
    tags: [],
  }
}
