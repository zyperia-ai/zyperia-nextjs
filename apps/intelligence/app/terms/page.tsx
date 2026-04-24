import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Intelligence',
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
            <strong>Intelligence provides educational content only.</strong> We are not business consultants, financial advisors, or official representatives of any tool. Nothing on our site constitutes professional advice.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Results vary based on your specific situation. We share what works for us and our community, but your mileage may vary. Always test in your own environment before deploying to production.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Accuracy</h2>
          <p className="text-gray-700 leading-relaxed">
            We strive for accuracy but don't guarantee it. AI tools and platforms change constantly. Information may become outdated. Always verify with official documentation before acting.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Affiliate Links</h2>
          <p className="text-gray-700 leading-relaxed">
            We earn commissions from affiliate links. This does not affect the price you pay. We only link to tools we genuinely use and recommend. See our Affiliate Disclosure for details.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            We are not liable for:
          </p>
          <ul className="space-y-2 text-gray-700 mt-2">
            <li>• Lost productivity or failed automations</li>
            <li>• Direct or indirect damages</li>
            <li>• Technical issues or server downtime</li>
            <li>• Typos, errors, or outdated information</li>
            <li>• Third-party tool problems or outages</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
          <p className="text-gray-700 leading-relaxed mb-2">You agree not to:</p>
          <ul className="space-y-2 text-gray-700">
            <li>• Scrape or automate content access</li>
            <li>• Use our site for harassment or illegal purposes</li>
            <li>• Distribute malware or harmful code</li>
            <li>• Spam or advertise without permission</li>
            <li>• Violate anyone's intellectual property rights</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content License</h2>
          <p className="text-gray-700 leading-relaxed">
            Our content is licensed under Creative Commons Attribution 4.0. You may share and adapt our articles, but must credit us.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            We may modify these terms anytime. Continued use means you accept the new terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Questions about our terms? Email{' '}
            <a href="mailto:legal@zyperia.ai" className="text-blue-600 hover:text-blue-700">
              legal@zyperia.ai
            </a>
          </p>
        </div>
      </section>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="font-bold text-orange-700 mb-2">⚠️ TESTING DISCLAIMER</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Always test automations and AI workflows in a safe environment first. Some tutorials involve AI systems that may produce unexpected results. Start with low-stakes tasks to verify behavior before using in production. This site is for education only, not professional consulting.
        </p>
      </div>
    </div>
  );
}
