import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact CryptoZYPERIA | Get in Touch',
  description: 'Send us a message. We read everything.',
};

export default function ContactPage() {
  return (
    <div className="space-y-12 py-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Have feedback, questions, or partnership inquiries? We'd love to hear from you.
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
            icon: '🐛',
            title: 'Report Issues',
            content: 'support@zyperia.ai',
            description: 'Technical issues & feedback',
          },
        ].map((method) => (
          <div
            key={method.title}
            className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-amber-500/30 transition-colors"
          >
            <div className="text-4xl mb-3">{method.icon}</div>
            <h3 className="font-bold text-white mb-1">{method.title}</h3>
            <p className="text-amber-500 font-medium mb-2">{method.content}</p>
            <p className="text-sm text-gray-400">{method.description}</p>
          </div>
        ))}
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-xl p-8 border border-slate-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-amber-500 focus:outline-none"
              required
            />
            <textarea
              placeholder="Your message..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-amber-500 focus:outline-none resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-3 font-bold text-white rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-amber-500/30 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            {
              q: 'How do you make money?',
              a: 'Primarily through affiliate commissions from products we recommend. We only link to services we genuinely use and recommend.',
            },
            {
              q: 'Can I contribute an article?',
              a: 'Yes! We accept guest posts. Email us at partnerships@zyperia.ai with your topic idea.',
            },
            {
              q: 'Do you offer consulting?',
              a: 'Not currently, but we may in the future. Reach out to express interest!',
            },
            {
              q: 'How often do you publish?',
              a: 'We publish 2-3 new articles daily, covering breaking news, deep dives, and tutorials.',
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
            >
              <h3 className="font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
