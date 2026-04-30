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

function getOllamaUrl() {
  return process.env.OLLAMA_URL || ''
}

function getOllamaModel() {
  return process.env.OLLAMA_MODEL || 'phi4'
}

function getOllamaTimeout() {
  const raw = process.env.OLLAMA_TIMEOUT_MS || '300000'
  const parsed = parseInt(raw)
  const isValid = !isNaN(parsed) && parsed > 0
  console.log(`[Ollama] timeout config: raw="${raw}" len=${raw.length} parsed=${parsed} valid=${isValid}`)
  return isValid ? parsed : 300000
}

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
    model: opts.model || getOllamaModel(),
    messages,
    stream: false,
    options: {
      temperature: opts.temperature ?? 0.3,
      num_predict: opts.maxTokens ?? 4096,
      num_ctx: 8192,
    },
  }

  const start = Date.now()
  const ollamaUrl = getOllamaUrl()
  const timeout = getOllamaTimeout()

  console.log(`[Ollama] request start: url=${ollamaUrl} timeout=${timeout}ms model=${body.model} tokens=${body.options?.num_predict}`)

  try {
    const reqStart = Date.now()
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeout),
    })
    const reqDuration = Date.now() - reqStart
    console.log(`[Ollama] fetch completed in ${reqDuration}ms, status=${response.status}`)

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
    const errorInfo = {
      message: error.message,
      code: error.code,
      cause: error.cause?.message || error.cause,
      name: error.name,
    }
    console.error(`[Ollama] Erro após ${durationMs}ms:`, JSON.stringify(errorInfo, null, 2))
    throw error
  }
}

export async function ollamaHealthy(): Promise<boolean> {
  const start = Date.now()
  try {
    const ollamaUrl = getOllamaUrl()
    if (!ollamaUrl) {
      console.log(`[Ollama] health check: url missing`)
      return false
    }
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    })
    const duration = Date.now() - start
    const healthy = response.ok
    console.log(`[Ollama] health check: url=${ollamaUrl} status=${response.status} duration=${duration}ms healthy=${healthy}`)
    return healthy
  } catch (error: any) {
    const duration = Date.now() - start
    console.error(`[Ollama] health check failed after ${duration}ms: ${error.message}`)
    return false
  }
}
