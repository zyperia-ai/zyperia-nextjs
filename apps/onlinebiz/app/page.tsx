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
  Mail,
} from "lucide-react";
import LatestArticles from "@/components/LatestArticles";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function OnlineBizLandingPage() {
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
                Negócio Online · Sem Gurus · Com Números
              </span>
              <p className="text-sm md:text-base text-[var(--text-muted)] mt-4 mb-4 h-mono uppercase tracking-wider">
                Guias práticos de rendimento online
              </p>
              <h1 className="h-display text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl mb-5">
                Negócio online que funciona.{" "}
                <span className="text-brand-gradient">Com os números a confirmar.</span>
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Do zero ao primeiro euro online — afiliados, produtos digitais, freelance,
                micro-SaaS. Tutoriais passo a passo com custos reais, ferramentas testadas,
                e zero promessas de "rendimento passivo" sem trabalho.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/articles" className="btn-primary">
                  Ver guias <ArrowRight size={18} />
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
              { label: "Modelos de negócio", value: "25+" },
              { label: "Ferramentas analisadas", value: "50+" },
              { label: "Categorias cobertas", value: "6" },
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

      {/* =========== BUSINESS MODELS =========== */}
      <section className="relative py-16 md:py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="kicker mb-4">Modelos de rendimento</span>
            <h2 className="h-display text-3xl md:text-4xl mt-4">
              Seis modelos. Com o que realmente custa a arrancar.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: DollarSign,
                title: "Marketing de Afiliados",
                desc: "Como escolher nicho, criar conteúdo que converte, e as estruturas de comissão que realmente valem a pena. Sem os programas de €5 por registo.",
              },
              {
                icon: ShoppingBag,
                title: "Produtos Digitais",
                desc: "Templates, ebooks, cursos, packs de prompts. Como criar, onde vender (Gumroad, Hotmart, Lemon Squeezy), e o que realmente compra.",
              },
              {
                icon: FileText,
                title: "Freelance & Serviços",
                desc: "Pricing, proposta, primeiros clientes, como sair do ciclo de hora por dinheiro. O caminho mais directo para os primeiros €1k/mês.",
              },
              {
                icon: Rocket,
                title: "Conteúdo & Newsletter",
                desc: "Blogs de nicho, newsletters pagas, SEO. O que compõe com o tempo vs. o que se esgota em 6 meses.",
              },
              {
                icon: Users,
                title: "Ferramentas Comparadas",
                desc: "Webflow vs WordPress, ConvertKit vs Beehiiv, Ahrefs vs Semrush. Qual usar para cada situação e orçamento.",
              },
              {
                icon: Target,
                title: "Micro-SaaS & Tech",
                desc: "Ferramentas pequenas para nichos específicos. Como validar antes de construir e onde encontrar os primeiros 100 clientes.",
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
                Números ou não publicamos.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Cada tutorial inclui os custos reais das ferramentas, o tempo necessário,
                e o que pode correr mal. Sem receitas de sucesso sem contexto. Sem "fiz
                €10k no primeiro mês" sem a factura do imposto.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "Custos antes de tudo",
                  d: "Cada guia começa pelo que realmente custa: ferramentas, tempo, skills necessárias. A matemática que os gurus escondem.",
                },
                {
                  n: "02",
                  t: "Ferramentas testadas",
                  d: "Só escrevemos sobre o que usámos. Comparações com planos reais, não só com o tier gratuito.",
                },
                {
                  n: "03",
                  t: "O que pode correr mal",
                  d: "Cada modelo de negócio tem armadilhas conhecidas. Dizemo-las antes de recomendar.",
                },
                {
                  n: "04",
                  t: "Sem pitches de curso",
                  d: "Não vendemos formações de €997. Se a solução para um problema é pagar um curso, dizemos qual — e porque é que a maioria não vale a pena.",
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
            Um modelo de negócio. Dissecado. Todas as sextas.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            Escolhemos um modelo de rendimento online, explicamos como funciona, quanto
            custa a arrancar, e o que os tutoriais do YouTube não dizem. Sem gurus.
            Com números.
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
        appName="ZYPERIA OnlineBiz"
        affiliateText={
          <>
            Alguns links para plataformas (Gumroad, Hotmart, Fiverr, Amazon, etc.)
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
