/**
 * Analytics event tracking for all blogs
 * Integrates with GA4 and custom database logging
 */

export type EventName =
  | 'article_view'
  | 'article_read_complete'
  | 'newsletter_subscribe'
  | 'newsletter_unsubscribe'
  | 'affiliate_click'
  | 'affiliate_conversion'
  | 'search_performed'
  | 'category_view'
  | 'social_share'
  | 'cta_click'
  | 'form_submit'
  | 'error_occurred';

export interface TrackingData {
  event: EventName;
  appId: 'crypto' | 'intelligence' | 'onlinebiz';
  userId?: string;
  sessionId?: string;
  data?: Record<string, any>;
  timestamp?: string;
}

/**
 * Track event in GA4 and custom database
 */
export async function trackEvent(trackingData: TrackingData) {
  const { event, appId, userId, data, timestamp = new Date().toISOString() } = trackingData;

  // Track in GA4 if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      app_id: appId,
      user_id: userId,
      ...data,
    });
  }

  // Log to custom database (non-blocking)
  void fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      appId,
      userId,
      data,
      timestamp,
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    }),
  }).catch(() => {
    // Silently fail
  });
}

/**
 * Track article read completion
 */
export async function trackArticleReadComplete(
  articleId: string,
  articleSlug: string,
  appId: 'crypto' | 'intelligence' | 'onlinebiz',
  readTimeSeconds: number
) {
  return trackEvent({
    event: 'article_read_complete',
    appId,
    data: {
      article_id: articleId,
      article_slug: articleSlug,
      read_time_seconds: readTimeSeconds,
    },
  });
}

/**
 * Track affiliate link click
 */
export async function trackAffiliateClick(
  affiliateProgram: string,
  articleId: string,
  appId: 'crypto' | 'intelligence' | 'onlinebiz'
) {
  return trackEvent({
    event: 'affiliate_click',
    appId,
    data: {
      affiliate_program: affiliateProgram,
      article_id: articleId,
    },
  });
}

/**
 * Track newsletter subscription
 */
export async function trackNewsletterSubscribe(
  email: string,
  themes: string[],
  source: string,
  appId: 'crypto' | 'intelligence' | 'onlinebiz'
) {
  return trackEvent({
    event: 'newsletter_subscribe',
    appId,
    data: {
      email: hashEmail(email),
      themes,
      source,
    },
  });
}

/**
 * Track search
 */
export async function trackSearch(
  query: string,
  resultsCount: number,
  appId: 'crypto' | 'intelligence' | 'onlinebiz'
) {
  return trackEvent({
    event: 'search_performed',
    appId,
    data: {
      search_query: query,
      results_count: resultsCount,
    },
  });
}

/**
 * Track social share
 */
export async function trackSocialShare(
  articleId: string,
  platform: 'twitter' | 'linkedin' | 'facebook' | 'telegram' | 'whatsapp',
  appId: 'crypto' | 'intelligence' | 'onlinebiz'
) {
  return trackEvent({
    event: 'social_share',
    appId,
    data: {
      article_id: articleId,
      platform,
    },
  });
}

/**
 * Track CTA click
 */
export async function trackCtaClick(
  ctaType: string,
  location: string,
  appId: 'crypto' | 'intelligence' | 'onlinebiz'
) {
  return trackEvent({
    event: 'cta_click',
    appId,
    data: {
      cta_type: ctaType,
      location,
    },
  });
}

/**
 * Hash email for privacy
 */
function hashEmail(email: string): string {
  // Simple hash for privacy - in production use proper hashing
  return Buffer.from(email).toString('base64').slice(0, 16);
}
