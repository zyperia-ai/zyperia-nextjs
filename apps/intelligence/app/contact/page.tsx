import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Intelligence | Get in Touch',
  description: 'Send us a message. We read everything.',
};

export default function ContactPage() {
  return (
    <div className="space-y-12 py-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have feedback, ideas for tutorials, or partnership inquiries? We'd love to hear from you.
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
            description: 'Tool sponsorships & collaborations',
          },
          {
            icon: '🐛',
            title: 'Report Issues',
            content: 'support@zyperia.ai',
            description: 'Tutorial bugs & technical feedback',
          },
        ].map((method) => (
          <div
            key={method.title}
            className="p-6 rounded-xl bg-gray-50 border border-gray-200 text-center hover:border-blue-300 transition-colors"
          >
            <div className="text-4xl mb-3">{method.icon}</div>
            <h3 className="font-bold text-gray-900 mb-1">{method.title}</h3>
            <p className="text-blue-600 font-medium mb-2">{method.content}</p>
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
                className="px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
              required
            />
            <textarea
              placeholder="Your message..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-3 font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
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
              a: 'Primarily through affiliate commissions from tools we recommend. We only link to services we genuinely use and recommend.',
            },
            {
              q: 'Can I contribute a tutorial?',
              a: 'Yes! We accept guest posts. Email us at partnerships@zyperia.ai with your topic idea.',
            },
            {
              q: 'Do you offer consulting?',
              a: 'Not currently, but we may offer premium courses in the future. Reach out to express interest!',
            },
            {
              q: 'How often do you publish?',
              a: 'We publish 2-3 new tutorials every week, covering new AI tools, automation tricks, and workflow optimization.',
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
