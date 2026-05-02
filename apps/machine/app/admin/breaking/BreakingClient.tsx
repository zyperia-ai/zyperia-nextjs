'use client'

import { useState } from 'react'

type Article = {
  id: string
  title: string
  app_id: string
  generation_approach: string
  published_at: string
  slug: string
  content: string
  meta_description: string | null
}

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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`
  if (hours > 0) return `há ${hours}h`
  return `há ${mins}min`
}

export default function BreakingClient({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState<Article | null>(null)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showCorrection, setShowCorrection] = useState(false)
  const [correctionNote, setCorrectionNote] = useState('')

  function openArticle(article: Article) {
    setSelected(article)
    setContent(article.content)
    setMessage('')
    setShowCorrection(false)
    setCorrectionNote('')
  }

  function closeArticle() {
    setSelected(null)
    setContent('')
    setMessage('')
    setShowCorrection(false)
    setCorrectionNote('')
  }

  async function handleSave() {
    if (!selected) return
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/article-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selected.id,
          action: 'approved',
          content,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      setMessage('✅ Guardado')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleUnpublish() {
    if (!selected) return
    if (!confirm('Despublicar este artigo? O URL mantém-se mas o artigo deixa de ser visível.')) return
    setSaving(true)

    try {
      const res = await fetch('/api/admin/article-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, action: 'unpublished' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      setMessage('✅ Despublicado')
      setTimeout(() => { closeArticle(); window.location.reload() }, 1000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  async function handleCorrectionNote() {
    if (!selected || !correctionNote.trim()) return
    setSaving(true)

    const correctionText = `\n\n---\n*Última actualização: ${new Date().toLocaleDateString('pt-PT')} — ${correctionNote.trim()}*`
    const newContent = content + correctionText

    try {
      const res = await fetch('/api/admin/article-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selected.id,
          action: 'approved',
          content: newContent,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      setContent(newContent)
      setMessage('✅ Nota de correcção adicionada')
      setShowCorrection(false)
      setCorrectionNote('')
      setTimeout(() => setMessage(''), 3000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (articles.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: '#aaa' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
        <div style={{ fontSize: '18px' }}>Nenhum breaking publicado</div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px' }}>
        Breaking News Publicados ({articles.length})
      </h1>

      {/* Lista */}
      {!selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {articles.map(article => {
            const color = APP_COLORS[article.app_id] ?? '#888'
            const domain = BLOG_DOMAINS[article.app_id] ?? '#'
            return (
              <div
                key={article.id}
                style={{
                  background: '#111',
                  border: '1px solid #222',
                  borderLeft: `4px solid ${color}`,
                  borderRadius: '8px',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#fff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {article.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#aaa', display: 'flex', gap: '12px' }}>
                    <span style={{ color }}>{article.app_id.replace('blog-', '')}</span>
                    <span>{timeAgo(article.published_at)}</span>
                    <a
                      href={`${domain}/articles/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#aaa', textDecoration: 'none' }}
                      onClick={e => e.stopPropagation()}
                    >
                      ver no site ↗
                    </a>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openArticle(article)}
                    style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#aaa', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Rever / Editar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Editor */}
      {selected && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <button
              onClick={closeArticle}
              style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#aaa', padding: '6px 12px', cursor: 'pointer', fontSize: '14px' }}
            >
              ← Voltar
            </button>
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', flex: 1, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selected.title}
            </h2>
            <a
              href={`${BLOG_DOMAINS[selected.app_id]}/articles/${selected.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none', flexShrink: 0 }}
            >
              ver no site ↗
            </a>
          </div>

          {/* Guard rails info */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '10px 16px', marginBottom: '16px', fontSize: '12px', color: '#aaa' }}>
            <span style={{ color: '#f87171' }}>Imutáveis:</span> slug, URL, app_id, generation_approach, published_at &nbsp;·&nbsp;
            <span style={{ color: '#4ade80' }}>Editáveis:</span> title, content, meta_description, tags
          </div>

          {/* Editor */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>Conteúdo (markdown)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: '400px',
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

          {/* Nota de correcção */}
          {showCorrection && (
            <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>
                Nota de correcção (aparece no artigo como "Última actualização")
              </label>
              <textarea
                value={correctionNote}
                onChange={e => setCorrectionNote(e.target.value)}
                placeholder="Ex: Corrigido valor do ETF de $2.1B para $1.8B conforme comunicado oficial."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: '#e5e5e5',
                  padding: '10px',
                  fontSize: '13px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={handleCorrectionNote}
                  disabled={saving || !correctionNote.trim()}
                  style={{ background: '#16a34a', border: 'none', borderRadius: '6px', color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Adicionar nota
                </button>
                <button
                  onClick={() => setShowCorrection(false)}
                  style={{ background: 'none', border: '1px solid #333', borderRadius: '6px', color: '#aaa', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Acções */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: '#16a34a', border: 'none', borderRadius: '6px', color: '#fff', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
            >
              Guardar edição
            </button>
            <button
              onClick={() => setShowCorrection(!showCorrection)}
              disabled={saving}
              style={{ background: '#111', border: '1px solid #444', borderRadius: '6px', color: '#aaa', padding: '10px 20px', cursor: 'pointer', fontSize: '14px' }}
            >
              + Nota correcção
            </button>
            <button
              onClick={handleUnpublish}
              disabled={saving}
              style={{ background: 'none', border: '1px solid #7f1d1d', borderRadius: '6px', color: '#f87171', padding: '10px 20px', cursor: 'pointer', fontSize: '14px' }}
            >
              Despublicar
            </button>
            {message && (
              <span style={{ fontSize: '14px', color: message.startsWith('✅') ? '#4ade80' : '#f87171' }}>
                {message}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
