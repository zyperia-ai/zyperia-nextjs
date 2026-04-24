'use client';

import ArticleCard from './ArticleCard';

interface RelatedArticlesProps {
  currentSlug: string;
  articles: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    publishedAt: string;
    readingTime: number;
  }>;
  isDark?: boolean;
  maxItems?: number;
}

/**
 * Display related articles based on similarity
 * Filters out current article and shows top N matches
 */
export default function RelatedArticles({
  currentSlug,
  articles,
  isDark = false,
  maxItems = 3,
}: RelatedArticlesProps) {
  // Filter out current article and limit results
  const related = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, maxItems);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200 pt-8">
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((article) => (
          <ArticleCard key={article.id} isDark={isDark} {...article} />
        ))}
      </div>
    </section>
  );
}
