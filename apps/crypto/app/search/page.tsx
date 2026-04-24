'use client';

import { useState, useMemo } from 'react';
import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

// Mock all articles for search
const allArticles = [
  {
    id: '1',
    slug: 'bitcoin-beginners-guide',
    title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
    excerpt: 'Learn the fundamentals of Bitcoin, how wallets work, and how to make your first purchase safely.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    keywords: ['bitcoin', 'beginners', 'guide', 'how to'],
  },
  {
    id: '2',
    slug: 'ethereum-smart-contracts',
    title: 'Understanding Ethereum Smart Contracts: A Technical Deep Dive',
    excerpt: 'Explore how smart contracts work, their applications in DeFi, and security best practices.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
    keywords: ['ethereum', 'smart contracts', 'defi', 'technical'],
  },
  {
    id: '3',
    slug: 'defi-risks-explained',
    title: 'DeFi Risks Explained: Protect Your Crypto Investments',
    excerpt: 'A comprehensive guide to understanding impermanent loss, rug pulls, and other DeFi risks.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    keywords: ['defi', 'risks', 'security', 'protection'],
  },
  {
    id: '4',
    slug: 'crypto-wallets-comparison',
    title: 'Best Crypto Wallets in 2026: Hardware vs Software vs Exchange',
    excerpt: 'Compare different wallet types and find the right solution for your security needs.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    keywords: ['wallets', 'hardware', 'security', 'comparison'],
  },
  {
    id: '5',
    slug: 'bitcoin-mining-explained',
    title: 'Bitcoin Mining in 2026: Is It Still Profitable?',
    excerpt: 'Understand how mining works, current profitability factors, and entry costs.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    keywords: ['bitcoin', 'mining', 'profitable', 'how to'],
  },
  {
    id: '6',
    slug: 'nft-guide-beyond-hype',
    title: 'NFTs Beyond the Hype: Real Use Cases in 2026',
    excerpt: 'Move past the speculation. Learn about legitimate NFT applications and communities.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    keywords: ['nft', 'use cases', 'applications', 'guide'],
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();

    return allArticles.filter((article) => {
      const matchTitle = article.title.toLowerCase().includes(lowerQuery);
      const matchExcerpt = article.excerpt.toLowerCase().includes(lowerQuery);
      const matchKeywords = article.keywords.some((kw) => kw.includes(lowerQuery));

      return matchTitle || matchExcerpt || matchKeywords;
    });
  }, [query]);

  return (
    <div className="py-12">
      {/* Search Header */}
      <section className="max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Search Articles</h1>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, topic, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto">
        {query.trim() === '' ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Start typing to search our articles</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
              </h2>
              <p className="text-gray-600">
                for "{query}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} isDark {...article} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any articles matching "{query}"
            </p>

            {/* Suggestions */}
            <div>
              <p className="text-gray-700 font-semibold mb-4">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Bitcoin', 'Ethereum', 'DeFi', 'Wallets', 'Mining', 'NFT'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-4 py-2 bg-gray-100 hover:bg-purple-100 text-gray-800 hover:text-purple-700 rounded-full transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
