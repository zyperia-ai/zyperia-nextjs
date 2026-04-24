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
  Share2,
  Mail,
} from "lucide-react";
import LatestArticles from "@/components/LatestArticles";

export default function IntelligenceLandingPage() {
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
              <div className="hero-banner-wrap mx-auto lg:mx-0 max-w-md lg:max-w-none">
                <Image
                  src="/hero-banner.png"
                  alt="ZYPERIA Intelligence"
                  width={1920}
                  height={800}
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>

            {/* Text — right on desktop, bottom on mobile */}
            <div className="lg:col-span-7 order-2 lg:order-2 text-center lg:text-left">
              <span className="kicker mb-4">
                IA & Automação · Feito para Quem Constrói
              </span>
              <p className="text-sm md:text-base text-[var(--text-muted)] mt-4 mb-4 h-mono uppercase tracking-wider">
                Um blog semanal de automação com IA para operadores
              </p>
              <h1 className="h-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-5">
                IA prática{" "}
                <span className="text-brand-gradient">para quem executa.</span>
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Playbooks de automação, blueprints de workflows, e as ferramentas que realmente merecem o seu lugar à mesa. Sem hype de IA, sem manchetes "revolucionárias".
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/articles" className="btn-primary">
                  Ver playbooks <ArrowRight size={18} />
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
              { label: "Playbooks publicados", value: "860+" },
              { label: "Ferramentas analisadas", value: "220+" },
              { label: "Automações partilhadas", value: "140" },
              { label: "Leitores/mês", value: "31K" },
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
              Seis frentes da economia da automação.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                title: "LLMs em Produção",
                desc: "Prompt engineering que sobrevive a utilizadores reais, pipelines de avaliação, e saber quando fazer fine-tune vs prompt.",
              },
              {
                icon: Workflow,
                title: "Automação de Workflows",
                desc: "n8n, Make, Zapier, e cola de código à medida. Walkthroughs ao nível de blueprint que consegues implementar hoje.",
              },
              {
                icon: Bot,
                title: "Agentes Autónomos",
                desc: "Arquitecturas de agentes, uso de ferramentas, memória, e os limites honestos do que funciona em 2026.",
              },
              {
                icon: Gauge,
                title: "Operações & Produtividade",
                desc: "Triagem de email, notas de reunião, assistentes de pesquisa. Sistemas que compõem, não brinquedos que se desgastam.",
              },
              {
                icon: Cpu,
                title: "Stack Open Source",
                desc: "Ollama, Llama, Mistral, Phi — a correr modelos capazes no hardware que já tens.",
              },
              {
                icon: Layers,
                title: "Integrações",
                desc: "Ligar IA a CRMs, ERPs, folhas de cálculo, e às ferramentas que a tua equipa não vai largar.",
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
                Se não conseguimos correr, não escrevemos.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Cada automação que publicamos foi construída, testada, e documentada a
                partir de uma implementação real. Nada de "aqui está o que podias fazer
                em teoria". Só o que realmente funciona.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "O problema primeiro",
                  d: "Começamos a partir da dor real de um operador — não de uma ferramenta à procura de caso de uso.",
                },
                {
                  n: "02",
                  t: "Construímos nós próprios",
                  d: "Cada workflow é montado de ponta a ponta antes de publicarmos. Os screenshots são nossos.",
                },
                {
                  n: "03",
                  t: "Trade-offs honestos",
                  d: "Custo, fiabilidade, vendor lock-in, esforço de manutenção. Dito à frente, não escondido.",
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
            Um playbook em profundidade. Toda a terça-feira.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            Uma automação, explicada passo a passo, com o template pronto a importar.
            Salta o ciclo de hype e lança alguma coisa útil.
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
            Junta-te a 31.000+ operadores · Sem spam · Conforme GDPR
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
              Intelligence
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
          <Link href="/articles" className="hover:text-white transition-colors">Playbooks</Link>
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
              <span className="h-display tracking-wide">ZYPERIA Intelligence</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              Parte da rede de análise ZYPERIA.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-4 max-w-xs leading-relaxed">
              Alguns links para ferramentas (Zapier, Make, Notion, provedores de LLMs)
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
                <li><Link href="/articles" className="hover:text-white">Playbooks recentes</Link></li>
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
            © {new Date().getFullYear()} ZYPERIA
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
