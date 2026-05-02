'use client'

import { useState } from 'react'
import ImageManager from '../../../components/ImageManager'

type Article = {
  id: string
  title: string
  app_id: string
  generation_approach: string
  created_at: string
  reading_time_minutes: number | null
  content: string
  meta_description: string | null
  tags: string[] | null
  slug: string
  featured_image_url?: string
  hero_image_url?: string
}

const APP_COLORS: Record<string, string> = {
  'blog-crypto': '#FFB800',
  'blog-intelligence': '#00B4FF',
  'blog-onlinebiz': '#AEEA00',
  'crypto': '#FFB800',
  'intelligence': '#00B4FF',
  'onlinebiz': '#AEEA00',
}

const TIPO_LABELS: Record<string, string> = {
  'breaking_news': 'TIPO 1 — Breaking',
  'youtube_newsletter': 'TIPO 2 — Transformação',
  'evergreen': 'TIPO 3 — Evergreen',
}

export default function PendingReviewClient({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<Article | null>(null)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  function openArticle(article: Article) {
    setSelected(article)
    setContent(article.content)
    setMessage('')
  }

  function closeArticle() {
    setSelected(null)
    setContent('')
    setMessage('')
  }

  async function handleAction(action: 'approved' | 'rejected') {
    if (!selected) return
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/article-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selected.id,
          action,
          content,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      setMessage(action === 'approved' ? '✅ Aprovado' : '❌ Rejeitado')
      setTimeout(() => {
        closeArticle()
        window.location.reload()
      }, 1000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selected) return
    if (!confirm('Apagar permanentemente? Esta acção não pode ser revertida.')) return
    setSaving(true)

    try {
      const res = await fetch('/api/admin/article-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, action: 'delete' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      closeArticle()
      window.location.reload()
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (articles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#aaa' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <div style={{ fontSize: '18px' }}>Nenhum artigo por rever</div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#fff' }}>
        Por Rever ({articles.length})
      </h1>

      {/* Lista de artigos */}
      {!selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {articles.map(article => {
            const color = APP_COLORS[article.app_id] ?? '#888'
            const tipo = TIPO_LABELS[article.generation_approach] ?? article.generation_approach
            const date = new Date(article.created_at).toLocaleDateString('pt-PT')
            return (
              <div
                key={article.id}
                onClick={() => openArticle(article)}
                style={{
                  background: '#111',
                  border: '1px solid #222',
                  borderLeft: `4px solid ${color}`,
                  borderRadius: '8px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#222')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#fff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa', display: 'flex', gap: '12px' }}>
                    <span style={{ color }}>{article.app_id.replace('blog-', '')}</span>
                    <span>{tipo}</span>
                    <span>{date}</span>
                    {article.reading_time_minutes && <span>{article.reading_time_minutes} min</span>}
                  </div>
                </div>
                <div style={{ color: '#888', fontSize: '18px' }}>›</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Editor de artigo */}
      {selected && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <button
              onClick={closeArticle}
              style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#aaa', padding: '6px 12px', cursor: 'pointer', fontSize: '14px' }}
            >
              ← Voltar
            </button>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', flex: 1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selected.title}
            </h2>
          </div>

          {/* Meta info */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '12px', color: '#aaa' }}>
            <span style={{ color: APP_COLORS[selected.app_id] ?? '#888' }}>
              {selected.app_id.replace('blog-', '')}
            </span>
            <span>{TIPO_LABELS[selected.generation_approach] ?? selected.generation_approach}</span>
            <span>{new Date(selected.created_at).toLocaleDateString('pt-PT')}</span>
            {selected.reading_time_minutes && <span>{selected.reading_time_minutes} min leitura</span>}
          </div>

          {/* Editor markdown */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
              Conteúdo (markdown)
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: '500px',
                background: '#111',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#e5e5e5',
                padding: '16px',
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'monospace',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Image Manager */}
          <ImageManager
            articleId={selected.id}
            currentImageUrl={selected.featured_image_url}
            articleTitle={selected.title}
            articleIntro={selected.content?.slice(0, 300)}
          />

          {/* Tags */}
          {selected.tags && selected.tags.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {selected.tags.map(tag => (
                <span key={tag} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', color: '#888' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Acções */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => handleAction('approved')}
              disabled={saving}
              style={{
                background: '#16a34a',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                padding: '10px 20px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                opacity: saving ? 0.6 : 1,
              }}
            >
              ✓ Aprovar
            </button>
            <button
              onClick={() => handleAction('rejected')}
              disabled={saving}
              style={{
                background: '#111',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#aaa',
                padding: '10px 20px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: saving ? 0.6 : 1,
              }}
            >
              ✗ Rejeitar
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              style={{
                background: 'none',
                border: '1px solid #7f1d1d',
                borderRadius: '6px',
                color: '#f87171',
                padding: '10px 20px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: saving ? 0.6 : 1,
              }}
            >
              Apagar
            </button>
            {message && (
              <span style={{ fontSize: '14px', color: message.startsWith('✅') ? '#4ade80' : message.startsWith('❌') ? '#aaa' : '#f87171' }}>
                {message}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
