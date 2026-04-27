import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Workflow,
  Bot,
  Gauge,
  Cpu,
  Layers,
  Mail,
} from "lucide-react";
import LatestArticles from "@/components/LatestArticles";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function IntelligenceLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <SiteNav />

      {/* =========== HERO =========== */}
      <section className="relative pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="hero-ambient" />
        <div className="container-narrow relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Banner — left on desktop, top on mobile */}
            <div className="lg:col-span-5 order-1 lg:order-1">
              <div className="hero-banner-wrap mx-auto lg:mx-0 max-w-[280px] lg:max-w-lg">
                <Image
                  src="/hero-banner.png"
                  alt="ZYPERIA Intelligence"
                  width={1254}
                  height={1254}
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>

            {/* Text — right on desktop, bottom on mobile */}
            <div className="lg:col-span-7 order-2 lg:order-2 text-center lg:text-left">
              <span className="kicker mb-4">
                IA & Automação · Para Quem Executa
              </span>
              <p className="text-sm md:text-base text-[var(--text-muted)] mt-4 mb-4 h-mono uppercase tracking-wider">
                Guias práticos de automação com IA
              </p>
              <h1 className="h-display text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl mb-5">
                Workflows que funcionam.{" "}
                <span className="text-brand-gradient">Não só em teoria.</span>
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Tutoriais passo a passo para construir com Claude, n8n, Make e ferramentas
                open source. Do primeiro agente ao pipeline em produção — sem hype, sem
                buzzwords, com custos reais.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/articles" className="btn-primary">
                  Ver tutoriais <ArrowRight size={18} />
                </Link>
                <Link href="#newsletter" className="btn-ghost">
                  Análise semanal <Mail size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats strip — below hero, full width */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {[
              { label: "Ferramentas analisadas", value: "50+" },
              { label: "Categorias cobertas", value: "6" },
              { label: "Stack principal", value: "Claude · n8n" },
              { label: "Publicação", value: "Semanal" },
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

      <LatestArticles />

      {/* =========== WHAT WE COVER =========== */}
      <section className="relative py-16 md:py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="kicker mb-4">O que cobrimos</span>
            <h2 className="h-display text-3xl md:text-4xl mt-4">
              Seis áreas. Do primeiro workflow ao pipeline em produção.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                title: "Claude & LLMs",
                desc: "Como usar Claude, ChatGPT e Gemini para tarefas reais. Prompts que funcionam, limites honestos, custos por caso de uso.",
              },
              {
                icon: Workflow,
                title: "Automação com n8n & Make",
                desc: "Workflows do zero ao deploy. Blueprints que podes importar e adaptar hoje.",
              },
              {
                icon: Bot,
                title: "AI Agents",
                desc: "Agentes de email, pesquisa, suporte. O que já funciona em 2026 e o que ainda é promessa de conferência.",
              },
              {
                icon: Gauge,
                title: "Claude API & Código",
                desc: "Construir apps com a API da Anthropic. Node.js, deploy no Vercel, custo por chamada.",
              },
              {
                icon: Cpu,
                title: "Open Source & Local",
                desc: "Ollama, Mistral, Phi. Correr modelos no teu hardware sem pagar por token.",
              },
              {
                icon: Layers,
                title: "Comparações de Ferramentas",
                desc: "n8n vs Make vs Zapier, Claude vs ChatGPT, Cursor vs Copilot. Tabelas honestas sem patrocínios.",
              },
            ].map((f) => (
              <div key={f.title} className="card p-6 md:p-7">
                <div className="w-11 h-11 rounded-lg bg-[var(--brand-soft)] border border-white/10 flex items-center justify-center mb-5">
                  <f.icon size={20} className="text-[var(--brand-primary)]" />
                </div>
                <h3 className="h-display text-xl mb-2">{f.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== HOW WE WORK =========== */}
      <section className="relative py-16 md:py-24 border-t border-white/5 bg-[var(--surface-1)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <span className="kicker mb-4">Padrão editorial</span>
              <h2 className="h-display text-3xl md:text-4xl mt-4 mb-6">
                Se não conseguimos construir, não escrevemos.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Cada tutorial foi executado antes de ser publicado. Os screenshots são
                nossos, os erros também. Não escrevemos sobre o que "podias" fazer —
                escrevemos sobre o que fizemos.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "O problema primeiro",
                  d: "Começamos por uma tarefa concreta que alguém quer automatizar, não por uma ferramenta à procura de caso de uso.",
                },
                {
                  n: "02",
                  t: "Construímos nós próprios",
                  d: "O workflow é montado de ponta a ponta. Se falhar a meio, reescrevemos até funcionar.",
                },
                {
                  n: "03",
                  t: "Custos e trade-offs à frente",
                  d: "Quanto custa por mês, quanto tempo demora a manter, onde pode falhar. Dito antes de recomendar.",
                },
                {
                  n: "04",
                  t: "Linguagem clara",
                  d: "Se um conceito precisa de três buzzwords para ser explicado, encontrámos a explicação errada.",
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

      {/* =========== NEWSLETTER =========== */}
      <section id="newsletter" className="relative py-16 md:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="kicker mb-4">O Build Semanal</span>
          <h2 className="h-display text-3xl md:text-4xl mt-4 mb-5">
            Um tutorial novo. Toda a semana.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            Uma automação explicada passo a passo, com os custos reais e os erros que
            cometemos. Sem ciclo de hype de IA — só o que é útil lançar esta semana.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="tu@dominio.com"
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--surface-1)] border border-white/10 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscrever grátis
            </button>
          </form>

          <p className="text-xs text-[var(--text-muted)] mt-6 h-mono">
            Sem spam · Cancelas quando quiseres · Conforme GDPR
          </p>
        </div>
      </section>

      <SiteFooter
        variant="homepage"
        appName="ZYPERIA Intelligence"
        affiliateText={
          <>
            Alguns links para ferramentas (Zapier, Make, Notion, provedores de LLMs)
            são links de afiliado. Sem custo adicional para ti.{" "}
            <Link href="/disclosure" className="underline hover:text-white">
              Lê como somos financiados
            </Link>.
          </>
        }
      />
    </main>
  );
}
