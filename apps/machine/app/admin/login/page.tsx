'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/admin/pending-review'

  async function handleLogin() {
    if (!password) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Password incorrecta')
      router.push(from)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        background: '#111',
        border: '1px solid #222',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '360px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            ZYPERIA Admin
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Acesso restrito
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%',
              background: '#0a0a0a',
              border: `1px solid ${error ? '#7f1d1d' : '#333'}`,
              borderRadius: '8px',
              color: '#e5e5e5',
              padding: '12px 14px',
              fontSize: '14px',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          {error && (
            <div style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>
              {error}
            </div>
          )}
        </div>

        <button
          onClick={handleLogin}
          disabled={loading || !password}
          style={{
            width: '100%',
            background: loading || !password ? '#1a1a1a' : '#fff',
            border: 'none',
            borderRadius: '8px',
            color: loading || !password ? '#444' : '#000',
            padding: '12px',
            cursor: loading || !password ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 700,
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
