'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

type Theme = 'crypto' | 'intelligence' | 'onlinebiz'

interface ThemeConfig {
  id: Theme
  label: string
  newsletter: string
  desc: string
}

const THEMES: ThemeConfig[] = [
  {
    id: 'crypto',
    label: 'Crypto',
    newsletter: 'O Resumo Matinal',
    desc: 'Diário · Bitcoin, DeFi, infraestrutura — 5 min de leitura',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    newsletter: 'O Build Semanal',
    desc: 'Terças · Uma automação de IA, passo a passo',
  },
  {
    id: 'onlinebiz',
    label: 'OnlineBiz',
    newsletter: 'A Análise de Sexta',
    desc: 'Sextas · Um negócio online real, dissecado',
  },
]

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<Theme[]>(['crypto'])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'err'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || selected.length === 0) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, themes: selected }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
        setSelected(['crypto'])
      } else {
        setStatus('err')
      }
    } catch {
      setStatus('err')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <h3 className="h-display text-xl mb-2">Quase lá.</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Verifica o teu email e clica no link de confirmação. O GDPR exige double opt-in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email input */}
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@dominio.com"
          required
          className="w-full px-4 py-3 rounded-lg bg-[var(--surface-1)] border border-white/10 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
        />
      </div>

      {/* Theme checkboxes */}
      <div>
        <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">
          Envia-me
        </div>
        <div className="space-y-2">
          {THEMES.map((theme) => (
            <label key={theme.id} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-[var(--surface-1)] transition-colors">
              <input
                type="checkbox"
                checked={selected.includes(theme.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected([...selected, theme.id])
                  } else {
                    setSelected(selected.filter((s) => s !== theme.id))
                  }
                }}
                className="mt-1"
              />
              <div>
                <div className="text-sm font-medium text-white">
                  ZYPERIA {theme.label} <span className="text-[var(--text-muted)]">— {theme.newsletter}</span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">{theme.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Error */}
      {status === 'err' && (
        <p className="text-xs text-red-400">
          Algo correu mal. Tenta novamente ou escreve para hi@zyperia.ai. {/* TODO: substituir por contacto específico */}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading' || !email}
        className="w-full btn-primary py-3 text-sm disabled:opacity-50"
      >
        {status === 'loading' ? 'A subscrever…' : 'Subscrever grátis'}
      </button>

      {/* Footer */}
      <p className="text-xs text-[var(--text-muted)] h-mono text-center">
        Double opt-in · Anula num clique · Conforme GDPR
      </p>
    </form>
  )
}
