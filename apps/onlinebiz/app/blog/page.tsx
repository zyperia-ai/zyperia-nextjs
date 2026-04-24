'use client';

import { useState } from 'react';
import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

const allArticles = [
  {
    id: '1',
    slug: 'freelancing-first-1k',
    title: 'Freelancing 101: Earn Your First $1000 in 30 Days',
    excerpt: 'Step-by-step guide to finding clients, setting rates, and landing your first paid project.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    category: 'Freelancing',
  },
  {
    id: '2',
    slug: 'passive-income-2026',
    title: 'Passive Income Ideas That Actually Work in 2026',
    excerpt: 'Real strategies beyond the hype. Digital products, courses, and affiliate marketing that generate revenue.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    category: 'Passive Income',
  },
  {
    id: '3',
    slug: 'digital-products-guide',
    title: 'Create & Sell Digital Products: No Experience Needed',
    excerpt: 'Templates, courses, presets, ebooks. Learn what sells and how to launch your first product.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    category: 'Digital Products',
  },
  {
    id: '4',
    slug: 'affiliate-marketing-income',
    title: 'Affiliate Marketing: Realistic Income Expectations in 2026',
    excerpt: 'How much can you earn? Real numbers from successful affiliates and strategies that work.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'Affiliate Marketing',
  },
  {
    id: '5',
    slug: 'side-hustle-test-ideas',
    title: 'Testing Side Hustle Ideas: Framework to Find Your Winner',
    excerpt: 'How to validate ideas before investing time and money. Strategies from successful entrepreneurs.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    category: 'Side Hustles',
  },
  {
    id: '6',
    slug: 'scaling-to-5-figures',
    title: '5-Figure Income: The Path to $5000/Month',
    excerpt: 'Real case studies and step-by-step frameworks to scale your online income.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
    category: 'Scaling',
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
          All Strategies
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Real ways to earn money online. From freelancing to passive income, proven methods that work.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === null
                ? 'bg-green-600 text-white'
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
                  ? 'bg-green-600 text-white'
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
            <p className="text-gray-600 text-lg">No strategies found in this category.</p>
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
                  ? 'bg-green-600 text-white'
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
