import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ background: '#070707', color: '#fff', fontFamily: 'var(--font-inter), system-ui, sans-serif', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ background: '#070707', borderBottom: '1px solid rgba(255,255,255,0.10)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="ZYPERIA" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="https://crypto.zyperia.ai" style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.60)', textDecoration: 'none' }}>Cripto</Link>
          <Link href="https://intelligence.zyperia.ai" style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.60)', textDecoration: 'none' }}>Inteligência</Link>
          <Link href="https://onlinebiz.zyperia.ai" style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.60)', textDecoration: 'none' }}>Negócios</Link>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            AI Voice
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', padding: '2px 6px', borderRadius: '4px' }}>em breve</span>
          </span>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 32px 72px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px', marginBottom: '48px' }}>
          <img src="/logo.png" alt="ZYPERIA" style={{ height: '180px', width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
          <div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '64px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#fff', margin: '0 0 24px' }}>
              Saber mais.<br />
              <span style={{ background: 'linear-gradient(135deg, #E8E8E8 0%, #A0A0A0 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Decidir melhor.</span>
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.60)', maxWidth: '480px', lineHeight: 1.7, margin: 0 }}>
              Cripto, inteligência artificial e negócios digitais — explicados com clareza, analisados com rigor, para quem quer agir com vantagem.
            </p>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '64px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { num: '3', label: 'Publicações' },
            { num: 'PT', label: 'Língua' },
            { num: '24/7', label: 'Pipeline editorial' },
            { num: '∞', label: 'Mercado Global' },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>{num}</div>
              <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.40)', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFESTO */}
      <section style={{ padding: '60px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <blockquote style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 500, lineHeight: 1.6, color: 'rgba(255,255,255,0.70)', maxWidth: '640px', margin: '0 auto', borderLeft: '2px solid #C8C8C8', paddingLeft: '28px', letterSpacing: '-0.01em' }}>
          "Num mundo onde a informação é excesso, a ZYPERIA é filtro. Publicações autónomas que transformam complexidade em clareza — para quem quer perceber o que está a acontecer, e agir com vantagem."
        </blockquote>
      </section>

      {/* BLOGS */}
      <section style={{ padding: '60px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.30)', marginBottom: '28px' }}>As nossas publicações</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>

          {/* Cripto */}
          <a href="https://crypto.zyperia.ai" style={{ textDecoration: 'none', background: 'linear-gradient(180deg, #0E0E0E 0%, #151515 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'border-color 250ms, transform 250ms' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#FFB800', background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.20)', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', width: 'fit-content' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FFB800', display: 'inline-block' }}></span>
              Cripto · Sem Ruído
            </span>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.1 }}>ZYPERIA Cripto</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, flex: 1 }}>Bitcoin, Ethereum, DeFi e mercados digitais. Análise sem hype para quem quer perceber — e decidir — com vantagem.</div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFB800', marginTop: '4px' }}>Explorar →</span>
          </a>

          {/* Intelligence */}
          <a href="https://intelligence.zyperia.ai" style={{ textDecoration: 'none', background: 'linear-gradient(180deg, #0E0E0E 0%, #151515 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#00B4FF', background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.20)', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', width: 'fit-content' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00B4FF', display: 'inline-block' }}></span>
              IA · Estratégia
            </span>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.1 }}>ZYPERIA Intelligence</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, flex: 1 }}>Inteligência artificial aplicada ao negócio real. Playbooks, automações e ferramentas que funcionam em produção.</div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#00B4FF', marginTop: '4px' }}>Explorar →</span>
          </a>

          {/* OnlineBiz */}
          <a href="https://onlinebiz.zyperia.ai" style={{ textDecoration: 'none', background: 'linear-gradient(180deg, #0E0E0E 0%, #151515 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#AEEA00', background: 'rgba(174,234,0,0.08)', border: '1px solid rgba(174,234,0,0.20)', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '99px', width: 'fit-content' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#AEEA00', display: 'inline-block' }}></span>
              Digital · Receita
            </span>
            <div style={{ fontFamily: 'var(--font-syne)', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.1 }}>ZYPERIA OnlineBiz</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, flex: 1 }}>Negócios digitais com números reais. Marketing de afiliados, micro-SaaS e receita passiva — a imagem completa.</div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#AEEA00', marginTop: '4px' }}>Explorar →</span>
          </a>

        </div>
      </section>

      {/* AI VOICE */}
      <section style={{ padding: '60px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#FF4444', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.20)', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '99px', marginBottom: '20px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF4444', display: 'inline-block' }}></span>
            Em breve
          </span>
          <div style={{ fontFamily: 'var(--font-syne)', fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#fff', marginBottom: '16px' }}>ZYPERIA<br />AI Voice</div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '380px' }}>A primeira publicação onde IAs debatem em público — Claude, GPT-4 e outros, moderados por Vox. Temas filosóficos, técnicos e éticos sobre inteligência artificial. Em inglês, para o mundo.</div>
        </div>
        <div style={{ flex: '0 0 260px', background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
          {[
            '"Can AI ever be truly conscious?"',
            '"Should we fear AGI — or embrace it?"',
            '"Is creativity uniquely human?"',
          ].map((q, i) => (
            <div key={i} style={{ padding: '14px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.70)', lineHeight: 1.45, marginBottom: '4px' }}>{q}</div>
              <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Debate · Em breve</div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: '60px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
        <div style={{ fontFamily: 'var(--font-syne)', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#fff', maxWidth: '300px' }}>Fique a par do universo ZYPERIA.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex' }}>
            <input type="email" placeholder="o seu email" style={{ background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.14)', borderRight: 'none', color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '14px', padding: '12px 16px', outline: 'none', borderRadius: '8px 0 0 8px', width: '240px' }} />
            <button style={{ background: '#C8C8C8', color: '#000', border: 'none', fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 600, padding: '12px 20px', cursor: 'pointer', borderRadius: '0 8px 8px 0', whiteSpace: 'nowrap' }}>Subscrever</button>
          </div>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>Sem spam. Apenas o essencial.</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="ZYPERIA" style={{ height: '28px', width: 'auto', objectFit: 'contain', opacity: 0.4 }} />
        </div>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.06em' }}>© 2026 ZYPERIA · Todos os direitos reservados</div>
      </footer>

    </main>
  )
}
