'use client';

import { useState } from 'react';
import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

const allArticles = [
  {
    id: '1',
    slug: 'zapier-automation-guide',
    title: 'Zapier for Beginners: Automate Your Workflow in 5 Minutes',
    excerpt: 'Connect your favorite apps without coding. Step-by-step guide to eliminating repetitive tasks.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 7,
    category: 'Automation',
  },
  {
    id: '2',
    slug: 'claude-vs-chatgpt',
    title: 'Claude vs ChatGPT: Which AI Tool Should You Use?',
    excerpt: 'Detailed comparison of features, pricing, and real-world use cases for each platform.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'AI Tools',
  },
  {
    id: '3',
    slug: 'ai-content-workflow',
    title: 'Building an AI Content Workflow: 10x Your Output',
    excerpt: 'Learn how to use AI tools to write better, faster, and more consistently.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    category: 'Content Creation',
  },
  {
    id: '4',
    slug: 'make-automation-advanced',
    title: 'Make.com Advanced Scenarios: Beyond Simple Automations',
    excerpt: 'Deep dive into complex workflows, data transformations, and multi-step automation.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
    category: 'Automation',
  },
  {
    id: '5',
    slug: 'ai-customer-service',
    title: 'AI-Powered Customer Service: Save 20 Hours Per Week',
    excerpt: 'Implement AI chatbots and automated responses without losing the human touch.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    category: 'AI Tools',
  },
  {
    id: '6',
    slug: 'business-intelligence-tools',
    title: 'Best Business Intelligence Tools for SMBs in 2026',
    excerpt: 'Data analysis platforms that are actually affordable and easy to use.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'Business Tools',
  },
];

const ARTICLES_PER_PAGE = 9;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = selectedCategory
    ? allArticles.filter((article) => article.category === selectedCategory)
    : allArticles;

  const categories = Array.from(new Set(allArticles.map((a) => a.category)));

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          All Guides
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Practical tutorials on AI tools, automation, and business optimization. New guides every week.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
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
                  ? 'bg-blue-600 text-white'
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
              <ArticleCard key={article.id} isDark={false} {...article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No guides found in this category.</p>
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
                  ? 'bg-blue-600 text-white'
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
