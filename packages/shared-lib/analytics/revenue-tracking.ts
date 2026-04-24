/**
 * Revenue tracking and analytics
 * Tracks affiliate commissions, AdSense, and other revenue sources
 */

export interface RevenueEvent {
  type: 'affiliate_click' | 'affiliate_conversion' | 'adsense_impression' | 'newsletter_value';
  appId: 'crypto' | 'intelligence' | 'onlinebiz';
  articleId?: string;
  source?: string; // e.g., 'kraken', 'zapier', 'gumroad'
  amount?: number;
  commission?: number;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface RevenueStats {
  totalRevenue: number;
  affiliateRevenue: number;
  adsenseRevenue: number;
  estimatedMonthlyRevenue: number;
  topPerformingArticles: Array<{
    articleId: string;
    title: string;
    revenue: number;
    clicks: number;
    conversionRate: number;
  }>;
  topAffiliates: Array<{
    source: string;
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  }>;
}

/**
 * Log revenue event
 */
export async function trackRevenueEvent(event: RevenueEvent) {
  const timestamp = event.timestamp || new Date().toISOString();

  // TODO: On May 1st, insert into revenue_events table
  console.log('Revenue event tracked:', {
    ...event,
    timestamp,
  });

  // Send to database
  void fetch('/api/revenue/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...event,
      timestamp,
    }),
  }).catch(() => {
    // Silently fail
  });
}

/**
 * Get revenue stats for dashboard
 */
export async function getRevenueStats(appId: 'crypto' | 'intelligence' | 'onlinebiz', days: number = 30) {
  try {
    const response = await fetch(`/api/revenue/stats?appId=${appId}&days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch revenue stats');
    return (await response.json()) as RevenueStats;
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    return {
      totalRevenue: 0,
      affiliateRevenue: 0,
      adsenseRevenue: 0,
      estimatedMonthlyRevenue: 0,
      topPerformingArticles: [],
      topAffiliates: [],
    };
  }
}

/**
 * Calculate estimated monthly revenue based on daily rate
 */
export function estimateMonthlyRevenue(dailyRevenue: number): number {
  return dailyRevenue * 30;
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(conversions: number, clicks: number): number {
  if (clicks === 0) return 0;
  return (conversions / clicks) * 100;
}

/**
 * Estimate affiliate commission
 */
export function estimateAffiliateCommission(
  clicks: number,
  conversionRate: number,
  commissionPerConversion: number
): number {
  const conversions = clicks * (conversionRate / 100);
  return conversions * commissionPerConversion;
}
