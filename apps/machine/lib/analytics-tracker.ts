/**
 * Analytics Tracking Library
 * Tracks article performance metrics for optimization
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

export interface ArticleMetrics {
  postId: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  scrollDepth: number;
  affiliateClicks: number;
  adSenseImpressions: number;
  adSenseRevenue: number;
}

/**
 * Record article view event
 */
export async function trackArticleView(
  postId: string,
  appId: string,
  visitorId: string,
  sessionDuration: number
) {
  try {
    // Get or create blog_performance entry for today
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await getSupabase()
      .from('blog_performance')
      .select('id, views')
      .eq('post_id', postId)
      .eq('date', today)
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing
      await getSupabase()
        .from('blog_performance')
        .update({
          views: (existing[0].views || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);
    } else {
      // Create new
      await getSupabase().from('blog_performance').insert({
        post_id: postId,
        date: today,
        views: 1,
        unique_visitors: 1,
        avg_time_on_page: sessionDuration,
        created_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking view:', error);
  }
}

/**
 * Track affiliate click
 */
export async function trackAffiliateClick(
  postId: string,
  affiliateProgram: string,
  affiliateUrl: string
) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await getSupabase()
      .from('blog_performance')
      .select('id, affiliate_clicks')
      .eq('post_id', postId)
      .eq('date', today)
      .limit(1);

    if (existing && existing.length > 0) {
      await getSupabase()
        .from('blog_performance')
        .update({
          affiliate_clicks: (existing[0].affiliate_clicks || 0) + 1,
        })
        .eq('id', existing[0].id);
    }

    // Also log to affiliate_clicks table
    await getSupabase().from('affiliate_clicks').insert({
      post_id: postId,
      affiliate_program: affiliateProgram,
      affiliate_url: affiliateUrl,
      clicked_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
}

/**
 * Track AdSense impression
 */
export async function trackAdSenseImpression(postId: string, revenue: number) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await getSupabase()
      .from('blog_performance')
      .select('id, adsense_impressions, adsense_revenue')
      .eq('post_id', postId)
      .eq('date', today)
      .limit(1);

    if (existing && existing.length > 0) {
      await getSupabase()
        .from('blog_performance')
        .update({
          adsense_impressions: (existing[0].adsense_impressions || 0) + 1,
          adsense_revenue: (existing[0].adsense_revenue || 0) + revenue,
        })
        .eq('id', existing[0].id);
    }
  } catch (error) {
    console.error('Error tracking AdSense impression:', error);
  }
}

/**
 * Get article performance metrics
 */
export async function getArticleMetrics(postId: string): Promise<ArticleMetrics | null> {
  try {
    // Get last 30 days of data
    const { data } = await getSupabase()
      .from('blog_performance')
      .select('*')
      .eq('post_id', postId)
      .order('date', { ascending: false })
      .limit(30);

    if (!data || data.length === 0) return null;

    // Aggregate metrics
    const totals = data.reduce(
      (acc: any, row: any) => ({
        views: acc.views + (row.views || 0),
        uniqueVisitors: acc.uniqueVisitors + (row.unique_visitors || 0),
        totalTimeOnPage: acc.totalTimeOnPage + (row.avg_time_on_page || 0),
        affiliateClicks: acc.affiliateClicks + (row.affiliate_clicks || 0),
        adSenseImpressions: acc.adSenseImpressions + (row.adsense_impressions || 0),
        adSenseRevenue: acc.adSenseRevenue + (row.adsense_revenue || 0),
        bounceRate: acc.bounceRate + (row.bounce_rate || 0),
        scrollDepth: acc.scrollDepth + (row.scroll_depth || 0),
        count: acc.count + 1,
      }),
      {
        views: 0,
        uniqueVisitors: 0,
        totalTimeOnPage: 0,
        affiliateClicks: 0,
        adSenseImpressions: 0,
        adSenseRevenue: 0,
        bounceRate: 0,
        scrollDepth: 0,
        count: 0,
      }
    );

    return {
      postId,
      views: totals.views,
      uniqueVisitors: totals.uniqueVisitors,
      avgTimeOnPage: Math.round(totals.totalTimeOnPage / totals.count),
      bounceRate: Math.round((totals.bounceRate / totals.count) * 100) / 100,
      scrollDepth: Math.round((totals.scrollDepth / totals.count) * 100) / 100,
      affiliateClicks: totals.affiliateClicks,
      adSenseImpressions: totals.adSenseImpressions,
      adSenseRevenue: Math.round(totals.adSenseRevenue * 100) / 100,
    };
  } catch (error) {
    console.error('Error getting article metrics:', error);
    return null;
  }
}

/**
 * Get top performing articles
 */
export async function getTopArticles(appId: string, limit: number = 10) {
  try {
    const { data } = await getSupabase().rpc('get_top_articles', {
      p_app_id: appId,
      p_limit: limit,
    });

    return data || [];
  } catch (error) {
    // Fallback: simple query
    const { data } = await getSupabase()
      .from('blog_posts')
      .select('id, title, views, engagement_score')
      .eq('app_id', appId)
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(limit);

    return data || [];
  }
}

/**
 * Get content performance by generation approach
 */
export async function getPerformanceByApproach(appId: string) {
  try {
    const { data } = await getSupabase()
      .from('blog_posts')
      .select('generation_approach, views, engagement_score')
      .eq('app_id', appId)
      .eq('status', 'published');

    if (!data) return {};

    // Group by approach
    const byApproach: any = {};
    data.forEach((article: any) => {
      const approach = article.generation_approach || 'unknown';
      if (!byApproach[approach]) {
        byApproach[approach] = {
          count: 0,
          totalViews: 0,
          avgEngagement: 0,
        };
      }
      byApproach[approach].count++;
      byApproach[approach].totalViews += article.views || 0;
      byApproach[approach].avgEngagement += article.engagement_score || 0;
    });

    // Calculate averages
    Object.keys(byApproach).forEach((approach) => {
      const stats = byApproach[approach];
      stats.avgViews = Math.round(stats.totalViews / stats.count);
      stats.avgEngagement = Math.round((stats.avgEngagement / stats.count) * 100) / 100;
    });

    return byApproach;
  } catch (error) {
    console.error('Error getting performance by approach:', error);
    return {};
  }
}

/**
 * Calculate engagement score
 * Formula: (views Ã— time_on_page) / average_site_time
 */
export function calculateEngagementScore(
  views: number,
  avgTimeOnPage: number,
  siteAverageTime: number = 120
): number {
  return Math.round((views * avgTimeOnPage) / siteAverageTime);
}

