/**
 * Content Recommendations Engine
 * Analyzes performance and suggests optimization opportunities
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

export interface ContentRecommendation {
  type: 'high_demand' | 'expansion' | 'optimization' | 'rewrite' | 'archive';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  topicOrArticle: string;
  details: Record<string, any>;
}

/**
 * Generate recommendations based on performance data
 */
export async function generateRecommendations(appId: string): Promise<ContentRecommendation[]> {
  const recommendations: ContentRecommendation[] = [];

  try {
    // 1. Find high-performing topics that need expansion
    const { data: topArticles } = await getSupabase()
      .from('blog_posts')
      .select('title, views, engagement_score, app_id')
      .eq('app_id', appId)
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(10);

    if (topArticles && topArticles.length > 0) {
      // Recommend follow-up articles for top performers
      topArticles.slice(0, 3).forEach((article: any) => {
        recommendations.push({
          type: 'expansion',
          title: `Create follow-up to "${article.title}"`,
          description: `This article gets ${article.views} views. Create a sequel or deep-dive to capture more traffic.`,
          impact: 'high',
          effort: 'low',
          topicOrArticle: article.title,
          details: {
            views: article.views,
            engagementScore: article.engagement_score,
            suggestion: `"Advanced ${article.title}"`,
          },
        });
      });
    }

    // 2. Find underperforming articles that need rewriting
    const { data: underperformers } = await getSupabase()
      .from('blog_performance')
      .select('post_id, views, bounce_rate')
      .gt('bounce_rate', 0.7)
      .lt('views', 50)
      .order('bounce_rate', { ascending: false })
      .limit(5);

    if (underperformers && underperformers.length > 0) {
      for (const article of underperformers.slice(0, 2)) {
        const { data: articleData } = await getSupabase()
          .from('blog_posts')
          .select('title')
          .eq('id', article.post_id)
          .limit(1);

        if (articleData && articleData[0]) {
          recommendations.push({
            type: 'optimization',
            title: `Rewrite "${articleData[0].title}"`,
            description: `High bounce rate (${Math.round(article.bounce_rate * 100)}%) suggests clarity issues. Rewrite intro and structure.`,
            impact: 'medium',
            effort: 'medium',
            topicOrArticle: articleData[0].title,
            details: {
              bounceRate: article.bounce_rate,
              views: article.views,
              suggestion: 'Improve clarity, add examples, better formatting',
            },
          });
        }
      }
    }

    // 3. Identify trending topics from competitive analysis
    const { data: trendingGaps } = await getSupabase()
      .from('content_research')
      .select('content_gaps, topic')
      .eq('app_id', appId)
      .eq('research_type', 'competitive_analysis')
      .order('analyzed_at', { ascending: false })
      .limit(5);

    if (trendingGaps && trendingGaps.length > 0) {
      trendingGaps.forEach((research: any) => {
        if (research.content_gaps && research.content_gaps.length > 0) {
          recommendations.push({
            type: 'high_demand',
            title: `Address content gap: "${research.content_gaps[0]}"`,
            description: `Competitors are missing this angle. High opportunity for ranking.`,
            impact: 'high',
            effort: 'medium',
            topicOrArticle: research.topic,
            details: {
              topic: research.topic,
              gap: research.content_gaps[0],
              suggestion: `Create article specifically about "${research.content_gaps[0]}"`,
            },
          });
        }
      });
    }

    // 4. Find archive candidates (very low views after 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: archiveCandidates } = await getSupabase()
      .from('blog_posts')
      .select('id, title, views')
      .eq('app_id', appId)
      .eq('status', 'published')
      .lt('published_at', thirtyDaysAgo.toISOString())
      .lt('views', 10)
      .limit(3);

    if (archiveCandidates && archiveCandidates.length > 0) {
      archiveCandidates.forEach((article: any) => {
        recommendations.push({
          type: 'archive',
          title: `Consider archiving "${article.title}"`,
          description: `After 30 days, still only ${article.views} views. Consider rewriting or archiving.`,
          impact: 'low',
          effort: 'low',
          topicOrArticle: article.title,
          details: {
            views: article.views,
            daysPublished: 30,
            suggestion: 'Rewrite with better keywords or archive and move topic to backlog',
          },
        });
      });
    }

    // 5. Recommend content mix rebalancing
    const { data: allArticles } = await getSupabase()
      .from('blog_posts')
      .select('generation_approach, views')
      .eq('app_id', appId)
      .eq('status', 'published');

    if (allArticles && allArticles.length > 10) {
      const approaches = {
        original: { count: 0, totalViews: 0 },
        transformed: { count: 0, totalViews: 0 },
        aggregated: { count: 0, totalViews: 0 },
      };

      allArticles.forEach((a: any) => {
        const approach = a.generation_approach || 'unknown';
        if (approach in approaches) {
          approaches[approach as keyof typeof approaches].count++;
          approaches[approach as keyof typeof approaches].totalViews += a.views || 0;
        }
      });

      // Find underperforming approach
      let lowestApproach = 'original';
      let lowestAvgViews = Infinity;

      Object.entries(approaches).forEach(([approach, stats]: [string, any]) => {
        if (stats.count > 0) {
          const avgViews = stats.totalViews / stats.count;
          if (avgViews < lowestAvgViews) {
            lowestAvgViews = avgViews;
            lowestApproach = approach;
          }
        }
      });

      if (lowestAvgViews < 50) {
        recommendations.push({
          type: 'optimization',
          title: `Rebalance content mix - boost ${lowestApproach} content quality`,
          description: `${lowestApproach} articles average only ${Math.round(lowestAvgViews)} views. Consider improving prompts or increasing quality.`,
          impact: 'medium',
          effort: 'medium',
          topicOrArticle: lowestApproach,
          details: {
            approach: lowestApproach,
            avgViews: Math.round(lowestAvgViews),
            suggestion: 'Adjust generation prompts or increase research depth',
          },
        });
      }
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
  }

  return recommendations.sort((a, b) => {
    // Sort by impact (high first) then effort (low first)
    const impactOrder = { high: 0, medium: 1, low: 2 };
    const effortOrder = { low: 0, medium: 1, high: 2 };

    if (impactOrder[a.impact] !== impactOrder[b.impact]) {
      return impactOrder[a.impact] - impactOrder[b.impact];
    }
    return effortOrder[a.effort] - effortOrder[b.effort];
  });
}

/**
 * Get quick stats on what to do next
 */
export async function getQuickInsights(appId: string): Promise<Record<string, any>> {
  try {
    const recommendations = await generateRecommendations(appId);

    // Count by type
    const byType: Record<string, number> = {};
    recommendations.forEach((r) => {
      byType[r.type] = (byType[r.type] || 0) + 1;
    });

    // High impact items
    const highImpact = recommendations.filter((r) => r.impact === 'high').length;
    const easyWins = recommendations.filter((r) => r.effort === 'low' && r.impact === 'high').length;

    return {
      totalRecommendations: recommendations.length,
      byType,
      highImpactCount: highImpact,
      easyWinsCount: easyWins,
      topRecommendation: recommendations[0] || null,
      recommendations: recommendations.slice(0, 5),
    };
  } catch (error) {
    console.error('Error getting quick insights:', error);
    return {};
  }
}

/**
 * Suggest next topic to write about
 */
export async function suggestNextTopic(appId: string): Promise<string | null> {
  try {
    const recommendations = await generateRecommendations(appId);

    // Find highest impact, lowest effort recommendation
    const topRecommendation = recommendations.find(
      (r) => r.impact === 'high' && r.effort === 'low'
    ) || recommendations.find((r) => r.impact === 'high') || recommendations[0];

    return topRecommendation?.topicOrArticle || null;
  } catch (error) {
    console.error('Error suggesting next topic:', error);
    return null;
  }
}

