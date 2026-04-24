import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Intelligence',
  description: 'How we make money and our affiliate relationships.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Affiliate Disclosure</h1>
        <p className="text-gray-600">Transparency first. We disclose all financial relationships.</p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Make Money</h2>
          <p className="text-gray-700 leading-relaxed">
            Intelligence is free and ad-free. We sustain ourselves through two channels:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="font-bold text-blue-600 mb-2">💰 Affiliate Commissions</h3>
              <p className="text-sm text-gray-700">
                We earn 2-25% commission when you purchase through our links. This doesn't affect your price.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="font-bold text-blue-600 mb-2">🤝 Sponsorships</h3>
              <p className="text-sm text-gray-700">
                Occasionally we feature sponsored content from tools we recommend. Always clearly marked.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Affiliate Partners</h2>
          <p className="text-gray-700 mb-4">
            We only partner with services we've personally tested and genuinely recommend:
          </p>
          <div className="space-y-3">
            {[
              {
                name: 'Zapier',
                category: 'Automation Platform',
                commission: '2-8%',
                why: 'The no-code automation pioneer. Perfect for beginners and complex workflows.',
              },
              {
                name: 'Make (Make.com)',
                category: 'Visual Automation',
                commission: '2-10%',
                why: 'More powerful than Zapier for complex scenarios. Best visuals.',
              },
              {
                name: 'OpenAI API',
                category: 'AI Platform',
                commission: 'Varies',
                why: 'ChatGPT for developers. Essential for AI workflow building.',
              },
              {
                name: 'Anthropic Claude API',
                category: 'AI Platform',
                commission: 'Varies',
                why: 'Most capable AI for complex reasoning and coding tasks.',
              },
              {
                name: 'Google Cloud (Vertex AI)',
                category: 'AI & Data',
                commission: '2-5%',
                why: 'Enterprise AI platform with excellent integrations.',
              },
            ].map((partner) => (
              <div key={partner.name} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{partner.name}</h3>
                    <p className="text-xs text-gray-500">{partner.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-600 font-medium text-sm">{partner.commission}</p>
                    <p className="text-xs text-gray-500">commission</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{partner.why}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Promise</h2>
          <div className="space-y-3">
            <div className="flex gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-emerald-700">No Kickback Bias</h3>
                <p className="text-sm text-gray-700">We recommend based on quality, not commission. High commission ≠ better tool.</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-emerald-700">Honest Reviews</h3>
                <p className="text-sm text-gray-700">We highlight pros AND cons. We don't recommend tools we haven't personally tested.</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-emerald-700">No Price Markup</h3>
                <p className="text-sm text-gray-700">You always pay the same price. We get commission from the company, not from you.</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-xl flex-shrink-0">✓</div>
              <div>
                <h3 className="font-bold text-emerald-700">Full Transparency</h3>
                <p className="text-sm text-gray-700">Every affiliate link is clearly marked. You always know when we benefit.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commission Breakdown</h2>
          <p className="text-gray-700 mb-4">
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
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="text-blue-600">{item.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-2">💬 Have Questions?</h3>
          <p className="text-gray-700 text-sm mb-3">
            We're happy to discuss our affiliate relationships. Email us at{' '}
            <a href="mailto:partnerships@zyperia.ai" className="text-blue-600 hover:text-blue-700">
              partnerships@zyperia.ai
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
