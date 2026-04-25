'use client'

import Link from 'next/link'
import { Share2, Mail } from 'lucide-react'
import type { ReactNode } from 'react'

type SiteFooterProps = {
  variant?: 'homepage' | 'internal'
  appName?: string
  affiliateText?: ReactNode
}

export default function SiteFooter({
  variant = 'internal',
  appName,
  affiliateText
}: SiteFooterProps) {
  const sharePage = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = document.title

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // Utilizador cancelou
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        // Sem permissão
      }
    }
  }

  return (
    <footer className="bg-[var(--surface-1)] border-t border-white/10 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Homepage brand section */}
        {variant === 'homepage' && appName && (
          <div className="mb-12 pb-12 border-b border-white/10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-md bg-[var(--brand-primary)] flex items-center justify-center">
                <span className="h-display text-black text-base leading-none">Z</span>
              </div>
              <span className="h-display tracking-wide">{appName}</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              Parte da rede de análise ZYPERIA.
            </p>
            {affiliateText && (
              <p className="text-xs text-[var(--text-muted)] mt-4 max-w-xs leading-relaxed">
                {affiliateText}
              </p>
            )}
          </div>
        )}

        {/* Top section */}
        <div className={`grid gap-12 mb-12 pb-12 border-b border-white/10 ${variant === 'homepage' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-4'}`}>
          {/* Brand column — só para internal, pois homepage tem brand-section dedicada */}
          {variant === 'internal' && (
            <div className="md:col-span-1">
              <p className="text-sm text-[var(--text-muted)] max-w-xs">Parte da rede de análise ZYPERIA.</p>
              <p className="text-xs text-[var(--text-muted)] mt-4 max-w-xs leading-relaxed">
                Alguns links para plataformas (Gumroad, Hotmart, Fiverr, Amazon, etc.) são links de afiliado. Sem
                custo adicional para ti.{' '}
                <Link href="/disclosure" className="underline hover:text-white">
                  Lê como somos financiados
                </Link>.
              </p>
            </div>
          )}

          {/* Ler */}
          <div>
            <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">
              Ler
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/articles" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  Análises recentes
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  Arquivo
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">
              Contacto
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  Fala connosco
                </Link>
              </li>
              <li>
                <a
                  href="#newsletter"
                  className="text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  Newsletter
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">
              Legal
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  Termos
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/disclosure" className="text-[var(--text-secondary)] hover:text-white transition-colors">
                  Divulgação
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rede link */}
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <Link
            href="/rede"
            className="text-xs text-[var(--text-muted)] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            Parte da rede ZYPERIA →
          </Link>
        </div>

        {/* Bottom */}
        <div className={`flex ${variant === 'homepage' ? 'flex-col md:flex-row justify-between items-center gap-4' : 'text-xs'} text-[var(--text-muted)] h-mono`}>
          <div className="text-xs">
            © {new Date().getFullYear()} ZYPERIA · Resultados não são típicos
          </div>
          {variant === 'homepage' && (
            <div className="flex items-center gap-4 text-[var(--text-muted)]">
              <button
                onClick={sharePage}
                aria-label="Partilhar"
                className="hover:text-[var(--brand-primary)] transition-colors"
              >
                <Share2 size={16} />
              </button>
              <a
                href="#newsletter"
                aria-label="Newsletter"
                className="hover:text-[var(--brand-primary)] transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
