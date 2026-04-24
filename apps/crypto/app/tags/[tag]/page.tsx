'use client';

import { useState, useMemo } from 'react';
import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';
import Link from 'next/link';

interface TagPageProps {
  params: {
    tag: string;
  };
}

// Mock data - tags extracted from articles
const allArticles = [
  {
    id: '1',
    slug: 'bitcoin-beginners-guide',
    title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
    excerpt: 'Learn the fundamentals of Bitcoin and how to get started with your first purchase.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    views: 2500,
    tags: ['bitcoin', 'beginners', 'getting-started', 'cryptocurrency'],
    category: 'Bitcoin',
  },
  {
    id: '2',
    slug: 'ethereum-smart-contracts',
    title: 'Understanding Ethereum Smart Contracts',
    excerpt: 'Deep dive into smart contracts and how they power decentralized applications.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
    views: 1800,
    tags: ['ethereum', 'smart-contracts', 'development', 'defi'],
    category: 'Ethereum',
  },
  {
    id: '3',
    slug: 'defi-yield-farming',
    title: 'DeFi Yield Farming: How to Generate Passive Income',
    excerpt: 'Learn how yield farming works and explore the best platforms for earning returns.',
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    views: 3200,
    tags: ['defi', 'yield-farming', 'passive-income', 'ethereum'],
    category: 'DeFi',
  },
  {
    id: '4',
    slug: 'crypto-wallets-comparison',
    title: 'Best Cryptocurrency Wallets: Hardware vs Software',
    excerpt: 'Comprehensive comparison of wallet types to help you store crypto safely.',
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    views: 2100,
    tags: ['wallets', 'security', 'storage', 'bitcoin', 'ethereum'],
    category: 'Wallets',
  },
  {
    id: '5',
    slug: 'bitcoin-mining-explained',
    title: 'Bitcoin Mining in 2026: Is It Still Profitable?',
    excerpt: 'Understand how mining works and whether it is profitable in 2026.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    views: 4100,
    tags: ['bitcoin', 'mining', 'profitability', 'hardware'],
    category: 'Bitcoin',
  },
  {
    id: '6',
    slug: 'nft-guide',
    title: 'NFTs Explained: From Creation to Trading',
    excerpt: 'Everything you need to know about NFTs and how to get started.',
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    views: 1600,
    tags: ['nft', 'ethereum', 'trading', 'digital-art'],
    category: 'NFT',
  },
  {
    id: '7',
    slug: 'crypto-security-best-practices',
    title: 'Crypto Security: Protecting Your Assets from Hackers',
    excerpt: 'Essential security practices every crypto holder should know.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    views: 2700,
    tags: ['security', 'wallets', 'best-practices', 'cryptocurrency'],
    category: 'Security',
  },
];

// Get all unique tags with article counts
const getTagStats = () => {
  const tagMap: Record<string, number> = {};
  allArticles.forEach((article) => {
    article.tags.forEach((tag) => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });
  return tagMap;
};

const decodedTag = (encodedTag: string) => {
  return decodeURIComponent(encodedTag).toLowerCase();
};

export default function TagPage({ params }: TagPageProps) {
  const tag = decodedTag(params.tag);

  const tagStats = getTagStats();

  // Filter articles by tag
  const articlesWithTag = useMemo(() => {
    return allArticles.filter((article) =>
      article.tags.map((t) => t.toLowerCase()).includes(tag)
    );
  }, [tag]);

  const allTags = Object.entries(tagStats)
    .map(([tagName, count]) => ({
      name: tagName,
      count,
      slug: encodeURIComponent(tagName),
    }))
    .sort((a, b) => b.count - a.count);

  if (articlesWithTag.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Tag: #{tag}</h1>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">No articles found with tag "{tag}"</p>
          <Link
            href="/blog"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Tag Header */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏷️</span>
            <h1 className="text-4xl font-bold text-gray-900">#{tag}</h1>
          </div>
          <p className="text-gray-600">
            {articlesWithTag.length} article{articlesWithTag.length !== 1 ? 's' : ''} tagged with{' '}
            <strong>#{tag}</strong>
          </p>
        </div>

        {/* Tag Cloud */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tags</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 15).map((t) => (
              <Link
                key={t.name}
                href={`/tags/${t.slug}`}
                className={`px-4 py-2 rounded-full border transition ${
                  t.name.toLowerCase() === tag
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                #{t.name}
                <span className="ml-2 text-sm opacity-70">({t.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {articlesWithTag
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          )
          .map((article) => (
            <ArticleCard key={article.id} isDark={false} {...article} />
          ))}
      </div>

      {/* All Tags Sidebar */}
      <div className="mt-16 pt-12 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">All Tags</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {allTags.map((t) => (
            <Link
              key={t.name}
              href={`/tags/${t.slug}`}
              className="p-3 rounded-lg bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition text-center"
            >
              <div className="font-semibold text-gray-900">#{t.name}</div>
              <div className="text-sm text-gray-500">{t.count} articles</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
