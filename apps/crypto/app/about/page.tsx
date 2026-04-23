import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About CryptoZYPERIA | Our Mission & Team',
  description: 'Learn about CryptoZYPERIA mission to provide expert cryptocurrency education and analysis.',
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          About CryptoZYPERIA
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Expert cryptocurrency education, daily market analysis, and actionable insights for everyone from beginners to professional traders.
        </p>
      </section>

      {/* Mission */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            We believe cryptocurrency education shouldn't be expensive, intimidating, or full of jargon. Our mission is to demystify blockchain technology and digital assets for everyone.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Through in-depth guides, market analysis, and expert reviews, we help people make informed decisions about their crypto investments and participation in the blockchain ecosystem.
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-bold text-white">Educational Excellence</h3>
                <p className="text-sm text-gray-400">Clear, accurate, accessible content</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">🤝</div>
              <div>
                <h3 className="font-bold text-white">Community First</h3>
                <p className="text-sm text-gray-400">Built by crypto enthusiasts, for crypto community</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h3 className="font-bold text-white">Always Current</h3>
                <p className="text-sm text-gray-400">Fresh analysis and market insights daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section>
        <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🔍',
              title: 'Transparency',
              description: 'We disclose affiliate relationships and clearly mark sponsored content. You always know our incentives.',
            },
            {
              icon: '✅',
              title: 'Accuracy',
              description: 'Every claim is researched and verified. We cite sources and correct mistakes promptly.',
            },
            {
              icon: '🚀',
              title: 'Innovation',
              description: 'We stay on the cutting edge of crypto technology, exploring new chains, tokens, and DeFi protocols.',
            },
            {
              icon: '🛡️',
              title: 'Security First',
              description: 'We prioritize user security and privacy. Your data is never sold or misused.',
            },
            {
              icon: '🌱',
              title: 'Sustainability',
              description: 'We explore eco-friendly solutions and evaluate projects on environmental impact.',
            },
            {
              icon: '🌍',
              title: 'Accessibility',
              description: 'Quality education should be free. All content is available to everyone, everywhere.',
            },
          ].map((value) => (
            <div
              key={value.title}
              className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-colors"
            >
              <div className="text-3xl mb-3">{value.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
              <p className="text-gray-400 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-3xl font-bold mb-12 text-center text-white">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              role: 'Founder & Crypto Expert',
              bio: '12+ years in cryptocurrency. Bitcoin advocate since 2012. Former institutional trader.',
            },
            {
              role: 'Content Lead & Writer',
              bio: 'Blockchain researcher. Specializes in DeFi protocols and smart contracts. PhD candidate.',
            },
            {
              role: 'Technical Director',
              bio: 'Full-stack developer. Built trading tools and portfolio trackers. Security auditor.',
            },
          ].map((member, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
                👤
              </div>
              <h3 className="font-bold text-white mb-1">{member.role}</h3>
              <p className="text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-12 border border-amber-500/20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Have Questions?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          We'd love to hear from you! Reach out with feedback, suggestions, or collaboration inquiries.
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition-all"
        >
          Get in Touch
        </a>
      </section>
    </div>
  );
}
