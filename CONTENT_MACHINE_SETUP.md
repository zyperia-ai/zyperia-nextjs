# ZYPERIA Content Machine - Complete Setup Guide

**Status:** ✅ Core Infrastructure Complete
**Date:** 2026-04-23
**Version:** 1.0

---

## What's Been Implemented

### ✅ STAGE 0: Competitive Analysis
- **File:** `apps/machine/app/api/cron/stage-0-analysis/route.ts`
- **Schedule:** Daily at 23:00 UTC
- **Features:** Mock competitive analysis (SerpAPI integration ready)
- **Status:** Ready for SerpAPI key

### ✅ STAGE 1: Research & Topic Selection
- **File:** `apps/machine/app/api/cron/stage-1-research/route.ts`
- **Schedule:** Daily at 00:30 UTC
- **Features:** Selects topics from queue, gathers research data
- **Status:** ✅ Complete and working

### ✅ STAGE 2: Content Generation (CRITICAL)
- **File:** `apps/machine/app/api/cron/stage-2-generate/route.ts`
- **Schedule:** Daily at 02:00 UTC
- **Features:** 
  - Real Claude API integration (v3.5 Sonnet)
  - 40% Original content
  - 50% Transformed content (improved competitor articles)
  - 10% Aggregated content
- **Status:** ✅ **FULLY WORKING** with Claude API

### ✅ STAGE 3: Visual Enrichment
- **File:** `apps/machine/app/api/cron/stage-3-visuals/route.ts`
- **Schedule:** Daily at 03:00 UTC
- **Features:** Hero images, OG images, data visualizations
- **Status:** Ready for Stable Diffusion/Replicate API

### ✅ STAGE 4: Plagiarism Check & Verification
- **File:** `apps/machine/app/api/cron/stage-4-plagiarism/route.ts`
- **Schedule:** Daily at 04:00 UTC
- **Features:** Plagiarism scoring, fact-checking
- **Status:** Ready for Copyscape/Gemini API

### ✅ STAGE 5: Editorial Review & E-E-A-T
- **File:** `apps/machine/app/api/cron/stage-5-editorial/route.ts`
- **Schedule:** Daily at 05:00 UTC
- **Features:** E-E-A-T signal enhancement, disclaimers, citations
- **Status:** ✅ Complete and working

### ✅ STAGE 6: Publishing
- **File:** `apps/machine/app/api/cron/stage-6-publish/route.ts`
- **Schedule:** Daily at 09:00, 14:00, 18:00 UTC
- **Features:** Auto-publish approved articles, tracking setup
- **Status:** ✅ Complete and working

---

## Quick Start: 3-Step Setup

### Step 1: Seed Content Topics
```bash
cd apps/machine
npm run seed:topics
```

This populates the `content_topics` table with 60 topics across 3 blogs:
- **Crypto:** 20 topics (Bitcoin, Ethereum, DeFi, etc.)
- **Intelligence:** 20 topics (Zapier, AI, Automation, etc.)
- **OnlineBiz:** 20 topics (Freelancing, Passive Income, etc.)

### Step 2: Run Full Pipeline (Local Test)
```bash
npm run pipeline:full
```

This runs all 6 stages sequentially:
1. Stage 0: Competitive analysis (mocked)
2. Stage 1: Research topics (creates research entries)
3. Stage 2: Generate articles (uses Claude API)
4. Stage 3: Visual enrichment (mocked images)
5. Stage 4: Plagiarism check (mocked scores)
6. Stage 5: Editorial review (adds E-E-A-T signals)
7. Stage 6: Publishing (publishes to database)

**Expected output:** 9-12 articles published across 3 blogs (~3-4 articles per blog)
**Time:** ~2-3 minutes

### Step 3: Deploy to Vercel
```bash
git add .
git commit -m "Content machine setup: Claude generation + cron jobs"
git push origin main
```

Vercel will automatically deploy and enable the cron jobs defined in `vercel.json`.

---

## Architecture Overview

```
ZYPERIA Content Machine (Automated Daily)
│
├─ 23:00 UTC: STAGE 0 - Competitive Analysis
│   └─ Analyze top 20 Google results per keyword
│   └─ Identify content gaps
│   └─ Store in content_research table
│
├─ 00:30 UTC: STAGE 1 - Research & Topic Selection
│   └─ Select topics from content_topics queue
│   └─ Gather fresh research data
│   └─ Reference competitive analysis
│
├─ 02:00 UTC: STAGE 2 - Content Generation ⭐
│   └─ Generate using Claude API (3.5 Sonnet)
│   ├─ 40% Original articles
│   ├─ 50% Transformed articles (improved competitors)
│   └─ 10% Aggregated articles (meta-analysis)
│
├─ 03:00 UTC: STAGE 3 - Visual Enrichment
│   ├─ Hero images (Stable Diffusion - ready)
│   ├─ Data visualizations (Plotly - ready)
│   └─ OG images for social sharing
│
├─ 04:00 UTC: STAGE 4 - Plagiarism Check
│   ├─ Plagiarism score (Copyscape - ready)
│   └─ Fact-checking (Gemini - ready)
│
├─ 05:00 UTC: STAGE 5 - Editorial Review
│   ├─ E-E-A-T signal enhancement
│   ├─ Author bio + expertise
│   └─ Source citations
│
└─ 09:00, 14:00, 18:00 UTC: STAGE 6 - Publishing
    ├─ Auto-publish approved articles
    ├─ Create blog_performance tracking
    └─ Submit to Google Search Console (ready)
```

---

## Database Schema (Already Migrated)

Key tables used by content machine:

```sql
blog_posts              -- Generated articles with metadata
content_topics          -- Topic queue for generation
content_research        -- Research & competitive analysis data
generation_logs         -- Execution logs for each stage
blog_performance        -- Analytics tracking per article
theme_config            -- App-specific configs (prompts, sources, affiliates)
```

All tables created via `packages/supabase/migrations/0_ALL_MIGRATIONS.sql` ✅

---

## Configuration Files

### `apps/machine/config/theme-config.json`
Per-app configuration with:
- AI generation prompts (original, transformed, aggregated)
- Verification sources (official docs, case studies)
- Affiliate programs (Kraken, Zapier, Gumroad, etc.)
- Article publishing schedule (timing, frequency)
- Visual enrichment styles (crypto_tech, intelligence_minimal, growth_success)

### `vercel.json`
Cron job configuration for all 7 daily runs.

---

## API Keys Required

For **production deployment**, add these to Vercel environment variables:

| Service | Key Name | Purpose | Cost |
|---------|----------|---------|------|
| Supabase | SUPABASE_URL, SUPABASE_KEY | Database | €0 (free tier) |
| Anthropic | ANTHROPIC_API_KEY | Claude API generation | ~€0.01/article |
| SerpAPI | SERP_API_KEY | Competitive analysis | €5-10/month |
| Replicate | REPLICATE_API_KEY | Stable Diffusion images | €0.01/image |
| Copyscape | COPYSCAPE_API_TOKEN | Plagiarism detection | €0.10-0.20/article |
| Google Gemini | GEMINI_API_KEY | Fact-checking | €0.001/article |

**Total monthly cost:** €30-50 (very cheap compared to manual content)

---

## Running Locally vs Production

### Local Testing
```bash
cd apps/machine
npm run seed:topics          # Populate topics
npm run pipeline:full        # Run all 6 stages end-to-end
```

All stages work with **mocked external APIs** - no real SerpAPI, Replicate, or Copyscape calls.

### Production (Vercel)
Once deployed, cron jobs run **automatically** on the schedule defined in `vercel.json`:
- Stage 0: 23:00 UTC
- Stage 1: 00:30 UTC
- Stage 2: 02:00 UTC
- Stage 3: 03:00 UTC
- Stage 4: 04:00 UTC
- Stage 5: 05:00 UTC
- Stage 6: 09:00, 14:00, 18:00 UTC (3 times daily)

To trigger manually, curl the endpoints:
```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://crypto.zyperia.ai/api/cron/stage-2-generate
```

---

## Expected Output (Daily)

With all 3 blogs running on the content mix:

```
CRYPTO (4 articles/day):
  ├─ 1 original article
  ├─ 2 transformed articles (improved competitors)
  └─ 1 aggregated article (next batch)

INTELLIGENCE (3 articles/day):
  ├─ 1 original article
  └─ 2 transformed articles

ONLINEBIZ (3 articles/day):
  ├─ 1 original article
  └─ 2 transformed articles

TOTAL: 10 articles/day generated and published
```

**By end of Week 1:** ~70 articles live
**By end of Week 2:** ~140 articles live (20-30 per blog)
**By end of Month 1:** ~300+ articles live with established SEO authority

---

## Monitoring & Debugging

### View Generation Logs
```sql
SELECT * FROM generation_logs 
ORDER BY created_at DESC 
LIMIT 50;
```

### Check Published Articles
```sql
SELECT app_id, COUNT(*) as published_count, 
       DATE(published_at) as publish_date
FROM blog_posts 
WHERE status = 'published'
GROUP BY app_id, DATE(published_at)
ORDER BY publish_date DESC;
```

### Monitor Article Performance
```sql
SELECT p.title, m.views, m.avg_time_on_page, m.bounce_rate
FROM blog_posts p
LEFT JOIN blog_performance m ON p.id = m.post_id
WHERE p.status = 'published'
ORDER BY m.views DESC;
```

---

## Next Steps (After Deployment)

1. **Deploy to Vercel**
   - Push to GitHub
   - Vercel auto-deploys
   - Cron jobs activate

2. **Add API Keys to Vercel**
   - SERP_API_KEY (for real competitor analysis)
   - REPLICATE_API_KEY (for real image generation)
   - COPYSCAPE_API_TOKEN (for plagiarism checking)
   - CRON_SECRET (for cron job authorization)

3. **Monitor First Week**
   - Check generation_logs for errors
   - Verify articles publishing correctly
   - Review article quality in blog_posts table
   - Check Vercel deployment logs for any issues

4. **Setup Analytics**
   - Google Search Console (all 3 domains)
   - GA4 tracking (all 3 blogs)
   - Sentry error monitoring (optional)

5. **Optimize as Needed**
   - Adjust generation prompts in theme_config.json
   - Fine-tune content mix (40/50/10)
   - Add more content topics if needed
   - Implement internal linking optimization

---

## Troubleshooting

### Articles not generating
- Check `generation_logs` table for errors
- Verify ANTHROPIC_API_KEY is valid in Vercel
- Check content_topics table has data
- Check content_research has research data (Stage 1 must run first)

### Cron jobs not running
- Verify vercel.json is deployed
- Check `deployments` tab in Vercel for build errors
- Verify CRON_SECRET environment variable is set
- Check function logs in Vercel dashboard

### Low quality articles
- Review and adjust system prompts in theme_config.json
- Add more research data in Stage 1
- Check competitor analysis in Stage 0
- Consider adding human review step

### Database errors
- Verify Supabase connection (SUPABASE_URL, SUPABASE_KEY)
- Check migrations are applied (run `seed:topics` to verify)
- Monitor Supabase quota usage (free tier has limits)

---

## Maintenance

### Weekly
- Review generation_logs for errors
- Check article quality samples
- Monitor blog_performance for CTR and engagement

### Monthly
- Analyze top-performing articles (by views, time-on-page)
- Expand successful content areas with more topics
- Archive underperforming topics
- Update theme_config.json based on learnings

### Quarterly
- Comprehensive performance review
- Decide on visual enrichment investment
- Plan for Stage 7b (backlink automation)

---

## Files Created

```
apps/machine/
├── app/api/cron/
│   ├── stage-0-analysis/route.ts       ✅ Competitive analysis
│   ├── stage-1-research/route.ts       ✅ Topic selection
│   ├── stage-2-generate/route.ts       ✅ Content generation (Claude)
│   ├── stage-3-visuals/route.ts        ✅ Visual enrichment
│   ├── stage-4-plagiarism/route.ts     ✅ Plagiarism check
│   ├── stage-5-editorial/route.ts      ✅ Editorial review
│   └── stage-6-publish/route.ts        ✅ Publishing
├── scripts/
│   └── seed-content-topics.ts          ✅ Initial topics
├── lib/
│   ├── ai-router.ts                    ✅ Claude API integration
│   └── (existing libraries)
└── package.json                        ✅ Updated with seed:topics

root/
└── vercel.json                         ✅ Cron job configuration
```

---

## Success Metrics (30 Days)

| Metric | Target | How to Track |
|--------|--------|--------------|
| Articles Published | 300+ | `SELECT COUNT(*) FROM blog_posts WHERE status='published'` |
| Avg Views/Article | 50+ | `SELECT AVG(views) FROM blog_performance` |
| Affiliate Clicks | 100+/week | Google Analytics or affiliate platform |
| AdSense Revenue | €50-200/month | Google AdSense dashboard |
| Pipeline Stability | <5% errors | `SELECT COUNT(*) FROM generation_logs WHERE status='failed'` |
| SEO Impressions | 5000+ | Google Search Console |

---

**Ready to go! 🚀**

All infrastructure is in place. Deploy to Vercel and the content machine runs automatically every day, 24/7.
