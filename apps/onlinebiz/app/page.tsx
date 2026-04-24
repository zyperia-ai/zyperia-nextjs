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

export default function OnlineBizLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />

      {/* =========== HERO =========== */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28">
        <div className="hero-ambient" />
        <div className="container-narrow relative z-10">
          <div className="hero-banner-wrap">
            <Image
              src="/hero-banner.png"
              alt="ZYPERIA OnlineBiz"
              width={1920}
              height={800}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>

          <div className="mt-14 md:mt-20 max-w-4xl mx-auto text-center">
            <span className="kicker mb-6">
              Online Income · No Fluff · No Gurus
            </span>
            <h1 className="h-display text-5xl md:text-7xl lg:text-8xl mb-6">
              Income that works{" "}
              <span className="text-brand-gradient">while you don't.</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Affiliate, digital products, micro-SaaS, content, services.
              Real numbers, real breakdowns, and the systems behind the money.
              No "laptop lifestyle" Instagram posts.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/articles" className="btn-primary">
                Browse case studies <ArrowRight size={18} />
              </Link>
              <Link href="#newsletter" className="btn-ghost">
                Friday breakdown <Mail size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {[
              { label: "Case studies", value: "480+" },
              { label: "Business models", value: "25" },
              { label: "Tools reviewed", value: "310" },
              { label: "Readers/month", value: "56K" },
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

      {/* =========== BUSINESS MODELS =========== */}
      <section className="relative py-20 md:py-28 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <span className="kicker mb-4">Income models</span>
            <h2 className="h-display text-4xl md:text-5xl mt-4">
              Six paths. Pick the one that fits your life.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: DollarSign,
                title: "Affiliate Marketing",
                desc: "Content-driven affiliate programs with real commission structures — not the $5-a-signup trap.",
              },
              {
                icon: ShoppingBag,
                title: "Digital Products",
                desc: "Templates, courses, notion setups, prompt packs. Build once, sell while you sleep.",
              },
              {
                icon: FileText,
                title: "Content & Newsletters",
                desc: "Paid newsletters, Substacks, niche blogs. What actually compounds vs. what burns out.",
              },
              {
                icon: Rocket,
                title: "Micro-SaaS",
                desc: "Small tools solving one problem for one niche. $2k-20k MRR without a team.",
              },
              {
                icon: Users,
                title: "Services & Productised",
                desc: "Freelance, done-for-you, fixed-scope offers. The fastest path to €5k months.",
              },
              {
                icon: Target,
                title: "E-commerce",
                desc: "DTC, print-on-demand, digital-first storefronts. Margin math that actually pencils out.",
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
              <span className="kicker mb-4">Editorial standard</span>
              <h2 className="h-display text-4xl md:text-5xl mt-4 mb-6">
                Receipts or it didn't happen.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Every revenue claim is backed by a screenshot, a dashboard,
                or a verified interview. No "I made $10k last month" without
                the invoice trail.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "Verified numbers",
                  d: "Every case study includes screenshots, P&L, or founder interviews. No anonymous bragging.",
                },
                {
                  n: "02",
                  t: "Full cost picture",
                  d: "Gross revenue is easy. We publish the margins, the tools, the refunds, the tax bill.",
                },
                {
                  n: "03",
                  t: "Time + effort",
                  d: "Hours per week, months to ramp, skills required. The honest version of what 'passive' means.",
                },
                {
                  n: "04",
                  t: "No course pitches",
                  d: "We don't sell $997 programs. If a business model needs a funnel to work, we say so.",
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
          <span className="kicker mb-4">The Friday Breakdown</span>
          <h2 className="h-display text-4xl md:text-5xl mt-4 mb-5">
            One business. Dissected. Every Friday.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            We pick one real online business, break down its model, numbers,
            and what you can actually steal from it. No gurus. No fluff.
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
            Join 56,000+ builders · No spam · GDPR compliant
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
          <Link href="/articles" className="hover:text-white transition-colors">Case Studies</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>
        <Link href="#newsletter" className="btn-primary text-sm py-2 px-4">Subscribe</Link>
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
              Part of the ZYPERIA research network.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">Read</div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/articles" className="hover:text-white">Latest</Link></li>
                <li><Link href="/articles?tag=affiliate" className="hover:text-white">Affiliate</Link></li>
                <li><Link href="/articles?tag=saas" className="hover:text-white">Micro-SaaS</Link></li>
              </ul>
            </div>
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">Company</div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <div className="h-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3">Legal</div>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-[var(--text-muted)] h-mono">
            © {new Date().getFullYear()} ZYPERIA · Results shown are not typical
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
