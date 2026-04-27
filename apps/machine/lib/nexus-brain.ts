/**
 * NEXUS Brain — Sistema de aprendizagem autónomo
 * Corre diariamente às 03:00 UTC via cron (brain-tick)
 * Lê article_performance → calcula scores → actualiza topic_scores + nexus_config
 */

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface ArticlePerformance {
  article_id: string
  views: number
  unique_views: number
  dwell_time_seconds: number
  scroll_depth_percent: number
  newsletter_signups: number
  affiliate_clicks: number
}

interface BlogPost {
  id: string
  app_name: string
  category?: string
  audience_level?: string
}

interface CategoryScore {
  category: string
  audience_level: string
  avg_views: number
  avg_dwell_time: number
  avg_scroll_depth: number
  avg_newsletter_rate: number
  article_count: number
}

interface NexusConfig {
  topic_distribution: Record<string, number>
  audience_focus: Record<string, number>
  daily_publish_limit: number
  circuit_breaker_threshold: number
  article_length: { min: number; max: number }
}

// ─── FASE 1: LER PERFORMANCE ──────────────────────────────────────────────────

async function readPerformanceData(dayWindow: number): Promise<{
  performances: ArticlePerformance[]
  posts: BlogPost[]
}> {
  const since = new Date()
  since.setDate(since.getDate() - dayWindow)

  const { data: performances, error: perfError } = await getSupabase()
    .from('article_performance')
    .select('*')
    .gte('updated_at', since.toISOString())

  if (perfError) {
    console.error('[NEXUS] Erro ao ler article_performance:', perfError.message)
    return { performances: [], posts: [] }
  }

  if (!performances || performances.length === 0) {
    console.log(`[NEXUS] Sem dados de performance nos últimos ${dayWindow} dias`)
    return { performances: [], posts: [] }
  }

  const articleIds = performances.map((p: ArticlePerformance) => p.article_id)

  const { data: posts, error: postsError } = await getSupabase()
    .from('blog_posts')
    .select('id, app_name, category, audience_level')
    .in('id', articleIds)

  if (postsError) {
    console.error('[NEXUS] Erro ao ler blog_posts:', postsError.message)
    return { performances, posts: [] }
  }

  return { performances: performances as ArticlePerformance[], posts: (posts as BlogPost[]) || [] }
}

// ─── FASE 2: CALCULAR SCORES ──────────────────────────────────────────────────

function calculateCategoryScores(
  performances: ArticlePerformance[],
  posts: BlogPost[]
): CategoryScore[] {
  const postMap = new Map(posts.map((p) => [p.id, p]))

  // Agrupar por categoria + audience_level
  const groups: Record<string, ArticlePerformance[]> = {}

  for (const perf of performances) {
    const post = postMap.get(perf.article_id)
    if (!post) continue

    const category = post.category || 'uncategorized'
    const audience = post.audience_level || 'intermédio'
    const key = `${category}::${audience}`

    if (!groups[key]) groups[key] = []
    groups[key].push(perf)
  }

  const scores: CategoryScore[] = []

  for (const [key, perfs] of Object.entries(groups)) {
    const [category, audience_level] = key.split('::')
    const count = perfs.length

    const avg = (field: keyof ArticlePerformance) =>
      perfs.reduce((sum, p) => sum + (Number(p[field]) || 0), 0) / count

    const avgViews = avg('views')
    const avgDwell = avg('dwell_time_seconds')
    const avgScroll = avg('scroll_depth_percent')
    // Newsletter rate: signups / unique_views (evitar divisão por zero)
    const avgNewsletterRate =
      perfs.reduce((sum, p) => {
        const rate = p.unique_views > 0 ? p.newsletter_signups / p.unique_views : 0
        return sum + rate
      }, 0) / count

    scores.push({
      category,
      audience_level,
      avg_views: Math.round(avgViews),
      avg_dwell_time: Math.round(avgDwell),
      avg_scroll_depth: Math.round(avgScroll * 10) / 10,
      avg_newsletter_rate: Math.round(avgNewsletterRate * 10000) / 10000,
      article_count: count,
    })
  }

  return scores
}

// ─── FASE 3: ACTUALIZAR topic_scores ─────────────────────────────────────────

async function updateTopicScores(scores: CategoryScore[]): Promise<void> {
  for (const score of scores) {
    const { error } = await getSupabase().from('topic_scores').upsert(
      {
        category: score.category,
        audience_level: score.audience_level,
        avg_views: score.avg_views,
        avg_dwell_time: score.avg_dwell_time,
        avg_scroll_depth: score.avg_scroll_depth,
        avg_newsletter_rate: score.avg_newsletter_rate,
        article_count: score.article_count,
        last_calculated_at: new Date().toISOString(),
      },
      { onConflict: 'category,audience_level' }
    )

    if (error) {
      console.error(`[NEXUS] Erro ao upsert topic_scores (${score.category}/${score.audience_level}):`, error.message)
    }
  }

  console.log(`[NEXUS] topic_scores actualizados: ${scores.length} entradas`)
}

// ─── FASE 4: AJUSTAR nexus_config ────────────────────────────────────────────

async function readCurrentConfig(): Promise<NexusConfig> {
  const defaults: NexusConfig = {
    topic_distribution: { how_to: 0.7, comparison: 0.2, analysis: 0.1 },
    audience_focus: { iniciante: 0.5, intermédio: 0.4, avançado: 0.1 },
    daily_publish_limit: 3,
    circuit_breaker_threshold: 3,
    article_length: { min: 800, max: 3000 },
  }

  const keys = Object.keys(defaults)
  const { data, error } = await getSupabase()
    .from('nexus_config')
    .select('config_key, config_value')
    .in('config_key', keys)

  if (error || !data) return defaults

  const config = { ...defaults }
  for (const row of data) {
    const key = row.config_key as keyof NexusConfig
    if (key in config) {
      ;(config as Record<string, unknown>)[key] = row.config_value
    }
  }

  return config
}

async function maybeAdjustConfig(
  scores: CategoryScore[],
  currentConfig: NexusConfig,
  totalArticles: number
): Promise<{ adjusted: boolean; changes: string[] }> {
  const changes: string[] = []

  // Só ajustar se houver amostra suficiente (mínimo 10 artigos)
  if (totalArticles < 10) {
    console.log(`[NEXUS] Amostra insuficiente (${totalArticles} artigos) — sem ajustes de config`)
    return { adjusted: false, changes: [] }
  }

  // Calcular engagement score composto por categoria (normalizado)
  const categoryEngagement: Record<string, number> = {}

  for (const score of scores) {
    // Score composto: views (40%) + dwell (30%) + scroll (20%) + newsletter (10%)
    // Normalização simples: usar valores relativos entre categorias
    const composite =
      score.avg_views * 0.4 +
      score.avg_dwell_time * 0.3 +
      score.avg_scroll_depth * 0.2 +
      score.avg_newsletter_rate * 1000 * 0.1

    categoryEngagement[score.category] = (categoryEngagement[score.category] || 0) + composite
  }

  // Mapear categorias para tipo de conteúdo (how_to / comparison / analysis)
  const typeEngagement: Record<string, number> = { how_to: 0, comparison: 0, analysis: 0 }
  const typeCounts: Record<string, number> = { how_to: 0, comparison: 0, analysis: 0 }

  // Heurística: categorias com "comparação" → comparison, resto → how_to (default)
  for (const [cat, eng] of Object.entries(categoryEngagement)) {
    const lower = cat.toLowerCase()
    if (lower.includes('compar') || lower.includes('vs') || lower.includes('review')) {
      typeEngagement.comparison += eng
      typeCounts.comparison++
    } else if (lower.includes('análise') || lower.includes('analysis') || lower.includes('context')) {
      typeEngagement.analysis += eng
      typeCounts.analysis++
    } else {
      typeEngagement.how_to += eng
      typeCounts.how_to++
    }
  }

  // Normalizar para somar 1.0 (manter proporções mas ajustar ligeiramente)
  const totalEng = Object.values(typeEngagement).reduce((a, b) => a + b, 0)

  if (totalEng > 0) {
    const newDistribution: Record<string, number> = {}
    for (const type of ['how_to', 'comparison', 'analysis']) {
      // Blend: 70% config actual + 30% novo sinal
      const newSignal = typeEngagement[type] / totalEng
      const blended = currentConfig.topic_distribution[type] * 0.7 + newSignal * 0.3
      newDistribution[type] = Math.round(blended * 100) / 100
    }

    // Normalizar para garantir soma = 1.0
    const sum = Object.values(newDistribution).reduce((a, b) => a + b, 0)
    for (const type of Object.keys(newDistribution)) {
      newDistribution[type] = Math.round((newDistribution[type] / sum) * 100) / 100
    }

    // Só actualizar se mudança > 5% em algum tipo
    const hasSignificantChange = Object.keys(newDistribution).some(
      (type) => Math.abs(newDistribution[type] - currentConfig.topic_distribution[type]) > 0.05
    )

    if (hasSignificantChange) {
      await upsertConfig('topic_distribution', newDistribution)
      changes.push(`topic_distribution: ${JSON.stringify(newDistribution)}`)
    }
  }

  return { adjusted: changes.length > 0, changes }
}

async function upsertConfig(key: string, value: unknown): Promise<void> {
  const { error } = await getSupabase().from('nexus_config').upsert(
    {
      config_key: key,
      config_value: value,
      updated_by: 'nexus_brain',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'config_key' }
  )

  if (error) {
    console.error(`[NEXUS] Erro ao upsert nexus_config (${key}):`, error.message)
  }
}

// ─── FASE 5: LOG DECISÃO ──────────────────────────────────────────────────────

async function logDecision(
  totalArticles: number,
  scores: CategoryScore[],
  adjusted: boolean,
  changes: string[],
  dayWindow: number
): Promise<void> {
  const { error } = await getSupabase().from('nexus_decisions').insert({
    decision_type: 'brain_tick',
    decision_data: {
      day_window: dayWindow,
      articles_analysed: totalArticles,
      categories_scored: scores.length,
      config_adjusted: adjusted,
      changes,
      top_categories: scores
        .sort((a, b) => b.avg_views - a.avg_views)
        .slice(0, 3)
        .map((s) => `${s.category}/${s.audience_level} (${s.avg_views} avg views)`),
    },
    reason: adjusted
      ? `Brain tick: ${changes.length} ajuste(s) de config com base em ${totalArticles} artigos`
      : `Brain tick: sem ajustes (${totalArticles} artigos analisados, amostra insuficiente ou sem sinal)`,
    articles_affected: totalArticles,
  })

  if (error) {
    console.error('[NEXUS] Erro ao log nexus_decisions:', error.message)
  }
}

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────

export async function runBrainTick(): Promise<{
  success: boolean
  articles_analysed: number
  categories_scored: number
  config_adjusted: boolean
  changes: string[]
  reason?: string
}> {
  console.log('[NEXUS] Brain tick iniciado:', new Date().toISOString())

  // Determinar janela de dados baseada no dia do projecto
  // Dias 1-30: usar janela de 7 dias (poucos dados)
  // Dias 31+: usar janela de 30 dias (mais estável)
  const dayWindow = 30 // simplificado: sempre 30, mas sem dados suficientes não ajusta

  const { performances, posts } = await readPerformanceData(dayWindow)

  if (performances.length === 0) {
    await logDecision(0, [], false, [], dayWindow)
    return {
      success: true,
      articles_analysed: 0,
      categories_scored: 0,
      config_adjusted: false,
      changes: [],
      reason: 'Sem dados de performance ainda — cold start',
    }
  }

  const scores = calculateCategoryScores(performances, posts)
  await updateTopicScores(scores)

  const currentConfig = await readCurrentConfig()
  const { adjusted, changes } = await maybeAdjustConfig(scores, currentConfig, performances.length)

  await logDecision(performances.length, scores, adjusted, changes, dayWindow)

  console.log(`[NEXUS] Brain tick completo: ${performances.length} artigos, ${scores.length} categorias, adjusted=${adjusted}`)

  return {
    success: true,
    articles_analysed: performances.length,
    categories_scored: scores.length,
    config_adjusted: adjusted,
    changes,
  }
}
