/**
 * AI Router - Cost-optimized content generation
 *
 * Priority order:
 * 1. Claude API - Anthropic (available, proven quality)
 * 2. Gemini Flash - ~€0.001/article, verification only
 */

import Anthropic from '@anthropic-ai/sdk';

export type AIModel = 'claude-3-5-sonnet' | 'gemini-flash';

export interface AIResponse {
  content: string;
  model: AIModel;
  costUsd: number;
  duration: number;
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
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
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

    // Rough cost estimation: Claude 3.5 Sonnet is ~$3/MTok input, $15/MTok output
    const inputTokens = message.usage.input_tokens;
    const outputTokens = message.usage.output_tokens;
    const costUsd = (inputTokens * 3 + outputTokens * 15) / 1_000_000;

    return {
      content,
      model: 'claude-3-5-sonnet',
      costUsd,
      duration,
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
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
