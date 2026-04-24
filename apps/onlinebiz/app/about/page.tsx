'use client'

import Link from 'next/link'
import { ArrowRight, Target, Users, Zap, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            About ZYPERIA Business
          </h1>
          <p className="text-gray-300 text-lg">Empowering entrepreneurs to build and scale successful businesses</p>
        </div>
      </section>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                We believe anyone can build a successful online business. Our mission is to provide the knowledge, tools, and community needed to launch and scale profitable ventures.
              </p>
              <p className="text-gray-400 text-lg">
                From side hustles to full-scale enterprises, we guide you through every step of your entrepreneurial journey.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-xl p-8 border border-white/10">
              <Target className="h-16 w-16 text-emerald-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Success Built on Knowledge</h3>
              <p className="text-gray-300">Everything you need to build your business empire.</p>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Zap, title: 'Action', desc: 'Practical strategies that work' },
                { icon: Users, title: 'Community', desc: 'Support from fellow entrepreneurs' },
                { icon: Globe, title: 'Scalability', desc: 'From zero to millions' },
                { icon: Target, title: 'Results', desc: 'Your success is our success' }
              ].map((value, idx) => (
                <div key={idx} className="p-8 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-all">
                  <value.icon className="h-8 w-8 text-emerald-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-400">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-300 text-lg mb-6">Ready to start your business journey?</p>
            <Link href="/articles" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
