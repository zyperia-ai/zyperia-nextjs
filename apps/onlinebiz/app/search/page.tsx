'use client';

import { useState, useMemo } from 'react';
import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

const allArticles = [
  {
    id: '1',
    slug: 'freelancing-first-1k',
    title: 'Freelancing 101: Earn Your First $1000 in 30 Days',
    excerpt: 'Step-by-step guide to finding clients, setting rates, and landing your first paid project.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    keywords: ['freelancing', 'earn', 'clients', '1000'],
  },
  {
    id: '2',
    slug: 'passive-income-2026',
    title: 'Passive Income Ideas That Actually Work in 2026',
    excerpt: 'Real strategies beyond the hype. Digital products, courses, and affiliate marketing that generate revenue.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    keywords: ['passive income', 'digital products', 'affiliate'],
  },
  {
    id: '3',
    slug: 'digital-products-guide',
    title: 'Create & Sell Digital Products: No Experience Needed',
    excerpt: 'Templates, courses, presets, ebooks. Learn what sells and how to launch your first product.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    keywords: ['digital products', 'courses', 'templates', 'create'],
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Search Strategies</h1>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by income method, skill, or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
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
            <p className="text-gray-600 text-lg">Start typing to search our strategies</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
              </h2>
              <p className="text-gray-600">for "{query}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} isDark={false} {...article} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find any strategies matching "{query}"</p>

            {/* Suggestions */}
            <div>
              <p className="text-gray-700 font-semibold mb-4">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Freelancing', 'Passive Income', 'Digital Products', 'Affiliate', 'Courses', 'Money'].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-4 py-2 bg-gray-100 hover:bg-green-100 text-gray-800 hover:text-green-700 rounded-full transition"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
