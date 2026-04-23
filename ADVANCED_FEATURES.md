# ZYPERIA Content Machine - Advanced Features Guide

Complete documentation of Stage 7b (Backlinks), monitoring, webhooks, and advanced analytics.

---

## 🔗 STAGE 7B: BACKLINK HUNTING & AUTOMATED OUTREACH

Acquire high-quality backlinks to improve rankings and traffic. **Only run in FASE 2+** (after revenue validation).

### Quick Start

```bash
# Find backlink opportunities for top articles
npm run backlinks:find -- crypto

# Get campaign report
npm run backlinks:report -- crypto

# Start outreach campaign
npm run backlinks:campaign -- crypto start-campaign
```

### How It Works

**Phase 1: Opportunity Discovery**
1. Analyzes top 5 performing articles
2. Identifies relevant domains that could link to us
3. Scores prospects by relevance (0-100) + authority (0-100)
4. Stores top 50 opportunities in database

**Phase 2: Intelligent Outreach**
1. Generates personalized outreach messages (using Claude)
2. Uses Hunter.io API to find contact emails
3. Sends via SendGrid with tracking
4. Logs all interactions in database

**Phase 3: Conversion Tracking**
1. Monitors when backlinks appear
2. Tracks ranking improvements
3. Estimates traffic impact per backlink
4. Optimizes future outreach based on response rates

### API Endpoints

```bash
# Get opportunities
curl "https://crypto.zyperia.ai/api/backlinks/opportunities?appId=crypto&limit=50"

# Get campaign analytics
curl "https://crypto.zyperia.ai/api/backlinks/opportunities?appId=crypto&analytics=true"

# Get outreach status
curl "https://crypto.zyperia.ai/api/backlinks/outreach?appId=crypto&action=status"

# Get campaign details
curl "https://crypto.zyperia.ai/api/backlinks/outreach?appId=crypto&action=campaign"

# Track backlink (requires ADMIN_TOKEN)
curl -X POST "https://crypto.zyperia.ai/api/backlinks/outreach?action=track-backlink&token=TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "opportunityId": "123",
    "backlink_url": "https://example.com/article",
    "appId": "crypto"
  }'

# Start campaign (requires ADMIN_TOKEN)
curl -X POST "https://crypto.zyperia.ai/api/backlinks/outreach?action=start-campaign&token=TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "crypto",
    "prospectIds": ["p1", "p2", "p3"]
  }'
```

### Expected Results (Phase 3)

```
Timeline: Week 11-16 of deployment
Prospects contacted/week: 40-50
Response rate: 8-15%
Conversion rate (actual links): 5-10%
Links acquired/week: 2-5

Traffic impact:
- 1st month: +50-100 visitors/week
- 2nd month: +200-500 visitors/week
- 3rd month: +500-1000+ visitors/week

Revenue impact:
- +€100-300/month from organic traffic increase
- Cumulative effect: €500-2000+ by month 3
```

### Configuration (in vercel.json)

```json
{
  "env": {
    "HUNTER_IO_API_KEY": "@hunter_io_key",
    "SENDGRID_API_KEY": "@sendgrid_key",
    "AHREFS_API_KEY": "@ahrefs_key"
  }
}
```

### Database Tables

```
backlink_opportunities:
  - id, app_id, target_url, prospect_domain, prospect_url
  - relevance_score (0-100), authority_score (0-100)
  - outreach_status (pending|sent|responded|rejected|linked)
  - outreach_message, outreach_sent_at, response_message

backlink_outreach:
  - Tracks all email sends, bounces, opens, clicks
  - Follow-up sequences
  - Response tracking

backlink_acquisitions:
  - Verified backlinks we've acquired
  - Source domain, anchor text, link type (dofollow/nofollow)
  - estimated_traffic_gain per backlink
  - status (pending_verification|verified|broken|removed)

backlink_campaigns:
  - Campaign metadata
  - success_rate, prospect_count
  - Date ranges for campaign analytics
```

---

## 📊 WEBHOOK INTEGRATIONS

Send real-time alerts to Slack, Discord, or custom webhooks.

### Setup

```bash
# Register Slack webhook
curl -X POST "https://crypto.zyperia.ai/api/webhooks/config?action=register&token=TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "crypto",
    "webhookUrl": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
    "webhookType": "slack",
    "events": [
      "article_published",
      "stage_failed",
      "high_revenue",
      "backlink_acquired"
    ]
  }'

# Register Discord webhook
curl -X POST "https://crypto.zyperia.ai/api/webhooks/config?action=register&token=TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "intelligence",
    "webhookUrl": "https://discordapp.com/api/webhooks/YOUR/WEBHOOK",
    "webhookType": "discord",
    "events": [
      "article_published",
      "high_traffic",
      "stage_failed"
    ]
  }'
```

### Webhook Events

```
article_published    - Article published successfully
article_generated    - Article generated (before publishing)
stage_completed      - Stage completed successfully
stage_failed         - Stage failed with error
high_revenue         - Revenue above threshold (€50+/day)
high_traffic         - Traffic above threshold (1000+/day)
ranking_improved     - Keyword ranking improved
backlink_acquired    - Backlink acquired from prospect
error_alert          - System error or critical issue
```

### Test Webhook

```bash
curl -X POST "https://crypto.zyperia.ai/api/webhooks/config?action=test&token=TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"webhookId": "webhook-uuid"}'
```

### View Configuration

```bash
curl "https://crypto.zyperia.ai/api/webhooks/config?appId=crypto&token=TOKEN"
```

---

## ⚡ PERFORMANCE BENCHMARKING

Measure pipeline speed, efficiency, and identify bottlenecks.

### Commands

```bash
# Full comprehensive benchmark
npm run benchmark -- crypto full

# Benchmark by stage (shows timing per stage)
npm run benchmark -- crypto stages

# Summary benchmark (quick overview)
npm run benchmark -- crypto summary
```

### Output Example

```
⚡ Full Benchmark Results:

✅ Database Connection: 45ms
✅ Article Retrieval (100 articles): 132ms (1.32ms per article)
✅ Analytics Query: 89ms
✅ Complex Query: 234ms

📈 Pipeline Performance:
  Stage 0 (Analysis): 
    ✅ Runs: 42 successful, 0 failed
    Duration: avg 45.3s, min 30s, max 62s
    Error rate: 0.0%
  
  Stage 1 (Research):
    ✅ Runs: 42 successful, 1 failed
    Duration: avg 28.5s, min 20s, max 35s
    Error rate: 2.3%
  
  Stage 2 (Generation):
    ✅ Runs: 42 successful, 0 failed
    Duration: avg 52.1s, min 45s, max 78s
    Error rate: 0.0%
  
  ... (all 7 stages)

💰 Cost Analysis:
  Total cost (200 articles): $2.47
  Cost per article: $0.012
  
✅ Summary:
  Total pipeline time: 542 minutes (9.03 hours)
  Total successful runs: 294
  Total errors: 1
  Overall error rate: 0.34%
```

### What to Optimize

**If error rate > 5%:**
- Check Stage X logs for specific errors
- Verify API keys and rate limits
- Increase retry logic

**If duration > 60s per article:**
- Stage 2 (generation) is slow → upgrade Claude model or increase parallelization
- Stage 3 (visuals) is slow → reduce image generation or cache results

**If cost > $0.03 per article:**
- Use Phi-4 instead of Claude (10x cheaper)
- Batch requests to reduce API calls
- Cache competitive analysis results

---

## 🔍 SEO ANALYSIS & KEYWORD TRACKING

Track rankings, identify opportunities, analyze keyword performance.

### Commands

```bash
# SEO overview (summary of all metrics)
npm run seo:analyze -- crypto

# Track keyword rankings
npm run seo:track -- crypto

# Analyze keyword effectiveness
npm run seo:keywords -- crypto

# Find SEO opportunities
npm run seo:opportunities -- crypto
```

### Output Example: SEO Overview

```
📊 SEO Overview (crypto)

📈 Traffic Overview:
  Total organic views (90d): 45,234
  Total impressions (90d): 1,234,567
  Average CTR: 3.67%
  Average daily views: 503

📄 Content Analysis:
  Total published articles: 145
  Avg views per article: 312
  Avg engagement score: 0.68
  Avg plagiarism/uniqueness: 84.2%

🏆 Top Performing Articles:
  1. "Bitcoin Security Best Practices"
     Views: 2,145 | Engagement: 0.89
  
  2. "Ethereum Smart Contracts Guide"
     Views: 1,987 | Engagement: 0.82
  
  ... (top 5)
```

### Output Example: Ranking Tracker

```
🎯 Top Ranking Keywords:
  🥇 "bitcoin price" - Rank #4
     Views: 342 | Impressions: 8,234 | CTR: 4.15%
  
  🥇 "ethereum tutorial" - Rank #7
     Views: 287 | Impressions: 6,123 | CTR: 4.68%
  
  🥈 "crypto wallet" - Rank #32
     Views: 45 | Impressions: 1,234 | CTR: 3.65%

📈 Improving Keywords:
  ⬆️ "DeFi guide" (+8 positions)
     #24 → #16
  
  ⬆️ "NFT marketplace" (+5 positions)
     #28 → #23
```

### Integrating with GSC (Google Search Console)

To track actual rankings from Google:

1. **Set up GSC API:**
   ```bash
   # In your .env.local
   GOOGLE_SEARCH_CONSOLE_URL="https://www.google.com/webmasters/tools/gsitemap-entry"
   GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
   ```

2. **Create script to import GSC data:**
   ```typescript
   // Import rankings from GSC API
   const { data: gscData } = await fetch(
     `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchanalytics/query`,
     { method: 'POST', body: JSON.stringify(query) }
   );
   
   // Store in ranking_history table
   await supabase.from('ranking_history').insert(gscData.rows);
   ```

3. **Run monthly analysis:**
   ```bash
   npm run seo:opportunities -- crypto
   ```

---

## 📈 ADVANCED ANALYTICS DASHBOARD

Additional analytics available via API.

### Trending Keywords

```bash
curl "https://crypto.zyperia.ai/api/analytics/trending?appId=crypto&days=7"

Response:
{
  "trendingUp": [
    { "keyword": "bitcoin ETF", "searchVolume": 450000, "trend": "+23%" },
    { "keyword": "ethereum merge", "searchVolume": 320000, "trend": "+18%" }
  ],
  "trendingDown": [
    { "keyword": "NFT guide", "searchVolume": 12000, "trend": "-45%" }
  ]
}
```

### Content Performance by Approach

```bash
curl "https://crypto.zyperia.ai/api/analytics/approach-comparison?appId=crypto"

Response:
{
  "original": {
    "count": 56,
    "avgViews": 145,
    "avgEngagement": 0.72,
    "totalRevenue": 823.45
  },
  "transformed": {
    "count": 70,
    "avgViews": 132,
    "avgEngagement": 0.65,
    "totalRevenue": 756.23
  },
  "aggregated": {
    "count": 14,
    "avgViews": 98,
    "avgEngagement": 0.54,
    "totalRevenue": 123.45
  }
}
```

### Revenue Attribution

```bash
curl "https://crypto.zyperia.ai/api/analytics/revenue-attribution?appId=crypto"

Response:
{
  "byChannel": {
    "adsense": { "revenue": 1234.56, "percentage": 65 },
    "affiliate": { "revenue": 567.89, "percentage": 30 },
    "sponsored": { "revenue": 89.01, "percentage": 5 }
  },
  "byArticle": [
    { "title": "...", "revenue": 234.56, "source": "adsense" },
    { "title": "...", "revenue": 123.45, "source": "affiliate" }
  ]
}
```

---

## 🧹 MAINTENANCE & OPERATIONS

### Daily Checklist

```bash
# 1. Check pipeline health
curl https://crypto.zyperia.ai/api/pipeline-status | jq '.status'

# 2. Check error rate
npm run benchmark -- crypto stages

# 3. Review recommendations
curl https://crypto.zyperia.ai/api/recommendations?appId=crypto

# 4. Check backlink campaign (if in FASE 2+)
npm run backlinks:report -- crypto
```

### Weekly Tasks

```bash
# 1. Full SEO analysis
npm run seo:opportunities -- crypto

# 2. Performance analytics
curl "https://crypto.zyperia.ai/api/analytics/performance?appId=crypto&days=7"

# 3. Check trending opportunities
npm run seo:keywords -- crypto

# 4. Backlink campaign status
npm run backlinks:report -- crypto
```

### Monthly Tasks

```bash
# 1. Optimize underperforming content
npm run optimize:pipeline -- crypto

# 2. Full SEO audit
npm run seo:analyze -- crypto

# 3. Performance benchmark
npm run benchmark -- crypto full

# 4. Revenue analysis
curl "https://crypto.zyperia.ai/api/analytics/revenue-attribution?appId=crypto"

# 5. Plan next month topics
# Use API recommendations to decide which topics to prioritize
```

---

## 🚀 PHASE ROADMAP

### FASE 1: MVP (Weeks 1-6)
✅ Stages 0-6 implemented and tested
✅ 60-90 articles published
✅ Real-time monitoring active
❌ Stage 7b (backlinks) - NOT YET
❌ Webhooks - NOT YET
❌ Advanced analytics - NOT YET

### FASE 2: Monetization (Weeks 7-10)
✅ AdSense + affiliate integration
✅ Revenue tracking
✅ Backlink opportunities discovered
✅ Webhooks enabled (optional)
✨ Stage 7b ready to activate

### FASE 3: Scale via Backlinks (Week 11+)
✅ Stage 7b running (backlink campaigns)
✅ 2-5 backlinks acquired/week
✅ +100-500 organic visitors/week
✅ Revenue +€1000-2000/month
✨ All monitoring and analytics active

---

## 📞 Support

If features aren't working:

1. Check logs: `npm run benchmark -- {app} stages`
2. Check API: `curl https://{domain}/api/pipeline-status`
3. Check database: `supabase dashboard → Logs`
4. Check Vercel: `vercel.com → {project} → Function Logs`

All features are fully documented in:
- `/api/{endpoint}` - OpenAPI style
- `COMPLETE_IMPLEMENTATION_SUMMARY.md` - Full reference
- Script help: `npm run {script} -- --help`
