'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';
import NewsletterSignup from '@zyperia/shared-ui/components/NewsletterSignup';

// Mock articles for preview (will be replaced with real data on May 1)
const mockArticles = [
  {
    id: '1',
    slug: 'bitcoin-beginners-guide',
    title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
    excerpt: 'Learn the fundamentals of Bitcoin, how wallets work, and how to make your first purchase safely.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
  },
  {
    id: '2',
    slug: 'ethereum-smart-contracts',
    title: 'Understanding Ethereum Smart Contracts: A Technical Deep Dive',
    excerpt: 'Explore how smart contracts work, their applications in DeFi, and security best practices.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
  },
  {
    id: '3',
    slug: 'defi-risks-explained',
    title: 'DeFi Risks Explained: Protect Your Crypto Investments',
    excerpt: 'A comprehensive guide to understanding impermanent loss, rug pulls, and other DeFi risks.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
  },
  {
    id: '4',
    slug: 'crypto-wallets-comparison',
    title: 'Best Crypto Wallets in 2026: Hardware vs Software vs Exchange',
    excerpt: 'Compare different wallet types and find the right solution for your security needs.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
  },
  {
    id: '5',
    slug: 'bitcoin-mining-explained',
    title: 'Bitcoin Mining in 2026: Is It Still Profitable?',
    excerpt: 'Understand how mining works, current profitability factors, and entry costs.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
  },
  {
    id: '6',
    slug: 'nft-guide-beyond-hype',
    title: 'NFTs Beyond the Hype: Real Use Cases in 2026',
    excerpt: 'Move past the speculation. Learn about legitimate NFT applications and communities.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
  },
];

export default function CryptoHome() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20">
        <div className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-700/50 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-purple-300">Updated Daily • Expert Reviewed</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Master Cryptocurrency
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Learn Bitcoin, Ethereum, DeFi, and blockchain technology from experts. Free, educational, and practical guides updated daily.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-105">
                Explore Articles
              </button>
              <button className="px-8 py-4 border border-purple-500 text-purple-300 hover:bg-purple-900/20 font-bold rounded-lg transition-all">
                Start Newsletter
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-gray-800">
              <div>
                <div className="text-3xl font-bold text-purple-400">500+</div>
                <div className="text-sm text-gray-400">Articles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">10K+</div>
                <div className="text-sm text-gray-400">Readers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">Updated</div>
                <div className="text-sm text-gray-400">Every Day</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section>
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Latest Articles</h2>
          <p className="text-gray-400">New guides published daily. Everything you need to understand crypto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArticles.map((article) => (
            <ArticleCard key={article.id} isDark {...article} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section>
        <NewsletterSignup isDark />
      </section>

      {/* E-E-A-T Section */}
      <section className="py-12 bg-gray-800/50 rounded-lg px-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">About This Site</h3>

          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-purple-400">Expertise:</strong> We cover cryptocurrency with 10+ years of combined experience in blockchain technology and digital finance.
            </p>

            <p>
              <strong className="text-blue-400">Authority:</strong> All articles are researched against official sources (CoinMarketCap, Bitcoin.org, Ethereum.org, official exchange documentation) and updated regularly.
            </p>

            <p>
              <strong className="text-cyan-400">Trustworthiness:</strong> We're transparent about affiliate relationships and include disclaimers. We don't provide financial advice—only educational information.
            </p>

            <p className="text-sm text-gray-500 border-t border-gray-700 pt-4">
              ⚠️ <strong>Disclaimer:</strong> This content is for educational purposes only. Cryptocurrency involves significant risk. Always do your own research and never invest more than you can afford to lose.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
