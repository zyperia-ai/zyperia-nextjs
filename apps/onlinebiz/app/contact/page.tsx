import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Earn Online | Get in Touch',
  description: 'Send us a message. We read everything.',
};

export default function ContactPage() {
  return (
    <div className="space-y-12 py-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have a question, success story to share, or idea for a case study? We'd love to hear from you.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: '📧',
            title: 'Email',
            content: 'hello@zyperia.ai',
            description: 'We respond within 24 hours',
          },
          {
            icon: '💼',
            title: 'Partnerships',
            content: 'partnerships@zyperia.ai',
            description: 'Sponsorships & collaborations',
          },
          {
            icon: '🎯',
            title: 'Success Stories',
            content: 'casestudies@zyperia.ai',
            description: 'Share your earning story',
          },
        ].map((method) => (
          <div
            key={method.title}
            className="p-6 rounded-xl bg-gray-50 border border-gray-200 text-center hover:border-green-300 transition-colors"
          >
            <div className="text-4xl mb-3">{method.icon}</div>
            <h3 className="font-bold text-gray-900 mb-1">{method.title}</h3>
            <p className="text-green-600 font-medium mb-2">{method.content}</p>
            <p className="text-sm text-gray-600">{method.description}</p>
          </div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-green-500 focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-green-500 focus:outline-none"
              required
            />
            <textarea
              placeholder="Your message..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-green-500 focus:outline-none resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-3 font-bold text-white rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            {
              q: 'How do you make money?',
              a: 'Primarily through affiliate commissions from tools and platforms we recommend. We only link to services we genuinely use.',
            },
            {
              q: 'Can I share my story?',
              a: 'Absolutely! Email us at casestudies@zyperia.ai with your success story. If it\'s a good fit, we may feature you.',
            },
            {
              q: 'Do you offer coaching or consulting?',
              a: 'Not currently, but we release free guides and case studies regularly. Stay subscribed for the latest updates.',
            },
            {
              q: 'How often do you publish?',
              a: 'We publish 2-4 new strategies and case studies every week, covering new income streams and earning opportunities.',
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="p-4 rounded-lg bg-gray-50 border border-gray-200"
            >
              <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
