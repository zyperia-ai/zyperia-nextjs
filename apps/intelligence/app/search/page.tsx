'use client';

import { useState, useMemo } from 'react';
import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

const allArticles = [
  {
    id: '1',
    slug: 'zapier-automation-guide',
    title: 'Zapier for Beginners: Automate Your Workflow in 5 Minutes',
    excerpt: 'Connect your favorite apps without coding. Step-by-step guide to eliminating repetitive tasks.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 7,
    keywords: ['zapier', 'automation', 'workflow', 'tutorial'],
  },
  {
    id: '2',
    slug: 'claude-vs-chatgpt',
    title: 'Claude vs ChatGPT: Which AI Tool Should You Use?',
    excerpt: 'Detailed comparison of features, pricing, and real-world use cases for each platform.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    keywords: ['claude', 'chatgpt', 'comparison', 'ai'],
  },
  {
    id: '3',
    slug: 'ai-content-workflow',
    title: 'Building an AI Content Workflow: 10x Your Output',
    excerpt: 'Learn how to use AI tools to write better, faster, and more consistently.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    keywords: ['ai', 'content', 'workflow', 'writing'],
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Search Guides</h1>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by topic, tool, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
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
            <p className="text-gray-600 text-lg">Start typing to search our guides</p>
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
            <p className="text-gray-600 mb-6">We couldn't find any guides matching "{query}"</p>

            {/* Suggestions */}
            <div>
              <p className="text-gray-700 font-semibold mb-4">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Zapier', 'Claude', 'ChatGPT', 'Automation', 'Content', 'AI'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-700 rounded-full transition"
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
