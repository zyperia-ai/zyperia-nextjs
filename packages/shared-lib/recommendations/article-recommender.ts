/**
 * Intelligent article recommendation engine
 * Suggests articles based on user behavior, content similarity, and popularity
 */

export interface ArticleData {
  id: string;
  slug: string;
  title: string;
  category: string;
  tags: string[];
  views: number;
  engagement_score: number;
  excerpt: string;
  publishedAt: string;
}

export interface RecommendationScore {
  articleId: string;
  score: number;
  reasons: string[];
}

/**
 * Get recommended articles for a user based on current article
 */
export function getRecommendations(
  currentArticleId: string,
  currentArticleCategory: string,
  allArticles: ArticleData[],
  limit: number = 5
): ArticleData[] {
  // Filter out current article
  const candidates = allArticles.filter((a) => a.id !== currentArticleId);

  // Score each article
  const scored = candidates.map((article) => {
    const score = calculateRecommendationScore(
      article,
      currentArticleCategory,
      allArticles
    );
    return { article, score };
  });

  // Sort by score and limit
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}

/**
 * Calculate recommendation score for an article
 * Factors: category match, engagement, popularity, recency
 */
function calculateRecommendationScore(
  article: ArticleData,
  currentCategory: string,
  allArticles: ArticleData[]
): number {
  let score = 0;

  // 1. Category match (40 points max)
  if (article.category === currentCategory) {
    score += 40;
  }

  // 2. Engagement score (30 points max)
  const avgEngagement =
    allArticles.reduce((sum, a) => sum + a.engagement_score, 0) /
    allArticles.length;
  const engagementScore =
    (article.engagement_score / (avgEngagement * 2)) * 30;
  score += Math.min(engagementScore, 30);

  // 3. Popularity (20 points max)
  const avgViews =
    allArticles.reduce((sum, a) => sum + a.views, 0) / allArticles.length;
  const popularityScore = (article.views / (avgViews * 2)) * 20;
  score += Math.min(popularityScore, 20);

  // 4. Recency (10 points max)
  const daysSincePublish =
    (Date.now() - new Date(article.publishedAt).getTime()) /
    (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(10 - daysSincePublish / 100, 0);
  score += recencyScore;

  return score;
}

/**
 * Get trending articles (popular recently)
 */
export function getTrendingArticles(
  allArticles: ArticleData[],
  days: number = 7,
  limit: number = 5
): ArticleData[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return allArticles
    .filter((a) => new Date(a.publishedAt) > cutoffDate)
    .sort((a, b) => {
      // Weight: 70% views, 30% engagement
      const scoreA = a.views * 0.7 + a.engagement_score * 100 * 0.3;
      const scoreB = b.views * 0.7 + b.engagement_score * 100 * 0.3;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/**
 * Get similar articles based on tags/content
 */
export function getSimilarArticles(
  currentArticle: ArticleData,
  allArticles: ArticleData[],
  limit: number = 5
): ArticleData[] {
  const candidates = allArticles.filter((a) => a.id !== currentArticle.id);

  const scored = candidates.map((article) => {
    let similarityScore = 0;

    // Category match
    if (article.category === currentArticle.category) {
      similarityScore += 40;
    }

    // Tag overlap
    const commonTags = article.tags.filter((tag) =>
      currentArticle.tags.includes(tag)
    ).length;
    similarityScore += commonTags * 15;

    // Title keyword overlap
    const currentWords = currentArticle.title.toLowerCase().split(' ');
    const articleWords = article.title.toLowerCase().split(' ');
    const commonWords = articleWords.filter((word) =>
      currentWords.includes(word)
    ).length;
    similarityScore += commonWords * 5;

    return { article, score: similarityScore };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}

/**
 * Get personalized recommendations based on reading history
 */
export function getPersonalizedRecommendations(
  readingHistory: string[], // Array of article IDs
  allArticles: ArticleData[],
  limit: number = 5
): ArticleData[] {
  // Get categories user has read most
  const readArticles = allArticles.filter((a) =>
    readingHistory.includes(a.id)
  );

  const categoryFrequency: Record<string, number> = {};
  readArticles.forEach((a) => {
    categoryFrequency[a.category] = (categoryFrequency[a.category] || 0) + 1;
  });

  // Find preferred categories
  const preferredCategories = Object.entries(categoryFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0]);

  // Recommend from preferred categories
  const candidates = allArticles.filter(
    (a) =>
      !readingHistory.includes(a.id) &&
      preferredCategories.includes(a.category)
  );

  return candidates
    .sort((a, b) => b.engagement_score - a.engagement_score)
    .slice(0, limit);
}
