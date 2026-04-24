'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, Rocket, DollarSign, BarChart3, Users, Award, Zap, BookOpen } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    } catch (error) {
      console.error('Subscribe error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Rocket className="h-4 w-4" />
            <span className="text-sm font-semibold text-emerald-400">Build Your Empire</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Online Business Mastery
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate guide to building, growing, and scaling your online business. From dropshipping to SaaS, we teach you everything you need to succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/articles" className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
              Start Learning
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-4 border-2 border-emerald-400/50 rounded-lg font-semibold text-lg hover:bg-emerald-400/10 transition-colors">
              Learn More
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-emerald-400">400+</div>
              <div className="text-gray-400">Business Guides</div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-emerald-400">Expert Tips</div>
              <div className="text-gray-400">Every Day</div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-emerald-400">80K+</div>
              <div className="text-gray-400">Entrepreneurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Complete Business Solutions
            </h2>
            <p className="text-gray-300 text-lg">Everything you need to launch and scale your online business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Rocket, title: 'Launch Strategy', desc: 'Step-by-step guides to start your business' },
              { icon: BarChart3, title: 'Growth Hacking', desc: 'Proven tactics to scale rapidly' },
              { icon: DollarSign, title: 'Monetization', desc: 'Multiple revenue stream strategies' },
              { icon: Users, title: 'Customer Mastery', desc: 'Build loyal communities and customers' },
              { icon: Zap, title: 'Automation', desc: 'Tools and tactics to work smarter' },
              { icon: Award, title: 'Success Stories', desc: 'Learn from entrepreneurs who made it' }
            ].map((feature, idx) => (
              <div key={idx} className="group relative p-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-emerald-400/50 transition-all hover:shadow-xl hover:shadow-emerald-500/20">
                <feature.icon className="h-12 w-12 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Models Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Learn Any Business Model
            </h2>
            <p className="text-gray-300 text-lg">From side hustles to full-scale enterprises</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'E-Commerce', desc: 'Build your online store', icon: '🛍️' },
              { title: 'SaaS', desc: 'Create subscription software', icon: '⚙️' },
              { title: 'Content Creation', desc: 'Monetize your audience', icon: '📺' },
              { title: 'Affiliate Marketing', desc: 'Earn commissions smartly', icon: '🔗' },
              { title: 'Digital Products', desc: 'Sell courses and templates', icon: '📦' },
              { title: 'Consulting', desc: 'Package your expertise', icon: '💼' },
              { title: 'Dropshipping', desc: 'Launch with zero inventory', icon: '🚚' },
              { title: 'Freelancing', desc: 'Monetize your skills', icon: '💻' },
              { title: 'Agency', desc: 'Build a service empire', icon: '🏢' }
            ].map((model, idx) => (
              <div key={idx} className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-white/10 hover:border-emerald-400/50 transition-all p-8 cursor-pointer hover:shadow-xl hover:shadow-emerald-500/20`}>
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{model.icon}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-300 transition-colors">{model.title}</h3>
                  <p className="text-gray-400">{model.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-y border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Get Weekly Business Tips
          </h2>
          <p className="text-gray-300 mb-8">Actionable strategies and insights delivered every week. Build your business the smart way.</p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:border-emerald-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubscribed}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50"
            >
              {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Entrepreneurs Helped', value: '80K+', icon: Users },
              { label: 'Business Guides', value: '400+', icon: BookOpen },
              { label: 'Revenue Generated', value: '$50M+', icon: DollarSign },
              { label: 'Success Rate', value: '87%', icon: TrendingUp }
            ].map((stat, idx) => (
              <div key={idx} className="relative p-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-center group hover:border-emerald-400/50 transition-all">
                <stat.icon className="h-8 w-8 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Build Your Business Today
          </h2>
          <p className="text-gray-300 text-lg mb-8">Join thousands of successful entrepreneurs who built profitable online businesses with our guidance</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/articles" className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
              Start Reading
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-4 border-2 border-emerald-400/50 rounded-lg font-semibold text-lg hover:bg-emerald-400/10 transition-colors">
              Explore Features
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
