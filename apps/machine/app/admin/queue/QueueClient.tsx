'use client'

import { useState } from 'react'

type Article = {
  id: string
  title: string
  app_id: string
  generation_approach: string
  created_at: string
  scheduled_for: string | null
  reading_time_minutes: number | null
  slug: string
}

const APP_COLORS: Record<string, string> = {
  'blog-crypto': '#FFB800',
  'blog-intelligence': '#00B4FF',
  'blog-onlinebiz': '#AEEA00',
}

const TIPO_LABELS: Record<string, string> = {
  'breaking_news': 'TIPO 1',
  'youtube_newsletter': 'TIPO 2',
  'evergreen': 'TIPO 3',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
}

export default function QueueClient({ articles: initial }: { articles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initial)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  async function scheduleAction(id: string, action: 'now' | 'delay_day' | 'delay_week' | 'unpublish' | 'custom', customDate?: string) {
    setSaving(id)
    setMessage('')

    let scheduled_for: string | null = null

    if (action === 'now') {
      scheduled_for = new Date().toISOString()
    } else if (action === 'delay_day') {
      const article = articles.find(a => a.id === id)
      const base = article?.scheduled_for ? new Date(article.scheduled_for) : new Date()
      base.setDate(base.getDate() + 1)
      scheduled_for = base.toISOString()
    } else if (action === 'delay_week') {
      const article = articles.find(a => a.id === id)
      const base = article?.scheduled_for ? new Date(article.scheduled_for) : new Date()
      base.setDate(base.getDate() + 7)
      scheduled_for = base.toISOString()
    } else if (action === 'custom' && customDate) {
      scheduled_for = new Date(customDate).toISOString()
    } else if (action === 'unpublish') {
      scheduled_for = null
    }

    try {
      const res = await fetch('/api/admin/queue-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, scheduled_for }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')

      setArticles(prev => prev.map(a =>
        a.id === id ? { ...a, scheduled_for } : a
      ).sort((a, b) => {
        if (!a.scheduled_for) return 1
        if (!b.scheduled_for) return -1
        return new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
      }))
      setMessage('✅ Actualizado')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(null)
    }
  }

  function move(id: string, direction: 'up' | 'down') {
    const idx = articles.findIndex(a => a.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === articles.length - 1) return

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const swapArticle = articles[swapIdx]
    const currentArticle = articles[idx]

    // Swap scheduled_for dates
    const tempDate = currentArticle.scheduled_for
    scheduleAction(currentArticle.id, 'custom', swapArticle.scheduled_for ?? undefined)
    scheduleAction(swapArticle.id, 'custom', tempDate ?? undefined)
  }

  // Count articles per day per blog
  function countPerDayBlog(date: string | null, app_id: string, excludeId: string) {
    if (!date) return 0
    const day = new Date(date).toDateString()
    return articles.filter(a =>
      a.id !== excludeId &&
      a.app_id === app_id &&
      a.scheduled_for &&
      new Date(a.scheduled_for).toDateString() === day
    ).length
  }

  if (articles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#666' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <div style={{ fontSize: '18px' }}>Fila vazia — nenhum artigo aprovado</div>
        <div style={{ fontSize: '14px', color: '#444', marginTop: '8px' }}>
          Aprova artigos em Pending Review para os ver aqui
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
          Fila de Aprovados ({articles.length})
        </h1>
        {message && (
          <span style={{ fontSize: '14px', color: message.startsWith('✅') ? '#4ade80' : '#f87171' }}>
            {message}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {articles.map((article, idx) => {
          const color = APP_COLORS[article.app_id] ?? '#888'
          const tipo = TIPO_LABELS[article.generation_approach] ?? '—'
          const isSaving = saving === article.id
          const dayCount = countPerDayBlog(article.scheduled_for, article.app_id, article.id)
          const overLimit = dayCount >= 3

          return (
            <div
              key={article.id}
              style={{
                background: '#111',
                border: `1px solid ${overLimit ? '#7f1d1d' : '#222'}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: '8px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {/* Posição */}
              <div style={{ color: '#444', fontSize: '13px', minWidth: '24px', textAlign: 'center' }}>
                {idx + 1}
              </div>

              {/* Move buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <button
                  onClick={() => move(article.id, 'up')}
                  disabled={idx === 0 || isSaving}
                  style={{ background: 'none', border: 'none', color: idx === 0 ? '#333' : '#666', cursor: idx === 0 ? 'default' : 'pointer', fontSize: '12px', padding: '2px 4px' }}
                >▲</button>
                <button
                  onClick={() => move(article.id, 'down')}
                  disabled={idx === articles.length - 1 || isSaving}
                  style={{ background: 'none', border: 'none', color: idx === articles.length - 1 ? '#333' : '#666', cursor: idx === articles.length - 1 ? 'default' : 'pointer', fontSize: '12px', padding: '2px 4px' }}
                >▼</button>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
                  {article.title}
                </div>
                <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ color }}>{article.app_id.replace('blog-', '')}</span>
                  <span>{tipo}</span>
                  {article.reading_time_minutes && <span>{article.reading_time_minutes} min</span>}
                  {overLimit && <span style={{ color: '#f87171' }}>⚠️ +3/dia/blog</span>}
                </div>
              </div>

              {/* Scheduled date */}
              <div style={{ fontSize: '12px', color: '#888', minWidth: '120px', textAlign: 'right' }}>
                {formatDate(article.scheduled_for)}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => scheduleAction(article.id, 'now')}
                  disabled={isSaving}
                  style={{ background: '#16a34a', border: 'none', borderRadius: '4px', color: '#fff', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                >
                  Agora
                </button>
                <button
                  onClick={() => scheduleAction(article.id, 'delay_day')}
                  disabled={isSaving}
                  style={{ background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#aaa', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
                >
                  +1d
                </button>
                <button
                  onClick={() => scheduleAction(article.id, 'delay_week')}
                  disabled={isSaving}
                  style={{ background: '#111', border: '1px solid #333', borderRadius: '4px', color: '#aaa', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
                >
                  +1sem
                </button>
                <input
                  type="datetime-local"
                  onChange={e => {
                    if (e.target.value) scheduleAction(article.id, 'custom', e.target.value)
                  }}
                  style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', color: '#aaa', padding: '4px 6px', fontSize: '11px', cursor: 'pointer' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
