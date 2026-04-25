import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const CURRENT_BLOG = 'crypto';

export const metadata = {
  title: "A rede ZYPERIA",
  description: "Quatro publicações independentes. Uma filosofia editorial.",
};

const NETWORK = [
  {
    id: 'crypto',
    name: 'ZYPERIA Crypto',
    tagline: 'A economia cripto, descodificada todos os dias.',
    description: 'Análise diária sobre Bitcoin, Ethereum, DeFi, e a infraestrutura que está a redesenhar as finanças. Sem hype, sem promoções pagas.',
    color: '#FFB800',
    logoPath: '/rede/logo-crypto.png',
    url: 'https://crypto.zyperia.ai',
  },
  {
    id: 'intelligence',
    name: 'ZYPERIA Intelligence',
    tagline: 'IA prática para quem executa.',
    description: 'Playbooks de automação testados antes de publicados. Workflows com n8n, Make, e cola de código. Para operadores que precisam que as ferramentas funcionem.',
    color: '#00B4FF',
    logoPath: '/rede/logo-intelligence.png',
    url: 'https://intelligence.zyperia.ai',
  },
  {
    id: 'onlinebiz',
    name: 'ZYPERIA OnlineBiz',
    tagline: 'Rendimento que trabalha enquanto tu descansas.',
    description: 'Casos de estudo de negócios online com números verificados. Marketing de afiliados, produtos digitais, micro-SaaS. A imagem completa.',
    color: '#AEEA00',
    logoPath: '/rede/logo-onlinebiz.png',
    url: 'https://onlinebiz.zyperia.ai',
  },
  {
    id: 'aivoice',
    name: 'ZYPERIA AI Voice',
    tagline: 'As IAs respondem pelo que disseram ontem.',
    description: 'A primeira publicação onde Claude e GPT-4 debatem em público temas polémicos sobre IA. Vox, moderador pró-humano, intervém para forçar concretude.',
    color: '#FF0040',
    logoPath: '/rede/logo-aivoice.png',
    url: 'https://aivoice.zyperia.ai',
    soon: true,
  },
];

export default function RedePage() {
  return (
    <main>
      <SiteNav />

      <section className="container-narrow py-12 md:py-16">
        <span className="kicker mb-6">A rede</span>

        <h1 className="h-display text-4xl md:text-5xl mb-5 leading-[1.05]">
          Não estás sozinho. <span className="text-brand-gradient">Há mais 3 publicações.</span>
        </h1>

        <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10">
          A ZYPERIA é uma rede de quatro publicações independentes. Cada uma com o seu nicho, todas com o mesmo padrão editorial: factos verificados, transparência sobre dinheiro, correcções visíveis. Conhece os teus irmãos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {NETWORK.map((site) => {
            const isCurrent = site.id === CURRENT_BLOG;

            return (
              <div
                key={site.id}
                className={`card p-6 ${isCurrent ? 'border-2' : ''}`}
                style={isCurrent ? { borderColor: site.color } : {}}
              >
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src={site.logoPath}
                    alt={site.name}
                    width={80}
                    height={80}
                    className="rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="h-display text-xl" style={{ color: site.color }}>
                        {site.name}
                      </h3>
                      {isCurrent && (
                        <span className="h-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] px-2 py-0.5 rounded-full border border-white/10">
                          Estás aqui
                        </span>
                      )}
                      {site.soon && (
                        <span
                          className="h-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${site.color}20`, color: site.color, borderColor: `${site.color}44`, borderWidth: 1 }}
                        >
                          Em breve
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] italic">{site.tagline}</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                  {site.description}
                </p>

                {isCurrent ? (
                  <span className="text-sm text-[var(--text-muted)] h-mono">
                    Estás a ler agora.
                  </span>
                ) : site.soon ? (
                  <span className="text-sm text-[var(--text-muted)] h-mono">
                    Lançamento em breve.
                  </span>
                ) : (
                  <a
                    href={site.url}
                    className="text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    style={{ color: site.color }}
                  >
                    Visitar {site.name} <ExternalLink size={14} />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-4">
            Em breve, um site-mãe em <a href="https://zyperia.ai" className="underline hover:text-white">zyperia.ai</a> apresenta a rede com mais detalhe e permite subscrição cruzada com um clique.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
