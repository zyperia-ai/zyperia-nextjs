/**
 * NEXUS Admin Dashboard
 * Página protegida por ADMIN_TOKEN — mostra estado do sistema autónomo
 * Usage: GET /api/admin/nexus?token=YOUR_ADMIN_TOKEN
 */

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  )
}

const adminToken = process.env.ADMIN_TOKEN || 'default-insecure-token'

// ─── DATA FETCHING ────────────────────────────────────────────────────────────

async function fetchNexusData() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const [
    { data: topArticles },
    { data: categoryScores },
    { data: recentDecisions },
    { data: nexusConfig },
    { data: rejectedRecent },
    { data: recentLogs },
    { count: publishedToday },
    { count: totalPublished },
    { count: totalRejected },
  ] = await Promise.all([
    // Top 10 artigos por views
    getSupabase()
      .from('article_performance')
      .select('article_id, views, dwell_time_seconds, scroll_depth_percent, newsletter_signups')
      .order('views', { ascending: false })
      .limit(10),

    // Scores por categoria
    getSupabase()
      .from('topic_scores')
      .select('category, audience_level, avg_views, avg_dwell_time, avg_scroll_depth, avg_newsletter_rate, article_count, last_calculated_at')
      .order('avg_views', { ascending: false })
      .limit(20),

    // Últimas 10 decisões NEXUS
    getSupabase()
      .from('nexus_decisions')
      .select('decision_type, reason, articles_affected, decision_data, created_at')
      .order('created_at', { ascending: false })
      .limit(10),

    // Config actual
    getSupabase()
      .from('nexus_config')
      .select('config_key, config_value, updated_by, updated_at')
      .order('config_key'),

    // Artigos rejeitados últimos 7 dias
    getSupabase()
      .from('rejected_articles')
      .select('app_name, rejection_layer, rejection_reason, rejected_at')
      .gte('rejected_at', sevenDaysAgo.toISOString())
      .order('rejected_at', { ascending: false })
      .limit(20),

    // Últimos logs para circuit breaker status
    getSupabase()
      .from('generation_logs')
      .select('status, stage, created_at')
      .order('created_at', { ascending: false })
      .limit(20),

    // Publicados hoje
    getSupabase()
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('published_at', today.toISOString()),

    // Total publicados
    getSupabase()
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),

    // Total rejeitados
    getSupabase()
      .from('rejected_articles')
      .select('*', { count: 'exact', head: true }),
  ])

  // Circuit breaker status
  let consecutiveRejections = 0
  for (const log of recentLogs || []) {
    if (log.status === 'rejected' || log.status === 'failed') {
      consecutiveRejections++
    } else if (log.status === 'success') {
      break
    }
  }

  const cbThreshold = (nexusConfig?.find((c: { config_key: string }) => c.config_key === 'circuit_breaker_threshold')?.config_value as number) ?? 3
  const dailyLimit = (nexusConfig?.find((c: { config_key: string }) => c.config_key === 'daily_publish_limit')?.config_value as number) ?? 3
  const circuitOpen = consecutiveRejections >= cbThreshold

  return {
    topArticles: topArticles || [],
    categoryScores: categoryScores || [],
    recentDecisions: recentDecisions || [],
    nexusConfig: nexusConfig || [],
    rejectedRecent: rejectedRecent || [],
    circuitBreaker: {
      open: circuitOpen,
      consecutive: consecutiveRejections,
      threshold: cbThreshold,
    },
    stats: {
      publishedToday: publishedToday ?? 0,
      dailyLimit,
      totalPublished: totalPublished ?? 0,
      totalRejected: totalRejected ?? 0,
    },
  }
}

// ─── HTML RENDER ──────────────────────────────────────────────────────────────

function renderHTML(data: Awaited<ReturnType<typeof fetchNexusData>>): string {
  const { topArticles, categoryScores, recentDecisions, nexusConfig, rejectedRecent, circuitBreaker, stats } = data

  const cbColor = circuitBreaker.open ? '#ef4444' : '#22c55e'
  const cbLabel = circuitBreaker.open ? '🔴 ABERTO — Pipeline pausado' : '🟢 FECHADO — Pipeline activo'

  const configRows = nexusConfig.map((c: { config_key: string; config_value: unknown; updated_by: string; updated_at: string }) => `
    <tr>
      <td>${c.config_key}</td>
      <td><code>${JSON.stringify(c.config_value)}</code></td>
      <td>${c.updated_by || '—'}</td>
      <td>${c.updated_at ? new Date(c.updated_at).toLocaleString('pt-PT') : '—'}</td>
    </tr>`).join('')

  const scoreRows = categoryScores.map((s: { category: string; audience_level: string; avg_views: number; avg_dwell_time: number; avg_scroll_depth: number; avg_newsletter_rate: number; article_count: number; last_calculated_at: string }) => `
    <tr>
      <td>${s.category}</td>
      <td>${s.audience_level}</td>
      <td>${s.avg_views}</td>
      <td>${Math.round(s.avg_dwell_time)}s</td>
      <td>${s.avg_scroll_depth}%</td>
      <td>${(s.avg_newsletter_rate * 100).toFixed(2)}%</td>
      <td>${s.article_count}</td>
      <td>${s.last_calculated_at ? new Date(s.last_calculated_at).toLocaleDateString('pt-PT') : '—'}</td>
    </tr>`).join('')

  const decisionRows = recentDecisions.map((d: { decision_type: string; reason: string; articles_affected: number; created_at: string }) => `
    <tr>
      <td>${new Date(d.created_at).toLocaleString('pt-PT')}</td>
      <td><code>${d.decision_type}</code></td>
      <td>${d.articles_affected ?? 0}</td>
      <td>${d.reason}</td>
    </tr>`).join('')

  const rejectedRows = rejectedRecent.map((r: { app_name: string; rejection_layer: number; rejection_reason: string; rejected_at: string }) => `
    <tr>
      <td>${new Date(r.rejected_at).toLocaleString('pt-PT')}</td>
      <td>${r.app_name}</td>
      <td>Camada ${r.rejection_layer}</td>
      <td>${r.rejection_reason?.slice(0, 120) ?? '—'}</td>
    </tr>`).join('')

  const topArticleRows = topArticles.map((a: { article_id: string; views: number; dwell_time_seconds: number; scroll_depth_percent: number; newsletter_signups: number }, i: number) => `
    <tr>
      <td>${i + 1}</td>
      <td><code>${a.article_id?.slice(0, 8)}…</code></td>
      <td>${a.views}</td>
      <td>${Math.round(a.dwell_time_seconds)}s</td>
      <td>${a.scroll_depth_percent}%</td>
      <td>${a.newsletter_signups}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NEXUS Admin — ZYPERIA Machine</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 24px; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
    h2 { font-size: 1rem; font-weight: 600; color: #a3a3a3; margin: 32px 0 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .subtitle { color: #737373; font-size: 0.875rem; margin-bottom: 32px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 8px; }
    .stat { background: #171717; border: 1px solid #262626; border-radius: 8px; padding: 16px; }
    .stat-value { font-size: 2rem; font-weight: 700; line-height: 1; }
    .stat-label { font-size: 0.75rem; color: #737373; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .cb { background: #171717; border: 2px solid ${cbColor}; border-radius: 8px; padding: 16px 20px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
    .cb-label { font-weight: 600; }
    .cb-detail { font-size: 0.875rem; color: #a3a3a3; margin-left: auto; }
    table { width: 100%; border-collapse: collapse; background: #171717; border-radius: 8px; overflow: hidden; font-size: 0.875rem; }
    th { text-align: left; padding: 10px 14px; background: #262626; color: #a3a3a3; font-weight: 500; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
    td { padding: 10px 14px; border-top: 1px solid #262626; vertical-align: top; }
    tr:hover td { background: #1c1c1c; }
    code { background: #262626; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; }
    .empty { color: #525252; font-style: italic; padding: 20px 14px; }
    .refresh { font-size: 0.75rem; color: #525252; margin-top: 32px; }
  </style>
</head>
<body>
  <h1>NEXUS Admin</h1>
  <p class="subtitle">ZYPERIA Machine · Actualizado em ${new Date().toLocaleString('pt-PT')} · <a href="?" style="color:#737373">Actualizar</a></p>

  <h2>Estado Geral</h2>
  <div class="stats">
    <div class="stat">
      <div class="stat-value">${stats.publishedToday}/${stats.dailyLimit}</div>
      <div class="stat-label">Publicados hoje</div>
    </div>
    <div class="stat">
      <div class="stat-value">${stats.totalPublished}</div>
      <div class="stat-label">Total publicados</div>
    </div>
    <div class="stat">
      <div class="stat-value">${stats.totalRejected}</div>
      <div class="stat-label">Total rejeitados</div>
    </div>
    <div class="stat">
      <div class="stat-value">${categoryScores.length}</div>
      <div class="stat-label">Categorias com score</div>
    </div>
  </div>

  <h2>Circuit Breaker</h2>
  <div class="cb">
    <span class="cb-label">${cbLabel}</span>
    <span class="cb-detail">${circuitBreaker.consecutive} rejeições consecutivas · threshold: ${circuitBreaker.threshold}</span>
  </div>

  <h2>NEXUS Config Actual</h2>
  ${nexusConfig.length === 0 ? '<p class="empty">Sem config — a usar defaults</p>' : `
  <table>
    <thead><tr><th>Chave</th><th>Valor</th><th>Actualizado por</th><th>Quando</th></tr></thead>
    <tbody>${configRows}</tbody>
  </table>`}

  <h2>Top 10 Artigos por Views</h2>
  ${topArticles.length === 0 ? '<p class="empty">Sem dados de performance ainda — cold start</p>' : `
  <table>
    <thead><tr><th>#</th><th>Article ID</th><th>Views</th><th>Dwell</th><th>Scroll</th><th>Newsletter</th></tr></thead>
    <tbody>${topArticleRows}</tbody>
  </table>`}

  <h2>Scores por Categoria (últimos 30 dias)</h2>
  ${categoryScores.length === 0 ? '<p class="empty">Sem scores calculados ainda — brain tick ainda não correu com dados suficientes</p>' : `
  <table>
    <thead><tr><th>Categoria</th><th>Audiência</th><th>Avg Views</th><th>Avg Dwell</th><th>Avg Scroll</th><th>Newsletter Rate</th><th>Artigos</th><th>Calculado em</th></tr></thead>
    <tbody>${scoreRows}</tbody>
  </table>`}

  <h2>Últimas 10 Decisões NEXUS</h2>
  ${recentDecisions.length === 0 ? '<p class="empty">Sem decisões ainda — brain tick ainda não correu</p>' : `
  <table>
    <thead><tr><th>Quando</th><th>Tipo</th><th>Artigos</th><th>Razão</th></tr></thead>
    <tbody>${decisionRows}</tbody>
  </table>`}

  <h2>Artigos Rejeitados (últimos 7 dias)</h2>
  ${rejectedRecent.length === 0 ? '<p class="empty">Sem rejeições nos últimos 7 dias</p>' : `
  <table>
    <thead><tr><th>Quando</th><th>Blog</th><th>Camada</th><th>Motivo</th></tr></thead>
    <tbody>${rejectedRows}</tbody>
  </table>`}

  <p class="refresh">NEXUS Admin v1 · Sessão 8.5.2D · Dados em tempo real do Supabase</p>
</body>
</html>`
}

// ─── HANDLER ──────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (token !== adminToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const data = await fetchNexusData()
    const html = renderHTML(data)

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(`<pre>Erro: ${msg}</pre>`, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    })
  }
}