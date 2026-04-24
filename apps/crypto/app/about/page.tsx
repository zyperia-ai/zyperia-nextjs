'use client'

import Link from 'next/link'
import { ArrowRight, Target, Users, Zap, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About ZYPERIA
          </h1>
          <p className="text-gray-300 text-lg">Empowering traders and investors with real-time intelligence</p>
        </div>
      </section>

      {/* Mission */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                We believe everyone deserves access to world-class cryptocurrency intelligence. Our mission is to democratize market insights, making professional-grade analysis available to traders of all levels.
              </p>
              <p className="text-gray-400 text-lg">
                We combine cutting-edge AI with human expertise to deliver actionable intelligence that helps you stay ahead of the market.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-white/10">
              <Target className="h-16 w-16 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Precision. Clarity. Success.</h3>
              <p className="text-gray-300">Every article, chart, and insight is designed to move you closer to your financial goals.</p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Zap, title: 'Excellence', desc: 'Highest quality content and analysis' },
                { icon: Users, title: 'Community', desc: 'Building a supportive trader network' },
                { icon: Globe, title: 'Transparency', desc: 'Open, honest market commentary' },
                { icon: Target, title: 'Impact', desc: 'Real results for our members' }
              ].map((value, idx) => (
                <div key={idx} className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all">
                  <value.icon className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-400">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-gray-300 text-lg mb-6">Ready to join the ZYPERIA community?</p>
            <Link href="/articles" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">
              Start Exploring
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
