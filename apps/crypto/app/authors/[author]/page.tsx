'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

interface AuthorPageProps {
  params: {
    author: string;
  };
}

// Mock author data
const authorProfiles: Record<string, any> = {
  'crypto-expert': {
    name: 'Crypto Expert',
    bio: '12+ years of cryptocurrency experience. Bitcoin advocate since 2012. Former institutional trader.',
    avatar: '🧑‍💼',
    expertise: ['Bitcoin', 'Trading', 'Security', 'Wallets'],
    articles: [
      {
        id: '1',
        slug: 'bitcoin-beginners-guide',
        title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
        excerpt: 'Learn the fundamentals of Bitcoin...',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        readingTime: 8,
      },
      {
        id: '5',
        slug: 'bitcoin-mining-explained',
        title: 'Bitcoin Mining in 2026: Is It Still Profitable?',
        excerpt: 'Understand how mining works...',
        publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        readingTime: 11,
      },
    ],
    stats: {
      articlesPublished: 12,
      totalViews: 15000,
      totalReads: 8500,
      avgEngagement: 0.78,
    },
  },
};

export default function AuthorPage({ params }: AuthorPageProps) {
  const author = authorProfiles[params.author];

  if (!author) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Author Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, we couldn't find this author's profile.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="py-12">
      {/* Author Profile Header */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 text-white">
          <div className="flex items-start gap-6">
            <div className="text-7xl flex-shrink-0">{author.avatar}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{author.name}</h1>
              <p className="text-gray-300 mb-4">{author.bio}</p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {author.expertise.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-500/30 border border-purple-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-2xl font-bold">{author.stats.articlesPublished}</p>
                  <p className="text-sm text-gray-300">Articles</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(author.stats.totalViews / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-gray-300">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(author.stats.totalReads / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-gray-300">Reads</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {(author.stats.avgEngagement * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-300">Engagement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author's Articles */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Latest Articles by {author.name}
        </h2>

        {author.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {author.articles.map((article: any) => (
              <ArticleCard key={article.id} isDark {...article} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-12">No articles published yet.</p>
        )}

        {/* Follow Author CTA */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h3>
          <p className="text-gray-600 mb-6">
            Subscribe to get notified when {author.name} publishes new articles
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
