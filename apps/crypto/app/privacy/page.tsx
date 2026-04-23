import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CryptoZYPERIA',
  description: 'Our privacy policy and how we protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-12">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy & GDPR</h1>
        <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• <strong>Email Address:</strong> Collected when you subscribe to our newsletter</li>
            <li>• <strong>Usage Data:</strong> Pages visited, time spent, referral source (via Google Analytics)</li>
            <li>• <strong>Technical Data:</strong> Browser type, IP address, device type (anonymized)</li>
            <li>• <strong>Affiliate Clicks:</strong> Which products you interact with</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Send you our weekly newsletter (with your consent)</li>
            <li>• Improve our content based on what readers find most valuable</li>
            <li>• Track affiliate commissions (to understand our revenue)</li>
            <li>• Provide customer support if you contact us</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">3. Your GDPR Rights</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• <strong>Right to Access:</strong> Request a copy of your data</li>
            <li>• <strong>Right to Deletion:</strong> Ask us to delete your email</li>
            <li>• <strong>Right to Correction:</strong> Update inaccurate data</li>
            <li>• <strong>Right to Opt-Out:</strong> Unsubscribe from our newsletter anytime</li>
            <li>• <strong>Right to Data Portability:</strong> Receive your data in a readable format</li>
          </ul>
          <p className="text-gray-400 mt-4 text-sm">
            Contact us at privacy@zyperia.ai to exercise any of these rights.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Services</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• <strong>Google Analytics:</strong> Tracks anonymous usage patterns</li>
            <li>• <strong>Substack/Resend:</strong> Manages our newsletter service</li>
            <li>• <strong>Affiliate Networks:</strong> Kraken, Binance, etc. (see Affiliate Disclosure)</li>
            <li>• <strong>Vercel:</strong> Hosts our website</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">5. Cookies & Tracking</h2>
          <p className="text-gray-300 mb-2">
            We use minimal cookies. You may see:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li>• Session cookies (to keep you logged in)</li>
            <li>• Analytics cookies (Google Analytics - anonymous)</li>
            <li>• Preference cookies (your theme choice: light/dark)</li>
          </ul>
          <p className="text-gray-400 text-sm mt-2">
            You can disable cookies in your browser settings.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Newsletter emails: Until you unsubscribe</li>
            <li>• Analytics: 14 months (Google Analytics default)</li>
            <li>• Usage logs: 30 days</li>
            <li>• Affiliate clicks: 90 days</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">7. Security</h2>
          <p className="text-gray-300">
            We use HTTPS encryption for all connections. Your email is stored securely in Supabase, which complies with SOC 2 and GDPR standards.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
          <p className="text-gray-300">
            Our site is not targeted at children under 13. If we become aware of data from children, we delete it immediately.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
          <p className="text-gray-300">
            Privacy concerns? Email us at{' '}
            <a href="mailto:privacy@zyperia.ai" className="text-amber-500 hover:text-amber-400">
              privacy@zyperia.ai
            </a>
          </p>
        </div>
      </section>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
        <p className="text-gray-400 text-sm">
          <strong>TL;DR:</strong> We only collect your email (when you subscribe) and basic analytics (anonymous). We never sell your data. You can unsubscribe or request deletion anytime.
        </p>
      </div>
    </div>
  );
}
