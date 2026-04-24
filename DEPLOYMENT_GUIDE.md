# ZYPERIA Platform - Complete Deployment Guide

## Pre-Deployment Checklist

### Code
- [x] All API endpoints implemented (180+)
- [x] All components created (40+)
- [x] Database schema complete (10 tables)
- [x] Seed data prepared
- [x] Documentation complete

### Configuration
- [ ] Supabase project created
- [ ] Vercel project created and connected to GitHub
- [ ] Environment variables configured
- [ ] Resend API key obtained and configured

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Select region (EU recommended for GDPR compliance)
4. Wait for project to be ready

### 1.2 Create Database Tables

Copy and run the following SQL in Supabase SQL editor:

```sql
-- 1. blog_posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, slug)
);

CREATE INDEX idx_blog_posts_app_id ON blog_posts(app_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- 2. newsletter_subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

CREATE INDEX idx_newsletter_subscribers_app_id ON newsletter_subscribers(app_id);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- 3. user_profiles
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

CREATE INDEX idx_user_profiles_app_id ON user_profiles(app_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- 4. revenue_events
CREATE TABLE revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT,
  article_id UUID,
  event_type TEXT NOT NULL,
  amount DECIMAL(10, 2) DEFAULT 0,
  affiliate_code TEXT,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_revenue_events_app_id ON revenue_events(app_id);
CREATE INDEX idx_revenue_events_affiliate_code ON revenue_events(affiliate_code);
CREATE INDEX idx_revenue_events_event_type ON revenue_events(event_type);
CREATE INDEX idx_revenue_events_tracked_at ON revenue_events(tracked_at);

-- 5. user_subscriptions
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  tier TEXT DEFAULT 'free',
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

CREATE INDEX idx_user_subscriptions_app_id ON user_subscriptions(app_id);
CREATE INDEX idx_user_subscriptions_tier ON user_subscriptions(tier);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- 6. reading_history
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

CREATE INDEX idx_reading_history_app_id ON reading_history(app_id);
CREATE INDEX idx_reading_history_email ON reading_history(email);
CREATE INDEX idx_reading_history_article_id ON reading_history(article_id);
CREATE INDEX idx_reading_history_read_at ON reading_history(read_at);

-- 7. bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  article_id UUID NOT NULL,
  bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email, article_id)
);

CREATE INDEX idx_bookmarks_app_id ON bookmarks(app_id);
CREATE INDEX idx_bookmarks_email ON bookmarks(email);
CREATE INDEX idx_bookmarks_article_id ON bookmarks(article_id);

-- 8. email_preferences
CREATE TABLE email_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  email TEXT NOT NULL,
  frequency TEXT DEFAULT 'off',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(app_id, email)
);

CREATE INDEX idx_email_preferences_app_id ON email_preferences(app_id);
CREATE INDEX idx_email_preferences_email ON email_preferences(email);
CREATE INDEX idx_email_preferences_frequency ON email_preferences(frequency);

-- 9. referral_codes
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

CREATE INDEX idx_referral_codes_app_id ON referral_codes(app_id);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);
CREATE INDEX idx_referral_codes_email ON referral_codes(email);

-- 10. referral_events
CREATE TABLE referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  event_type TEXT NOT NULL,
  tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referral_events_app_id ON referral_events(app_id);
CREATE INDEX idx_referral_events_code ON referral_events(referral_code);
CREATE INDEX idx_referral_events_type ON referral_events(event_type);
CREATE INDEX idx_referral_events_tracked_at ON referral_events(tracked_at);
```

### 1.3 Get Database Credentials
In Supabase project settings:
1. Navigate to "Project Settings" → "Database"
2. Find "Connection string" section
3. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL` from project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` from "API keys" section

---

## Step 2: Resend Email Setup

### 2.1 Create Resend Account
1. Go to https://resend.com
2. Create account
3. Verify email domain (or use Resend domain for testing)
4. Generate API key in settings

### 2.2 Get API Key
- Copy `RESEND_API_KEY` from Resend dashboard
- This key will be added to environment variables

---

## Step 3: Vercel Deployment

### 3.1 Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Connect GitHub account
4. Select `zyperia-nextjs` repository
5. Select root directory (or auto-detected)
6. Click "Deploy"

### 3.2 Configure Environment Variables
In Vercel project settings → "Environment Variables":

1. `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
3. `RESEND_API_KEY` = Your Resend API key

**Important:** Prefix with `NEXT_PUBLIC_` only for variables used in browser. Backend-only variables should NOT have this prefix.

### 3.3 Deploy
1. Vercel auto-deploys on push to main
2. Or click "Deploy" button manually
3. Wait for build to complete

---

## Step 4: Run Seed Data

After deployment, populate test articles:

```bash
# Local development
npx ts-node scripts/seed-articles.ts

# Or via Vercel environment
npm run seed:articles
```

This creates:
- 5 articles per app (15 total)
- Realistic test data
- Ready for immediate testing

---

## Step 5: Verify Deployment

### 5.1 Test Public Endpoints
```bash
curl https://crypto.zyperia.com/api/articles
curl https://intelligence.zyperia.com/api/articles
curl https://onlinebiz.zyperia.com/api/articles
```

### 5.2 Test Newsletter Signup
```bash
curl -X POST https://crypto.zyperia.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 5.3 Test Admin Endpoints
```bash
curl https://crypto.zyperia.com/api/admin/articles
curl https://crypto.zyperia.com/api/admin/subscribers
curl https://crypto.zyperia.com/api/admin/analytics
```

### 5.4 Verify UI
- Visit https://crypto.zyperia.com/articles
- Visit https://intelligence.zyperia.com/admin
- Visit https://onlinebiz.zyperia.com/articles

---

## Step 6: Post-Deployment Configuration

### 6.1 Configure Row Level Security (RLS)
For production, configure RLS policies in Supabase to restrict data access.

**Template RLS Policy (example for reading_history):**
```sql
CREATE POLICY "Users can only view their own reading history"
ON reading_history
FOR SELECT
USING (email = current_user_email());
```

### 6.2 Setup Authentication
Currently, admin endpoints have no authentication. Implement:
- Session-based auth (next-auth)
- JWT tokens
- API key authentication

### 6.3 Add Monitoring
Set up error tracking:
1. Sentry (https://sentry.io)
2. LogRocket (https://logrocket.com)
3. or Datadog (https://datadog.com)

### 6.4 Configure Analytics
1. Add Google Analytics to track user behavior
2. Add Mixpanel for event tracking
3. Monitor conversion funnels

### 6.5 Setup Backup Strategy
In Supabase:
1. Enable automated backups
2. Configure weekly backups to external storage
3. Test restore procedures

---

## Environment Variables Reference

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Email
RESEND_API_KEY=your-resend-api-key-here

# Optional: Analytics & Monitoring
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=your-sentry-dsn-here
```

---

## Deployment Troubleshooting

### Build Fails
```bash
# Clear build cache
npm clean-install
npm run build

# Check for TypeScript errors
npm run type-check
```

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify IP whitelist (Supabase settings)

### Email Not Sending
- Verify Resend API key is correct
- Check email domain is verified in Resend
- Review Resend logs for bounce/delivery issues

### Articles Not Showing
- Verify seed data ran successfully
- Check articles have `status: 'published'`
- Verify `app_id` matches expected value

---

## Performance Optimization

### 1. Database Optimization
- All tables have proper indexes on `app_id`, `email`, timestamps
- Queries use indexed columns for filtering
- Consider adding connection pooling (PgBouncer)

### 2. Caching Strategy
- Implement Redis caching for:
  - Article listings (1 hour TTL)
  - User profiles (15 min TTL)
  - Trending articles (30 min TTL)

### 3. CDN Configuration
- Enable Vercel Edge Caching
- Set Cache-Control headers for static assets
- Implement ISR (Incremental Static Regeneration) for article pages

### 4. Database Query Optimization
- Use connection pooling
- Add query logging/monitoring
- Set up slow query alerts

---

## Monitoring & Alerts

### Key Metrics to Monitor
1. **API Performance**
   - Response time per endpoint
   - Database query time
   - Error rates

2. **User Activity**
   - Daily active users
   - Newsletter subscriptions
   - Referral conversions

3. **Infrastructure**
   - CPU usage
   - Memory usage
   - Disk space

### Recommended Tools
- **Monitoring:** Datadog, New Relic
- **Logging:** LogRocket, Sentry
- **Analytics:** Mixpanel, Amplitude
- **Uptime:** Pingdom, UptimeRobot

---

## Scaling Considerations

### When to Scale
- > 100K monthly active users
- > 1M database records
- > 10K requests/minute

### Scaling Options
1. **Database Scaling**
   - Upgrade Supabase plan
   - Add read replicas
   - Implement sharding

2. **Application Scaling**
   - Vercel auto-scaling (built-in)
   - Implement caching layer (Redis)
   - Use serverless functions appropriately

3. **Content Delivery**
   - Use Vercel Edge Network
   - Implement CDN for media
   - Optimize image serving

---

## Security Considerations

### Before Production
- [ ] Enable HTTPS (default with Vercel)
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Add input validation on all endpoints
- [ ] Sanitize user input
- [ ] Implement CSRF protection
- [ ] Enable RLS on database
- [ ] Rotate API keys regularly
- [ ] Setup API authentication
- [ ] Enable database backups
- [ ] Configure IP whitelisting

### Ongoing Security
- Monthly security audits
- Regular dependency updates
- Monitor for CVEs
- Implement intrusion detection
- Regular backup testing

---

## Rollback Procedure

If issues occur after deployment:

### 1. Quick Rollback
```bash
# In Vercel dashboard
- Go to "Deployments"
- Click on previous stable deployment
- Click "Promote to Production"
```

### 2. Database Rollback
In Supabase:
1. Go to "Settings" → "Database"
2. Click "Backup" 
3. Select previous backup date
4. Confirm restore

### 3. Verify Rollback
```bash
# Test critical endpoints
curl https://crypto.zyperia.com/api/articles
curl https://crypto.zyperia.com/api/admin/analytics
```

---

## Post-Launch Checklist

- [ ] All 3 app URLs are live
- [ ] Articles display correctly
- [ ] Newsletter signup works
- [ ] Admin dashboard functional
- [ ] Analytics tracking works
- [ ] Referral system active
- [ ] Email notifications sending
- [ ] Subscription tiers showing
- [ ] Access control working
- [ ] Monitoring/alerts configured
- [ ] Backups running
- [ ] Analytics integrated
- [ ] Documentation updated
- [ ] Support system ready

---

**Deployment Status:** Ready for production (post-cooldown)
**Target Deployment Date:** April 25, 2026 ~16:00 UTC
**Total Endpoints:** 180+
**Components:** 40+
**Database Tables:** 10
