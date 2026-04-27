/**
 * Admin Dashboard API
 * Provides comprehensive pipeline monitoring and analytics
 * Usage: GET /api/admin/dashboard?token=YOUR_ADMIN_TOKEN
 */

export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const adminToken = process.env.ADMIN_TOKEN || 'default-insecure-token';

const supabase = createClient(supabaseUrl, supabaseKey);

interface DashboardData {
  timestamp: string;
  environment: string;
  overview: {
    totalBlogs: number;
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalTopics: number;
    remainingTopicDays: number;
  };
  contentMetrics: {
    originalCount: number;
    transformedCount: number;
    aggregatedCount: number;
    originalAvgViews: number;
    transformedAvgViews: number;
    aggregatedAvgViews: number;
  };
  dailyActivity: {
    publishedToday: number;
    generatedToday: number;
    failurestoday: number;
  };
  revenueTracking: {
    totalAdSenseImpressions: number;
    totalAdSenseRevenue: number;
    totalAffiliateClicks: number;
    estimatedMonthlyRevenue: number;
  };
  systemHealth: {
    status: 'healthy' | 'warning' | 'error';
    avgGenerationTime: number;
    errorRate: number;
    successfulRuns: number;
    failedRuns: number;
    lastRunTime: string | null;
  };
  topPerformers: Array<{
    title: string;
    views: number;
    approach: string;
    engagementScore: number;
    affiliateClicks: number;
  }>;
  queueStatus: {
    crypto: number;
    intelligence: number;
    onlinebiz: number;
    totalDays: number;
  };
}

async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    // Overview stats
    const { data: allArticles, count: totalCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' });

    const { count: publishedCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published');

    const { count: draftCount } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'draft');

    const { count: topicCount } = await supabase
      .from('content_topics')
      .select('*', { count: 'exact' });

    const { data: themeConfigs } = await supabase.from('theme_config').select('articles_per_day');
    const totalArticlesPerDay = themeConfigs?.reduce((sum: number, c: any) => sum + (c.articles_per_day || 0), 0) || 10;
    const remainingDays = Math.floor((topicCount || 0) / totalArticlesPerDay);

    // Content metrics
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('generation_approach, views')
      .eq('status', 'published');

    const approachMetrics = calculateApproachMetrics(articles || []);

    // Daily activity
    const { count: publishedToday } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .gte('published_at', `${today}T00:00:00`);

    const { data: todayLogs } = await supabase
      .from('generation_logs')
      .select('status, stage')
      .gte('created_at', `${today}T00:00:00`);

    const generatedToday = todayLogs?.filter((l: any) => l.stage === 'generation' && l.status === 'success').length || 0;
    const failurestoday = todayLogs?.filter((l: any) => l.status === 'failed').length || 0;

    // Revenue tracking
    const { data: performance } = await supabase
      .from('blog_performance')
      .select('adsense_impressions, adsense_revenue, affiliate_clicks')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

    const totalAdSenseImpressions = performance?.reduce((sum: number, p: any) => sum + (p.adsense_impressions || 0), 0) || 0;
    const totalAdSenseRevenue = performance?.reduce((sum: number, p: any) => sum + (p.adsense_revenue || 0), 0) || 0;
    const totalAffiliateClicks = performance?.reduce((sum: number, p: any) => sum + (p.affiliate_clicks || 0), 0) || 0;
    const estimatedMonthlyRevenue = totalAdSenseRevenue * 1.5; // Rough estimate assuming growth

    // System health
    const { data: logs } = await supabase
      .from('generation_logs')
      .select('status, duration_seconds, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const successfulRuns = logs?.filter((l: any) => l.status === 'success').length || 0;
    const failedRuns = logs?.filter((l: any) => l.status === 'failed').length || 0;
    const totalRuns = successfulRuns + failedRuns;
    const errorRate = totalRuns > 0 ? (failedRuns / totalRuns) * 100 : 0;
    const avgDuration =
      logs && logs.length > 0
        ? logs.reduce((sum: number, l: any) => sum + (l.duration_seconds || 0), 0) / logs.length
        : 0;

    const lastRun = logs && logs.length > 0 ? logs[0].created_at : null;
    const systemStatus = errorRate > 20 ? 'error' : errorRate > 5 ? 'warning' : 'healthy';

    // Top performers
    const { data: topArticles } = await supabase
      .from('blog_posts')
      .select('title, views, generation_approach, engagement_score')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(5);

    const topPerformers = (topArticles || []).map((a: any) => ({
      title: a.title,
      views: a.views || 0,
      approach: a.generation_approach || 'unknown',
      engagementScore: a.engagement_score || 0,
      affiliateClicks: 0, // Would need separate aggregation
    }));

    // Queue status
    const { count: cryptoTopics } = await supabase
      .from('content_topics')
      .select('*', { count: 'exact' })
      .eq('app_id', 'crypto')
      .is('last_used_at', null);

    const { count: intTopics } = await supabase
      .from('content_topics')
      .select('*', { count: 'exact' })
      .eq('app_id', 'intelligence')
      .is('last_used_at', null);

    const { count: bizTopics } = await supabase
      .from('content_topics')
      .select('*', { count: 'exact' })
      .eq('app_id', 'onlinebiz')
      .is('last_used_at', null);

    return {
      timestamp: now.toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      overview: {
        totalBlogs: 3,
        totalArticles: totalCount || 0,
        publishedArticles: publishedCount || 0,
        draftArticles: draftCount || 0,
        totalTopics: topicCount || 0,
        remainingTopicDays: remainingDays,
      },
      contentMetrics: {
        originalCount: approachMetrics.original.count,
        transformedCount: approachMetrics.transformed.count,
        aggregatedCount: approachMetrics.aggregated.count,
        originalAvgViews: approachMetrics.original.avgViews,
        transformedAvgViews: approachMetrics.transformed.avgViews,
        aggregatedAvgViews: approachMetrics.aggregated.avgViews,
      },
      dailyActivity: {
        publishedToday: publishedToday || 0,
        generatedToday,
        failurestoday,
      },
      revenueTracking: {
        totalAdSenseImpressions,
        totalAdSenseRevenue: Math.round(totalAdSenseRevenue * 100) / 100,
        totalAffiliateClicks,
        estimatedMonthlyRevenue: Math.round(estimatedMonthlyRevenue * 100) / 100,
      },
      systemHealth: {
        status: systemStatus,
        avgGenerationTime: Math.round(avgDuration),
        errorRate: Math.round(errorRate * 100) / 100,
        successfulRuns,
        failedRuns,
        lastRunTime: lastRun,
      },
      topPerformers,
      queueStatus: {
        crypto: cryptoTopics || 0,
        intelligence: intTopics || 0,
        onlinebiz: bizTopics || 0,
        totalDays: Math.floor((((cryptoTopics || 0) + (intTopics || 0) + (bizTopics || 0)) / totalArticlesPerDay)),
      },
    };
  } catch (error) {
    console.error('Error building dashboard:', error);
    throw error;
  }
}

function calculateApproachMetrics(articles: any[]) {
  const approaches = {
    original: { count: 0, totalViews: 0 },
    transformed: { count: 0, totalViews: 0 },
    aggregated: { count: 0, totalViews: 0 },
  };

  articles.forEach((a: any) => {
    const approach = a.generation_approach || 'unknown';
    if (approach in approaches) {
      approaches[approach as keyof typeof approaches].count++;
      approaches[approach as keyof typeof approaches].totalViews += a.views || 0;
    }
  });

  return {
    original: {
      count: approaches.original.count,
      avgViews: approaches.original.count > 0 ? Math.round(approaches.original.totalViews / approaches.original.count) : 0,
    },
    transformed: {
      count: approaches.transformed.count,
      avgViews: approaches.transformed.count > 0 ? Math.round(approaches.transformed.totalViews / approaches.transformed.count) : 0,
    },
    aggregated: {
      count: approaches.aggregated.count,
      avgViews: approaches.aggregated.count > 0 ? Math.round(approaches.aggregated.totalViews / approaches.aggregated.count) : 0,
    },
  };
}

export async function GET(request: Request) {
  try {
    // Check admin token
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (token !== adminToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const dashboard = await getDashboardData();

    return new Response(JSON.stringify(dashboard), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, max-age=300', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to load dashboard',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
