import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Intelligence | AI & Automation Experts',
  description: 'Learn about Intelligence mission to democratize AI and business automation for everyone.',
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          About Intelligence
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Practical AI and automation guides for makers, entrepreneurs, and teams who want to work smarter, not harder.
        </p>
      </section>

      {/* Mission */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            AI and automation shouldn't be just for tech companies. Our mission is to make these tools accessible to everyone.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We believe the future belongs to those who can leverage AI effectively. Through practical tutorials, real case studies, and honest reviews, we help you automate your workflows, boost productivity, and focus on what matters.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <h3 className="font-bold text-gray-900">Practical & Actionable</h3>
                <p className="text-sm text-gray-600">No fluff, just real tutorials you can use today</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-bold text-gray-900">Tool-Agnostic</h3>
                <p className="text-sm text-gray-600">We cover Claude, ChatGPT, Zapier, Make, and more</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-bold text-gray-900">Results-Focused</h3>
                <p className="text-sm text-gray-600">Learn the strategies that actually save time</p>
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
              icon: '🔍',
              title: 'Transparency',
              description: 'We disclose affiliate relationships and tool sponsorships. You always know our incentives.',
            },
            {
              icon: '✅',
              title: 'Accuracy',
              description: 'Every tutorial is tested. Every benchmark is verified. No fluff, just facts.',
            },
            {
              icon: '🚀',
              title: 'Innovation',
              description: 'We stay on top of new AI tools and automation platforms as they emerge.',
            },
            {
              icon: '⏱️',
              title: 'Time-Saving',
              description: 'Our goal: save you hours every week. Real ROI, not hypothetical benefits.',
            },
            {
              icon: '💰',
              title: 'Affordability',
              description: 'We focus on free and low-cost tools. Powerful automation shouldn\'t require enterprise budgets.',
            },
            {
              icon: '🤝',
              title: 'Community',
              description: 'Built by makers, for makers. We learn from our readers and iterate together.',
            },
          ].map((value) => (
            <div
              key={value.title}
              className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-blue-300 transition-colors"
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
              role: 'Founder & Automation Architect',
              bio: '10+ years building workflows and automations. Started with Zapier in 2015.',
            },
            {
              role: 'AI Specialist & Prompt Engineer',
              bio: 'Focuses on maximizing Claude, ChatGPT, and Gemini capabilities for business use.',
            },
            {
              role: 'Tools & Integration Expert',
              bio: 'Tests and compares automation platforms. Specializes in complex multi-tool workflows.',
            },
          ].map((member, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-gray-50 border border-gray-200 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-3xl">
                👤
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{member.role}</h3>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-12 border border-blue-200 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Have Questions?</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          We'd love to hear from you! Have suggestions for tools to cover, ideas for tutorials, or partnership inquiries?
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
}
