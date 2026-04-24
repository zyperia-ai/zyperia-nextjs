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
  Twitter,
  Mail,
} from "lucide-react";

export default function IntelligenceLandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />

      {/* =========== HERO =========== */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28">
        <div className="hero-ambient" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="relative mx-auto w-full max-w-5xl rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_120px_-40px_rgba(0,180,255,0.45)]">
            <Image
              src="/hero-banner.png"
              alt="ZYPERIA Intelligence"
              width={1920}
              height={800}
              priority
              className="w-full h-auto block"
            />
          </div>

          <div className="mt-14 md:mt-20 max-w-4xl mx-auto text-center">
            <span className="kicker mb-6">
              AI & Automation · Built for Operators
            </span>
            <h1 className="h-display text-5xl md:text-7xl lg:text-8xl mb-6">
              Practical AI{" "}
              <span className="text-brand-gradient">for people who ship.</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Automation playbooks, workflow blueprints, and the tools that
              actually earn their seat at the table. No AI hype, no "game
              changer" headlines.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/articles" className="btn-primary">
                Browse playbooks <ArrowRight size={18} />
              </Link>
              <Link href="#newsletter" className="btn-ghost">
                Weekly breakdown <Mail size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
            {[
              { label: "Playbooks published", value: "860+" },
              { label: "Tools reviewed", value: "220+" },
              { label: "Automations shared", value: "140" },
              { label: "Readers/month", value: "31K" },
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
              Six fronts of the automation economy.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                title: "LLMs in Production",
                desc: "Prompt engineering that survives real users, eval pipelines, and knowing when to fine-tune vs. prompt.",
              },
              {
                icon: Workflow,
                title: "Workflow Automation",
                desc: "n8n, Make, Zapier, and custom glue code. Blueprint-level walkthroughs you can deploy today.",
              },
              {
                icon: Bot,
                title: "Autonomous Agents",
                desc: "Agent architectures, tool use, memory, and the honest limits of what works in 2026.",
              },
              {
                icon: Gauge,
                title: "Ops & Productivity",
                desc: "Email triage, meeting notes, research assistants. Systems that compound, not toys that rot.",
              },
              {
                icon: Cpu,
                title: "Open Source Stack",
                desc: "Ollama, Llama, Mistral, Phi — running capable models on hardware you already own.",
              },
              {
                icon: Layers,
                title: "Integrations",
                desc: "Plugging AI into CRMs, ERPs, spreadsheets, and the tools your team won't give up.",
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
                If we can't run it, we don't write it.
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Every automation we publish is built, tested, and documented
                from a real deployment. No "here's what you could do in theory."
                Only what actually moves.
              </p>
            </div>
            <div className="lg:col-span-7 space-y-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
              {[
                {
                  n: "01",
                  t: "Problem first",
                  d: "We start from an operator's real pain — not from a tool looking for a use case.",
                },
                {
                  n: "02",
                  t: "Build it ourselves",
                  d: "Every workflow is constructed end-to-end before we hit publish. Screenshots are ours.",
                },
                {
                  n: "03",
                  t: "Honest trade-offs",
                  d: "Cost, reliability, vendor lock-in, maintenance burden. Named out loud, not buried.",
                },
                {
                  n: "04",
                  t: "Plain language",
                  d: "If a concept needs three buzzwords to explain, we found the wrong explanation.",
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
          <span className="kicker mb-4">The Weekly Build</span>
          <h2 className="h-display text-4xl md:text-5xl mt-4 mb-5">
            One deep playbook. Every Tuesday.
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
            One automation, broken down step by step, with the template ready
            to import. Skip the hype cycle and ship something useful.
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
            Join 31,000+ operators · No spam · GDPR compliant
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
              <span className="h-display tracking-wide">ZYPERIA Intelligence</span>
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
                <li><Link href="/articles?tag=llm" className="hover:text-white">LLMs</Link></li>
                <li><Link href="/articles?tag=automation" className="hover:text-white">Automation</Link></li>
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
            © {new Date().getFullYear()} ZYPERIA
          </div>
          <div className="flex items-center gap-4 text-[var(--text-muted)]">
            <a href="#" aria-label="Twitter" className="hover:text-[var(--brand-primary)] transition-colors">
              <Twitter size={16} />
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
