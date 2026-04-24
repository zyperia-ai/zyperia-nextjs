import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Earn Online | Making Money From Home Experts',
  description: 'Learn about Earn Online mission to help people earn money from home with proven strategies.',
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          About Earn Online
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We help people build real income streams from home. Practical guides, real case studies, and honest income expectations.
        </p>
      </section>

      {/* Mission */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Too many "make money online" sites promise unrealistic results. We're different.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to share real strategies from people who are actually earning money online. No hype, no fake testimonials. Just honest insights about freelancing, digital products, passive income, and side hustles that genuinely work.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-2xl">💪</div>
              <div>
                <h3 className="font-bold text-gray-900">Real & Verified</h3>
                <p className="text-sm text-gray-600">Case studies from actual earners, not made-up testimonials</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <h3 className="font-bold text-gray-900">Data-Driven</h3>
                <p className="text-sm text-gray-600">Real income numbers and realistic timelines</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-bold text-gray-900">Actionable Steps</h3>
                <p className="text-sm text-gray-600">Not just theory, but step-by-step guides you can follow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section>
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '💬',
              title: 'Transparency',
              description: 'We disclose affiliate relationships. You always know when we earn commission.',
            },
            {
              icon: '✓',
              title: 'Honesty',
              description: 'We tell you what works AND what doesn\'t. Real timelines, real income expectations.',
            },
            {
              icon: '🚀',
              title: 'Innovation',
              description: 'We test new income streams as they emerge. 2026 strategies, not 2015 tactics.',
            },
            {
              icon: '🤝',
              title: 'Community First',
              description: 'Built by people earning online, for people who want to earn online.',
            },
            {
              icon: '📈',
              title: 'Scalability',
              description: 'From first $100 to $5000/month. We cover every level of growth.',
            },
            {
              icon: '🌍',
              title: 'Global Access',
              description: 'Methods that work worldwide. Not just for one country or audience.',
            },
          ].map((value) => (
            <div
              key={value.title}
              className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-green-300 transition-colors"
            >
              <div className="text-3xl mb-3">{value.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              role: 'Founder & Income Strategist',
              bio: '10+ years earning online. Built multiple 6-figure income streams. Now teaching others.',
            },
            {
              role: 'Case Study Manager',
              bio: 'Interviews successful earners and documents their real case studies for our community.',
            },
            {
              role: 'Market Research & Trends',
              bio: 'Identifies new income opportunities as they emerge. Keeps our strategies 2026-relevant.',
            },
          ].map((member, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-gray-50 border border-gray-200 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl">
                👤
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{member.role}</h3>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-12 border border-green-200 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Earn?</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          Start with our guides, connect with our community, and share your own success story.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
}
