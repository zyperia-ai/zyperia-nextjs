import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Earn Online',
  description: 'Our terms of service and disclaimer.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Disclaimer</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Earn Online provides educational content only.</strong> We are not financial advisors, tax consultants, or business coaches. Nothing on our site constitutes professional advice.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Your income will vary. Results depend on your effort, skill, market conditions, and many other factors. We share what works for us and our community, but we can't guarantee specific results for you.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Income Claims</h2>
          <p className="text-gray-700 leading-relaxed">
            We don't guarantee any income. Case studies and income examples are real but exceptional. Most people earn less. Some earn more. Results are not typical and vary based on individual effort and circumstances.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Accuracy</h2>
          <p className="text-gray-700 leading-relaxed">
            We strive for accuracy but don't guarantee it. Platforms change constantly. Income opportunities evolve. Information may become outdated. Always verify with official sources before acting.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Affiliate Links</h2>
          <p className="text-gray-700 leading-relaxed">
            We earn commissions from affiliate links. This does not affect the price you pay. We only link to tools and services we genuinely recommend. See our Affiliate Disclosure for details.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. No Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            We are not liable for:
          </p>
          <ul className="space-y-2 text-gray-700 mt-2">
            <li>• Lost income or failed side hustles</li>
            <li>• Direct or indirect damages</li>
            <li>• Technical issues or server downtime</li>
            <li>• Typos, errors, or outdated information</li>
            <li>• Third-party platform problems or account bans</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Acceptable Use</h2>
          <p className="text-gray-700 leading-relaxed mb-2">You agree not to:</p>
          <ul className="space-y-2 text-gray-700">
            <li>• Scrape or automate content access</li>
            <li>• Use our site for illegal activities</li>
            <li>• Distribute malware or harmful code</li>
            <li>• Spam or advertise without permission</li>
            <li>• Violate anyone's intellectual property rights</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Content License</h2>
          <p className="text-gray-700 leading-relaxed">
            Our content is licensed under Creative Commons Attribution 4.0. You may share and adapt our articles, but must credit us.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            We may modify these terms anytime. Continued use means you accept the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Questions about our terms? Email{' '}
            <a href="mailto:legal@zyperia.ai" className="text-green-600 hover:text-green-700">
              legal@zyperia.ai
            </a>
          </p>
        </div>
      </section>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="font-bold text-orange-700 mb-2">⚠️ INCOME DISCLAIMER</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Individual income results are not guaranteed and vary depending on your efforts, experience, and market conditions. Past income is not typical and does not guarantee future results. We share real case studies but they represent exceptional results, not the norm. This site is for educational purposes only.
        </p>
      </div>
    </div>
  );
}
