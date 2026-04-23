import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | CryptoZYPERIA',
  description: 'Our terms of service and disclaimer.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">1. Disclaimer</h2>
          <p className="text-gray-300 leading-relaxed">
            <strong>CryptoZYPERIA provides educational content only.</strong> We are not financial advisors, investment advisors, or brokers. Nothing on our site constitutes financial advice.
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            Cryptocurrency is highly volatile and risky. You could lose money. Do your own research (DYOR) before investing. Never invest more than you can afford to lose.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">2. Accuracy</h2>
          <p className="text-gray-300 leading-relaxed">
            We strive for accuracy but don't guarantee it. Crypto markets move fast. Information may become outdated. Always verify critical information before acting on it.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">3. Affiliate Links</h2>
          <p className="text-gray-300 leading-relaxed">
            We earn commissions from affiliate links. This does not affect the price you pay. We only link to services we genuinely recommend. See our Affiliate Disclosure for details.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">4. No Liability</h2>
          <p className="text-gray-300 leading-relaxed">
            We are not liable for:
          </p>
          <ul className="space-y-2 text-gray-300 mt-2">
            <li>• Investment losses</li>
            <li>• Direct or indirect damages</li>
            <li>• Technical issues or server downtime</li>
            <li>• Typos, errors, or outdated information</li>
            <li>• Third-party website or service problems</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use</h2>
          <p className="text-gray-300 leading-relaxed mb-2">You agree not to:</p>
          <ul className="space-y-2 text-gray-300">
            <li>• Scrape or automate content access</li>
            <li>• Use our site for harassment or illegal purposes</li>
            <li>• Distribute malware or harmful code</li>
            <li>• Spam or advertise without permission</li>
            <li>• Violate anyone's intellectual property rights</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">6. Content License</h2>
          <p className="text-gray-300 leading-relaxed">
            Our content is licensed under Creative Commons Attribution 4.0. You may share and adapt our articles, but must credit us.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">7. Modifications</h2>
          <p className="text-gray-300 leading-relaxed">
            We may modify these terms anytime. Continued use means you accept the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">8. Contact</h2>
          <p className="text-gray-300 leading-relaxed">
            Questions about our terms? Email{' '}
            <a href="mailto:legal@zyperia.ai" className="text-amber-500 hover:text-amber-400">
              legal@zyperia.ai
            </a>
          </p>
        </div>
      </section>

      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
        <h3 className="font-bold text-red-400 mb-2">⚠️ CRITICAL DISCLAIMER</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          Crypto investments are extremely risky. Bitcoin, Ethereum, and other cryptocurrencies have experienced 50%+ drawdowns in the past. Past performance does not guarantee future results. Never invest money you can't afford to lose. This site is for education only, not financial advice.
        </p>
      </div>
    </div>
  );
}
