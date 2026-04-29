/**
 * AI Router - Cost-optimized content generation
 *
 * Priority order:
 * 1. Claude API - Anthropic (available, proven quality)
 * 2. Gemini Flash - ~€0.001/article, verification only
 */

import Anthropic from '@anthropic-ai/sdk';

export type AIModel = 'claude-sonnet-4-5' | 'gemini-flash';

export interface AIResponse {
  content: string;
  model: AIModel;
  costUsd: number;
  duration: number;
  inputTokens?: number;
  outputTokens?: number;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate content using Claude API
 */
export async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string,
): Promise<AIResponse> {
  const startTime = Date.now();

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 16000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const duration = Math.round((Date.now() - startTime) / 1000);
    const content = message.content[0].type === 'text' ? message.content[0].text : '';

    // Rough cost estimation: Claude Sonnet 4.5 is ~$3/MTok input, $15/MTok output
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const costUsd = (inputTokens * 3 + outputTokens * 15) / 1_000_000;

    console.log(`[AI Router] input_tokens: ${inputTokens}, output_tokens: ${outputTokens}, max: 16000, stop_reason: ${message.stop_reason}`)
    return {
      content,
      model: 'claude-sonnet-4-5',
      costUsd,
      duration,
      inputTokens,
      outputTokens,
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

export async function searchAndExtractWithClaude(
  topic: string,
  appId: string
): Promise<{
  sources: string[]
  keyFacts: string[]
  lusophoneContext: string
  searchQueries: string[]
}> {
  const searchQueries = buildSearchQueries(topic, appId)

  const systemPrompt = `És um investigador editorial do ZYPERIA — media publisher lusófono global.
A tua função é encontrar os melhores artigos em inglês sobre um tópico
e extrair os factos mais relevantes para transformar em conteúdo lusófono de qualidade.

REGRAS:
- Procura artigos de fontes credíveis (publicações especializadas, não blogs genéricos)
- Extrai apenas factos verificáveis — nunca inventes dados
- Identifica o que é único para o mercado lusófono (Portugal, Brasil, Angola, Cabo Verde, Moçambique)
- Foca em conteúdo que ainda não existe em português de qualidade`

  const userPrompt = `Pesquisa informação sobre: "${topic}"

Usa as seguintes queries de pesquisa:
${searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Após pesquisar, extrai e devolve em JSON:
{
  "sources": ["URL ou título dos melhores artigos encontrados"],
  "keyFacts": [
    "Facto verificável 1 com contexto",
    "Facto verificável 2 com contexto",
    "Facto verificável 3 com contexto"
  ],
  "lusophoneContext": "O que é único/relevante sobre este tema para Portugal, Brasil, Angola e outros países lusófonos que os artigos em inglês não cobrem",
  "searchQueries": ["queries usadas"]
}

IMPORTANTE: Se não encontrares factos verificáveis sobre algo, omite-o.
Nunca inventas dados. Prefere menos factos sólidos a muitos factos duvidosos.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      tools: [
        {
          type: 'web_search_20250305' as any,
          name: 'web_search',
        } as any,
      ],
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = response.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('')

    const jsonMatch = textContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        sources: parsed.sources || [],
        keyFacts: parsed.keyFacts || [],
        lusophoneContext: parsed.lusophoneContext || '',
        searchQueries: parsed.searchQueries || searchQueries,
      }
    }
  } catch (error) {
    console.error('[AI Router] Web search error:', error)
  }

  return {
    sources: [],
    keyFacts: [],
    lusophoneContext: '',
    searchQueries,
  }
}

function buildSearchQueries(topic: string, appId: string): string[] {
  const baseQueries = [
    `${topic} explained 2025 2026`,
    `${topic} guide tutorial`,
  ]

  const appQueries: Record<string, string[]> = {
    crypto: [
      `${topic} site:coindesk.com OR site:theblock.co OR site:decrypt.co`,
      `${topic} Portugal Brazil regulation 2025 2026`,
    ],
    intelligence: [
      `${topic} site:techcrunch.com OR site:venturebeat.com OR site:huggingface.co`,
      `${topic} GDPR LGPD Europe Brazil 2025 2026`,
    ],
    onlinebiz: [
      `${topic} site:indiehackers.com OR site:failory.com OR site:starterstory.com`,
      `${topic} Portugal Brazil online business 2025 2026`,
    ],
  }

  return [...baseQueries, ...(appQueries[appId] || [])]
}

/**
 * Route content generation based on task type
 */
export async function routeGeneration(
  task: 'generation' | 'verification' | 'editorial',
  prompt: string,
  appId: string,
  systemPrompt: string = 'You are a professional content writer.',
): Promise<AIResponse> {
  // Use Claude for all generation tasks
  return await generateWithClaude(systemPrompt, prompt);
}
