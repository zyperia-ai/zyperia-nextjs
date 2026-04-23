import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | CryptoZYPERIA',
  description: 'How we make money and our affiliate relationships.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Affiliate Disclosure</h1>
        <p className="text-gray-400">Transparency first. We disclose all financial relationships.</p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">How We Make Money</h2>
          <p className="text-gray-300 leading-relaxed">
            CryptoZYPERIA is free and ad-free. We sustain ourselves through two channels:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <h3 className="font-bold text-amber-500 mb-2">💰 Affiliate Commissions</h3>
              <p className="text-sm text-gray-300">
                We earn 0-50% commission when you purchase through our links. This doesn't affect your price.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <h3 className="font-bold text-blue-500 mb-2">🤝 Sponsorships</h3>
              <p className="text-sm text-gray-300">
                Occasionally we feature sponsored content. Always clearly marked.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Our Affiliate Partners</h2>
          <p className="text-gray-300 mb-4">
            We only partner with services we've personally tested and genuinely recommend:
          </p>
          <div className="space-y-3">
            {[
              {
                name: 'Kraken',
                category: 'Crypto Exchange',
                commission: '0.25% - 0.50%',
                why: 'Industry-leading security, low fees, excellent support',
              },
              {
                name: 'Binance',
                category: 'Crypto Exchange',
                commission: '0.20% - 0.40%',
                why: 'Largest exchange by volume, wide token selection',
              },
              {
                name: 'Coinbase',
                category: 'Crypto Platform',
                commission: 'Varies',
                why: 'Best for beginners, backed by institutional investors',
              },
              {
                name: 'Ledger',
                category: 'Hardware Wallet',
                commission: '€10 per sale',
                why: 'Most secure way to store crypto long-term',
              },
              {
                name: 'Uphold',
                category: 'Crypto Wallet',
                commission: 'Varies',
                why: 'Great for multi-asset investing',
              },
              {
                name: 'Celsius',
                category: 'Yield Platform',
                commission: '€50 per deposit',
                why: 'Earn interest on crypto holdings',
              },
            ].map((partner) => (
              <div key={partner.name} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-white">{partner.name}</h3>
                    <p className="text-xs text-gray-500">{partner.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-500 font-medium text-sm">{partner.commission}</p>
                    <p className="text-xs text-gray-500">commission</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{partner.why}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Our Promise</h2>
          <div className="space-y-3">
            <div className="flex gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-emerald-400">No Kickback Bias</h3>
                <p className="text-sm text-gray-300">We recommend based on quality, not commission. High commission ≠ better product.</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-emerald-400">Honest Reviews</h3>
                <p className="text-sm text-gray-300">We highlight pros AND cons of every product. No sugar-coating.</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-emerald-400">No Price Markup</h3>
                <p className="text-sm text-gray-300">You always pay the same price. We get commission from the company, not from you.</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-emerald-400">Full Transparency</h3>
                <p className="text-sm text-gray-300">Every affiliate link is clearly marked. You always know when we benefit.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Commission Breakdown</h2>
          <p className="text-gray-300 mb-4">
            How we typically use affiliate revenue:
          </p>
          <div className="space-y-2">
            {[
              { category: 'Content Creation', percent: 40 },
              { category: 'Hosting & Infrastructure', percent: 25 },
              { category: 'Tools & Research', percent: 20 },
              { category: 'Team & Support', percent: 15 },
            ].map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-white">{item.category}</span>
                    <span className="text-amber-500">{item.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h3 className="font-bold text-white mb-2">💬 Have Questions?</h3>
          <p className="text-gray-300 text-sm mb-3">
            We're happy to discuss our affiliate relationships. Email us at{' '}
            <a href="mailto:partnerships@zyperia.ai" className="text-amber-500 hover:text-amber-400">
              partnerships@zyperia.ai
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
