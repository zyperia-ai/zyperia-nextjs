/**
 * Detailed Performance Analytics API
 * Provides in-depth metrics for each blog
 * Usage: GET /api/analytics/performance?appId=crypto&days=30
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

interface PerformanceMetrics {
  appId: string;
  period: {
    days: number;
    from: string;
    to: string;
  };
  articles: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  traffic: {
    totalViews: number;
    avgViewsPerArticle: number;
    avgTimeOnPage: number;
    avgBounceRate: number;
  };
  revenue: {
    totalAdSenseRevenue: number;
    totalAffiliateClicks: number;
    estimatedAffiliateRevenue: number;
    combinedRevenue: number;
  };
  contentQuality: {
    avgPlagiarismScore: number;
    avgEngagementScore: number;
    articlesWithPlagiarismIssues: number;
  };
  topPerformers: Array<{
    title: string;
    views: number;
    approach: string;
    bounceRate: number;
    engagementScore: number;
  }>;
  approachComparison: Record<
    string,
    {
      count: number;
      totalViews: number;
      avgViews: number;
      totalEngagement: number;
      avgEngagement: number;
    }
  >;
  trends: {
    viewsTrend: 'up' | 'down' | 'stable';
    viewsChangePercent: number;
    engagementTrend: 'up' | 'down' | 'stable';
    publishingVelocity: number; // articles per day
  };
  recommendations: string[];
}

async function getPerformanceMetrics(appId: string, days: number = 30): Promise<PerformanceMetrics> {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - days);

  const midpoint = new Date(from);
  midpoint.setDate(midpoint.getDate() + Math.floor(days / 2));

  try {
    // Article counts
    const { count: totalCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('app_id', appId);

    const { count: publishedCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('app_id', appId)
      .eq('status', 'published');

    const { count: draftCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('app_id', appId)
      .eq('status', 'draft');

    const { count: archivedCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('app_id', appId)
      .eq('status', 'archived');

    // Traffic metrics
    const { data: performanceData } = await supabase
      .from('blog_performance')
      .select('*')
      .gte('date', from.toISOString().split('T')[0]);

    const trafficMetrics = calculateTrafficMetrics(performanceData || []);

    // Content quality
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('plagiarism_score, engagement_score, generation_approach, views')
      .eq('app_id', appId)
      .eq('status', 'published');

    const qualityMetrics = calculateQualityMetrics(articles || []);

    // Top performers
    const topPerformers = (articles || [])
      .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
      .map((a: any) => ({
        title: '', // Would need to fetch from blog_posts
        views: a.views || 0,
        approach: a.generation_approach || 'unknown',
        bounceRate: 0, // Would need to calculate from performance data
        engagementScore: a.engagement_score || 0,
      }));

    // Approach comparison
    const approachComparison = calculateApproachComparison(articles || []);

    // Trends
    const {
      data: earlyData,
    } = await supabase
      .from('blog_performance')
      .select('views')
      .gte('date', from.toISOString().split('T')[0])
      .lt('date', midpoint.toISOString().split('T')[0]);

    const { data: lateData } = await supabase
      .from('blog_performance')
      .select('views')
      .gte('date', midpoint.toISOString().split('T')[0]);

    const earlyViews = earlyData?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) || 0;
    const lateViews = lateData?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) || 0;
    const viewsChangePercent = earlyViews > 0 ? ((lateViews - earlyViews) / earlyViews) * 100 : 0;
    const viewsTrend = viewsChangePercent > 5 ? 'up' : viewsChangePercent < -5 ? 'down' : 'stable';

    const publishedInPeriod = (publishedCount || 0);
    const publishingVelocity = publishedInPeriod / days;

    // Recommendations
    const recommendations = generateRecommendations(qualityMetrics, trafficMetrics, approachComparison);

    return {
      appId,
      period: {
        days,
        from: from.toISOString().split('T')[0],
        to: now.toISOString().split('T')[0],
      },
      articles: {
        total: totalCount || 0,
        published: publishedCount || 0,
        draft: draftCount || 0,
        archived: archivedCount || 0,
      },
      traffic: trafficMetrics,
      revenue: {
        totalAdSenseRevenue: performanceData
          ?.reduce((sum: number, p: any) => sum + (p.adsense_revenue || 0), 0) || 0,
        totalAffiliateClicks: performanceData?.reduce((sum: number, p: any) => sum + (p.affiliate_clicks || 0), 0) || 0,
        estimatedAffiliateRevenue:
          (performanceData?.reduce((sum: number, p: any) => sum + (p.affiliate_clicks || 0), 0) || 0) * 0.5, // Rough estimate: $0.50 per click
        combinedRevenue: 0, // Will be calculated
      },
      contentQuality: qualityMetrics,
      topPerformers,
      approachComparison,
      trends: {
        viewsTrend,
        viewsChangePercent: Math.round(viewsChangePercent * 100) / 100,
        engagementTrend: 'stable', // Would calculate similarly
        publishingVelocity: Math.round(publishingVelocity * 10) / 10,
      },
      recommendations,
    };
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    throw error;
  }
}

function calculateTrafficMetrics(data: any[]) {
  const totalViews = data.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
  const totalBounceRate = data.reduce((sum: number, p: any) => sum + (p.bounce_rate || 0), 0);
  const totalTimeOnPage = data.reduce((sum: number, p: any) => sum + (p.avg_time_on_page || 0), 0);

  return {
    totalViews,
    avgViewsPerArticle: data.length > 0 ? Math.round(totalViews / data.length) : 0,
    avgTimeOnPage: data.length > 0 ? Math.round(totalTimeOnPage / data.length) : 0,
    avgBounceRate: data.length > 0 ? Math.round((totalBounceRate / data.length) * 100) / 100 : 0,
  };
}

function calculateQualityMetrics(articles: any[]) {
  const plagiarismScores = articles
    .map((a: any) => a.plagiarism_score)
    .filter((s: any) => s !== null && s !== undefined);
  const engagementScores = articles
    .map((a: any) => a.engagement_score)
    .filter((s: any) => s !== null && s !== undefined);

  const issueCount = plagiarismScores.filter((s: number) => s < 70).length;

  return {
    avgPlagiarismScore:
      plagiarismScores.length > 0
        ? Math.round((plagiarismScores.reduce((a: number, b: number) => a + b, 0) / plagiarismScores.length) * 10) / 10
        : 0,
    avgEngagementScore:
      engagementScores.length > 0
        ? Math.round((engagementScores.reduce((a: number, b: number) => a + b, 0) / engagementScores.length) * 10) / 10
        : 0,
    articlesWithPlagiarismIssues: issueCount,
  };
}

function calculateApproachComparison(articles: any[]) {
  const approaches: Record<string, any> = {};

  articles.forEach((a: any) => {
    const approach = a.generation_approach || 'unknown';
    if (!approaches[approach]) {
      approaches[approach] = {
        count: 0,
        totalViews: 0,
        totalEngagement: 0,
      };
    }
    approaches[approach].count++;
    approaches[approach].totalViews += a.views || 0;
    approaches[approach].totalEngagement += a.engagement_score || 0;
  });

  Object.keys(approaches).forEach((approach) => {
    const stats = approaches[approach];
    stats.avgViews = Math.round(stats.totalViews / stats.count);
    stats.avgEngagement = Math.round((stats.totalEngagement / stats.count) * 10) / 10;
  });

  return approaches;
}

function generateRecommendations(quality: any, traffic: any, approaches: any): string[] {
  const recs: string[] = [];

  if (quality.avgPlagiarismScore < 75) {
    recs.push('⚠️ Average plagiarism score is low - consider improving content uniqueness');
  }

  if (traffic.avgBounceRate > 0.6) {
    recs.push('📌 High bounce rate detected - improve article introductions and clarity');
  }

  if (traffic.avgTimeOnPage < 60) {
    recs.push('⏱️ Readers spending less than 1 min - expand content depth and add visuals');
  }

  // Find best performing approach
  let bestApproach = '';
  let bestAvg = 0;
  Object.entries(approaches).forEach(([approach, stats]: [string, any]) => {
    if (stats.avgViews > bestAvg) {
      bestAvg = stats.avgViews;
      bestApproach = approach;
    }
  });

  if (bestApproach && bestApproach !== 'unknown') {
    recs.push(`📈 "${bestApproach}" content performs best - increase focus on this approach`);
  }

  return recs;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('appId') || 'crypto';
    const days = parseInt(url.searchParams.get('days') || '30');

    const metrics = await getPerformanceMetrics(appId, Math.min(days, 90)); // Max 90 days

    return new Response(JSON.stringify(metrics), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to get analytics',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
