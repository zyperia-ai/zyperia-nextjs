'use client'

import Link from 'next/link'
import { ArrowRight, Brain, Lightbulb, Search, Zap, Users, Target, Lock, BookOpen } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Brain className="h-4 w-4" />
            <span className="text-sm font-semibold text-purple-400">AI-Powered Intelligence</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text text-transparent">
            Intelligence You Can Trust
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Deep research, expert analysis, and actionable intelligence on technology, business, and markets. Curated by top analysts and powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/articles" className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
              Start Learning
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-4 border-2 border-purple-400/50 rounded-lg font-semibold text-lg hover:bg-purple-400/10 transition-colors">
              Learn More
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-sm">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-400">300+</div>
              <div className="text-gray-400">Expert Articles</div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-400">AI Analysis</div>
              <div className="text-gray-400">Every Article</div>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-400">100K+</div>
              <div className="text-gray-400">Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Research Excellence
            </h2>
            <p className="text-gray-300 text-lg">Everything you need for informed decision-making</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'AI Analysis', desc: 'Machine learning insights on market trends' },
              { icon: Search, title: 'Deep Research', desc: 'Comprehensive market and technology analysis' },
              { icon: Lightbulb, title: 'Expert Insights', desc: 'Perspectives from industry thought leaders' },
              { icon: BookOpen, title: 'Knowledge Base', desc: '1000+ articles on tech and business' },
              { icon: Zap, title: 'Daily Updates', desc: 'Fresh content every single day' },
              { icon: Users, title: 'Community', desc: 'Network with 50K+ knowledge seekers' }
            ].map((feature, idx) => (
              <div key={idx} className="group relative p-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-purple-400/50 transition-all hover:shadow-xl hover:shadow-purple-500/20">
                <feature.icon className="h-12 w-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Research Categories
            </h2>
            <p className="text-gray-300 text-lg">Explore knowledge across multiple domains</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Artificial Intelligence', articles: '45+', color: 'from-blue-600/20 to-purple-600/20' },
              { title: 'Business Strategy', articles: '38+', color: 'from-green-600/20 to-emerald-600/20' },
              { title: 'Technology Trends', articles: '52+', color: 'from-pink-600/20 to-rose-600/20' },
              { title: 'Market Analysis', articles: '41+', color: 'from-orange-600/20 to-red-600/20' },
              { title: 'Innovation', articles: '35+', color: 'from-cyan-600/20 to-blue-600/20' },
              { title: 'Global Economy', articles: '39+', color: 'from-violet-600/20 to-purple-600/20' }
            ].map((cat, idx) => (
              <div key={idx} className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${cat.color} border border-white/10 hover:border-purple-400/50 transition-all p-8 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20`}>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">{cat.title}</h3>
                  <p className="text-gray-400 mb-4">{cat.articles} articles</p>
                  <div className="flex items-center text-purple-400 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-semibold">Explore</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-y border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get Weekly Insights
          </h2>
          <p className="text-gray-300 mb-8">Curated research summaries delivered every week. Stay informed on the topics that matter most.</p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:border-purple-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubscribed}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50"
            >
              {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Active Readers', value: '100K+', icon: Users },
              { label: 'Research Articles', value: '1000+', icon: BookOpen },
              { label: 'Expert Writers', value: '150+', icon: Brain },
              { label: 'Knowledge Score', value: '98%', icon: Target }
            ].map((stat, idx) => (
              <div key={idx} className="relative p-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-center group hover:border-purple-400/50 transition-all">
                <stat.icon className="h-8 w-8 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Expand Your Knowledge Today
          </h2>
          <p className="text-gray-300 text-lg mb-8">Access thousands of research articles and expert insights on technology and business</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/articles" className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105">
              Start Reading
              <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="px-8 py-4 border-2 border-purple-400/50 rounded-lg font-semibold text-lg hover:bg-purple-400/10 transition-colors">
              Explore Features
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
