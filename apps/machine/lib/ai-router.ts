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
  "sources": ["https://... URL completa obrigatória — extrai do resultado da web search"],
  "keyFacts": [
    "Facto verificável 1 com contexto",
    "Facto verificável 2 com contexto",
    "Facto verificável 3 com contexto"
  ],
  "lusophoneContext": "O que é único/relevante sobre este tema para Portugal, Brasil, Angola e outros países lusófonos que os artigos em inglês não cobrem",
  "searchQueries": ["queries usadas"]
}

IMPORTANTE:
- Em "sources" inclui APENAS URLs completas (https:// ou http://)
- NUNCA incluis títulos ou nomes de sites — apenas URLs completas
- Se não tens a URL completa, omite essa source
- Maximum 5 key facts — os mais importantes e verificáveis
- Se não encontrares factos verificáveis sobre algo, omite-o
- Nunca inventas dados. Prefere menos factos sólidos a muitos factos duvidosos.`

  try {
    // Primeira chamada — Claude pode invocar web_search
    let messages: any[] = [{ role: 'user', content: userPrompt }]
    let finalText = ''
    let iterations = 0
    const maxIterations = 5

    while (iterations < maxIterations) {
      iterations++
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        tools: [{ type: 'web_search_20250305' as any, name: 'web_search' } as any],
        system: systemPrompt,
        messages,
      })

      // Extrai text blocks desta resposta
      const textBlocks = response.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('')

      if (textBlocks) finalText += textBlocks

      // Se parou (end_turn ou max_tokens) — termina
      if (response.stop_reason === 'end_turn' || response.stop_reason === 'max_tokens') {
        break
      }

      // Se invocou tool — processa e continua
      if (response.stop_reason === 'tool_use') {
        const toolUseBlocks = response.content.filter((block: any) => block.type === 'tool_use')

        if (toolUseBlocks.length === 0) break

        // web_search_20250305 é nativo — Claude recebe resultados automaticamente
        // Apenas adiciona a resposta do assistant ao histórico e continua
        messages.push({ role: 'assistant', content: response.content })
        continue
      }

      break
    }

    // Extrai JSON do texto final
    const jsonMatch = finalText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0])
        console.log('[AI Router] Parsed successfully:', {
          sources: parsed.sources?.length || 0,
          keyFacts: parsed.keyFacts?.length || 0,
        })
        return {
          sources: parsed.sources || [],
          keyFacts: parsed.keyFacts || [],
          lusophoneContext: parsed.lusophoneContext || '',
          searchQueries: parsed.searchQueries || searchQueries,
        }
      } catch (parseError) {
        console.error('[AI Router] JSON parse error:', parseError)
      }
    }

    console.warn('[AI Router] No valid JSON found in response. finalText length:', finalText.length)

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
    `"${topic}" statistics data 2024 2025`,
    `${topic} real example case study results`,
  ]

  const appQueries: Record<string, string[]> = {
    crypto: [
      `${topic} site:coindesk.com OR site:theblock.co OR site:defillama.com`,
      `${topic} data statistics DeFi TVL 2024 2025`,
      `${topic} Portugal Brazil regulation MiCA CVM 2024 2025`,
    ],
    intelligence: [
      `${topic} site:techcrunch.com OR site:huggingface.co OR site:venturebeat.com`,
      `${topic} pricing benchmark comparison 2024 2025`,
      `${topic} GDPR LGPD Europe Brazil implementation`,
    ],
    onlinebiz: [
      `${topic} site:indiehackers.com OR site:starterstory.com OR site:failory.com`,
      `${topic} revenue numbers case study verified 2024 2025`,
      `${topic} Portugal Brazil tax fiscal 2024 2025`,
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
