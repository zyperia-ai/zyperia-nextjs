'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const articlesByCategory: Record<string, any[]> = {
  freelancing: [
    {
      id: '1',
      slug: 'freelancing-first-1k',
      title: 'Freelancing 101: Earn Your First $1000 in 30 Days',
      excerpt: 'Step-by-step guide to finding clients, setting rates, and landing your first paid project.',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 8,
    },
  ],
  'passive-income': [
    {
      id: '2',
      slug: 'passive-income-2026',
      title: 'Passive Income Ideas That Actually Work in 2026',
      excerpt: 'Real strategies beyond the hype. Digital products, courses, and affiliate marketing that generate revenue.',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 11,
    },
  ],
  'digital-products': [
    {
      id: '3',
      slug: 'digital-products-guide',
      title: 'Create & Sell Digital Products: No Experience Needed',
      excerpt: 'Templates, courses, presets, ebooks. Learn what sells and how to launch your first product.',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 10,
    },
  ],
  'side-hustles': [
    {
      id: '5',
      slug: 'side-hustle-test-ideas',
      title: 'Testing Side Hustle Ideas: Framework to Find Your Winner',
      excerpt: 'How to validate ideas before investing time and money. Strategies from successful entrepreneurs.',
      publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 8,
    },
  ],
};

const categoryInfo: Record<string, { emoji: string; description: string }> = {
  freelancing: {
    emoji: '💼',
    description: 'Start freelancing and earn money from your skills.',
  },
  'passive-income': {
    emoji: '💰',
    description: 'Create income streams that work while you sleep.',
  },
  'digital-products': {
    emoji: '📦',
    description: 'Create and sell digital products online.',
  },
  'side-hustles': {
    emoji: '🚀',
    description: 'Test and scale side business ideas.',
  },
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.category.toLowerCase();
  const articles = articlesByCategory[categorySlug] || [];
  const info = categoryInfo[categorySlug];

  const categoryName = params.category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (!info) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, we couldn't find the category you're looking for.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="py-12">
      {/* Category Header */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="mb-4 text-5xl">{info.emoji}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{categoryName}</h1>
        <p className="text-xl text-gray-600">{info.description}</p>
      </section>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {articles.length} {articles.length === 1 ? 'Guide' : 'Guides'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} isDark={false} {...article} />
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-6">No guides found in this category yet.</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View All Guides
          </a>
        </section>
      )}

      {/* Browse Other Categories */}
      <section className="max-w-4xl mx-auto mt-16 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryInfo).map(([slug, { emoji }]) => (
            <a
              key={slug}
              href={`/categories/${slug}`}
              className={`p-4 rounded-lg text-center transition ${
                slug === categorySlug
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-50 border border-gray-200 hover:border-green-500'
              }`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div
                className={`font-semibold text-sm ${
                  slug === categorySlug ? 'text-green-700' : 'text-gray-900'
                }`}
              >
                {slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
