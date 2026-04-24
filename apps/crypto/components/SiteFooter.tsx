import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--surface-1)] border-t border-white/10 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="text-sm text-[var(--text-muted)] max-w-xs">Parte da rede de análise ZYPERIA.</p>
            <p className="text-xs text-[var(--text-muted)] mt-4 max-w-xs leading-relaxed">
              Alguns links para exchanges e carteiras de hardware são links de afiliado. Podemos receber uma
              comissão sem qualquer custo para ti.{' '}
              <Link href="/disclosure" className="underline hover:text-white">
                Lê como somos financiados
              </Link>.
            </p>
          </div>

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

        {/* Bottom */}
        <div className="text-xs text-[var(--text-muted)] h-mono">
          © {new Date().getFullYear()} ZYPERIA · Não constitui aconselhamento financeiro
        </div>
      </div>
    </footer>
  )
}
