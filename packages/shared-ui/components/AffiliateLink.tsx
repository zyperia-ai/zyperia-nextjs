'use client';

import React, { useEffect, useState } from 'react';

export interface AffiliateLinkProps {
  /**
   * Tracking ID for the affiliate link (platform_article_xxx)
   * Format: "{platform_name}_{post_id}_{random}"
   */
  trackingId: string;

  /**
   * Platform name (for display and lookup)
   * e.g., "Kraken", "Zapier", "Gumroad"
   */
  platformName: string;

  /**
   * Display text for the link
   * e.g., "Sign up on Kraken", "Try Zapier free"
   */
  children: React.ReactNode;

  /**
   * CSS className for styling
   */
  className?: string;

  /**
   * Whether to open in new tab
   */
  newTab?: boolean;

  /**
   * Show affiliate disclosure icon/text
   */
  showDisclosure?: boolean;

  /**
   * Callback when click is tracked
   */
  onClickTracked?: () => void;

  /**
   * Custom referrer context
   */
  referrer?: string;
}

/**
 * AffiliateLink Component
 *
 * Renders an affiliate link that:
 * 1. Tracks clicks via /api/affiliate/click endpoint
 * 2. Logs click to Supabase with user metadata
 * 3. Redirects to affiliate URL
 *
 * Usage:
 * ```tsx
 * <AffiliateLink trackingId="kraken_article123_abc456" platformName="Kraken">
 *   Sign up on Kraken
 * </AffiliateLink>
 * ```
 */
export const AffiliateLink: React.FC<AffiliateLinkProps> = ({
  trackingId,
  platformName,
  children,
  className = 'text-blue-600 hover:text-blue-800 underline',
  newTab = true,
  showDisclosure = false,
  onClickTracked,
  referrer,
}) => {
  const [href, setHref] = useState('#');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Build click tracking URL
    const params = new URLSearchParams({
      id: trackingId,
      ref: referrer || (typeof window !== 'undefined' ? window.location.pathname : 'direct'),
    });

    // Get current session ID from localStorage or create one
    const sessionId = getOrCreateSessionId();
    if (sessionId) {
      params.append('s', sessionId);
    }

    // Use current app's API endpoint
    const apiBase = typeof window !== 'undefined' ? window.location.origin : '';
    const clickUrl = `${apiBase}/api/affiliate/click?${params.toString()}`;

    setHref(clickUrl);
    setLoading(false);
  }, [trackingId, referrer]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the redirect happen naturally
    onClickTracked?.();
  };

  if (loading) {
    return <span className={className}>{children}</span>;
  }

  return (
    <div className="inline">
      <a
        href={href}
        onClick={handleClick}
        target={newTab ? '_blank' : '_self'}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={className}
        data-affiliate-platform={platformName}
        data-tracking-id={trackingId}
      >
        {children}
      </a>

      {showDisclosure && (
        <span
          className="ml-1 text-xs text-gray-500 align-super"
          title={`Affiliate link: ${platformName}`}
        >
          🔗
        </span>
      )}
    </div>
  );
};

/**
 * Get or create a session ID for tracking repeat visits
 * Stored in localStorage, lasts 30 days
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  const STORAGE_KEY = 'zyperia_session_id';
  const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const { id, createdAt } = JSON.parse(stored);
      const age = Date.now() - createdAt;

      if (age < SESSION_DURATION) {
        return id;
      }
    }

    // Create new session
    const newSession = {
      id: generateRandomId(),
      createdAt: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    return newSession.id;
  } catch (error) {
    console.error('Failed to manage session ID:', error);
    return '';
  }
}

function generateRandomId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * AffiliateDisclosure Component
 *
 * Renders a disclosure about affiliate links on a page
 * Place near the bottom of article or in footer
 */
export const AffiliateDisclosure: React.FC<{ className?: string }> = ({
  className = 'text-sm text-gray-600 bg-gray-50 p-4 rounded mt-8 border-l-4 border-blue-400',
}) => {
  return (
    <div className={className}>
      <strong>💡 Affiliate Disclosure:</strong> This article contains affiliate links. When you
      purchase through these links, we earn a small commission at no extra cost to you. This helps
      us continue creating quality content. We only recommend products and services we genuinely
      believe in.
    </div>
  );
};

/**
 * Inline Affiliate Link Disclosure
 *
 * Render inline when a specific link is about monetization
 */
export const AffiliateNote: React.FC<{ children?: React.ReactNode }> = ({
  children = 'We earn a commission if you purchase through this link.',
}) => {
  return <span className="text-xs text-gray-500 ml-2">({children})</span>;
};
