import Anthropic from '@anthropic-ai/sdk'
import { ollamaComplete, ollamaHealthy } from './ollama-client'

const KEYWORDS_BY_APP: Record<string, string[]> = {
  crypto: [
    'BITCOIN', 'ETHEREUM', 'ALTCOINS', 'STABLECOINS', 'NFT',
    'DEFI', 'MINING', 'ON-CHAIN', 'LAYER2', 'WEB3',
    'SEGURANCA', 'REGULACAO', 'TRADING', 'MACRO', 'ADOPCAO',
  ],
  intelligence: [
    'OPENAI', 'ANTHROPIC', 'GOOGLE-AI', 'XAI', 'META-AI', 'DEEPSEEK',
    'LLM', 'AGENTS', 'RAG', 'MCP', 'MULTIMODAL',
    'PRODUTIVIDADE', 'AUTOMACAO',
    'ETICA-IA', 'REGULACAO-IA',
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
  const excerpt = content.slice(0, 3000)

  return `És um editor SEO. Analisa o artigo abaixo e devolve APENAS um objecto JSON válido com 3 campos. Sem texto antes ou depois. Sem markdown. Sem code fences.

ESQUEMA OBRIGATÓRIO:
{
  "keywords": ["CATEGORIA_1", "CATEGORIA_2"],
  "meta_description": "string entre 140 e 160 caracteres",
  "tags": ["tag-uma", "tag-duas", "tag-tres"]
}

REGRAS:
1. keywords: escolhe 1 a 3 categorias EXCLUSIVAMENTE desta lista (não inventes outras): ${JSON.stringify(allowed)}
2. meta_description: resumo factual em português, 140-160 caracteres, sem hype, sem clickbait
3. tags: 3 a 7 tags livres em minúsculas com hífens (long-tail SEO, ex: "halving-2028", "wallets-hardware")
4. Não repitas o título no meta_description
5. Não uses palavras vagas ("interessante", "importante", "fascinante")

ARTIGO:
TÍTULO: ${title}

CONTEÚDO:
${excerpt}

JSON:`
}

function parseJSON(raw: string): ExtractedMetadata | null {
  // Strip code fences if model included them despite instruction
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim()
  // Find first { and last }
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
    .map(t => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    .filter(t => t.length > 0)
    .slice(0, 7)
  return { keywords, meta_description, tags }
}

export async function extractMetadata(
  appId: string,
  title: string,
  content: string
): Promise<ExtractedMetadata> {
  const prompt = buildPrompt(appId, title, content)

  // Try Phi-4 (Ollama) first
  try {
    const healthy = await ollamaHealthy()
    if (healthy) {
      const result = await ollamaComplete({
        userPrompt: prompt,
        maxTokens: 600,
        temperature: 0.3,
      })
      const parsed = parseJSON(result.text)
      if (parsed) return validate(parsed, appId)
      console.warn('[metadata-extractor] Ollama returned invalid JSON, falling back to Haiku')
    }
  } catch (e) {
    console.warn('[metadata-extractor] Ollama error:', (e as Error).message)
  }

  // Fallback: Haiku 4.5
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')
  const parsed = parseJSON(text)
  if (!parsed) {
    // Last resort: return safe defaults
    return {
      keywords: [],
      meta_description: title.slice(0, 160),
      tags: [],
    }
  }
  return validate(parsed, appId)
}
