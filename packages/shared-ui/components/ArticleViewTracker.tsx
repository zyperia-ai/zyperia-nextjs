'use client';

import { useEffect } from 'react';

interface ArticleViewTrackerProps {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
  appId: 'crypto' | 'intelligence' | 'onlinebiz';
}

/**
 * Track article views in analytics
 * Sends pageview event to GA4 and records in database
 */
export default function ArticleViewTracker({
  articleId,
  articleSlug,
  articleTitle,
  appId,
}: ArticleViewTrackerProps) {
  useEffect(() => {
    // GA4 pageview event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: `/articles/${articleSlug}`,
        page_title: articleTitle,
      });
    }

    // Custom event for article view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'article_view', {
        article_id: articleId,
        article_slug: articleSlug,
        article_title: articleTitle,
        app_id: appId,
      });
    }

    // Log view to database (non-blocking)
    void fetch('/api/articles/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId,
        articleSlug,
        appId,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silently fail - don't impact user experience
    });

    // Record reading time at intervals
    let readTime = 0;
    const interval = setInterval(() => {
      readTime++;
      if (readTime % 10 === 0) {
        // Every 10 seconds
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'article_read_progress', {
            article_id: articleId,
            read_seconds: readTime,
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [articleId, articleSlug, articleTitle, appId]);

  // This component doesn't render anything
  return null;
}
