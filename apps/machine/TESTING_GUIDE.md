# ZYPERIA Brutal System — Testing & Verification Guide

## Overview

The ZYPERIA content machine consists of 7 interconnected stages that transform raw topics into published, visually-enriched, plagiarism-checked articles. This guide explains how to test and verify each stage works correctly.

**Status:** ✓ Local testing infrastructure complete (no external APIs required)

---

## Quick Start: Run Full Pipeline Test

```bash
# From apps/machine directory
npm run test:all

# Or step by step:
npm run mock:generate     # Create test data
npm run test:local        # Run all 7 stages with mock data
```

Expected output: Full pipeline completes in <30s, generates 15-20 test articles across 3 blogs.

---

## Stage Breakdown

### Stage 0: Competitive Analysis (23:00 UTC)
**Purpose:** Identify top-performing competitor articles and content gaps

**What it does:**
- Queries SerpAPI for top 20 Google results per keyword
- Analyzes competitor article structure, word count, sources
- Identifies content gaps (what competitors miss)
- Recommends generation approach (original/transformed/aggregated)
- Stores analysis in `content_research` table

**Files:**
- Main: `scripts/stage-0-competitive-analysis.ts`
- Library: `lib/competitive-intelligence.ts`

**Test locally:**
```bash
npm run stage:0
```

**Expected output:**
```
=== STAGE 0: COMPETITIVE ANALYSIS ===
Started at: 2026-04-22T...
Analyzing competitive landscape for: crypto
  ✓ Analyzed "bitcoin": 15 competitors, 4 gaps identified (2.3s)
  ✓ Analyzed "ethereum": 18 competitors, 3 gaps identified (1.9s)
```

**Depends on:** SerpAPI key (external API, will skip if missing in local test)

**To verify:**
- [ ] Stage runs without errors
- [ ] `content_research` table populated with competitive analysis
- [ ] Each analysis includes: top_performing_articles, content_gaps, recommended_approach
- [ ] Logs show competitive analysis confidence scores 80%+

---

### Stage 1: Research & Topic Selection (00:30 UTC)
**Purpose:** Select topics and gather fresh research data

**What it does:**
- Loads topic queue from `content_topics` table
- Performs web research for each topic (current news, updates)
- References competitive analysis from Stage 0
- Compiles research data: facts, stats, angles, sources
- Stores research in `content_research` table

**Files:**
- Main: `scripts/stage-1-research-topics.ts`

**Test locally:**
```bash
npm run stage:1
```

**Expected output:**
```
=== STAGE 1: RESEARCH & TOPIC SELECTION ===
[crypto] Researching topics...
  ✓ "Bitcoin for Beginners": Research complete
  ✓ "Ethereum DeFi Guide": Research complete
```

**To verify:**
- [ ] `content_research` table has entries for each blog's topics
- [ ] Each research entry includes: research_data, competitive_analysis, confidence_score
- [ ] Confidence scores: 85%+ indicates good quality research

---

### Stage 2: Content Generation (02:00 UTC)
**Purpose:** Generate articles using 3 approaches (40% original, 50% transformed, 10% aggregated)

**What it does:**
- Loads research from Stage 1
- Generates 40% original content (fresh research angle)
- Generates 50% transformed content (improved competitor articles, >30% rewrite)
- Generates 10% aggregated content (synthesized meta-analysis)
- Stores drafts in `blog_posts` table with `status='draft'`

**Content Mix Example (for 2 articles/day):**
```
Crypto (4 articles/day):
  - 2 original
  - 2 transformed
  - 0 aggregated (next day)

Intelligence (3 articles/day):
  - 1 original
  - 2 transformed
  - 0 aggregated

OnlineBiz (3 articles/day):
  - 1 original
  - 2 transformed
  - 0 aggregated
```

**Files:**
- Main: `scripts/stage-2-generate-articles.ts`

**Test locally:**
```bash
npm run stage:2
```

**Expected output:**
```
=== STAGE 2: CONTENT GENERATION ===
[crypto] Generating articles (4/day)...
  Generated: 2 original, 2 transformed, 0 aggregated
[intelligence] Generating articles (3/day)...
  Generated: 1 original, 2 transformed, 0 aggregated
[onlinebiz] Generating articles (3/day)...
  Generated: 1 original, 2 transformed, 0 aggregated

✓ STAGE 2 COMPLETE – 9 articles generated
```

**To verify:**
- [ ] All articles created with `status='draft'`
- [ ] Each article has: title, slug, content, excerpt, meta_description, keywords
- [ ] `generation_approach` correctly set (original/transformed/aggregated)
- [ ] `transformation_of` field populated for transformed articles
- [ ] Generation logs track duration and approach used

---

### Stage 3: Visual Enrichment (03:00 UTC)
**Purpose:** Generate hero images, data visualizations, and OG images (THE BRUTAL SYSTEM DIFFERENTIATOR)

**What it does:**
- Generates unique hero image per article (Stable Diffusion)
  - Crypto: "crypto_tech_aesthetic" (neon colors, blockchain visuals)
  - Intelligence: "tech_minimal" (clean, professional)
  - OnlineBiz: "growth_success" (aspirational, upward trends)
- Detects numeric data → auto-generates Plotly charts
- Generates OG image for social sharing (1200x630px)
- Stores images in Supabase Storage
- Updates article with image URLs

**Files:**
- Main: `scripts/stage-3-visual-enrichment.ts`
- Library: `lib/visual-enrichment.ts`

**Test locally:**
```bash
npm run stage:3
```

**Expected output:**
```
=== STAGE 3: VISUAL ENRICHMENT ===
Enriching 12 articles with visuals...
  ✓ Hero image: crypto_tech_aesthetic
  ✓ Visualizations: 2 charts detected and generated
  ✓ OG image: 1200x630px created
✓ 12 articles enriched with visuals (4.2s)
```

**To verify:**
- [ ] All articles have `hero_image_url` populated
- [ ] All articles have `og_image_url` populated
- [ ] `visualizations` JSONB includes chart metadata
- [ ] Images stored in Supabase with correct naming: `/articles/[id]/hero-[version].png`
- [ ] Visual enrichment takes 2-5s per article

---

### Stage 4: Plagiarism Check & Verification (04:00 UTC)
**Purpose:** Verify uniqueness (critical for transformed content) and fact-check claims

**What it does:**
- Original articles: 85%+ uniqueness expected
- Transformed articles: 70%+ uniqueness required (minimum 30% rewrite)
- Aggregated articles: 80%+ uniqueness expected
- Fact-checks critical claims using Gemini Flash
- Plagiarism score < 30 = approved
- Plagiarism score 30-50 = warning, needs review
- Plagiarism score > 50 = rejected, mark for rework

**Files:**
- Main: `scripts/stage-4-plagiarism-check.ts`
- Library: `lib/plagiarism-checker.ts`

**Test locally:**
```bash
npm run stage:4
```

**Expected output:**
```
=== STAGE 4: PLAGIARISM CHECK & VERIFICATION ===
Verifying uniqueness of 12 articles...
✓ Original articles: avg 92% unique
✓ Transformed articles: avg 76% unique (all >70%)
✓ Aggregated articles: avg 84% unique
✓ Plagiarism checks complete: 12 passed, 0 warnings
```

**To verify:**
- [ ] All articles have `plagiarism_score` between 0-100
- [ ] Original articles: plagiarism_score > 80
- [ ] Transformed articles: plagiarism_score > 70
- [ ] Aggregated articles: plagiarism_score > 75
- [ ] `plagiarism_checked_at` timestamp populated
- [ ] Verification logs include plagiarism_check_result JSONB

---

### Stage 5: Editorial Review & E-E-A-T Enhancement (05:00 UTC)
**Purpose:** Add human touch and E-E-A-T signals

**What it does:**
- Checks plagiarism_score >= 70 (skip articles that failed)
- Enhances content with:
  - Disclaimer at top (educational/not financial advice)
  - Author expertise bio (10+ years experience)
  - Sources & References section
  - Related Articles internal links
  - JSON-LD schema markup (SEO)
- Updates `last_verified_at` to mark as reviewed
- Keeps status as 'draft' for final stage

**Files:**
- Main: `scripts/stage-5-editorial-review.ts`

**Test locally:**
```bash
npm run stage:5
```

**Expected output:**
```
=== STAGE 5: EDITORIAL REVIEW & E-E-A-T ENHANCEMENT ===
Applying E-E-A-T enhancements to 12 articles...
  ✓ Disclaimer added
  ✓ Author bio added
  ✓ Sources section formatted
  ✓ Internal links populated
✓ 12 articles enhanced with E-E-A-T signals
```

**To verify:**
- [ ] All articles have `last_verified_at` timestamp
- [ ] Content includes disclaimer sections
- [ ] Content includes author expertise bio
- [ ] Content includes Sources & References
- [ ] E-E-A-T signals present in article

---

### Stage 6: Publishing (09:00, 14:00, 18:00 UTC)
**Purpose:** Auto-publish approved articles and submit to Google Search Console

**What it does:**
- Gets articles with `status='draft'` AND `last_verified_at` is set
- Final plagiarism check (score < 30)
- Updates `status='published'` and sets `published_at`
- Generates article URL: `https://[app_id].zyperia.ai/[slug]`
- Submits to Google Search Console for indexing
- Triggers GA4 event `article_published`
- Creates blog_performance entry for tracking

**Files:**
- Main: `scripts/stage-6-publish-articles.ts`

**Test locally:**
```bash
npm run stage:6
```

**Expected output:**
```
=== STAGE 6: PUBLISHING ===
Publishing 3 articles...
  ✓ Published: Bitcoin for Beginners...
    URL: https://crypto.zyperia.ai/bitcoin-for-beginners...
  ✓ Published: Zapier Automation Guide
    URL: https://intelligence.zyperia.ai/zapier-automation-guide...
✓ 3 articles published
```

**To verify:**
- [ ] Articles have `status='published'`
- [ ] `published_at` timestamp set
- [ ] `blog_performance` entry created (for analytics tracking)
- [ ] Generation log includes publishing success
- [ ] Expected URL format: `https://[app_id].zyperia.ai/[slug]`

---

## Complete End-to-End Test

Run the full pipeline with mock data (no external APIs needed):

```bash
cd apps/machine

# Option 1: Run everything with one command
npm run test:all

# Option 2: Step by step
npm run mock:generate      # Generate mock database
npm run test:local         # Run all 7 stages

# View results
cat .mock-db-after-test.json | jq '.blog_posts | length'  # Count articles
cat .mock-db-after-test.json | jq '.blog_posts[] | select(.status == "published") | .title'  # List published
```

**Expected results after full test:**
- ✓ 3 blogs configured
- ✓ 12 topics loaded
- ✓ 15-20 articles generated (mix of original/transformed/aggregated)
- ✓ All articles visually enriched
- ✓ All articles plagiarism-checked (70%+ unique)
- ✓ All articles editorially reviewed (E-E-A-T signals added)
- ✓ 3-5 articles published
- ✓ 30+ generation logs (Stage 0-6 execution records)
- ✓ Total duration: <30 seconds

---

## Critical Checks Before Go-Live (May 1)

### API Key Validation
- [ ] SUPABASE_URL + SUPABASE_KEY working
- [ ] SERP_API_KEY valid (SerpAPI)
- [ ] REPLICATE_API_KEY valid (Stable Diffusion)
- [ ] COPYSCAPE_API_TOKEN valid (plagiarism check)
- [ ] GEMINI_API_KEY valid (fact-checking)
- [ ] ANTHROPIC_API_KEY valid (Claude fallback)

### Database Validation
- [ ] All tables created: blog_posts, content_research, theme_config, generation_logs, blog_performance
- [ ] All columns present with correct types
- [ ] RLS policies enabled (if required)
- [ ] Supabase Storage bucket `zyperia-visuals` created

### Vercel Configuration
- [ ] Cron jobs configured for all 3 blogs:
  - Stage 0: 23:00 UTC
  - Stage 1: 00:30 UTC
  - Stage 2: 02:00 UTC
  - Stage 3: 03:00 UTC
  - Stage 4: 04:00 UTC
  - Stage 5: 05:00 UTC
  - Stage 6: 09:00, 14:00, 18:00 UTC
- [ ] Environment variables set in Vercel for all 3 blog projects
- [ ] CI/CD pipeline builds without errors

### Content Validation
- [ ] Theme config loaded correctly for all 3 apps
- [ ] Content topics seeded (60-90 total across 3 blogs)
- [ ] Landing pages live and accessible
- [ ] Newsletter signup functional

### Monitoring Setup
- [ ] Google Search Console connected (all 3 domains)
- [ ] GA4 property created (all 3 blogs)
- [ ] Sentry error tracking enabled
- [ ] Slack notifications configured (optional)

---

## Troubleshooting

### Stage 0: "No competitors found"
**Cause:** SerpAPI key invalid or rate-limited
**Fix:** 
1. Check `SERP_API_KEY` is valid
2. Check monthly quota not exceeded
3. Verify keyword is searchable

### Stage 2: "AI generation timeout"
**Cause:** Phi-4 via Ollama not running or Claude API timeout
**Fix:**
1. Ensure Ollama is running: `ollama serve`
2. Check Anthropic API key is valid
3. Verify network connection to API

### Stage 3: "Stable Diffusion API error"
**Cause:** Replicate API key invalid or rate-limited
**Fix:**
1. Check `REPLICATE_API_KEY` is valid
2. Check account has remaining credits
3. Monitor Replicate dashboard for errors

### Stage 4: "Plagiarism score too high"
**Cause:** Content is too similar to competitor articles or database copies
**Fix:**
1. Regenerate with different Phi-4 prompt
2. Increase transformation percentage (rewrite more)
3. Use original content approach instead

### Stage 6: "Articles not publishing"
**Cause:** plagiarism_score > 30 or last_verified_at not set
**Fix:**
1. Check Stage 4 and 5 ran successfully
2. Verify plagiarism_score <= 30
3. Verify last_verified_at timestamp exists

---

## Performance Expectations

**Single article through full pipeline:**
- Stage 0 (competitive analysis): 2-3s
- Stage 1 (research): 1-2s
- Stage 2 (generation): 10-20s (AI model time)
- Stage 3 (visual enrichment): 5-10s (image generation)
- Stage 4 (plagiarism): 2-5s
- Stage 5 (editorial): 1-2s
- Stage 6 (publishing): 1s
- **Total per article: 25-45s**

**Batch processing (10 articles/day):**
- Total time: 5-7 minutes for full pipeline
- Can run in off-peak hours (23:00-09:00 UTC)

---

## Next Steps

1. **Owner Tasks:**
   - [ ] Provide API keys (SerpAPI, Replicate, Copyscape, Gemini, Anthropic, Supabase)
   - [ ] Confirm domains and DNS setup
   - [ ] Review theme config and content topics
   - [ ] Setup monitoring (GSC, GA4, Sentry)

2. **CC Tasks (After Owner Provides Keys):**
   - [ ] Update .env files with API keys
   - [ ] Run Stage scripts in production Supabase
   - [ ] Monitor first 7 days of article generation
   - [ ] Iterate on prompts if quality issues detected

3. **Validation (Before Go-Live):**
   - [ ] 60-90 articles generated and published
   - [ ] Core Web Vitals > 90
   - [ ] Google Search Console indexing working
   - [ ] Affiliate links functional
   - [ ] Newsletter signups working

---

## Support

For issues with testing or pipeline execution:
1. Check this guide first
2. Review generation_logs for error messages
3. Check .env variables are set correctly
4. Check API rate limits and quotas
5. Review CLAUDE.md for architecture details
