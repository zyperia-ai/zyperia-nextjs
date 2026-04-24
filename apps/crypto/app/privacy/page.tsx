export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Introduction</h2>
            <p className="text-gray-300 mb-6">
              ZYPERIA ("we", "us", "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Information Collection</h2>
            <p className="text-gray-300 mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Personal Data: Name, email address, usage data</li>
              <li>Device Data: Browser type, IP address, pages visited</li>
              <li>Cookies: To enhance your experience</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Use of Data</h2>
            <p className="text-gray-300 mb-6">
              ZYPERIA uses the collected data for various purposes including providing and maintaining the service, notifying you of changes, allowing participation in interactive features, providing customer support, gathering analysis to improve the service, and monitoring usage patterns.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Security</h2>
            <p className="text-gray-300 mb-6">
              The security of your data is important to us but remember that no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at privacy@zyperia.ai
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
