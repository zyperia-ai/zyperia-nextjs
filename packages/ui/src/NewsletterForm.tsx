'use client'

import React, { useState } from 'react'

type Source = 'crypto' | 'intelligence' | 'onlinebiz' | 'home'
type Variant = 'nav' | 'inline'
type State = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

interface NewsletterFormProps {
  source: Source
  variant: Variant
}

const BRAND_COLORS: Record<Source, string> = {
  crypto: '#FFB800',
  intelligence: '#00B4FF',
  onlinebiz: '#AEEA00',
  home: '#C8C8C8',
}

const MESSAGES = {
  success: 'Subscrito com sucesso! Bem-vindo à ZYPERIA.',
  error: 'Algo correu mal. Tenta novamente.',
  duplicate: 'Este email já está subscrito.',
}

export function NewsletterForm({ source, variant }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  const brandColor = BRAND_COLORS[source]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setState('error')
      setMessage('Por favor, insere um email.')
      return
    }

    setState('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.message?.includes('já está')) {
          setState('duplicate')
          setMessage(MESSAGES.duplicate)
        } else {
          setState('error')
          setMessage(data.message || MESSAGES.error)
        }
        return
      }

      setState('success')
      setMessage(MESSAGES.success)
      setEmail('')

      // Reset success message após 5 segundos
      setTimeout(() => {
        setState('idle')
        setMessage('')
      }, 5000)
    } catch (error) {
      setState('error')
      setMessage(MESSAGES.error)
    }
  }

  if (variant === 'nav') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="O teu email"
          disabled={state === 'loading' || state === 'success'}
          className="px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2"
          style={{
            opacity: state === 'success' ? 0.6 : 1,
            borderColor: state === 'success' ? brandColor : undefined,
          }}
        />
        <button
          type="submit"
          disabled={state === 'loading' || state === 'success'}
          className="px-4 py-2 rounded text-white text-sm font-medium whitespace-nowrap"
          style={{
            backgroundColor: brandColor,
            opacity: state === 'loading' || state === 'success' ? 0.7 : 1,
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {state === 'loading' ? 'A enviar...' : 'Subscrever'}
        </button>
        {message && (
          <span
            className="text-xs whitespace-nowrap"
            style={{
              color:
                state === 'success'
                  ? '#22c55e'
                  : state === 'error' || state === 'duplicate'
                    ? '#ef4444'
                    : '#666',
            }}
          >
            {message}
          </span>
        )}
      </form>
    )
  }

  // variant === 'inline'
  return (
    <div
      className="p-8 rounded-lg border border-gray-200 my-8 text-center"
      style={{ backgroundColor: `${brandColor}08` }}
    >
      <h3
        className="text-2xl font-bold mb-2"
        style={{ color: '#333' }}
      >
        Recebe os melhores artigos na tua caixa de entrada
      </h3>

      <p className="text-gray-600 mb-6">
        Subscreve à newsletter ZYPERIA e fica sempre a par das últimas novidades e análises.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="O teu email"
          disabled={state === 'loading' || state === 'success'}
          className="px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2"
          style={{
            opacity: state === 'success' ? 0.6 : 1,
            borderColor: state === 'success' ? brandColor : undefined,
          }}
        />

        <button
          type="submit"
          disabled={state === 'loading' || state === 'success'}
          className="px-4 py-3 rounded text-white font-medium transition-opacity"
          style={{
            backgroundColor: brandColor,
            opacity: state === 'loading' || state === 'success' ? 0.7 : 1,
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
          }}
        >
          {state === 'loading' ? 'A processar...' : 'Subscrever'}
        </button>

        {message && (
          <p
            className="text-sm"
            style={{
              color:
                state === 'success'
                  ? '#22c55e'
                  : state === 'error' || state === 'duplicate'
                    ? '#ef4444'
                    : '#666',
            }}
          >
            {message}
          </p>
        )}
      </form>

      <p className="text-xs text-gray-500 mt-6">
        Podemos fazer melhor. Desinscrever é simples. <a href="https://zyperia.ai/unsubscribe" style={{ color: brandColor }}>Saber mais</a>
      </p>
    </div>
  )
}

export default NewsletterForm
