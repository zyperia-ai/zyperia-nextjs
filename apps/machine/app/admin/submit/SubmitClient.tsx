'use client'

import { useState } from 'react'

type Mode = 'url' | 'text' | 'youtube'
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

export default function SubmitClient() {
  const [mode, setMode] = useState<Mode>('url')
  const [blog, setBlog] = useState<Blog>('blog-crypto')
  const [tipo, setTipo] = useState<Tipo>('3')
  const [input, setInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!input.trim()) {
      setError('Campo obrigatório')
      return
    }
    setSubmitting(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/admin/submit-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, blog, tipo, input: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro desconhecido')
      setMessage(`✅ Submetido com sucesso! Artigo em pending_review.`)
      setInput('')
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
        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Modo de entrada
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['url', 'text', 'youtube'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setInput(''); setError('') }}
              style={{
                background: mode === m ? '#1a1a1a' : 'none',
                border: `1px solid ${mode === m ? color : '#333'}`,
                borderRadius: '6px',
                color: mode === m ? color : '#666',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: mode === m ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {m === 'url' ? '🔗 URL' : m === 'text' ? '📝 Texto' : '▶️ YouTube'}
            </button>
          ))}
        </div>
      </div>

      {/* Blog destino */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                transition: 'all 0.15s',
              }}
            >
              {BLOG_LABELS[b]}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: tipo === t ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {TIPO_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {mode === 'url' ? 'URL do artigo' : mode === 'youtube' ? 'URL do vídeo YouTube' : 'Texto / Markdown'}
        </label>
        {mode === 'text' ? (
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            placeholder="Cola aqui o texto ou markdown..."
            style={{
              width: '100%',
              minHeight: '200px',
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
        ) : (
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
        )}
        {error && <div style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>{error}</div>}
      </div>

      {/* Nota informativa */}
      <div style={{ marginBottom: '24px', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#666' }}>
        {mode === 'url' && '🔗 O sistema vai fazer fetch do artigo e processá-lo via Stage 1+2. Aparece em Pending Review.'}
        {mode === 'text' && '📝 O texto será processado directamente via Stage 2. Aparece em Pending Review.'}
        {mode === 'youtube' && '▶️ O sistema vai extrair a transcrição do vídeo e processá-la via Stage 1+2. Aparece em Pending Review.'}
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
            transition: 'opacity 0.15s',
          }}
        >
          {submitting ? 'A processar...' : 'Submeter'}
        </button>
        {message && (
          <span style={{ fontSize: '14px', color: '#4ade80' }}>{message}</span>
        )}
      </div>
    </div>
  )
}
