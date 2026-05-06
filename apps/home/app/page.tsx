import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface-0)] border-b border-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="h-display text-lg font-bold text-white">
            <img src="/logo.png" alt="ZYPERIA" height={40} />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="https://crypto.zyperia.ai" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
              Cripto
            </Link>
            <Link href="https://intelligence.zyperia.ai" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
              Inteligência
            </Link>
            <Link href="https://onlinebiz.zyperia.ai" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
              Negócios
            </Link>
            <span className="text-sm text-[var(--text-muted)] cursor-not-allowed">
              AI Voice ↗ (em breve)
            </span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="kicker mb-8 justify-center">
            Rede Editorial · Lusófona · Global
          </div>

          <h1 className="h-display text-5xl md:text-6xl mb-6">
            O conhecimento que o mundo lusófono merece.
          </h1>

          <p className="text-lg text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed">
            Jornalismo editorial autónomo sobre cripto, inteligência artificial e negócios digitais. Em português, para o mundo.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-[var(--text-secondary)]">Publicações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">PT</div>
              <div className="text-sm text-[var(--text-secondary)]">Português</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-[var(--text-secondary)]">Em contínuo</div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <blockquote className="border-l-4 border-[var(--brand-primary)] pl-6 py-6 italic text-lg text-[var(--text-secondary)]">
            "Construímos a rede editorial autónoma para o mundo lusófono — independente, rigorosa, e pensada para quem quer compreender o futuro antes que ele aconteça."
          </blockquote>
        </div>
      </section>

      {/* BLOGS GRID */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="h-display text-3xl mb-16 text-center">
            Os nossos blogs
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* CRYPTO */}
            <Link href="https://crypto.zyperia.ai" className="card p-6 group cursor-pointer">
              <div className="h-1 w-12 rounded-full mb-6" style={{ backgroundColor: '#FFB800' }}></div>
              <div className="kicker mb-4" style={{ backgroundColor: 'rgba(255, 184, 0, 0.08)', color: '#FFD700' }}>
                Cripto · Sem Ruído
              </div>
              <h3 className="h-display text-xl font-bold mb-3">ZYPERIA Cripto</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Bitcoin, Ethereum, DeFi e mercados digitais. Análise sem ruído para investidores e curiosos.
              </p>
              <span className="text-sm font-medium text-[var(--brand-primary)] group-hover:text-[var(--brand-highlight)] transition-colors">
                Aceder →
              </span>
            </Link>

            {/* INTELLIGENCE */}
            <Link href="https://intelligence.zyperia.ai" className="card p-6 group cursor-pointer">
              <div className="h-1 w-12 rounded-full mb-6" style={{ backgroundColor: '#00B4FF' }}></div>
              <div className="kicker mb-4" style={{ backgroundColor: 'rgba(0, 180, 255, 0.08)', color: '#66DFFF' }}>
                IA · Estratégia
              </div>
              <h3 className="h-display text-xl font-bold mb-3">ZYPERIA Intelligence</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Inteligência artificial aplicada aos negócios. Tendências, ferramentas e decisões estratégicas.
              </p>
              <span className="text-sm font-medium text-[#00B4FF] hover:text-[#66DFFF] transition-colors">
                Aceder →
              </span>
            </Link>

            {/* ONLINEBIZ */}
            <Link href="https://onlinebiz.zyperia.ai" className="card p-6 group cursor-pointer">
              <div className="h-1 w-12 rounded-full mb-6" style={{ backgroundColor: '#AEEA00' }}></div>
              <div className="kicker mb-4" style={{ backgroundColor: 'rgba(174, 234, 0, 0.08)', color: '#C6FF4C' }}>
                Digital · Receita
              </div>
              <h3 className="h-display text-xl font-bold mb-3">ZYPERIA OnlineBiz</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Negócios digitais, monetização e empreendedorismo online para o mercado lusófono.
              </p>
              <span className="text-sm font-medium text-[#AEEA00] hover:text-[#C6FF4C] transition-colors">
                Aceder →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* AI VOICE TEASER */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-2)] border border-white/10 rounded-2xl p-12">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-red-950/30 border border-red-900/50">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Em breve</span>
            </div>

            <h2 className="h-display text-3xl mb-4">ZYPERIA AI Voice</h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl">
              Debates filosóficos e técnicos sobre inteligência artificial. Em inglês, para o mundo.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-sm text-[var(--text-muted)]">
                • Episódios com experts europeus
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                • Cobertura live events e conferências
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                • Análise critica de tendências
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="h-display text-3xl mb-4">
            Fique a par do universo ZYPERIA.
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Novidades, análises e insights directo no seu email.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-4 py-3 bg-[var(--surface-1)] border border-[var(--border-subtle)] rounded-lg text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              disabled
            />
            <button
              type="button"
              className="btn-primary"
              disabled
            >
              Subscrever
            </button>
          </form>
          <p className="text-xs text-[var(--text-muted)] mt-4">
            (Em desenvolvimento)
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="ZYPERIA" height={32} />
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            © 2026 ZYPERIA · Todos os direitos reservados
          </p>
        </div>
      </footer>
    </>
  )
}
