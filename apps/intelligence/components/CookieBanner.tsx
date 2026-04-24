'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setShow(true)
  }, [])

  const save = (value: 'accept' | 'reject') => {
    localStorage.setItem('cookie-consent', value)
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 md:max-w-sm bg-[var(--surface-1)] border border-white/10 rounded-lg p-4 backdrop-blur">
      <div className="h-display text-base mb-2">Cookies?</div>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
        Usamos cookies estritamente necessários para o site funcionar. Com o teu consentimento, usamos também
        analytics para perceber que artigos ressoam. Sem publicidade, sem tracking, sem revenda de dados.{' '}
        <Link href="/cookies" className="underline hover:text-white">
          Detalhes
        </Link>.
      </p>
      <div className="flex gap-3">
        <button onClick={() => save('accept')} className="btn-primary text-xs py-2 px-3 flex-1">
          Aceitar analytics
        </button>
        <button onClick={() => save('reject')} className="btn-ghost text-xs py-2 px-3 flex-1">
          Rejeitar não-essenciais
        </button>
      </div>
    </div>
  )
}
