'use client';

import ArticleCard from './ArticleCard';

interface RecommendedArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  category?: string;
}

interface ArticleRecommendationsProps {
  title?: string;
  articles: RecommendedArticle[];
  isDark?: boolean;
  maxItems?: number;
  variant?: 'related' | 'recommended' | 'trending';
}

/**
 * Display article recommendations with different variants
 */
export default function ArticleRecommendations({
  title,
  articles,
  isDark = false,
  maxItems = 4,
  variant = 'recommended',
}: ArticleRecommendationsProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  const displayedArticles = articles.slice(0, maxItems);

  const getTitleAndIcon = () => {
    switch (variant) {
      case 'related':
        return { title: 'Related Articles', icon: '📌' };
      case 'trending':
        return { title: 'Trending Now', icon: '🔥' };
      case 'recommended':
      default:
        return { title: 'Recommended For You', icon: '⭐' };
    }
  };

  const { title: defaultTitle, icon } = getTitleAndIcon();

  return (
    <section
      className={`py-12 rounded-lg ${
        isDark ? 'bg-gray-800/30' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-3xl">{icon}</span>
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title || defaultTitle}
          </h2>
        </div>

        {variant === 'trending' ? (
          // Trending layout - horizontal cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.id} isDark={isDark} {...article} />
            ))}
          </div>
        ) : (
          // Related/Recommended layout - 3 columns
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.id} isDark={isDark} {...article} />
            ))}
          </div>
        )}

        {articles.length > maxItems && (
          <div className="text-center mt-8">
            <button
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              View All Recommendations →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
