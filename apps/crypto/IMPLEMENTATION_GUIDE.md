# CryptoZYPERIA Implementation Guide

Complete guide for the blog infrastructure, APIs, and analytics systems built for the crypto blog.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Blog Pages](#blog-pages)
3. [APIs](#apis)
4. [Components](#components)
5. [Analytics](#analytics)
6. [SEO Features](#seo-features)
7. [Admin Dashboard](#admin-dashboard)
8. [Monetization](#monetization)
9. [Database Integration (May 1st)](#database-integration-may-1st)

## Overview

This infrastructure provides:
- **15+ blog pages** with article management, search, and categories
- **4 REST APIs** for articles, analytics, newsletter, and affiliate tracking
- **10+ reusable components** for articles, stats, sharing, and SEO
- **Complete analytics** integration with GA4 and custom tracking
- **Admin dashboard** for content and performance management
- **SEO features** including sitemap, RSS feed, and schema markup

## Blog Pages

### Core Pages
- **Homepage** (`/`) - Featured articles, newsletter CTA, hero section
- **Blog Archive** (`/blog`) - All articles with pagination and category filtering
- **Article Detail** (`/articles/[slug]`) - Full article with sharing, stats, related articles
- **Search** (`/search`) - Full-text search with suggestions
- **Category** (`/categories/[category]`) - Articles filtered by category
- **404 Page** (`/not-found.tsx`) - Custom 404 with navigation suggestions

### Support Pages
- **About** (`/about`) - Brand story, mission, team
- **Privacy** (`/privacy`) - GDPR-compliant privacy policy
- **Terms** (`/terms`) - Terms of service and disclaimers
- **Contact** (`/contact`) - Contact form and FAQ
- **Affiliate Disclosure** (`/affiliate-disclosure`) - Commission structure

### Newsletter Pages
- **Confirmation** (`/newsletter-confirmed`) - Subscription confirmation
- **Error** (`/newsletter-error`) - Error page

## APIs

### Articles API
**GET `/api/articles`**
```bash
# List all articles
curl "https://crypto.zyperia.ai/api/articles"

# Search articles
curl "https://crypto.zyperia.ai/api/articles?search=bitcoin"

# Filter by category
curl "https://crypto.zyperia.ai/api/articles?category=Bitcoin"

# Pagination
curl "https://crypto.zyperia.ai/api/articles?limit=20&offset=40"

# Sorting
curl "https://crypto.zyperia.ai/api/articles?sortBy=views"
```

Response:
```json
{
  "articles": [
    {
      "id": "1",
      "slug": "bitcoin-beginners-guide",
      "title": "Bitcoin for Beginners...",
      "excerpt": "...",
      "category": "Bitcoin",
      "publishedAt": "2024-04-22T00:00:00Z",
      "readingTime": 8,
      "views": 1250,
      "engagement_score": 0.75
    }
  ],
  "total": 6,
  "limit": 10,
  "offset": 0
}
```

### Newsletter API
**POST `/api/newsletter/subscribe`**
```bash
curl -X POST https://crypto.zyperia.ai/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "themes": ["crypto"],
    "source": "crypto_site"
  }'
```

**POST `/api/newsletter/confirm`**
```bash
curl -X POST https://crypto.zyperia.ai/api/newsletter/confirm \
  -H "Content-Type: application/json" \
  -d '{"token": "confirmation_token"}'
```

### Analytics API
**POST `/api/analytics/track`**
```bash
curl -X POST https://crypto.zyperia.ai/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "event": "article_view",
    "appId": "crypto",
    "articleId": "1",
    "timestamp": "2024-04-24T12:00:00Z"
  }'
```

### Article Views API
**POST `/api/articles/view`**
```bash
curl -X POST https://crypto.zyperia.ai/api/articles/view \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "1",
    "articleSlug": "bitcoin-beginners-guide",
    "appId": "crypto"
  }'
```

### Affiliate API
**POST `/api/affiliate/click`**
```bash
curl -X POST https://crypto.zyperia.ai/api/affiliate/click \
  -H "Content-Type: application/json" \
  -d '{
    "affiliate": "kraken",
    "articleId": "1",
    "source": "crypto_site"
  }'
```

## Components

### Shared Components (in `packages/shared-ui`)

#### ArticleCard
Display article previews in grids
```tsx
<ArticleCard
  id="1"
  slug="bitcoin-guide"
  title="Bitcoin for Beginners"
  excerpt="..."
  publishedAt="2024-04-22"
  readingTime={8}
  isDark={true}
/>
```

#### SocialShareButtons
Multi-platform sharing (Twitter, LinkedIn, Facebook, Telegram, WhatsApp)
```tsx
<SocialShareButtons
  title="Bitcoin for Beginners"
  url="https://crypto.zyperia.ai/articles/bitcoin-guide"
  isDark={true}
/>
```

#### ArticleStats
Display views, engagement, reading time
```tsx
<ArticleStats articleId="1" isDark={true} />
```

#### RelatedArticles
Show similar articles
```tsx
<RelatedArticles
  currentSlug="bitcoin-guide"
  articles={articles}
  maxItems={3}
/>
```

#### SchemaOrgArticle
SEO schema markup
```tsx
<SchemaOrgArticle
  title="Bitcoin for Beginners"
  description="..."
  datePublished="2024-04-22"
  author="Crypto Expert"
  canonicalUrl="https://crypto.zyperia.ai/articles/bitcoin-guide"
/>
```

#### SocialProof
Display trust metrics
```tsx
<SocialProof
  subscribers={10000}
  totalReaders={50000}
  articlesPublished={500}
/>
```

#### ArticleViewTracker
Track pageviews and engagement (non-rendering)
```tsx
<ArticleViewTracker
  articleId="1"
  articleSlug="bitcoin-guide"
  articleTitle="Bitcoin for Beginners"
  appId="crypto"
/>
```

## Analytics

### Tracking Events

#### Article Views
```tsx
import { trackEvent } from '@zyperia/shared-lib/analytics';

trackEvent({
  event: 'article_view',
  appId: 'crypto',
  data: {
    article_id: '1',
    article_slug: 'bitcoin-guide',
  },
});
```

#### Article Read Completion
```tsx
import { trackArticleReadComplete } from '@zyperia/shared-lib/analytics';

trackArticleReadComplete('1', 'bitcoin-guide', 'crypto', 480);
```

#### Affiliate Clicks
```tsx
import { trackAffiliateClick } from '@zyperia/shared-lib/analytics';

trackAffiliateClick('kraken', '1', 'crypto');
```

#### Newsletter Subscription
```tsx
import { trackNewsletterSubscribe } from '@zyperia/shared-lib/analytics';

trackNewsletterSubscribe('user@example.com', ['crypto'], 'homepage', 'crypto');
```

#### Search
```tsx
import { trackSearch } from '@zyperia/shared-lib/analytics';

trackSearch('bitcoin', 5, 'crypto');
```

### Revenue Tracking
```tsx
import { trackRevenueEvent } from '@zyperia/shared-lib/analytics/revenue-tracking';

trackRevenueEvent({
  type: 'affiliate_click',
  appId: 'crypto',
  source: 'kraken',
  articleId: '1',
});
```

## SEO Features

### Sitemap
Automatically generated at `/sitemap.ts`
- Updates on every deploy
- Includes all articles, categories, and static pages
- Suitable for Google Search Console

### RSS Feed
Available at `/feed.xml`
- Latest articles in RSS 2.0 format
- Subscribe for email notifications
- Caching enabled for performance

### Schema Markup
Automatically added to article pages
- NewsArticle schema
- Author information
- Publication date
- JSON-LD format

## Admin Dashboard

Access at `/admin` (authentication gate to be added)

**Features:**
- Article statistics (published, draft, views)
- Recent articles with performance metrics
- Newsletter subscriber count
- Affiliate click tracking
- Revenue estimation
- Quick actions (create article, view analytics, manage subscribers)

## Monetization

### Affiliate Tracking
```tsx
import { trackAffiliateClick } from '@zyperia/shared-lib/analytics';

// When user clicks affiliate link
<a
  href={affiliateLink}
  onClick={() => trackAffiliateClick('kraken', articleId, 'crypto')}
>
  Sign up with Kraken
</a>
```

### Newsletter Value
Newsletter subscribers tracked as recurring revenue source
- Track subscription events
- Monitor conversion to affiliate clicks
- Calculate lifetime value

### AdSense Integration
Ready for implementation:
```tsx
// Add to layout for auto-ads
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
  crossOrigin="anonymous"
></script>
```

## Database Integration (May 1st)

### Tables to Create (Supabase)

**blog_posts**
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  app_id TEXT,
  slug TEXT UNIQUE,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  author_id UUID,
  published_at TIMESTAMP,
  status TEXT,
  views INT DEFAULT 0,
  engagement_score DECIMAL,
  category TEXT
);
```

**newsletter_subscriptions**
```sql
CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  crypto BOOLEAN,
  intelligence BOOLEAN,
  onlinebiz BOOLEAN,
  status TEXT,
  confirmation_token TEXT,
  confirmed_at TIMESTAMP
);
```

**analytics_events**
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  app_id TEXT,
  event TEXT,
  article_id TEXT,
  user_id TEXT,
  data JSONB,
  timestamp TIMESTAMP
);
```

**revenue_events**
```sql
CREATE TABLE revenue_events (
  id UUID PRIMARY KEY,
  app_id TEXT,
  type TEXT,
  source TEXT,
  amount DECIMAL,
  article_id TEXT,
  timestamp TIMESTAMP
);
```

## Next Steps

1. **Replace Mock Data** - Connect all APIs to Supabase queries
2. **Add Authentication** - Secure admin dashboard
3. **Email Service** - Integrate Resend for newsletters
4. **GA4 Setup** - Add tracking ID to layout
5. **AdSense Integration** - Add publisher ID
6. **Deploy** - One production deployment with all features

## Support

For questions about implementation, refer to:
- ADVANCED_FEATURES.md
- OPERATIONS_MANUAL.md
- Individual component documentation in `packages/shared-ui`
