import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bitcoin,
  LineChart,
  ShieldCheck,
  Zap,
  Globe2,
  BookOpen,
  Mail,
} from "lucide-react";
import LatestArticles from "@/components/LatestArticles";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function CryptoLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* =========== NAV =========== */}
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
                  alt="ZYPERIA Crypto"
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
                Cripto · Sem Ruído
              </span>
              <p className="text-sm md:text-base text-[var(--text-muted)] mt-4 mb-4 h-mono uppercase tracking-wider">
                Análise independente · Sem hype · Sem agenda
              </p>
              <h1 className="h-display text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl mb-5">
                Bitcoin, Ethereum, DeFi.{" "}
                <span className="text-brand-gradient">Sem predições falsas.</span>
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Análise independente e guias práticos sobre Bitcoin, Ethereum, DeFi e tudo o que importa saber — sem hype, sem agenda, em linguagem directa.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/articles" className="btn-primary">
                  Ver artigos <ArrowRight size={18} />
                </Link>
                <Link href="#newsletter" className="btn-ghost">
                  Receber o resumo diário <Mail size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats strip — below hero, full width */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {[
              { label: "Publicação", value: "Diária" },
              { label: "Acesso", value: "Gratuito" },
              { label: "Patrocínios editoriais", value: "Zero" },
              { label: "Predições de preço", value: "Nenhuma" },
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
              Seis áreas. Do iniciante ao avançado.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: BookOpen,
                title: "Primeiros Passos",
                desc: "Carteiras, primeiras compras, seed phrases, 2FA. O que tens mesmo de saber antes de pôr dinheiro real em jogo.",
              },
              {
                icon: Bitcoin,
                title: "Bitcoin & Ethereum",
                desc: "Staking, Lightning, Layer 2, gas fees. Os dois activos que mais importam, explicados sem simplificar demais.",
              },
              {
                icon: Zap,
                title: "DeFi & Protocolos",
                desc: "Uniswap, yield farming, bridges, tokens scam. Como participar sem perder capital em erros evitáveis.",
              },
              {
                icon: ShieldCheck,
                title: "Segurança & Custódia",
                desc: "Ledger, Trezor, multi-sig, self-custody. A OPSEC de quem leva o próprio dinheiro a sério.",
              },
              {
                icon: Globe2,
                title: "Regulação & Impostos",
                desc: "MICA, IRS português, stablecoins pós-2026. O que mudou e o que tens de declarar.",
              },
              {
                icon: LineChart,
                title: "Comparações Honestas",
                desc: "Exchanges, carteiras, plataformas de staking. Tabelas reais sem patrocínios a distorcer.",
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
              <span className="kicker mb-4">O nosso método</span>
              <h2 className="h-display text-3xl md:text-4xl mt-4 mb-6">
                Como trabalhamos.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Cada artigo começa com uma pergunta real ou um tema que confunde quem quer entender o mercado. Verificamos factos contra fontes primárias — documentação oficial, dados on-chain, publicações regulatórias. Se não conseguimos confirmar, não publicamos.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "Começamos pelo erro mais comum",
                  d: "Cada guia nasce de uma pergunta real ou de um erro que custa dinheiro. Não cobrimos tópicos porque estão em tendência.",
                },
                {
                  n: "02",
                  t: "Fontes primárias sempre",
                  d: "Documentação oficial, exploradores de blockchain, auditorias de contratos. Nada de scraping a outros blogs de cripto.",
                },
                {
                  n: "03",
                  t: "Números verificados",
                  d: "Cada fee, cada percentagem de staking, cada prazo regulatório é cruzado com duas fontes antes de publicar.",
                },
                {
                  n: "04",
                  t: "Linguagem sem jargão desnecessário",
                  d: "Explicamos o que é necessário explicar. Se um conceito precisa de três parágrafos de contexto, escrevemos esses três parágrafos.",
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
          <span className="kicker mb-4">O Resumo Matinal</span>
          <h2 className="h-display text-3xl md:text-4xl mt-4 mb-5">
            O essencial em cripto. Todas as manhãs.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            O que mudou no mercado, um guia novo, e o que não vale a pena ler —
            entregue antes de abrires a app da exchange. Sem hype, sem promos pagas.
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
            Sem spam · Cancelas quando quiseres
          </p>
        </div>
      </section>

      {/* =========== FOOTER =========== */}
      <SiteFooter
        variant="homepage"
        appName="ZYPERIA Crypto"
        affiliateText={
          <>
            Alguns links para exchanges e carteiras de hardware são links de
            afiliado. Podemos receber uma comissão sem qualquer custo para ti.{" "}
            <Link href="/disclosure" className="underline hover:text-white">
              Lê como somos financiados
            </Link>.
          </>
        }
      />
    </main>
  );
}

