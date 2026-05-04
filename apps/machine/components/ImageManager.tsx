'use client'

import { useState } from 'react'

type ImageManagerProps = {
  articleId: string
  currentImageUrl?: string
  articleTitle: string
  articleIntro?: string
}

function generateDefaultPrompt(title: string, intro?: string): string {
  const cleanTitle = title.replace(/^#+\s*/, '').replace(/[#*_`]/g, '').trim()
  const cleanIntro = intro
    ? intro.replace(/^#+\s*.+$/m, '').replace(/[#*_`]/g, '').trim().slice(0, 150)
    : ''

  return `Editorial illustration for a Portuguese-language article titled: "${cleanTitle}". ${cleanIntro ? `Context: ${cleanIntro}` : ''} Professional, clean, modern editorial style. No text overlays. 16:9 format.`
}

export default function ImageManager({ articleId, currentImageUrl, articleTitle, articleIntro }: ImageManagerProps) {
  const [mode, setMode] = useState<'ai' | 'url' | 'upload'>('ai')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // AI mode
  const [prompt, setPrompt] = useState(generateDefaultPrompt(articleTitle, articleIntro))

  // URL mode
  const [imageUrl, setImageUrl] = useState('')

  // Upload mode
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/image-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          articleId,
          prompt,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar imagem')

      setMessage('✅ Imagem gerada com sucesso')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleSetUrl() {
    if (!imageUrl.trim()) return
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/image-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_url',
          articleId,
          imageUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao definir imagem')

      setImageUrl('')
      setMessage('✅ Imagem definida')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload() {
    if (!uploadFile) return
    setLoading(true)
    setMessage('')
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const path = `article-images/${articleId}/${Date.now()}-${uploadFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(path, uploadFile, { contentType: uploadFile.type, upsert: true })

      if (uploadError) throw new Error(`Upload erro: ${uploadError.message}`)

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)
      const imageUrl = urlData.publicUrl

      // Registar na BD via API
      const res = await fetch('/api/admin/image-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_url',
          articleId,
          imageUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setUploadFile(null)
      setMessage('✅ Imagem carregada')
      setTimeout(() => setMessage(''), 3000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove() {
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/image-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          articleId,
        }),
      })

      if (!res.ok) throw new Error('Erro ao remover imagem')

      setMessage('✅ Imagem removida')
      setTimeout(() => setMessage(''), 2000)
    } catch (e: any) {
      setMessage(`Erro: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
        Imagem
      </div>

      {/* Preview */}
      {currentImageUrl && (
        <div style={{ position: 'relative', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', maxWidth: '300px' }}>
          <img src={currentImageUrl} alt="Preview" style={{ width: '100%', display: 'block', maxHeight: '200px', objectFit: 'cover' }} />
          <button
            onClick={handleRemove}
            disabled={loading}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.7)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ✕ Remover
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #222', paddingBottom: '12px' }}>
        <button
          onClick={() => setMode('ai')}
          style={{
            background: mode === 'ai' ? '#333' : 'transparent',
            border: 'none',
            color: mode === 'ai' ? '#fff' : '#666',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            borderBottom: mode === 'ai' ? '2px solid #4ade80' : 'none',
          }}
        >
          ✨ IA
        </button>
        <button
          onClick={() => setMode('url')}
          style={{
            background: mode === 'url' ? '#333' : 'transparent',
            border: 'none',
            color: mode === 'url' ? '#fff' : '#666',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            borderBottom: mode === 'url' ? '2px solid #4ade80' : 'none',
          }}
        >
          🔗 URL
        </button>
        <button
          onClick={() => setMode('upload')}
          style={{
            background: mode === 'upload' ? '#333' : 'transparent',
            border: 'none',
            color: mode === 'upload' ? '#fff' : '#666',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            borderBottom: mode === 'upload' ? '2px solid #4ade80' : 'none',
          }}
        >
          📤 Upload
        </button>
      </div>

      {/* AI Mode */}
      {mode === 'ai' && (
        <div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Descreva a imagem desejada..."
            style={{
              width: '100%',
              height: '80px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#e5e5e5',
              padding: '8px 12px',
              fontSize: '12px',
              boxSizing: 'border-box',
              marginBottom: '8px',
              fontFamily: 'monospace',
            }}
          />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                background: '#16a34a',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {loading ? 'Gerando...' : 'Gerar imagem'}
            </button>
            <span style={{ fontSize: '11px', color: '#666' }}>~$0.003</span>
          </div>
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="Cole a URL da imagem..."
            style={{
              flex: 1,
              background: '#111',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#e5e5e5',
              padding: '8px 12px',
              fontSize: '12px',
              boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleSetUrl}
            disabled={loading || !imageUrl.trim()}
            style={{
              background: '#16a34a',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Definir
          </button>
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div>
          <div
            style={{
              border: '2px dashed #333',
              borderRadius: '6px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#0a0a0a',
              marginBottom: '8px',
            }}
            onDrop={e => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                setUploadFile(file)
              }
            }}
            onDragOver={e => e.preventDefault()}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => setUploadFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" style={{ cursor: 'pointer', display: 'block', color: '#666', fontSize: '12px' }}>
              {uploadFile ? uploadFile.name : 'Arrastar ficheiro ou clicar'}
            </label>
          </div>
          {uploadFile && (
            <button
              onClick={handleUpload}
              disabled={loading}
              style={{
                background: '#16a34a',
                border: 'none',
                borderRadius: '4px',
                color: '#fff',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          )}
        </div>
      )}

      {/* Message */}
      {message && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: message.startsWith('✅') ? '#4ade80' : '#f87171' }}>
          {message}
        </div>
      )}
    </div>
  )
}
