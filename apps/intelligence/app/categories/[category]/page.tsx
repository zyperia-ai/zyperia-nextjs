'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const articlesByCategory: Record<string, any[]> = {
  'ai-tools': [
    {
      id: '2',
      slug: 'claude-vs-chatgpt',
      title: 'Claude vs ChatGPT: Which AI Tool Should You Use?',
      excerpt: 'Detailed comparison of features, pricing, and real-world use cases for each platform.',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 9,
    },
  ],
  automation: [
    {
      id: '1',
      slug: 'zapier-automation-guide',
      title: 'Zapier for Beginners: Automate Your Workflow in 5 Minutes',
      excerpt: 'Connect your favorite apps without coding. Step-by-step guide to eliminating repetitive tasks.',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 7,
    },
    {
      id: '4',
      slug: 'make-automation-advanced',
      title: 'Make.com Advanced Scenarios: Beyond Simple Automations',
      excerpt: 'Deep dive into complex workflows, data transformations, and multi-step automation.',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 12,
    },
  ],
  'content-creation': [
    {
      id: '3',
      slug: 'ai-content-workflow',
      title: 'Building an AI Content Workflow: 10x Your Output',
      excerpt: 'Learn how to use AI tools to write better, faster, and more consistently.',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 11,
    },
  ],
};

const categoryInfo: Record<string, { emoji: string; description: string }> = {
  'ai-tools': {
    emoji: '🤖',
    description: 'Guides on Claude, ChatGPT, Gemini, and other AI platforms.',
  },
  automation: {
    emoji: '⚙️',
    description: 'Zapier, Make, and other automation platform tutorials.',
  },
  'content-creation': {
    emoji: '✍️',
    description: 'Using AI to create content faster and better.',
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
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View All Guides
          </a>
        </section>
      )}

      {/* Browse Other Categories */}
      <section className="max-w-4xl mx-auto mt-16 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(categoryInfo).map(([slug, { emoji }]) => (
            <a
              key={slug}
              href={`/categories/${slug}`}
              className={`p-4 rounded-lg text-center transition ${
                slug === categorySlug
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-50 border border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div
                className={`font-semibold ${slug === categorySlug ? 'text-blue-700' : 'text-gray-900'}`}
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
