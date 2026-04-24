/**
 * Affiliate link management and tracking
 * Handles affiliate program integration, link encoding, and click tracking
 */

import crypto from 'crypto';

export interface AffiliateProgram {
  id: string;
  name: string;
  url: string;
  commission_rate: number; // e.g., 0.15 for 15%
  cookie_window: number; // Days
  is_active: boolean;
  category: string; // 'crypto' | 'automation' | 'earning'
  programs: string[]; // ['Kraken', 'Binance', 'Coinbase']
}

export interface AffiliateLink {
  id: string;
  article_id: string;
  program_id: string;
  affiliate_url: string;
  encoded_url: string; // Obfuscated for tracking
  label: string; // Display text
  clicks: number;
  conversions?: number;
  revenue?: number;
  created_at: string;
}

export interface AffiliateClick {
  id: string;
  link_id: string;
  article_id: string;
  program_id: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  converted: boolean;
  conversion_value?: number;
}

/**
 * Encode affiliate URL with tracking metadata
 */
export function encodeAffiliateLink(
  affiliateUrl: string,
  linkId: string,
  articleId: string
): string {
  // Create tracking parameter
  const trackingData = JSON.stringify({
    link_id: linkId,
    article_id: articleId,
    timestamp: Date.now(),
  });

  // Encode in base64
  const encoded = Buffer.from(trackingData).toString('base64');

  // Return original URL with tracking parameter
  const separator = affiliateUrl.includes('?') ? '&' : '?';
  return `${affiliateUrl}${separator}_zy=${encoded}`;
}

/**
 * Decode affiliate tracking data
 */
export function decodeAffiliateLink(encodedParam: string): {
  link_id: string;
  article_id: string;
  timestamp: number;
} | null {
  try {
    const decoded = Buffer.from(encodedParam, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Generate short tracking code for affiliate links
 * Used for obfuscation and analytics
 */
export function generateTrackingCode(linkId: string, articleId: string): string {
  const combined = `${linkId}:${articleId}:${Date.now()}`;
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  return hash.substring(0, 8).toUpperCase();
}

/**
 * Create affiliate link with built-in tracking
 */
export function createAffiliateLink(
  affiliateUrl: string,
  linkId: string,
  articleId: string,
  label: string
): AffiliateLink {
  const encoded = encodeAffiliateLink(affiliateUrl, linkId, articleId);

  return {
    id: linkId,
    article_id: articleId,
    program_id: '', // To be filled from database
    affiliate_url: affiliateUrl,
    encoded_url: encoded,
    label,
    clicks: 0,
    created_at: new Date().toISOString(),
  };
}

/**
 * Mock affiliate programs (crypto, intelligence, onlinebiz)
 */
export const AFFILIATE_PROGRAMS: Record<string, AffiliateProgram> = {
  'crypto:kraken': {
    id: 'kraken',
    name: 'Kraken',
    url: 'https://kraken.com/?c=ref-ZYPERIA',
    commission_rate: 0.25,
    cookie_window: 90,
    is_active: true,
    category: 'crypto',
    programs: ['Kraken'],
  },
  'crypto:binance': {
    id: 'binance',
    name: 'Binance',
    url: 'https://binance.com/?ref=ZYPERIA',
    commission_rate: 0.2,
    cookie_window: 90,
    is_active: true,
    category: 'crypto',
    programs: ['Binance'],
  },
  'crypto:coinbase': {
    id: 'coinbase',
    name: 'Coinbase',
    url: 'https://coinbase.com/join/ZYPERIA',
    commission_rate: 0.15,
    cookie_window: 30,
    is_active: true,
    category: 'crypto',
    programs: ['Coinbase'],
  },
  'automation:zapier': {
    id: 'zapier',
    name: 'Zapier',
    url: 'https://zapier.com?fla=ZYPERIA',
    commission_rate: 0.15,
    cookie_window: 60,
    is_active: true,
    category: 'automation',
    programs: ['Zapier'],
  },
  'automation:make': {
    id: 'make',
    name: 'Make (Integromat)',
    url: 'https://make.com?aff_id=ZYPERIA',
    commission_rate: 0.1,
    cookie_window: 60,
    is_active: true,
    category: 'automation',
    programs: ['Make'],
  },
  'earning:gumroad': {
    id: 'gumroad',
    name: 'Gumroad',
    url: 'https://gumroad.com?ref=ZYPERIA',
    commission_rate: 0.2,
    cookie_window: 90,
    is_active: true,
    category: 'earning',
    programs: ['Gumroad'],
  },
  'earning:hotmart': {
    id: 'hotmart',
    name: 'Hotmart',
    url: 'https://hotmart.com?aff=ZYPERIA',
    commission_rate: 0.15,
    cookie_window: 30,
    is_active: true,
    category: 'earning',
    programs: ['Hotmart'],
  },
  'earning:skillshare': {
    id: 'skillshare',
    name: 'Skillshare',
    url: 'https://skillshare.com/ref/ZYPERIA',
    commission_rate: 0.1,
    cookie_window: 30,
    is_active: true,
    category: 'earning',
    programs: ['Skillshare'],
  },
};

/**
 * Get affiliate programs for a category
 */
export function getProgramsByCategory(category: string): AffiliateProgram[] {
  return Object.values(AFFILIATE_PROGRAMS).filter(
    (p) => p.category === category && p.is_active
  );
}

/**
 * Get single program by ID
 */
export function getProgramById(programId: string): AffiliateProgram | null {
  const key = Object.keys(AFFILIATE_PROGRAMS).find((k) => k.endsWith(programId));
  return key ? AFFILIATE_PROGRAMS[key] : null;
}
