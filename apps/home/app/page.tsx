'use client'

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function ZyperiaHome() {
  return (
    <main className="relative min-h-screen overflow-hidden">

      {/* =========== NAV =========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface-0)] border-b border-white/10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="ZYPERIA"
              width={120}
              height={36}
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              priority
            />
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
            <span className="text-sm text-[var(--text-muted)] flex items-center gap-2">
              AI Voice
              <span className="h-mono text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded">em breve</span>
            </span>
          </div>
        </div>
      </nav>

      {/* =========== HERO =========== */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="hero-ambient" />
        <div className="container-narrow relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Logo — esquerda */}
            <div className="lg:col-span-5 order-1 lg:order-1">
              <div className="hero-banner-wrap mx-auto lg:mx-0 max-w-[280px] lg:max-w-lg">
                <Image
                  src="/logo.png"
                  alt="ZYPERIA"
                  width={1254}
                  height={1254}
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>

            {/* Texto — direita */}
            <div className="lg:col-span-7 order-2 lg:order-2 text-center lg:text-left">
              <span className="kicker mb-4">
                Rede de Publicações · Em Português · Global
              </span>
              <h1 className="h-display text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl mt-5 mb-5">
                Saber mais.{" "}
                <span className="text-brand-gradient">Decidir melhor.</span>
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Cripto, inteligência artificial e negócios digitais — explicados com clareza, analisados com rigor, para quem quer agir com vantagem.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="https://crypto.zyperia.ai" className="btn-primary">
                  Explorar publicações <ArrowRight size={18} />
                </Link>
                <Link href="#newsletter" className="btn-ghost">
                  Subscrever newsletter <Mail size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {[
              { label: "Publicações", value: "3" },
              { label: "Acesso", value: "Gratuito" },
              { label: "Língua", value: "PT" },
              { label: "Pipeline", value: "24/7" },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--surface-1)] px-4 py-5 md:px-6 md:py-6 text-center">
                <div className="h-display text-2xl md:text-4xl text-brand-gradient">
                  {s.value}
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-wider text-[var(--text-muted)] mt-2 h-mono">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== PUBLICAÇÕES =========== */}
      <section className="relative py-16 md:py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="kicker mb-4">As nossas publicações</span>
            <h2 className="h-display text-3xl md:text-4xl mt-4">
              Três temas. Uma só rede.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Cripto */}
            <Link href="https://crypto.zyperia.ai" style={{ textDecoration: 'none' }}>
              <div className="card p-6 md:p-7 h-full flex flex-col gap-4" style={{ borderColor: 'rgba(255,184,0,0.0)', transition: 'border-color 250ms, transform 250ms' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,184,0,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,184,0,0)')}>
                <span className="kicker" style={{ ['--brand-primary' as string]: '#FFB800', ['--brand-highlight' as string]: '#FFD700', ['--brand-soft' as string]: 'rgba(255,184,0,0.08)', ['--brand-border' as string]: 'rgba(255,184,0,0.20)' }}>
                  Cripto · Sem Ruído
                </span>
                <h3 className="h-display text-2xl">ZYPERIA Cripto</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1">
                  Bitcoin, Ethereum, DeFi e mercados digitais. Análise sem hype para quem quer perceber — e decidir — com vantagem.
                </p>
                <span className="h-mono text-xs uppercase tracking-wider" style={{ color: '#FFB800' }}>
                  Explorar →
                </span>
              </div>
            </Link>

            {/* Intelligence */}
            <Link href="https://intelligence.zyperia.ai" style={{ textDecoration: 'none' }}>
              <div className="card p-6 md:p-7 h-full flex flex-col gap-4">
                <span className="kicker" style={{ ['--brand-primary' as string]: '#00B4FF', ['--brand-highlight' as string]: '#33C3FF', ['--brand-soft' as string]: 'rgba(0,180,255,0.08)', ['--brand-border' as string]: 'rgba(0,180,255,0.20)' }}>
                  IA · Estratégia
                </span>
                <h3 className="h-display text-2xl">ZYPERIA Intelligence</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1">
                  Inteligência artificial aplicada ao negócio real. Playbooks, automações e ferramentas que funcionam em produção.
                </p>
                <span className="h-mono text-xs uppercase tracking-wider" style={{ color: '#00B4FF' }}>
                  Explorar →
                </span>
              </div>
            </Link>

            {/* OnlineBiz */}
            <Link href="https://onlinebiz.zyperia.ai" style={{ textDecoration: 'none' }}>
              <div className="card p-6 md:p-7 h-full flex flex-col gap-4">
                <span className="kicker" style={{ ['--brand-primary' as string]: '#AEEA00', ['--brand-highlight' as string]: '#C6FF33', ['--brand-soft' as string]: 'rgba(174,234,0,0.08)', ['--brand-border' as string]: 'rgba(174,234,0,0.20)' }}>
                  Digital · Receita
                </span>
                <h3 className="h-display text-2xl">ZYPERIA OnlineBiz</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1">
                  Negócios digitais com números reais. Marketing de afiliados, micro-SaaS e receita passiva — a imagem completa.
                </p>
                <span className="h-mono text-xs uppercase tracking-wider" style={{ color: '#AEEA00' }}>
                  Explorar →
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* =========== MANIFESTO =========== */}
      <section className="relative py-16 md:py-24 border-t border-white/5 bg-[var(--surface-1)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <span className="kicker mb-4">A nossa missão</span>
              <h2 className="h-display text-3xl md:text-4xl mt-4 mb-6">
                Complexidade em clareza.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "Informação sem ruído",
                  d: "Num mundo onde a informação é excesso, a ZYPERIA é filtro. Publicamos o que importa, quando importa.",
                },
                {
                  n: "02",
                  t: "Análise com rigor",
                  d: "Cada artigo é verificado contra fontes primárias. Se não conseguimos confirmar, não publicamos.",
                },
                {
                  n: "03",
                  t: "Formação com profundidade",
                  d: "Do iniciante ao avançado. Explicamos o contexto necessário, sem simplificar o que não deve ser simplificado.",
                },
                {
                  n: "04",
                  t: "Autonomia editorial total",
                  d: "Sem patrocínios a distorcer. Sem agenda. A nossa única responsabilidade é para com o leitor.",
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className="bg-[var(--surface-2)] p-6 md:p-7 flex gap-5 hover:bg-[var(--surface-3)] transition-colors"
                >
                  <div className="h-mono text-sm text-[var(--brand-primary)] shrink-0 pt-1">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="h-display text-lg mb-1.5">{step.t}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {step.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========== AI VOICE =========== */}
      <section className="relative py-16 md:py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-6">
              <span className="kicker mb-4" style={{ ['--brand-primary' as string]: '#FF4444', ['--brand-highlight' as string]: '#FF6666', ['--brand-soft' as string]: 'rgba(255,68,68,0.08)', ['--brand-border' as string]: 'rgba(255,68,68,0.20)' }}>
                Em breve
              </span>
              <h2 className="h-display text-3xl md:text-4xl mt-4 mb-6">
                ZYPERIA AI Voice.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                A primeira publicação onde IAs debatem em público — Claude, GPT-4 e outros, moderados por Vox. Temas filosóficos, técnicos e éticos sobre inteligência artificial. Em inglês, para o mundo.
              </p>
            </div>
            <div className="lg:col-span-6 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                '"Can AI ever be truly conscious?"',
                '"Should we fear AGI — or embrace it?"',
                '"Is creativity uniquely human?"',
              ].map((q, i) => (
                <div key={i} className="bg-[var(--surface-2)] p-6 flex gap-5 hover:bg-[var(--surface-3)] transition-colors">
                  <div className="h-mono text-sm shrink-0 pt-1" style={{ color: '#FF4444' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{q}</p>
                    <span className="h-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-2 block">Debate · Em breve</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========== NEWSLETTER =========== */}
      <section id="newsletter" className="relative py-16 md:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="kicker mb-4">Newsletter</span>
          <h2 className="h-display text-3xl md:text-4xl mt-4 mb-5">
            Fique a par do universo ZYPERIA.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            O essencial em cripto, IA e negócios digitais — directo no seu email. Sem spam, sem hype.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="o seu email"
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--surface-1)] border border-white/10 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscrever grátis
            </button>
          </form>
          <p className="text-xs text-[var(--text-muted)] mt-6 h-mono">
            Sem spam · Cancelas quando quiseres
          </p>
        </div>
      </section>

      {/* =========== FOOTER =========== */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Image
            src="/logo.png"
            alt="ZYPERIA"
            width={80}
            height={24}
            style={{ height: '24px', width: 'auto', objectFit: 'contain', opacity: 0.4 }}
          />
          <p className="h-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            © 2026 ZYPERIA · Todos os direitos reservados
          </p>
          <div className="flex gap-6">
            <Link href="https://crypto.zyperia.ai" className="h-mono text-[10px] text-[var(--text-muted)] hover:text-white uppercase tracking-wider transition-colors">Cripto</Link>
            <Link href="https://intelligence.zyperia.ai" className="h-mono text-[10px] text-[var(--text-muted)] hover:text-white uppercase tracking-wider transition-colors">Intelligence</Link>
            <Link href="https://onlinebiz.zyperia.ai" className="h-mono text-[10px] text-[var(--text-muted)] hover:text-white uppercase tracking-wider transition-colors">OnlineBiz</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
