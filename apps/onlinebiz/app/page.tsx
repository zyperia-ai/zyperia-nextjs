import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  ShoppingBag,
  FileText,
  Users,
  Rocket,
  Target,
  Share2,
  Mail,
} from "lucide-react";
import LatestArticles from "@/components/LatestArticles";

export default function OnlineBizLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />

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
                  alt="ZYPERIA OnlineBiz"
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
                Rendimento Online · Sem Rodeios · Sem Gurus
              </span>
              <p className="text-sm md:text-base text-[var(--text-muted)] mt-4 mb-4 h-mono uppercase tracking-wider">
                Um blog semanal de casos de estudo sobre negócios online
              </p>
              <h1 className="h-display text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl mb-5">
                Rendimento que trabalha{" "}
                <span className="text-brand-gradient">enquanto tu descansas.</span>
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Afiliados, produtos digitais, micro-SaaS, conteúdo, serviços. Números reais, análises detalhadas, e os sistemas por trás do dinheiro. Sem posts de "laptop lifestyle" no Instagram.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/articles" className="btn-primary">
                  Ver casos de estudo <ArrowRight size={18} />
                </Link>
                <Link href="#newsletter" className="btn-ghost">
                  Análise de Sexta <Mail size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats strip — below hero, full width */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {[
              { label: "Casos de estudo", value: "480+" },
              { label: "Modelos de negócio", value: "25" },
              { label: "Ferramentas analisadas", value: "310" },
              { label: "Leitores/mês", value: "56K" },
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

      {/* =========== BUSINESS MODELS =========== */}
      <section className="relative py-16 md:py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="kicker mb-4">Modelos de rendimento</span>
            <h2 className="h-display text-3xl md:text-4xl mt-4">
              Seis caminhos. Escolhe o que encaixa na tua vida.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: DollarSign,
                title: "Marketing de Afiliados",
                desc: "Programas de afiliados baseados em conteúdo com estruturas de comissão reais — não a armadilha dos $5 por registo.",
              },
              {
                icon: ShoppingBag,
                title: "Produtos Digitais",
                desc: "Templates, cursos, setups de Notion, packs de prompts. Constrói uma vez, vende enquanto dormes.",
              },
              {
                icon: FileText,
                title: "Conteúdo & Newsletters",
                desc: "Newsletters pagas, Substacks, blogs de nicho. O que realmente compõe vs. o que acaba por se esgotar.",
              },
              {
                icon: Rocket,
                title: "Micro-SaaS",
                desc: "Ferramentas pequenas que resolvem um problema para um nicho. €2k-20k MRR sem equipa.",
              },
              {
                icon: Users,
                title: "Serviços & Productised",
                desc: "Freelance, done-for-you, ofertas de âmbito fixo. O caminho mais rápido para os €5k por mês.",
              },
              {
                icon: Target,
                title: "E-commerce",
                desc: "DTC, print-on-demand, lojas digital-first. Matemática de margem que realmente fecha as contas.",
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
                Recibos ou não aconteceu.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Cada afirmação sobre receita é apoiada por um screenshot, um dashboard,
                ou uma entrevista verificada. Nada de "fiz 10k no último mês" sem o
                rasto das facturas.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "Números verificados",
                  d: "Cada caso de estudo inclui screenshots, P&L, ou entrevistas com o fundador. Sem bragging anónimo.",
                },
                {
                  n: "02",
                  t: "Imagem de custos completa",
                  d: "A receita bruta é fácil. Nós publicamos as margens, as ferramentas, os reembolsos, a factura do imposto.",
                },
                {
                  n: "03",
                  t: "Tempo + esforço",
                  d: "Horas por semana, meses para arrancar, competências necessárias. A versão honesta do que 'passivo' significa.",
                },
                {
                  n: "04",
                  t: "Sem pitches de curso",
                  d: "Não vendemos programas de €997. Se um modelo de negócio precisa de um funil para funcionar, nós dizemos.",
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
          <span className="kicker mb-4">A Análise de Sexta</span>
          <h2 className="h-display text-3xl md:text-4xl mt-4 mb-5">
            Um negócio. Dissecado. Todas as sextas.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            Escolhemos um negócio online real, desmontamos o modelo, os números, e
            o que realmente podes aproveitar dele. Sem gurus. Sem enchimento.
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
            Junta-te a 56.000+ construtores · Sem spam · Conforme GDPR
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ====================================================================== */
function Nav() {
  return (
    <header className="relative z-20">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[var(--brand-primary)] flex items-center justify-center">
            <span className="h-display text-black text-lg leading-none">Z</span>
          </div>
          <div className="leading-tight">
            <div className="h-display text-sm tracking-wide">ZYPERIA</div>
            <div className="h-mono text-[10px] uppercase text-[var(--brand-primary)] tracking-widest">
              OnlineBiz
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
          <Link href="/articles" className="hover:text-white transition-colors">Casos de Estudo</Link>
          <Link href="/archive" className="hover:text-white transition-colors">Arquivo</Link>
          <Link href="/about" className="hover:text-white transition-colors">Sobre</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contacto</Link>
        </nav>
        <Link href="#newsletter" className="btn-primary text-sm py-2 px-4">Subscrever</Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="hairline mb-10" />
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-md bg-[var(--brand-primary)] flex items-center justify-center">
                <span className="h-display text-black text-base leading-none">Z</span>
              </div>
              <span className="h-display tracking-wide">ZYPERIA OnlineBiz</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              Parte da rede de análise ZYPERIA.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-4 max-w-xs leading-relaxed">
              Alguns links para plataformas (Gumroad, Hotmart, Fiverr, Amazon, etc.)
              são links de afiliado. Sem custo adicional para ti.{" "}
              <Link href="/disclosure" className="underline hover:text-white">
                Lê como somos financiados
              </Link>.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">Ler</div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/articles" className="hover:text-white">Análises recentes</Link></li>
                <li><Link href="/archive" className="hover:text-white">Arquivo</Link></li>
                <li><Link href="/about" className="hover:text-white">Sobre</Link></li>
              </ul>
            </div>
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">Contacto</div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/contact" className="hover:text-white">Fala connosco</Link></li>
                <li><Link href="/#newsletter" className="hover:text-white">Newsletter</Link></li>
              </ul>
            </div>
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">Legal</div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/privacy" className="hover:text-white">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-white">Termos</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
                <li><Link href="/disclosure" className="hover:text-white">Divulgação</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-[var(--text-muted)] h-mono">
            © {new Date().getFullYear()} ZYPERIA · Resultados não são típicos
          </div>
          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <a href="#" aria-label="Partilhar" className="hover:text-[var(--brand-primary)] transition-colors">
              <Share2 size={16} />
            </a>
            <a href="#newsletter" aria-label="Newsletter" className="hover:text-[var(--brand-primary)] transition-colors">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
