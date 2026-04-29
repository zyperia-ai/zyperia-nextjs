/**
 * Cliente Ollama para inferência LLM local.
 * Usa endpoint Ollama via Cloudflare Tunnel.
 */

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OllamaChatRequest {
  model: string
  messages: OllamaMessage[]
  stream?: false
  options?: {
    temperature?: number
    num_predict?: number
    num_ctx?: number
  }
}

interface OllamaChatResponse {
  model: string
  created_at: string
  message: { role: 'assistant'; content: string }
  done: boolean
  total_duration: number
  eval_count: number
  prompt_eval_count: number
}

export interface OllamaCompletionResult {
  text: string
  inputTokens: number
  outputTokens: number
  durationMs: number
  stopReason: 'end_turn' | 'max_tokens' | 'error'
}

const OLLAMA_URL = process.env.OLLAMA_URL!
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi4'
const OLLAMA_TIMEOUT_MS = parseInt(process.env.OLLAMA_TIMEOUT_MS || '300000')

export async function ollamaComplete(opts: {
  systemPrompt?: string
  userPrompt: string
  maxTokens?: number
  temperature?: number
  model?: string
}): Promise<OllamaCompletionResult> {
  const messages: OllamaMessage[] = []
  if (opts.systemPrompt) messages.push({ role: 'system', content: opts.systemPrompt })
  messages.push({ role: 'user', content: opts.userPrompt })

  const body: OllamaChatRequest = {
    model: opts.model || OLLAMA_MODEL,
    messages,
    stream: false,
    options: {
      temperature: opts.temperature ?? 0.3,
      num_predict: opts.maxTokens ?? 4096,
      num_ctx: 8192,
    },
  }

  const start = Date.now()

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(OLLAMA_TIMEOUT_MS),
    })

    if (!response.ok) {
      throw new Error(`Ollama HTTP ${response.status}: ${await response.text()}`)
    }

    const data: OllamaChatResponse = await response.json()
    const durationMs = Date.now() - start
    const stopReason: OllamaCompletionResult['stopReason'] = data.done ? 'end_turn' : 'max_tokens'

    console.log(
      `[Ollama] model=${data.model} in=${data.prompt_eval_count} out=${data.eval_count} ` +
      `duration=${durationMs}ms stop=${stopReason}`
    )

    return {
      text: data.message.content,
      inputTokens: data.prompt_eval_count,
      outputTokens: data.eval_count,
      durationMs,
      stopReason,
    }
  } catch (error: any) {
    const durationMs = Date.now() - start
    console.error(`[Ollama] Erro após ${durationMs}ms:`, error.message)
    throw error
  }
}

export async function ollamaHealthy(): Promise<boolean> {
  try {
    if (!OLLAMA_URL) return false
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    })
    return response.ok
  } catch {
    return false
  }
}
