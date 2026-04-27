import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}
import { sendCircuitBreakerAlert } from './email-notifications'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

// ─── RATE LIMITING ────────────────────────────────────────────────────────────

export async function checkDailyLimit(): Promise<{
  allowed: boolean
  published_today: number
  limit: number
}> {
  const limit = await getDailyLimit()

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const { count, error } = await getSupabase()
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .gte('published_at', today.toISOString())

  if (error) {
    console.error('[CircuitBreaker] Erro ao verificar daily limit:', error.message)
    return { allowed: true, published_today: 0, limit } // fail-open
  }

  const published_today = count ?? 0
  const allowed = published_today < limit

  if (!allowed) {
    console.log(`[CircuitBreaker] Daily limit atingido: ${published_today}/${limit}`)
    await logNexusDecision('rate_limit', {
      published_today,
      limit,
      blocked: true,
    })
  }

  return { allowed, published_today, limit }
}

// ─── CIRCUIT BREAKER ──────────────────────────────────────────────────────────

export async function checkCircuitBreaker(): Promise<{
  open: boolean
  consecutive_rejections: number
  threshold: number
}> {
  const threshold = await getCircuitBreakerThreshold()

  // Conta artigos rejeitados consecutivos (sem published entretanto)
  const { data: recentLogs, error } = await getSupabase()
    .from('generation_logs')
    .select('status, created_at')
    .order('created_at', { ascending: false })
    .limit(threshold + 5)

  if (error || !recentLogs) {
    console.error('[CircuitBreaker] Erro ao ler logs:', error?.message)
    return { open: false, consecutive_rejections: 0, threshold }
  }

  let consecutive = 0
  for (const log of recentLogs) {
    if (log.status === 'rejected' || log.status === 'failed') {
      consecutive++
    } else if (log.status === 'success') {
      break // reset count
    }
  }

  const open = consecutive >= threshold

  if (open) {
    console.error(`[CircuitBreaker] 🔴 ABERTO: ${consecutive} rejeições consecutivas`)
    await logNexusDecision('circuit_breaker_open', {
      consecutive_rejections: consecutive,
      threshold,
      action: 'pipeline_paused',
    })

    // Notificar owner
    try {
      await sendCircuitBreakerAlert({
        consecutive_rejections: consecutive,
        threshold,
      })
    } catch (err) {
      console.error('[CircuitBreaker] Falha ao enviar alerta:', err)
    }
  }

  return { open, consecutive_rejections: consecutive, threshold }
}

// ─── NEXUS CONFIG HELPERS ─────────────────────────────────────────────────────

async function getDailyLimit(): Promise<number> {
  const { data } = await getSupabase()
    .from('nexus_config')
    .select('config_value')
    .eq('config_key', 'daily_publish_limit')
    .single()

  return (data?.config_value as number) ?? 3
}

async function getCircuitBreakerThreshold(): Promise<number> {
  const { data } = await getSupabase()
    .from('nexus_config')
    .select('config_value')
    .eq('config_key', 'circuit_breaker_threshold')
    .single()

  return (data?.config_value as number) ?? 3
}

async function logNexusDecision(
  decision_type: string,
  decision_data: Record<string, unknown>
): Promise<void> {
  const { error } = await getSupabase().from('nexus_decisions').insert({
    decision_type,
    decision_data,
    reason: `Automático — ${decision_type}`,
    articles_affected: decision_data.consecutive_rejections ?? decision_data.published_today ?? 0,
  })

  if (error) {
    console.error('[CircuitBreaker] Erro ao log nexus_decisions:', error.message)
  }
}
