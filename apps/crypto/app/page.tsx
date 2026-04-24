'use client';

import { useState } from 'react';
import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';
import NewsletterSignup from '@zyperia/shared-ui/components/NewsletterSignup';

// Mock articles for preview
const mockArticles = [
  {
    id: '1',
    slug: 'bitcoin-beginners-guide',
    title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
    excerpt: 'Learn the fundamentals of Bitcoin, how wallets work, and how to make your first purchase safely.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    category: 'Bitcoin',
  },
  {
    id: '2',
    slug: 'ethereum-smart-contracts',
    title: 'Understanding Ethereum Smart Contracts: A Technical Deep Dive',
    excerpt: 'Explore how smart contracts work, their applications in DeFi, and security best practices.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
    category: 'Ethereum',
  },
  {
    id: '3',
    slug: 'defi-risks-explained',
    title: 'DeFi Risks Explained: Protect Your Crypto Investments',
    excerpt: 'A comprehensive guide to understanding impermanent loss, rug pulls, and other DeFi risks.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    category: 'DeFi',
  },
  {
    id: '4',
    slug: 'crypto-wallets-comparison',
    title: 'Best Crypto Wallets in 2026: Hardware vs Software vs Exchange',
    excerpt: 'Compare different wallet types and find the right solution for your security needs.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'Security',
  },
  {
    id: '5',
    slug: 'bitcoin-mining-explained',
    title: 'Bitcoin Mining in 2026: Is It Still Profitable?',
    excerpt: 'Understand how mining works, current profitability factors, and entry costs.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    category: 'Mining',
  },
  {
    id: '6',
    slug: 'nft-guide-beyond-hype',
    title: 'NFTs Beyond the Hype: Real Use Cases in 2026',
    excerpt: 'Move past the speculation. Learn about legitimate NFT applications and communities.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'NFTs',
  },
];

export default function CryptoHome() {
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-20">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[90vh] sm:min-h-screen flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-amber-400 via-blue-500 to-cyan-500 opacity-80"
          style={{
            animation: 'gradientShift 8s ease infinite',
            backgroundSize: '200% 200%',
          }}
        />

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-slate-950/40" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/50 rounded-full px-4 py-2 w-fit">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-sm text-amber-300">Updated Daily • Expert Reviewed</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                Master <span className="bg-gradient-to-r from-amber-300 to-blue-400 bg-clip-text text-transparent">Cryptocurrency</span> in 2026
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl">
                Expert guides on Bitcoin, Ethereum, DeFi, trading, and blockchain security. Learn from real data, not hype.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Explore Articles
                </button>
                <button className="px-8 py-4 border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 font-bold rounded-lg transition-all">
                  Get Updates
                </button>
              </div>

              {/* Authority signals */}
              <div className="pt-6 border-t border-slate-700/50 space-y-2">
                <p className="text-sm text-slate-400">
                  ✓ 12+ Years Crypto Expertise • ✓ Daily Updates • ✓ 100+ Articles
                </p>
              </div>
            </div>

            {/* Right: Visual (animated chart placeholder) */}
            <div className="hidden lg:flex items-center justify-center h-96">
              <div className="relative w-full h-full">
                {/* Animated chart bars */}
                <div className="absolute inset-0 flex items-end justify-center gap-4 px-8">
                  {[30, 45, 60, 75, 90, 85, 70, 65].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-amber-500 to-blue-500 rounded-t-lg opacity-70 hover:opacity-100 transition-opacity"
                      style={{
                        height: `${height}%`,
                        animation: `chartBounce 2s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
                {/* Chart labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 px-8 pb-20">
                  {['BTC', 'ETH', 'DeFi', 'Layer2', 'Stake', 'Smart', 'NFT', 'Web3'].map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS animations */}
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes chartBounce {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.1); }
          }
        `}</style>
      </section>

      {/* ===================== TRUST SECTION ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Trust item 1 */}
          <div className="bg-slate-900/50 border border-amber-500/20 rounded-lg p-8 hover:border-amber-500/50 transition-all">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-white mb-3">12+ Years Expertise</h3>
            <p className="text-slate-400">
              Built on real experience in crypto markets, not theoretical knowledge.
            </p>
          </div>

          {/* Trust item 2 */}
          <div className="bg-slate-900/50 border border-blue-500/20 rounded-lg p-8 hover:border-blue-500/50 transition-all">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-3">Security First</h3>
            <p className="text-slate-400">
              Only safe, verified practices. No hype. No shills. Just facts.
            </p>
          </div>

          {/* Trust item 3 */}
          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-8 hover:border-cyan-500/50 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-3">Data Driven</h3>
            <p className="text-slate-400">
              Facts from official sources: CoinMarketCap, Exchanges, Blockchain.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED ARTICLES ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Section header */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Featured Articles</h2>
            <p className="text-lg text-slate-300 max-w-2xl">
              Expert guides and in-depth analysis, updated daily. Start learning with our most popular content.
            </p>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockArticles.map((article) => (
              <div key={article.id} className="group">
                {/* Article card with enhanced styling */}
                <div className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-lg overflow-hidden transition-all hover:shadow-xl">
                  {/* Image placeholder with category gradient */}
                  <div className="h-48 bg-gradient-to-br from-amber-500/20 to-blue-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl opacity-30">₿</div>
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">
                      {article.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-amber-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-2">{article.excerpt}</p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-700/50">
                      <span>📖 {article.readingTime} min read</span>
                      <span>📅 {new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>

                    {/* CTA */}
                    <button className="w-full mt-4 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 text-amber-300 font-semibold rounded-lg transition-all text-sm">
                      Read Article →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== EMAIL SIGNUP ===================== */}
      <section className="bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-cyan-500/20 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-white">
                Get Daily <span className="text-amber-400">Crypto Insights</span>
              </h2>
              <p className="text-lg text-slate-300">
                Join 5,000+ readers. One email per day. No spam. Only the best content.
              </p>
            </div>

            {/* Newsletter form */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-lg transition-all hover:shadow-lg whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-slate-400">✓ No spam • ✓ Unsubscribe anytime • ✓ Expert curated</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== COMPARISON SECTION ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Why Choose ZYPERIA?</h2>
            <p className="text-lg text-slate-300">vs. Other Crypto Education Sites</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real Experts',
                vs: 'Not ChatGPT Regurgitated',
                description: 'Knowledge from 12+ years in crypto markets',
              },
              {
                title: 'Security First',
                vs: 'Not Hype-Driven',
                description: 'Focus on safety and verified practices',
              },
              {
                title: 'Actionable Tips',
                vs: 'Not Theory Only',
                description: 'Practical guides you can implement today',
              },
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-amber-400">{item.title}</h3>
                    <p className="text-sm text-slate-400">vs. {item.vs}</p>
                    <p className="text-base text-slate-300">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BOTTOM CTA ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Learn Crypto?</h2>
          <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-block">
            Start Reading Articles
          </button>
        </div>
      </section>
    </div>
  );
}
