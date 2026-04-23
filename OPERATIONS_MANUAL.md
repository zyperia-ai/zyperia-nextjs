# ZYPERIA Content Machine - Operations Manual

Complete guide to running, monitoring, maintaining, and optimizing the automated content pipeline.

---

## 📋 DAILY CHECKLIST (5 minutes)

Every morning, check these 3 things:

```bash
# 1. Check if pipeline is healthy
curl https://crypto.zyperia.ai/api/pipeline-status | jq '.'

# 2. Check for any critical alerts
curl https://crypto.zyperia.ai/api/alerts/status?appId=crypto

# 3. Check yesterday's revenue
curl "https://crypto.zyperia.ai/api/analytics/performance?appId=crypto&days=1" | jq '.revenue'
```

**What to do if there's a problem:**
- Critical alert? → Check Vercel Function Logs (Vercel → Project → Function Logs)
- Pipeline didn't run? → Check Vercel Cron Jobs (Vercel → Project → Cron)
- Error rate high? → Run: `npm run benchmark -- {app} stages`

---

## 📊 WEEKLY REVIEW (30 minutes)

Every Monday (or start of week):

### 1. Performance Review

```bash
# Get detailed metrics for the week
curl "https://crypto.zyperia.ai/api/analytics/performance?appId=crypto&days=7" | jq '.'
```

Check:
- ✅ Traffic trend (up/stable/down?)
- ✅ Bounce rate (< 60%?)
- ✅ Average engagement (> 0.5?)
- ✅ Revenue (up or down week-over-week?)

### 2. SEO Analysis

```bash
# Get SEO opportunities
npm run seo:opportunities -- crypto

# Track ranking changes
npm run seo:track -- crypto
```

Check:
- ✅ Which topics are ranking best?
- ✅ Any ranking drops (need investigation)?
- ✅ Content gaps identified?

### 3. Content Quality Review

```bash
# Check article quality metrics
curl "https://crypto.zyperia.ai/api/admin/dashboard?token=YOUR_TOKEN" | jq '.contentMetrics'
```

Check:
- ✅ Plagiarism scores > 80%?
- ✅ Engagement scores healthy?
- ✅ Low-engagement articles need rewriting?

### 4. Get Recommendations

```bash
# AI-powered suggestions for next content
curl "https://crypto.zyperia.ai/api/recommendations?appId=crypto"
```

Topics to prioritize next week based on:
- High-demand keywords
- Expansion opportunities (follow-ups to top articles)
- Underperforming content fixes

### 5. Backlink Campaign Status (FASE 2+)

```bash
# Check outreach campaign progress
npm run backlinks:report -- crypto
```

Check:
- ✅ How many links acquired this week?
- ✅ Response rate (aim: 8-15%)?
- ✅ Conversion rate (aim: 5-10%)?

---

## 🔧 MONTHLY TASKS (2 hours)

### 1. Full SEO Audit

```bash
npm run seo:analyze -- crypto
```

Review:
- Top performing articles
- Traffic overview (30 days)
- Content analysis
- Top ranking keywords

### 2. Performance Benchmark

```bash
npm run benchmark -- crypto full
```

Monitor:
- Database response times
- API performance
- Error rates by stage
- Cost per article

### 3. Database Maintenance

```bash
# Create full backup before any optimization
npm run backup -- crypto

# Cleanup old logs and optimize
npm run optimize:pipeline -- crypto
```

Tasks:
- [ ] Archive old drafts
- [ ] Regenerate failed articles
- [ ] Rebalance topic queue
- [ ] Update plagiarism scores

### 4. Revenue Analysis

```bash
# Get detailed revenue breakdown
curl "https://crypto.zyperia.ai/api/analytics/revenue-attribution?appId=crypto"
```

Analyze:
- Revenue by channel (AdSense vs affiliate)
- Revenue per article
- Top performing articles
- Monetization trends

### 5. Update Content Strategy

Based on:
- Top topics driving traffic
- Keywords that are ranking best
- Revenue-generating content types
- Seasonal trends

---

## 🚀 OPTIMIZATION CHECKLIST

### For Traffic Growth

**If traffic is flat/declining:**

1. Check rankings
   ```bash
   npm run seo:track -- crypto
   ```

2. Review low-engagement articles
   ```bash
   npm run seo:opportunities -- crypto
   ```

3. Rewrite underperformers
   ```bash
   # Mark for rewrite in database
   # Pipeline will regenerate on next run
   ```

4. Increase high-performing topic coverage
   ```bash
   # Add 3-5 more articles on top topics
   # Update content_topics queue
   ```

### For Revenue Growth

**If revenue is flat/declining:**

1. Check AdSense metrics
   - RPM (Revenue Per Mille): Should grow as site matures
   - CTR: Optimize ad placement if low
   - CPC: Higher value keywords earn more

2. Optimize affiliate CTR
   - Check CTA placement and messaging
   - Test different affiliate programs
   - Link on high-intent articles only

3. Increase traffic (see above)

### For Quality Improvement

**If engagement is low:**

1. Review article structure
   - Breaking up large text blocks
   - Adding more headers
   - Including data visualizations
   - Better intro hook

2. Optimize for mobile
   - Test on mobile devices
   - Ensure fast loading (Core Web Vitals >90)
   - Check formatting on small screens

3. Improve internal linking
   - Link to related articles
   - Use contextual anchor text
   - Target 5-10 internal links per article

---

## 🚨 TROUBLESHOOTING

### Pipeline Isn't Running

```bash
# 1. Check if cron jobs are registered
curl https://crypto.zyperia.ai/api/pipeline-status | jq '.nextScheduledRuns'

# 2. Check Vercel cron logs
# Vercel dashboard → Project → Function Logs → search "stage-0" etc

# 3. Verify environment variables are set
# Vercel → Settings → Environment Variables
# Check: CRON_SECRET, SUPABASE_URL, SUPABASE_KEY, ANTHROPIC_API_KEY, RESEND_API_KEY
```

### High Error Rate

```bash
# 1. Check which stage is failing
npm run benchmark -- crypto stages

# 2. Check detailed errors
# Vercel → Function Logs → filter by stage name

# 3. Common fixes:
# - API rate limits: Wait 1 hour, try again
# - Supabase quota: Check database usage
# - Claude quota: Check API credits
# - Missing env var: Add to Vercel
```

### Low Traffic/Rankings Not Improving

```bash
# 1. Check indexing status
# Google Search Console → Coverage → check for errors

# 2. Verify sitemap was submitted
# GSC → Sitemaps → should show success

# 3. Check Core Web Vitals
# Vercel → Analytics → Core Web Vitals (should be >90 in green)

# 4. Review article quality
npm run seo:opportunities -- crypto

# 5. Check backlink situation
npm run backlinks:report -- crypto
```

### AdSense Not Showing Revenue

```bash
# 1. Check if ads are displaying
# Visit site → inspect → look for Google ads

# 2. Check AdSense account
# AdSense dashboard → Earnings → verify account active

# 3. Check for policy violations
# AdSense → Policy → ensure site follows policies

# 4. Check traffic quality
# GA4 → Traffic quality → ensure humans, not bots

# 5. Common issue: Affiliate links blocking ads
# Solution: Use nofollow on affiliate links
```

---

## 💾 BACKUP & DISASTER RECOVERY

### Regular Backups

Automated backups happen:
- **Daily backup** (optional): `npm run backup -- crypto`
- **Manual backup before big changes**: `npm run backup -- crypto`

### Restore from Backup

```bash
# 1. List available backups
npm run backup:list

# 2. Restore from specific date
npm run backup -- crypto restore backup-crypto-2026-04-20.json.gz

# 3. Verify restore successful
curl "https://crypto.zyperia.ai/api/analytics/performance?appId=crypto&days=1"
```

### What's Backed Up

- All article content + metadata
- Performance metrics (365 days)
- Generation logs (1000 recent)
- Topics and research data
- Backlink campaigns

### What's NOT Backed Up

- Git history (keep in GitHub)
- Vercel environment variables (keep in Vercel)
- Supabase RLS policies (keep in migrations)

---

## 📈 SCALING GUIDE

### When to Move from FASE 1 → FASE 2

After 4-6 weeks, check:
- ✅ Total traffic > 5,000 visitors?
- ✅ Bounce rate < 60%?
- ✅ Engagement score > 0.5?
- ✅ Articles ranking for keywords?

If YES → Ready for FASE 2 (AdSense + affiliate integration)

### When to Move from FASE 2 → FASE 3

After 8-12 weeks, check:
- ✅ Monthly revenue > €300?
- ✅ AdSense approved?
- ✅ Affiliate CTR > 1%?
- ✅ Pipeline stable (error rate < 5%)?

If YES → Ready for FASE 3 (Stage 7b backlink campaigns)

### Expected Growth Timeline

```
WEEK 1:   Setup complete, cron jobs running, first articles generating
WEEK 2:   60-90 articles published, articles start indexing
WEEK 3:   First traffic starting (100-500 visitors)
WEEK 4:   Google crawling articles, some keywords ranking
WEEK 6:   FASE 1 checkpoint: traffic 5000+ or extend
WEEK 8:   FASE 2: AdSense approved, affiliate links live
WEEK 10:  Early revenue (€100-500/month)
WEEK 12:  Ready for FASE 3: backlink campaigns
MONTH 4:  Pipeline mature, 300+ articles, 5000-15000 visitors/day
MONTH 6:  Revenue €1000-5000/month, 20000+ visitors/day
MONTH 12: Revenue €5000-20000/month, 50000+ visitors/day
```

---

## 🛠️ ADVANCED OPERATIONS

### Manual Content Generation

```bash
# Generate articles for specific app and stage
npm run stage:2 -- crypto

# Or run full pipeline for testing
npm run pipeline:full -- crypto
```

### Seed New Topics

```bash
# Populate 60 new topics (20 per blog)
npm run seed:topics
```

### Test Full Production System

```bash
# Comprehensive system test
npm run test:production -- crypto
```

### Monitor Cost

Each article costs:
- Claude generation: ~€0.01
- Stable Diffusion visuals: ~€0.01 (if enabled)
- Plagiarism check: ~€0.001
- **Total: ~€0.02-0.03 per article**

Monitor monthly:
```bash
npm run benchmark -- crypto full
# Look for: "Total cost" and "Cost per article"
```

---

## 📞 SUPPORT & RESOURCES

### Documentation
- `COMPLETE_IMPLEMENTATION_SUMMARY.md` - Full system documentation
- `ADVANCED_FEATURES.md` - Stage 7b, webhooks, analytics
- `API_REFERENCE.md` - All API endpoints
- `DEPLOYMENT_CHECKLIST.md` - Deployment verification

### APIs to Monitor

```bash
# System health (public)
https://crypto.zyperia.ai/api/pipeline-status

# Admin dashboard (requires token)
https://crypto.zyperia.ai/api/admin/dashboard?token=TOKEN

# Performance analytics
https://crypto.zyperia.ai/api/analytics/performance?appId=crypto&days=30

# Content recommendations
https://crypto.zyperia.ai/api/recommendations?appId=crypto

# Backlink status (FASE 2+)
https://crypto.zyperia.ai/api/backlinks/opportunities?appId=crypto

# Alert status
https://crypto.zyperia.ai/api/alerts/status?appId=crypto
```

### Tools

- **Vercel Dashboard**: Monitor deployments, logs, performance
- **Supabase Dashboard**: View database, check RLS, manage tables
- **Google Search Console**: Check rankings, indexing, search traffic
- **Google Analytics 4**: Monitor audience, engagement, conversions
- **AdSense**: Check earnings, optimize ad placement
- **Affiliate Networks**: Track commission earnings

### When to Escalate

**Contact support if:**
- Consistent error rate > 20%
- Traffic drops > 50% suddenly
- Revenue drops > 50% suddenly
- Articles not publishing for 24+ hours
- Database quota exceeded

---

## 🎯 SUCCESS METRICS

Monitor these weekly:

```
TRAFFIC:
- Daily visitors (target: growing)
- Traffic by source (organic % should increase)
- Top landing pages (new articles ranking?)

ENGAGEMENT:
- Avg session duration (target: >2 min)
- Avg engagement score (target: >0.5)
- Bounce rate (target: <60%)

REVENUE:
- Daily revenue (target: growing)
- AdSense RPM (target: €1-5 per 1000 impressions)
- Affiliate CTR (target: >1%)

CONTENT:
- Articles published (target: 10-12/day)
- Avg plagiarism score (target: >80%)
- Articles ranking in top 100 (target: growing)

SEO:
- Keywords in top 10 (target: growing each month)
- Keywords in top 20 (target: growing each month)
- Backlinks acquired (FASE 2+, target: 2-5/week)
```

---

## 🏁 CONCLUSION

This is a fully automated system. Your job is:

1. **Monitor** (daily, 5 min): Check dashboard, alerts
2. **Optimize** (weekly, 30 min): Review metrics, update strategy
3. **Maintain** (monthly, 2 hours): Cleanup, backup, full review
4. **Scale** (quarterly): Move between FASES, expand to more topics

**Total time commitment: ~4-5 hours per week**

Everything else is automated. Let the machine run, monitor the metrics, optimize the strategy.

---

**For production deployment questions, see: DEPLOYMENT_CHECKLIST.md**

**For system architecture questions, see: COMPLETE_IMPLEMENTATION_SUMMARY.md**

**For API usage, see: API_REFERENCE.md**
