'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3, Users, Rocket, Lock, Globe } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Rocket className="h-4 w-4" />
            <span className="text-sm font-semibold text-blue-400">Launching Soon</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
            Cryptocurrency Intelligence Unleashed
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Real-time market insights, AI-powered analysis, and predictive intelligence for crypto traders and investors. Never miss a market opportunity again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/articles" className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105">
              Explore Articles
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-4 border-2 border-blue-400/50 rounded-lg font-semibold text-lg hover:bg-blue-400/10 transition-colors">
              Learn More
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">500+</div>
              <div className="text-gray-400">Daily Articles</div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-gray-400">Market Intel</div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-400">AI-Powered</div>
              <div className="text-gray-400">Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-gray-300 text-lg">Everything you need to dominate the crypto market</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'Real-time Analytics', desc: 'Live price tracking and market trends with AI predictions' },
              { icon: BarChart3, title: 'Advanced Charts', desc: 'Professional-grade technical analysis tools' },
              { icon: Lock, title: 'Secure Data', desc: 'Bank-level encryption for your portfolio' },
              { icon: Globe, title: 'Global Markets', desc: 'Coverage of 10,000+ cryptocurrencies' },
              { icon: Zap, title: 'Instant Alerts', desc: 'Get notified of critical market movements' },
              { icon: Users, title: 'Community', desc: 'Connect with 100K+ traders and investors' }
            ].map((feature, idx) => (
              <div key={idx} className="group relative p-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-blue-400/50 transition-all hover:shadow-xl hover:shadow-blue-500/20">
                <feature.icon className="h-12 w-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Preview Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Premium Content
            </h2>
            <p className="text-gray-300 text-lg">Curated insights from industry experts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { category: 'Market Analysis', title: 'Bitcoin Halving Impact on Network Security', author: 'Sarah Chen', views: '12.5K' },
              { category: 'Trading Strategy', title: 'Advanced DeFi Yield Farming Techniques', author: 'Alex Rivera', views: '8.3K' },
              { category: 'Blockchain Tech', title: 'Layer 2 Solutions Explained', author: 'Dr. James Liu', views: '15.2K' },
              { category: 'Crypto News', title: 'Regulatory Updates: What You Need to Know', author: 'Emma Wilson', views: '9.7K' }
            ].map((article, idx) => (
              <article key={idx} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-blue-400/50 transition-all p-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-transparent transition-colors"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-blue-400 bg-blue-400/20 px-3 py-1 rounded-full">{article.category}</span>
                    <span className="text-xs text-gray-400">{article.views}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">{article.title}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-sm text-gray-400">by {article.author}</span>
                    <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/articles" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600/20 border border-blue-400/50 rounded-lg font-semibold text-blue-300 hover:bg-blue-600/30 transition-colors">
              Browse All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-y border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Stay Ahead of the Market
          </h2>
          <p className="text-gray-300 mb-8">Get daily crypto insights delivered to your inbox. Curated by experts, delivered with precision.</p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:border-blue-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubscribed}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50"
            >
              {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4">Never spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Active Traders', value: '45K+', icon: Users },
              { label: 'Market Coverage', value: '10K+', icon: Globe },
              { label: 'Daily Insights', value: '500+', icon: TrendingUp },
              { label: 'Success Rate', value: '94%', icon: Shield }
            ].map((stat, idx) => (
              <div key={idx} className="relative p-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-center group hover:border-blue-400/50 transition-all">
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ready to Trade Smarter?
          </h2>
          <p className="text-gray-300 text-lg mb-8">Join thousands of successful traders using ZYPERIA for real-time crypto intelligence</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/articles" className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105">
              Start Reading
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-4 border-2 border-blue-400/50 rounded-lg font-semibold text-lg hover:bg-blue-400/10 transition-colors">
              Explore Features
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
