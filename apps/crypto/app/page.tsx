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
  Share2,
  Mail,
} from "lucide-react";

export default function CryptoLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* =========== NAV =========== */}
      <Nav />

      {/* =========== HERO =========== */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28">
        <div className="hero-ambient" />
        <div className="container-narrow relative z-10">
          {/* Banner hero image — usa CSS puro como safety net */}
          <div className="hero-banner-wrap">
            <Image
              src="/hero-banner.png"
              alt="ZYPERIA Crypto"
              width={1920}
              height={800}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>

          {/* Headline */}
          <div className="mt-14 md:mt-20 max-w-4xl mx-auto text-center">
            <span className="kicker mb-6">
              Daily Research · Signal over Noise
            </span>
            <h1 className="h-display text-5xl md:text-7xl lg:text-8xl mb-6">
              The crypto economy,{" "}
              <span className="text-brand-gradient">decoded daily.</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Deep research on Bitcoin, Ethereum, DeFi, and the infrastructure
              reshaping finance. Fact-checked, ad-free reading, delivered every
              morning.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/articles" className="btn-primary">
                Read latest research <ArrowRight size={18} />
              </Link>
              <Link href="#newsletter" className="btn-ghost">
                Get the daily brief <Mail size={18} />
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {[
              { label: "Articles published", value: "1,240+" },
              { label: "Assets covered", value: "80+" },
              { label: "Research sources", value: "35" },
              { label: "Readers/month", value: "42K" },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--surface-1)] px-6 py-6 text-center">
                <div className="h-display text-3xl md:text-4xl text-brand-gradient">
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mt-2 h-mono">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========== WHAT WE COVER =========== */}
      <section className="relative py-20 md:py-28 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="kicker mb-4">What we cover</span>
            <h2 className="h-display text-4xl md:text-5xl mt-4">
              Six lenses on the digital asset economy.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Bitcoin,
                title: "Bitcoin & Macro",
                desc: "Halving cycles, ETF flows, on-chain metrics, and Bitcoin's role as a reserve asset.",
              },
              {
                icon: Zap,
                title: "Ethereum & L2s",
                desc: "Post-merge economics, rollup wars, restaking, and the path to 100k TPS.",
              },
              {
                icon: LineChart,
                title: "DeFi & Yield",
                desc: "Real yield, liquid staking, perpetuals, and the protocols worth your capital.",
              },
              {
                icon: ShieldCheck,
                title: "Security & Custody",
                desc: "Hardware wallets, multi-sig, inheritance planning, and the OPSEC of serious holders.",
              },
              {
                icon: Globe2,
                title: "Regulation",
                desc: "MiCA, SEC cases, stablecoin bills, and how policy shapes the next cycle.",
              },
              {
                icon: BookOpen,
                title: "Fundamentals",
                desc: "Plain-English explainers for newcomers, no hype, no affiliate traps.",
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
      <section className="relative py-20 md:py-28 border-t border-white/5 bg-[var(--surface-1)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <span className="kicker mb-4">Our method</span>
              <h2 className="h-display text-4xl md:text-5xl mt-4 mb-6">
                Research that holds up under pressure.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Every claim is verified against on-chain data, primary sources,
                and protocol documentation. If we can't source it, we don't
                publish it. That's the whole game.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "Topic selection",
                  d: "Daily scan of on-chain data, protocol updates, and market events. Only topics with new information get picked up.",
                },
                {
                  n: "02",
                  t: "Primary sources",
                  d: "Whitepapers, GitHub commits, Dune dashboards, official announcements. No scraping other blogs.",
                },
                {
                  n: "03",
                  t: "Fact verification",
                  d: "Every number cross-checked against two independent sources before publication.",
                },
                {
                  n: "04",
                  t: "Editorial review",
                  d: "Plain language, no jargon walls, no hype. Clear enough for newcomers, sharp enough for pros.",
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
      <section id="newsletter" className="relative py-20 md:py-28 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="kicker mb-4">The Morning Brief</span>
          <h2 className="h-display text-4xl md:text-5xl mt-4 mb-5">
            One email. 5 minutes. Every morning.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            The 3 stories that matter before you open your exchange app. Zero
            fluff, zero paid promos. Unsubscribe in one click.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="you@domain.com"
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--surface-1)] border border-white/10 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe free
            </button>
          </form>

          <p className="text-xs text-[var(--text-muted)] mt-6 h-mono">
            Join 42,000+ readers · No spam · GDPR compliant
          </p>
        </div>
      </section>

      {/* =========== FOOTER =========== */}
      <Footer />
    </main>
  );
}

/* ====================================================================== */
/* SUB-COMPONENTS                                                         */
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
              Crypto
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
          <Link href="/articles" className="hover:text-white transition-colors">
            Research
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
        </nav>
        <Link href="#newsletter" className="btn-primary text-sm py-2 px-4">
          Subscribe
        </Link>
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
              <span className="h-display tracking-wide">ZYPERIA Crypto</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              Part of the ZYPERIA research network.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">
                Read
              </div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/articles" className="hover:text-white">Latest</Link></li>
                <li><Link href="/articles?tag=bitcoin" className="hover:text-white">Bitcoin</Link></li>
                <li><Link href="/articles?tag=defi" className="hover:text-white">DeFi</Link></li>
              </ul>
            </div>
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">
                Company
              </div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">
                Legal
              </div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-[var(--text-muted)] h-mono">
            © {new Date().getFullYear()} ZYPERIA · Not financial advice
          </div>
          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <a href="#" aria-label="Share" className="hover:text-[var(--brand-primary)] transition-colors">
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
