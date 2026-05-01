'use client'

const APP_COLORS: Record<string, string> = {
  'blog-crypto': '#FFB800',
  'blog-intelligence': '#00B4FF',
  'blog-onlinebiz': '#AEEA00',
  'crypto': '#FFB800',
  'intelligence': '#00B4FF',
  'onlinebiz': '#AEEA00',
}

const BLOG_DOMAINS: Record<string, string> = {
  'blog-crypto': 'https://crypto.zyperia.ai',
  'blog-intelligence': 'https://intelligence.zyperia.ai',
  'blog-onlinebiz': 'https://onlinebiz.zyperia.ai',
}

const TIPO_LABELS: Record<string, string> = {
  'breaking_news': 'TIPO 1',
  'youtube_newsletter': 'TIPO 2',
  'evergreen': 'TIPO 3',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  if (weeks > 0) return `há ${weeks} sem`
  if (days > 0) return `há ${days}d`
  if (hours > 0) return `há ${hours}h`
  return `há ${mins}min`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return `Hoje ${formatTime(iso)}`
  if (d.toDateString() === tomorrow.toDateString()) return `Amanhã ${formatTime(iso)}`
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }) + ' ' + formatTime(iso)
}

function stockWeeks(approved: any[], appId: string) {
  const count = approved.filter(a => a.app_id === appId).length
  return { count, weeks: (count / 7).toFixed(1) }
}

function stockBarWidth(weeks: number) {
  return Math.min((weeks / 6) * 100, 100)
}

function stockColor(weeks: number) {
  if (weeks < 1) return '#ef4444'
  if (weeks > 5) return '#f59e0b'
  return null
}

function isOld(createdAt: string) {
  const weeks = (Date.now() - new Date(createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
  return weeks > 4
}

function nextBatchInfo() {
  const now = new Date()
  const next = new Date(now)
  const day = now.getUTCDay()
  const daysUntilSunday = (7 - day) % 7 || 7
  next.setUTCDate(now.getUTCDate() + daysUntilSunday)
  next.setUTCHours(2, 0, 0, 0)
  const diff = next.getTime() - now.getTime()
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  if (days > 0) return `daqui a ${days} dia${days > 1 ? 's' : ''}`
  return `daqui a ${hours}h`
}

type Props = {
  pendingCount: number
  approved: any[]
  publishedToday: any[]
  recentBreakings: any[]
  recentPublished: any[]
  pendingArticles: any[]
  nextScheduled: any[]
}

export default function DashboardClient({
  pendingCount, approved, publishedToday,
  recentBreakings, recentPublished, pendingArticles, nextScheduled
}: Props) {

  const cryptoStock = stockWeeks(approved, 'blog-crypto')
  const intelStock = stockWeeks(approved, 'blog-intelligence')
  const bizStock = stockWeeks(approved, 'blog-onlinebiz')

  const cryptoToday = publishedToday.filter(a => a.app_id === 'blog-crypto').length
  const intelToday = publishedToday.filter(a => a.app_id === 'blog-intelligence').length
  const bizToday = publishedToday.filter(a => a.app_id === 'blog-onlinebiz').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Breaking alert — só aparece se houver breakings recentes */}
      {recentBreakings.length > 0 && (
        <div style={{ background: '#1a1200', border: '1px solid #713f12', borderRadius: '8px', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }}></div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>
              {recentBreakings.length} breaking{recentBreakings.length > 1 ? 's' : ''} publicado{recentBreakings.length > 1 ? 's' : ''} nas últimas 48h
            </span>
            <a href="/admin/breaking" style={{ marginLeft: 'auto', fontSize: '12px', color: '#f59e0b', textDecoration: 'none' }}>Ver todos →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {recentBreakings.slice(0, 3).map(article => (
              <div key={article.id} style={{ background: '#111', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: '#e5e5e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                    <span style={{ color: APP_COLORS[article.app_id] ?? '#888' }}>{article.app_id.replace('blog-', '')}</span>
                    {' · '}{timeAgo(article.published_at)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <a href="/admin/breaking" style={{ fontSize: '12px', color: '#60a5fa', textDecoration: 'none' }}>Rever</a>
                  <a href={`${BLOG_DOMAINS[article.app_id]}/articles/${article.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#555', textDecoration: 'none' }}>↗</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
        <a href="/admin/pending-review" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Pending review</div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: pendingCount > 0 ? '#fff' : '#444' }}>{pendingCount}</div>
            <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>artigos a rever</div>
          </div>
        </a>
        <a href="/admin/queue" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Fila aprovados</div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: approved.length > 0 ? '#fff' : '#444' }}>{approved.length}</div>
            <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>
              {approved.length > 0 ? `~${(approved.length / 3 / 7).toFixed(1)} semanas stock` : 'fila vazia'}
            </div>
          </div>
        </a>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Publicados hoje</div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: publishedToday.length > 0 ? '#fff' : '#444' }}>{publishedToday.length}</div>
          <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>
            {cryptoToday > 0 && <span style={{ color: '#FFB800' }}>{cryptoToday} crypto </span>}
            {intelToday > 0 && <span style={{ color: '#00B4FF' }}>{intelToday} intel </span>}
            {bizToday > 0 && <span style={{ color: '#AEEA00' }}>{bizToday} biz</span>}
            {publishedToday.length === 0 && 'nenhum ainda'}
          </div>
        </div>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Próximo batch</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>Dom 02:00</div>
          <div style={{ fontSize: '11px', color: '#444', marginTop: '4px' }}>{nextBatchInfo()}</div>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '16px' }}>

        {/* Left — Pending review */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Pending review</span>
            <a href="/admin/pending-review" style={{ fontSize: '12px', color: '#60a5fa', textDecoration: 'none' }}>Ver todos →</a>
          </div>
          {pendingArticles.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#444', textAlign: 'center', padding: '20px 0' }}>Nenhum artigo pendente</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingArticles.map(article => {
                const old = isOld(article.created_at)
                const color = APP_COLORS[article.app_id] ?? '#888'
                return (
                  <a key={article.id} href="/admin/pending-review" style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                      background: old ? '#1a0a0a' : '#1a1a1a',
                      border: old ? '1px solid #7f1d1d' : '1px solid transparent',
                      borderRadius: '6px', cursor: 'pointer'
                    }}>
                      <div style={{ width: '3px', height: '32px', background: color, flexShrink: 0 }}></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', color: '#e5e5e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</div>
                        <div style={{ fontSize: '11px', marginTop: '2px', display: 'flex', gap: '8px' }}>
                          <span style={{ color }}>{article.app_id.replace('blog-', '')}</span>
                          <span style={{ color: old ? '#ef4444' : '#555' }}>{timeAgo(article.created_at)}{old ? ' ⚠️' : ''}</span>
                          <span style={{ color: '#555' }}>{TIPO_LABELS[article.generation_approach] ?? '—'}</span>
                        </div>
                      </div>
                      <span style={{ color: '#444', fontSize: '16px' }}>›</span>
                    </div>
                  </a>
                )
              })}
              {pendingCount > 5 && (
                <div style={{ fontSize: '12px', color: '#444', textAlign: 'center', padding: '4px 0' }}>+ {pendingCount - 5} mais</div>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Stock por blog */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '14px' }}>Stock aprovado</div>
            {[
              { id: 'blog-crypto', label: 'Crypto', stock: cryptoStock },
              { id: 'blog-intelligence', label: 'Intelligence', stock: intelStock },
              { id: 'blog-onlinebiz', label: 'OnlineBiz', stock: bizStock },
            ].map(({ id, label, stock }) => {
              const weeks = parseFloat(stock.weeks)
              const barColor = stockColor(weeks) ?? APP_COLORS[id]
              const barWidth = stockBarWidth(weeks)
              return (
                <div key={id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#666' }}>{label}</span>
                    <span style={{ fontSize: '12px', color: '#e5e5e5' }}>{stock.count} art · {stock.weeks} sem</span>
                  </div>
                  <div style={{ height: '4px', background: '#222', borderRadius: '2px' }}>
                    <div style={{ height: '4px', width: `${barWidth}%`, background: barColor, borderRadius: '2px', transition: 'width 0.3s' }}></div>
                  </div>
                  {weeks < 1 && <div style={{ fontSize: '10px', color: '#ef4444', marginTop: '3px' }}>⚠️ stock baixo</div>}
                  {weeks > 5 && <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '3px' }}>⚠️ artigos a envelhecer</div>}
                </div>
              )
            })}
            <div style={{ fontSize: '10px', color: '#333', marginTop: '4px', borderTop: '1px solid #1a1a1a', paddingTop: '8px' }}>
              0% = vazio · 100% = 6 semanas (máximo recomendado)
            </div>
          </div>

          {/* Próximas publicações */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Próximas publicações</span>
              <a href="/admin/queue" style={{ fontSize: '12px', color: '#60a5fa', textDecoration: 'none' }}>Fila →</a>
            </div>
            {nextScheduled.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#444', textAlign: 'center', padding: '12px 0' }}>Nenhuma publicação agendada</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {nextScheduled.map(article => (
                  <div key={article.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: APP_COLORS[article.app_id] ?? '#888', flexShrink: 0 }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: '#e5e5e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>{formatDate(article.scheduled_for)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publicados recentemente */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px 20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '14px' }}>Publicados recentemente</div>
        {recentPublished.length === 0 ? (
          <div style={{ fontSize: '13px', color: '#444', textAlign: 'center', padding: '12px 0' }}>Nenhum artigo publicado ainda</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {recentPublished.map(article => {
              const color = APP_COLORS[article.app_id] ?? '#888'
              const domain = BLOG_DOMAINS[article.app_id] ?? '#'
              return (
                <div key={article.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px', borderRadius: '6px', background: '#1a1a1a' }}>
                  <div style={{ width: '3px', height: '28px', background: color, flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', color: '#e5e5e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{article.title}</div>
                    <div style={{ fontSize: '11px', color: '#555', marginTop: '2px', display: 'flex', gap: '8px' }}>
                      <span style={{ color }}>{article.app_id.replace('blog-', '')}</span>
                      <span>{TIPO_LABELS[article.generation_approach] ?? '—'}</span>
                      <span>{timeAgo(article.published_at)}</span>
                    </div>
                  </div>
                  <a
                    href={`${domain}/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '12px', color: '#444', textDecoration: 'none', flexShrink: 0 }}
                  >
                    ↗
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pipeline status */}
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px 20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '14px' }}>Estado do pipeline</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>Crons</div>
            <div style={{ display: 'inline-block', background: '#1a0a0a', color: '#ef4444', fontSize: '11px', padding: '3px 10px', borderRadius: '4px' }}>OFF</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>Último batch</div>
            <div style={{ fontSize: '12px', color: '#444' }}>—</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>Modelo activo</div>
            <div style={{ fontSize: '12px', color: '#e5e5e5' }}>Haiku 4.5</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>Custo mês</div>
            <div style={{ fontSize: '12px', color: '#e5e5e5' }}>$0.00</div>
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '10px', color: '#60a5fa', textDecoration: 'none' }}>ver Anthropic →</a>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>Próximo batch</div>
            <div style={{ fontSize: '12px', color: '#e5e5e5' }}>Dom 02:00 UTC</div>
            <div style={{ fontSize: '10px', color: '#444', marginTop: '2px' }}>{nextBatchInfo()}</div>
          </div>
        </div>
      </div>

    </div>
  )
}
