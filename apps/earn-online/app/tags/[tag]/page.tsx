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
    slug: 'freelancing-101',
    title: 'Freelancing 101: Your Complete Guide to Getting Started',
    excerpt: 'Learn how to launch your freelance career and attract your first clients.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    views: 2200,
    tags: ['freelancing', 'getting-started', 'income', 'work-from-home'],
    category: 'Freelancing',
  },
  {
    id: '2',
    slug: 'affiliate-marketing-income',
    title: 'Affiliate Marketing: Earn While You Sleep',
    excerpt: 'Complete guide to starting an affiliate business with zero investment.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    views: 3400,
    tags: ['affiliate-marketing', 'passive-income', 'marketing', 'business'],
    category: 'Passive Income',
  },
  {
    id: '3',
    slug: 'youtube-monetization',
    title: 'YouTube Monetization: Turning Views into Revenue',
    excerpt: 'Strategy and tips for maximizing YouTube revenue as a content creator.',
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    views: 2600,
    tags: ['youtube', 'content-creation', 'video', 'monetization'],
    category: 'Content',
  },
  {
    id: '4',
    slug: 'digital-products-guide',
    title: 'Creating Digital Products: Templates, Courses & More',
    excerpt: 'How to create and sell digital products for recurring revenue.',
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
    views: 1800,
    tags: ['digital-products', 'passive-income', 'business', 'courses'],
    category: 'Digital Products',
  },
  {
    id: '5',
    slug: 'remote-work-jobs',
    title: '25 Remote Jobs That Pay $50K+ Per Year',
    excerpt: 'Top paying remote positions and how to land them.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    views: 4200,
    tags: ['remote-work', 'jobs', 'income', 'work-from-home'],
    category: 'Remote Work',
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
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">No articles found with tag "{tag}"</p>
          <Link
            href="/blog"
            className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
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
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-8 mb-8">
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
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-emerald-400 hover:text-emerald-600'
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
              className="p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 transition text-center"
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
