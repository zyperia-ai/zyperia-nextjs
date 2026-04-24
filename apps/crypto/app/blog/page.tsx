'use client';

import { useState } from 'react';
import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

const allArticles = [
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
    category: 'Wallets',
  },
  {
    id: '5',
    slug: 'bitcoin-mining-explained',
    title: 'Bitcoin Mining in 2026: Is It Still Profitable?',
    excerpt: 'Understand how mining works, current profitability factors, and entry costs.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    category: 'Bitcoin',
  },
  {
    id: '6',
    slug: 'nft-guide-beyond-hype',
    title: 'NFTs Beyond the Hype: Real Use Cases in 2026',
    excerpt: 'Move past the speculation. Learn about legitimate NFT applications and communities.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'NFT',
  },
];

const ARTICLES_PER_PAGE = 9;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter articles by category if selected
  const filteredArticles = selectedCategory
    ? allArticles.filter((article) => article.category === selectedCategory)
    : allArticles;

  // Get unique categories
  const categories = Array.from(new Set(allArticles.map((a) => a.category)));

  // Paginate
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          All Articles
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Expert guides on Bitcoin, Ethereum, DeFi, and everything cryptocurrency. Updated daily.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === null
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto mb-12">
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <ArticleCard key={article.id} isDark {...article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No articles found in this category.</p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="max-w-6xl mx-auto flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo(0, 0);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === page
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
