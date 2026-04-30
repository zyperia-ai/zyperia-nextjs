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
  stream?: boolean
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
    stream: true,
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

    // Parse NDJSON stream: each line is a JSON event from Ollama
    // Streaming keeps the Cloudflare Tunnel connection alive (avoids 524 timeouts)
    // by sending bytes continuously instead of going silent for >100s
    if (!response.body) {
      throw new Error('Ollama response has no body (cannot stream)')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let fullText = ''
    let inputTokens = 0
    let outputTokens = 0
    let modelName = body.model
    let finalDone = false

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // Split on newlines; last fragment may be incomplete, keep in buffer
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          const event = JSON.parse(trimmed)
          if (event.message?.content) {
            fullText += event.message.content
          }
          if (event.done) {
            finalDone = true
            if (typeof event.prompt_eval_count === 'number') inputTokens = event.prompt_eval_count
            if (typeof event.eval_count === 'number') outputTokens = event.eval_count
            if (event.model) modelName = event.model
          }
        } catch (parseErr: any) {
          console.warn(`[Ollama] skipped malformed NDJSON line: ${trimmed.slice(0, 120)}`)
        }
      }
    }

    // Process any leftover buffer content
    const leftover = buffer.trim()
    if (leftover) {
      try {
        const event = JSON.parse(leftover)
        if (event.message?.content) fullText += event.message.content
        if (event.done) {
          finalDone = true
          if (typeof event.prompt_eval_count === 'number') inputTokens = event.prompt_eval_count
          if (typeof event.eval_count === 'number') outputTokens = event.eval_count
          if (event.model) modelName = event.model
        }
      } catch {
        // ignore trailing garbage
      }
    }

    const durationMs = Date.now() - start
    const stopReason: OllamaCompletionResult['stopReason'] = finalDone ? 'end_turn' : 'max_tokens'

    console.log(
      `[Ollama] model=${modelName} in=${inputTokens} out=${outputTokens} ` +
      `duration=${durationMs}ms stop=${stopReason} chars=${fullText.length}`
    )

    return {
      text: fullText,
      inputTokens,
      outputTokens,
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
