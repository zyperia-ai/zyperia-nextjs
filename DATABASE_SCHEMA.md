# Database Schema for ZYPERIA Article & Newsletter System

This document describes the Supabase tables required for the article and newsletter system.

## Tables

### 1. blog_posts
Stores all blog articles across different apps.

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft', -- 'draft' or 'published'
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, slug)
);

-- Indexes for performance
CREATE INDEX idx_blog_posts_app_id ON blog_posts(app_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
```

### 2. newsletter_subscribers
Stores newsletter subscribers per app.

```sql
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

-- Indexes for performance
CREATE INDEX idx_newsletter_subscribers_app_id ON newsletter_subscribers(app_id);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
```

### 3. user_profiles
Stores user profile information and preferences.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

-- Indexes for performance
CREATE INDEX idx_user_profiles_app_id ON user_profiles(app_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
```

### 4. revenue_events
Tracks monetization events including affiliate clicks, conversions, and revenue.

```sql
CREATE TABLE revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT,
  article_id UUID,
  event_type TEXT NOT NULL, -- 'click', 'conversion', 'impression'
  amount DECIMAL(10, 2) DEFAULT 0,
  affiliate_code TEXT,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_revenue_events_app_id ON revenue_events(app_id);
CREATE INDEX idx_revenue_events_affiliate_code ON revenue_events(affiliate_code);
CREATE INDEX idx_revenue_events_event_type ON revenue_events(event_type);
CREATE INDEX idx_revenue_events_tracked_at ON revenue_events(tracked_at);
```

### 5. user_subscriptions
Stores user subscription tiers and billing information.

```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  tier TEXT DEFAULT 'free', -- 'free', 'pro', 'elite'
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'suspended'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

-- Indexes for performance
CREATE INDEX idx_user_subscriptions_app_id ON user_subscriptions(app_id);
CREATE INDEX idx_user_subscriptions_tier ON user_subscriptions(tier);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
```

### 6. reading_history
Tracks which articles users have read and reading time.

```sql
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  article_id UUID NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email, article_id)
);

-- Indexes for performance
CREATE INDEX idx_reading_history_app_id ON reading_history(app_id);
CREATE INDEX idx_reading_history_email ON reading_history(email);
CREATE INDEX idx_reading_history_article_id ON reading_history(article_id);
CREATE INDEX idx_reading_history_read_at ON reading_history(read_at);
```

### 7. bookmarks
Stores user bookmarked articles.

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  article_id UUID NOT NULL,
  bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email, article_id)
);

-- Indexes for performance
CREATE INDEX idx_bookmarks_app_id ON bookmarks(app_id);
CREATE INDEX idx_bookmarks_email ON bookmarks(email);
CREATE INDEX idx_bookmarks_article_id ON bookmarks(article_id);
```

### 8. email_preferences
Stores user email digest preferences.

```sql
CREATE TABLE email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  frequency TEXT DEFAULT 'off', -- 'off', 'daily', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

-- Indexes for performance
CREATE INDEX idx_email_preferences_app_id ON email_preferences(app_id);
CREATE INDEX idx_email_preferences_email ON email_preferences(email);
CREATE INDEX idx_email_preferences_frequency ON email_preferences(frequency);
```

### 9. referral_codes
Stores user referral codes and tracking stats.

```sql
CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  earnings DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, code),
  UNIQUE(app_id, email)
);

-- Indexes for performance
CREATE INDEX idx_referral_codes_app_id ON referral_codes(app_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);
CREATE INDEX idx_referral_codes_email ON referral_codes(email);
```

### 10. referral_events
Tracks individual referral clicks and conversions.

```sql
CREATE TABLE referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'click', 'conversion'
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_referral_events_app_id ON referral_events(app_id);
CREATE INDEX idx_referral_events_code ON referral_events(referral_code);
CREATE INDEX idx_referral_events_type ON referral_events(event_type);
CREATE INDEX idx_referral_events_tracked_at ON referral_events(tracked_at);
```

### 11. comments
Stores article comments and discussions.

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  article_id UUID NOT NULL,
  email TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_comments_app_id ON comments(app_id);
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comments_email ON comments(email);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### 12. article_ratings
Stores user ratings for articles.

```sql
CREATE TABLE article_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  article_id UUID NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, article_id, email)
);

-- Indexes for performance
CREATE INDEX idx_article_ratings_app_id ON article_ratings(app_id);
CREATE INDEX idx_article_ratings_article_id ON article_ratings(article_id);
CREATE INDEX idx_article_ratings_email ON article_ratings(email);
```

### 13. user_follows
Stores user follow relationships for social features.

```sql
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  follower_email TEXT NOT NULL,
  following_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, follower_email, following_email),
  CONSTRAINT no_self_follow CHECK (follower_email != following_email)
);

-- Indexes for performance
CREATE INDEX idx_user_follows_app_id ON user_follows(app_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_email);
CREATE INDEX idx_user_follows_following ON user_follows(following_email);
```

### 14. article_tags
Stores tags/categories for articles for better content discovery.

```sql
CREATE TABLE article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  article_id UUID NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, article_id, tag)
);

-- Indexes for performance
CREATE INDEX idx_article_tags_app_id ON article_tags(app_id);
CREATE INDEX idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag ON article_tags(tag);
```

### 15. user_author_profiles
Extended user profiles for authors (bio, avatar, social links).

```sql
CREATE TABLE user_author_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  articles_count INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

-- Indexes for performance
CREATE INDEX idx_user_author_profiles_app_id ON user_author_profiles(app_id);
CREATE INDEX idx_user_author_profiles_email ON user_author_profiles(email);
```

### 16. notification_preferences
Stores user notification settings for various features.

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  new_articles_from_followed BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true,
  newsletter BOOLEAN DEFAULT true,
  comments_on_articles BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

-- Indexes for performance
CREATE INDEX idx_notification_preferences_app_id ON notification_preferences(app_id);
CREATE INDEX idx_notification_preferences_email ON notification_preferences(email);
```

### 17. email_queue
Queue for sending batch emails (sent articles from followed authors).

```sql
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  article_id UUID NOT NULL,
  author_email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'new_article_from_followed'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, recipient_email, article_id, author_email)
);

-- Indexes for performance
CREATE INDEX idx_email_queue_app_id ON email_queue(app_id);
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_created_at ON email_queue(created_at);
```

## Supported Apps

The system supports multi-tenant architecture with three apps:
- `crypto` - Cryptocurrency focused content
- `intelligence` - AI/Intelligence focused content
- `onlinebiz` - Online business focused content

Each app can have independent articles, subscribers, and analytics.

## API Endpoints

### Articles

**Get all articles:**
- `GET /api/articles` - Returns 50 most recent published articles

**Get article by slug:**
- `GET /api/articles/{slug}` - Returns single article and increments view count

**Get article categories:**
- `GET /api/articles/categories` - Get all tags/categories for published articles

**Search articles:**
- `GET /api/articles/search?q=keyword&tag=category` - Search articles by keyword and/or category

**Admin - List all articles:**
- `GET /api/admin/articles` - Returns all articles (draft + published)

**Admin - Create article:**
- `POST /api/admin/articles` - Create new article

**Admin - Update article:**
- `PATCH /api/admin/articles/{id}` - Update article

**Admin - Delete article:**
- `DELETE /api/admin/articles/{id}` - Delete article

### Personalization

**Get recommendations:**
- `GET /api/articles/recommendations?email=user@example.com` - Get personalized recommendations based on reading history

**Get trending articles:**
- `GET /api/articles/trending?range=7d&limit=10` - Get trending articles (24h, 7d, 30d)

**Get related articles:**
- `GET /api/articles/related?article_id=uuid&limit=5` - Get articles related by tags

### Newsletter

**Subscribe to newsletter:**
- `POST /api/newsletter/subscribe` - Subscribe email to newsletter

**Admin - List subscribers:**
- `GET /api/admin/subscribers` - Get all subscribers for app

**Admin - Send newsletter:**
- `POST /api/admin/newsletter/send` - Send newsletter to all active subscribers

### User System

**Get user profile:**
- `GET /api/users/profile?email=user@example.com` - Get user profile and subscription status

**Update user profile:**
- `POST /api/users/profile` - Create or update user profile and preferences

**Get reading history:**
- `GET /api/users/reading-history?email=user@example.com` - Get user's reading history

**Track article read:**
- `POST /api/users/reading-history` - Record that user read an article

**Get bookmarks:**
- `GET /api/users/bookmarks?email=user@example.com` - Get user's bookmarked articles

**Add bookmark:**
- `POST /api/users/bookmarks` - Save article to bookmarks

**Remove bookmark:**
- `DELETE /api/users/bookmarks?email=user@example.com&article_id=uuid` - Remove article from bookmarks

### Subscriptions

**Get subscription tiers:**
- `GET /api/subscriptions/tiers` - Get all available subscription tiers

**Get user subscription:**
- `GET /api/subscriptions/user?email=user@example.com` - Get user's current subscription

**Update user subscription:**
- `POST /api/subscriptions/user` - Upgrade or downgrade subscription

**Check article access:**
- `GET /api/articles/access?email=user@example.com&article_id=uuid` - Check if user has access to article

### Email & Digest

**Get digest preferences:**
- `GET /api/emails/digest?email=user@example.com` - Get digest preferences and top articles

**Update digest preferences:**
- `POST /api/emails/digest` - Update digest frequency (daily/weekly/off)

### Referrals

**Generate referral code:**
- `GET /api/referrals/generate?email=user@example.com` - Generate or retrieve user's referral code

**Track referral event:**
- `POST /api/referrals/track` - Track referral click or conversion

### Revenue & Monetization

**Track revenue event:**
- `POST /api/admin/revenue/track` - Track click, conversion, or impression event

**Get revenue statistics:**
- `GET /api/admin/revenue/stats` - Get revenue metrics and top affiliates

### Analytics

**Get analytics:**
- `GET /api/admin/analytics` - Get metrics and top articles

## Setup Instructions

1. Create a new Supabase project or use existing
2. Run the SQL migration above in the SQL editor
3. Configure Row Level Security (RLS) policies if needed
4. Ensure environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Email Configuration

The system supports email notifications via Resend API. Configure the following:

1. Set environment variable: `RESEND_API_KEY`
2. Create email addresses for each app:
   - `noreply@crypto.zyperia.com`
   - `noreply@intelligence.zyperia.com`
   - `noreply@onlinebiz.zyperia.com`

Email features:
- Subscription confirmation emails
- Newsletter sending to subscribers
- Transactional email notifications

## Seed Data

Run the seed script to populate test articles:

```bash
npm run seed:articles
# or
npx ts-node scripts/seed-articles.ts
```

This will create 5 sample articles per app (15 total) with realistic test data.

## Data Flow

### Article Reading
1. User visits `/articles` page
2. Page fetches `GET /api/articles` for list
3. User clicks article, navigates to `/articles/[slug]`
4. Page fetches `GET /api/articles/[slug]`
5. API increments views count in database
6. Article renders with view count
7. Optional: Reading history tracked via `POST /api/users/reading-history`

### Newsletter Signup
1. User enters email in NewsletterSignup component
2. Component submits to `POST /api/newsletter/subscribe`
3. Email is stored in newsletter_subscribers table
4. User sees confirmation message

### Admin Management
1. Admin visits `/admin` dashboard
2. Dashboards fetch articles and subscribers from admin APIs
3. Admin can create, edit, delete articles
4. View analytics at `/admin/analytics`
5. Access revenue analytics at `/admin/revenue`

### Email Notifications & Digests
1. User subscribes via NewsletterSignup component
2. System calls `POST /api/newsletter/subscribe`
3. Optional: Subscription confirmation email sent via Resend
4. Admin can send newsletters via `POST /api/admin/newsletter/send`
5. Email sent to all active subscribers
6. User can set digest preferences: daily/weekly/off via `POST /api/emails/digest`

### Revenue Tracking
1. Admin tracks events via `POST /api/admin/revenue/track`
2. Event types: click, conversion, impression
3. Each event stores: email, article_id, amount, affiliate_code
4. View revenue stats at `/admin/revenue`
5. Dashboard shows total revenue, conversion rate, top affiliates

### User Preferences & Profile
1. User visits preferences modal or settings page
2. User enters email and selects notification preferences
3. Preferences saved via `POST /api/users/profile`
4. User profile created with email and preferences object
5. Profile linked to newsletter subscription status

### Reading History Tracking
1. User reads an article via `/articles/[slug]`
2. Optional: Component tracks read time
3. POST request to `POST /api/users/reading-history` with article_id and read_time
4. Record stored in reading_history table
5. Used for personalized recommendations

### Bookmarking Articles
1. User clicks bookmark button on article
2. Component sends `POST /api/users/bookmarks` with article_id
3. Record stored in bookmarks table
4. User can view bookmarks in dedicated page
5. DELETE request removes bookmark

### Personalized Recommendations
1. User opens recommendations widget
2. Widget fetches `GET /api/articles/recommendations`
3. API queries reading_history for user's read articles
4. Returns top unread articles by views
5. Widget displays 4-5 recommended articles

### Subscription & Access Control
1. User accesses article via `/articles/[slug]`
2. Component checks access via `GET /api/articles/access?email=user&article_id=id`
3. API queries user_subscriptions table for tier
4. Compares article access_level to user tier
5. Shows paywall if access denied
6. User can upgrade via `POST /api/subscriptions/user`

### Referral System
1. User requests referral code via `GET /api/referrals/generate?email=user@example.com`
2. API generates 8-character code or retrieves existing
3. Code stored in referral_codes table
4. User shares referral link with others
5. Clicks tracked via `POST /api/referrals/track` with referralCode and eventType
6. Conversions tracked separately (click → conversion)
7. Earnings calculated from conversion events
