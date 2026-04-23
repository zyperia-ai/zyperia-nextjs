# ZYPERIA Deployment Guide

## Status: Ready for Vercel Deployment ✅

All builds passing. Next steps:

---

## 1. Apply Database Migrations

### Option A: Supabase Dashboard (Easiest)

1. Go to: https://app.supabase.com/
2. Open your project
3. Go to **SQL Editor** → **New Query**
4. Copy contents from: `packages/supabase/migrations/0_ALL_MIGRATIONS.sql`
5. Run the query

### Option B: Supabase CLI

```bash
npm install -g @supabase/cli
supabase link --project-ref echhftptqtznxqpvjgta
supabase db push
```

### Migrations Applied:
- ✅ `001_blog_schema.sql` — Core blog, research, topics, performance tables
- ✅ `002_brutal_system_extension.sql` — Competitive analysis, visual enrichment fields
- ✅ `003_affiliate_tracking.sql` — Affiliate links, clicks, conversions

---

## 2. Vercel Deployment

### Create 3 Vercel Projects

```bash
# For crypto.zyperia.ai
vercel deploy --name zyperia-crypto apps/crypto

# For intelligence.zyperia.ai
vercel deploy --name zyperia-intelligence apps/intelligence

# For onlinebiz.zyperia.ai
vercel deploy --name zyperia-onlinebiz apps/onlinebiz
```

### Set Environment Variables in Each Project

In Vercel dashboard, add these for **each** project (values in `.env.local`):

```
SUPABASE_URL
SUPABASE_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
RESEND_API_KEY
ANTHROPIC_API_KEY
```

---

## 3. Configure Custom Domains

In Vercel for each project:

- **zyperia-crypto** → `crypto.zyperia.ai`
- **zyperia-intelligence** → `intelligence.zyperia.ai`
- **zyperia-onlinebiz** → `onlinebiz.zyperia.ai`

Update DNS records to point to Vercel nameservers.

---

## 4. Next.js Middleware for Routing

Middleware configured in `apps/*/middleware.ts`:
- Rewrites subdomains to correct app
- Handles static files + API routes
- Environment-aware (dev/prod)

---

## 5. Newsletter System Ready ✅

- **Resend** for transactional emails (confirmations, reminders)
- **Database** for subscriptions (newsletter_subscriptions table)
- **API Routes** all fixed and tested

Test with:
```bash
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","themes":["crypto"],"source":"crypto_site"}'
```

---

## 6. Content Machine (Optional for Week 2)

When ready to generate content:
```bash
cd apps/machine
pnpm run stage-0  # Competitive analysis
pnpm run stage-1  # Research topics
pnpm run stage-2  # Generate articles
# ... etc
```

---

## Files Changed

**Core Infrastructure:**
- ✅ `.env.local` — Real credentials
- ✅ All API routes — Fixed Supabase lazy initialization
- ✅ Newsletter service — Using Resend (not SendGrid)
- ✅ Build — All 3 apps pass `pnpm build`

**New Pages:**
- ✅ `apps/*/app/newsletter-confirmed/page.tsx`
- ✅ `apps/*/app/newsletter-error/page.tsx`

**Database:**
- ✅ Migrations consolidated in `packages/supabase/migrations/0_ALL_MIGRATIONS.sql`

---

## Quick Start Command

```bash
# Build locally
pnpm build

# Deploy to Vercel (after setup)
vercel deploy --prod

# Run locally
pnpm dev  # Runs all 3 apps on ports 3001, 3002, 3003
```

---

**Ready to deploy?** Next step is applying migrations to Supabase, then deploying to Vercel.
