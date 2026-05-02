'use client'

import { useState, useMemo } from 'react'

type Article = {
  id: string
  title: string
  app_id: string
  generation_approach: string
  status: string
  created_at: string
  published_at: string | null
  scheduled_for: string | null
  reading_time_minutes: number | null
  slug: string
}

const APP_COLORS: Record<string, string> = {
  'blog-crypto': '#FFB800', 'crypto': '#FFB800',
  'blog-intelligence': '#00B4FF', 'intelligence': '#00B4FF',
  'blog-onlinebiz': '#AEEA00', 'onlinebiz': '#AEEA00',
}

const STATUS_COLORS: Record<string, string> = {
  'pending_review': '#f59e0b',
  'approved': '#3b82f6',
  'published': '#22c55e',
  'unpublished': '#6b7280',
  'rejected': '#ef4444',
  'draft': '#6b7280',
}

const STATUS_LABELS: Record<string, string> = {
  'pending_review': 'Pending',
  'approved': 'Aprovado',
  'published': 'Publicado',
  'unpublished': 'Despublicado',
  'rejected': 'Rejeitado',
  'draft': 'Draft',
}

const TIPO_LABELS: Record<string, string> = {
  'breaking_news': 'T1',
  'youtube_newsletter': 'T2',
  'evergreen': 'T3',
}

const BLOG_DOMAINS: Record<string, string> = {
  'blog-crypto': 'https://crypto.zyperia.ai',
  'blog-intelligence': 'https://intelligence.zyperia.ai',
  'blog-onlinebiz': 'https://onlinebiz.zyperia.ai',
  'crypto': 'https://crypto.zyperia.ai',
  'intelligence': 'https://intelligence.zyperia.ai',
  'onlinebiz': 'https://onlinebiz.zyperia.ai',
}

function timeAgo(iso: string | null) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor(diff / (60 * 60 * 1000))
  if (days > 30) return `${Math.floor(days / 30)}m`
  if (days > 0) return `${days}d`
  if (hours > 0) return `${hours}h`
  return 'agora'
}

export default function ArticlesClient({ articles: initial }: { articles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initial)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterBlog, setFilterBlog] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const filtered = useMemo(() => {
    return articles.filter(a => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false
      if (filterBlog !== 'all' && a.app_id !== filterBlog && a.app_id !== filterBlog.replace('blog-', '')) return false
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [articles, filterStatus, filterBlog, search])

  async function doAction(id: string, action: string, extra?: Record<string, any>) {
    setSaving(id)
    setMessage('')
    try {
      const res = await fetch('/api/admin/article-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, ...extra }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro')

      if (action === 'delete') {
        setArticles(prev => prev.filter(a => a.id !== id))
      } else {
        const newStatus = action === 'approved' ? 'approved'
          : action === 'rejected' ? 'rejected'
          : action === 'unpublished' ? 'unpublished'
          : action === 'pending_review' ? 'pending_review'
          : null
        if (newStatus) {
          setArticles(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
        }
      }
      setMessage('✅ Feito')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(null)
    }
  }

  async function saveEdit(id: string) {
    setSaving(id)
    try {
      const res = await fetch('/api/admin/article-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'edit', title: editTitle, content: editContent }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro')
      setArticles(prev => prev.map(a => a.id === id ? { ...a, title: editTitle } : a))
      setEditingId(null)
      setMessage('✅ Guardado')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(null)
    }
  }

  async function openEdit(article: Article) {
    setSaving(article.id)
    try {
      const res = await fetch(`/api/admin/get-article?id=${article.id}`)
      const data = await res.json()
      setEditTitle(data.title ?? article.title)
      setEditContent(data.content ?? '')
      setEditingId(article.id)
    } catch {
      setEditTitle(article.title)
      setEditContent('')
      setEditingId(article.id)
    } finally {
      setSaving(null)
    }
  }

  const statuses = ['all', 'pending_review', 'approved', 'published', 'unpublished', 'rejected']
  const blogs = ['all', 'crypto', 'intelligence', 'onlinebiz']

  const counts: Record<string, number> = { all: articles.length }
  articles.forEach(a => { counts[a.status] = (counts[a.status] ?? 0) + 1 })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
          Todos os artigos ({filtered.length})
        </h1>
        {message && <span style={{ fontSize: '13px', color: message.startsWith('✅') ? '#4ade80' : '#f87171' }}>{message}</span>}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Status */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                background: filterStatus === s ? '#1a1a1a' : 'none',
                border: `1px solid ${filterStatus === s ? '#555' : '#333'}`,
                borderRadius: '6px',
                color: filterStatus === s ? '#fff' : '#666',
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: filterStatus === s ? 600 : 400,
              }}
            >
              {s === 'all' ? 'Todos' : STATUS_LABELS[s]}
              {counts[s] ? ` (${counts[s]})` : ''}
            </button>
          ))}
        </div>

        {/* Blog */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {blogs.map(b => (
            <button
              key={b}
              onClick={() => setFilterBlog(b)}
              style={{
                background: filterBlog === b ? '#1a1a1a' : 'none',
                border: `1px solid ${filterBlog === b ? (APP_COLORS[b] ?? '#555') : '#333'}`,
                borderRadius: '6px',
                color: filterBlog === b ? (APP_COLORS[b] ?? '#fff') : '#666',
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {b === 'all' ? 'Todos blogs' : b}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar título..."
          style={{
            background: '#111', border: '1px solid #333', borderRadius: '6px',
            color: '#e5e5e5', padding: '5px 12px', fontSize: '13px',
            width: '220px',
          }}
        />
      </div>

      {/* Editor inline */}
      {editingId && (
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px' }}>Título</label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#e5e5e5', padding: '8px 12px', fontSize: '14px', boxSizing: 'border-box' as const }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '6px' }}>Conteúdo (markdown)</label>
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              style={{ width: '100%', minHeight: '300px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '6px', color: '#e5e5e5', padding: '12px', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' as const }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => saveEdit(editingId)} disabled={saving === editingId} style={{ background: '#16a34a', border: 'none', borderRadius: '6px', color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>Guardar</button>
            <button onClick={() => setEditingId(null)} style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#aaa', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Lista */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>Nenhum artigo encontrado</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filtered.map(article => {
            const color = APP_COLORS[article.app_id] ?? '#888'
            const statusColor = STATUS_COLORS[article.status] ?? '#888'
            const isPublished = article.status === 'published'
            const isSaving = saving === article.id
            const isEditing = editingId === article.id
            const domain = BLOG_DOMAINS[article.app_id]

            return (
              <div
                key={article.id}
                style={{
                  background: isEditing ? '#1a1a1a' : '#111',
                  border: `1px solid ${isEditing ? '#333' : '#1a1a1a'}`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: '6px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {/* Status badge */}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, flexShrink: 0 }} title={STATUS_LABELS[article.status]}></div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: '#e5e5e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#555', display: 'flex', gap: '8px' }}>
                    <span style={{ color }}>{article.app_id.replace('blog-', '')}</span>
                    <span>{TIPO_LABELS[article.generation_approach] ?? '—'}</span>
                    <span style={{ color: statusColor }}>{STATUS_LABELS[article.status]}</span>
                    <span>{timeAgo(article.published_at ?? article.created_at)}</span>
                    {article.reading_time_minutes && <span>{article.reading_time_minutes} min</span>}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {/* Editar — sempre disponível */}
                  <button
                    onClick={() => openEdit(article)}
                    disabled={isSaving}
                    style={{ background: 'none', border: '1px solid #333', borderRadius: '4px', color: '#aaa', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Editar
                  </button>

                  {/* Ver no site — só published */}
                  {isPublished && domain && (
                    <a
                      href={`${domain}/articles/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: 'none', border: '1px solid #333', borderRadius: '4px', color: '#555', padding: '4px 10px', cursor: 'pointer', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                    >
                      ↗
                    </a>
                  )}

                  {/* Acções por estado */}
                  {article.status === 'pending_review' && (
                    <>
                      <button onClick={() => doAction(article.id, 'approved')} disabled={isSaving} style={{ background: '#166534', border: 'none', borderRadius: '4px', color: '#4ade80', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>Aprovar</button>
                      <button onClick={() => doAction(article.id, 'rejected')} disabled={isSaving} style={{ background: 'none', border: '1px solid #333', borderRadius: '4px', color: '#666', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>Rejeitar</button>
                    </>
                  )}

                  {article.status === 'approved' && (
                    <button onClick={() => { if (confirm('Mover de volta para pending review?')) doAction(article.id, 'approved', { revert: true }) }} disabled={isSaving} style={{ background: 'none', border: '1px solid #333', borderRadius: '4px', color: '#666', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>← Pending</button>
                  )}

                  {article.status === 'published' && (
                    <button onClick={() => { if (confirm('Despublicar este artigo?')) doAction(article.id, 'unpublished') }} disabled={isSaving} style={{ background: 'none', border: '1px solid #333', borderRadius: '4px', color: '#666', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>Despublicar</button>
                  )}

                  {article.status === 'rejected' && (
                    <button onClick={() => { if (confirm('Restaurar para pending review?')) doAction(article.id, 'approved', { revert: true }) }} disabled={isSaving} style={{ background: 'none', border: '1px solid #333', borderRadius: '4px', color: '#60a5fa', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}>Restaurar</button>
                  )}

                  {/* Apagar — não disponível para published */}
                  {!isPublished && (
                    <button
                      onClick={() => { if (confirm('Apagar permanentemente?')) doAction(article.id, 'delete') }}
                      disabled={isSaving}
                      style={{ background: 'none', border: '1px solid #7f1d1d', borderRadius: '4px', color: '#f87171', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Apagar
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
