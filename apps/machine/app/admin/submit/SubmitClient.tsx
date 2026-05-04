'use client'

import { useState } from 'react'

type Mode = 'url' | 'text' | 'youtube' | 'direct'
type Blog = 'blog-crypto' | 'blog-intelligence' | 'blog-onlinebiz'
type Tipo = '1' | '2' | '3'

const APP_COLORS: Record<Blog, string> = {
  'blog-crypto': '#FFB800',
  'blog-intelligence': '#00B4FF',
  'blog-onlinebiz': '#AEEA00',
}

const BLOG_LABELS: Record<Blog, string> = {
  'blog-crypto': 'Crypto',
  'blog-intelligence': 'Intelligence',
  'blog-onlinebiz': 'OnlineBiz',
}

const TIPO_LABELS: Record<Tipo, string> = {
  '1': 'TIPO 1 — Breaking News',
  '2': 'TIPO 2 — Transformação',
  '3': 'TIPO 3 — Evergreen',
}

const MODE_NOTES: Record<Mode, string> = {
  'url': 'Cola o URL de um artigo em inglês. O sistema faz o download automático do conteúdo, traduz para português, aplica reformulação linguística, gera SEO (keywords, meta description, tags) e insere o artigo em Pending Review para a tua revisão.',
  'text': 'Cola o texto original (em inglês ou português). O sistema traduz se necessário, aplica reformulação linguística, gera SEO automático e insere em Pending Review. Ideal para newsletters, transcrições ou artigos de outras fontes.',
  'youtube': 'Cola o URL de um vídeo YouTube. O sistema extrai a transcrição automática, traduz para português, transforma em artigo editorial estruturado, gera SEO e insere em Pending Review.',
  'direct': 'Cola o texto já escrito e revisto em português. Entra directamente em Pending Review sem passar pelo pipeline de tradução ou reformulação. SEO deve ser gerado manualmente — abre o artigo em Pending Review → botão ✨ SEO.',
}

export default function SubmitClient() {
  const [mode, setMode] = useState<Mode>('url')
  const [blog, setBlog] = useState<Blog>('blog-crypto')
  const [tipo, setTipo] = useState<Tipo>('3')
  const [input, setInput] = useState('')
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!input.trim()) { setError('Conteúdo obrigatório'); return }
    if (mode === 'direct' && !title.trim()) { setError('Título obrigatório'); return }
    setSubmitting(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/admin/submit-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, blog, tipo, input: input.trim(), title: title.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      setMessage('✅ Submetido com sucesso! Artigo em pending_review.')
      setInput('')
      setTitle('')
    } catch (e: any) {
      setError(`Erro: ${e.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const color = APP_COLORS[blog]

  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '32px' }}>
        Submit Manual
      </h1>

      {/* Modo de entrada */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Modo de entrada
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {([
            { id: 'url', label: '🔗 URL' },
            { id: 'text', label: '📝 Texto via pipeline' },
            { id: 'youtube', label: '▶️ YouTube' },
            { id: 'direct', label: '✍️ Texto finalizado' },
          ] as { id: Mode, label: string }[]).map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setInput(''); setTitle(''); setError('') }}
              style={{
                background: mode === m.id ? '#1a1a1a' : 'none',
                border: `1px solid ${mode === m.id ? color : '#333'}`,
                borderRadius: '6px',
                color: mode === m.id ? color : '#666',
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: mode === m.id ? 600 : 400,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blog destino */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Blog destino
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(Object.keys(BLOG_LABELS) as Blog[]).map(b => (
            <button
              key={b}
              onClick={() => setBlog(b)}
              style={{
                background: blog === b ? '#1a1a1a' : 'none',
                border: `1px solid ${blog === b ? APP_COLORS[b] : '#333'}`,
                borderRadius: '6px',
                color: blog === b ? APP_COLORS[b] : '#666',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: blog === b ? 600 : 400,
              }}
            >
              {BLOG_LABELS[b]}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Tipo de artigo
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(Object.keys(TIPO_LABELS) as Tipo[]).map(t => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              style={{
                background: tipo === t ? '#1a1a1a' : 'none',
                border: `1px solid ${tipo === t ? color : '#333'}`,
                borderRadius: '6px',
                color: tipo === t ? color : '#666',
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: tipo === t ? 600 : 400,
              }}
            >
              {TIPO_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Título — só no modo direct */}
      {mode === 'direct' && (
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Título do artigo
          </label>
          <input
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); setError('') }}
            placeholder="Título completo do artigo"
            style={{
              width: '100%',
              background: '#111',
              border: `1px solid ${error && !title ? '#7f1d1d' : '#333'}`,
              borderRadius: '8px',
              color: '#e5e5e5',
              padding: '12px 14px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {mode === 'url' ? 'URL do artigo' : mode === 'youtube' ? 'URL do vídeo YouTube' : 'Conteúdo (markdown ou texto)'}
        </label>
        {mode === 'url' || mode === 'youtube' ? (
          <input
            type="url"
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            placeholder={mode === 'url' ? 'https://example.com/article' : 'https://youtube.com/watch?v=...'}
            style={{
              width: '100%',
              background: '#111',
              border: `1px solid ${error ? '#7f1d1d' : '#333'}`,
              borderRadius: '8px',
              color: '#e5e5e5',
              padding: '12px 14px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        ) : (
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            placeholder={mode === 'direct' ? 'Cola aqui o texto finalizado (markdown ou plain text)...' : 'Cola aqui o texto ou markdown...'}
            style={{
              width: '100%',
              minHeight: mode === 'direct' ? '400px' : '200px',
              background: '#111',
              border: `1px solid ${error ? '#7f1d1d' : '#333'}`,
              borderRadius: '8px',
              color: '#e5e5e5',
              padding: '14px',
              fontSize: '14px',
              lineHeight: '1.6',
              fontFamily: 'monospace',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        )}
        {error && <div style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>{error}</div>}
      </div>

      {/* Nota informativa */}
      <div style={{ marginBottom: '24px', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#aaa' }}>
        {MODE_NOTES[mode]}
        {mode === 'direct' && (
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
            Keywords, imagem e afiliados serão gerados automaticamente quando abrires o artigo em Pending Review.
          </div>
        )}
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            background: color,
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            padding: '12px 28px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'A processar...' : 'Submeter'}
        </button>
        {message && <span style={{ fontSize: '14px', color: '#4ade80' }}>{message}</span>}
      </div>
    </div>
  )
}
