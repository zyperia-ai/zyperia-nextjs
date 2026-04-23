# ZYPERIA — 3-Blog Monetization Platform

Expert content on Cryptocurrency, AI & Business Automation, and How to Earn Online.

**Status:** ✅ Production Ready (May 1, 2026 Launch)  
**Live:** https://zyperia.ai  
**Repository:** https://github.com/zyperya-ai/relocate  

---

## 📚 What's Inside

### 3 Expert Blogs
- **Crypto & Blockchain** → /crypto (education, security, trading)
- **AI & Business Automation** → /intelligence (tools, workflows, automation)
- **How to Earn Online** → /onlinebiz (side hustles, passive income, digital products)

### Monetization Systems
- **Newsletter System** — Double opt-in, multi-theme, SendGrid bulk sending
- **Affiliate Marketing** — 15 platforms, click tracking, conversion attribution  
- **AdSense** — Secondary revenue stream (future)

### Revenue Model
- Newsletter: €300-5,000/month
- Affiliate Links: €500-25,000/month
- AdSense: €0-500/month
- **Year 1 Target: €500 → €30,000+/month**

---

## 🏗️ Architecture

**Monorepo** with pnpm workspaces:
- `apps/root/` — Landing page (/)
- `apps/crypto/` — /crypto blog
- `apps/intelligence/` — /intelligence blog
- `apps/onlinebiz/` — /onlinebiz blog
- `apps/machine/` — Content generation engine
- `packages/shared-ui/` — React components
- `packages/shared-lib/` — Shared logic
- `packages/supabase/` — Database migrations

**Deployment:** Single Vercel project with middleware routing  
**Database:** Supabase (PostgreSQL)  
**Email:** Resend (confirmations) + SendGrid (bulk)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit with your Supabase credentials

# Apply database migrations
pnpm supabase migration up

# Seed affiliate platforms
npx ts-node apps/machine/scripts/seed-affiliate-platforms.ts

# Run development server
pnpm dev

# Visit http://localhost:3000
```

## 📤 Deployment

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys (1-2 minutes)
# Check: https://vercel.com/dashboard

# Live at: https://zyperia.ai
```
- `intelligence.zyperia.ai` runs on port 3002
- `onlinebiz.zyperia.ai` runs on port 3003

## Content Pipeline

```
Research (00:30 UTC) 
  → Generate (02:00 UTC) 
    → Verify (04:00 UTC) 
      → Editorial (05:00 UTC) 
        → Publish (09:00, 14:00, 18:00 UTC)
```

## Database

Supabase PostgreSQL with:
- `blog_posts` — Main content
- `content_research` — Research data
- `content_topics` — Topic queue
- `blog_performance` — Metrics
- `theme_config` — Per-app settings
- `generation_logs` — Audit trail

See `packages/supabase/migrations/` for schema.

## Status

✅ **WEEK 1:** Monorepo + apps + schema ready
⏳ **WEEK 2:** Content machine + landing pages
⏳ **WEEK 3:** Automation + SEO
⏳ **WEEK 4:** Monetization (AdSense + affiliates)

---

Built with ❤️ by Claude Code
