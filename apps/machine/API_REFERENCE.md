# ZYPERIA Content Machine - API Reference

Complete API documentation for monitoring, analytics, and management endpoints.

---

## Base URLs

```
Production:
- https://crypto.zyperia.ai/api/
- https://intelligence.zyperia.ai/api/
- https://onlinebiz.zyperia.ai/api/

All endpoints return JSON.
```

---

## Authentication

Some endpoints require authentication:

```
CRON_SECRET: Required for triggering cron jobs
  Header: Authorization: Bearer {CRON_SECRET}

ADMIN_TOKEN: Required for admin endpoints
  Query param: ?token={ADMIN_TOKEN}
```

---

## Monitoring Endpoints

### Pipeline Status (Public)
```
GET /api/pipeline-status

Returns current pipeline state and next scheduled runs.

Response:
{
  "status": "healthy" | "degraded" | "error",
  "timestamp": "2026-04-24T...",
  "stats": {
    "totalArticles": 145,
    "publishedToday": 12,
    "draftArticles": 8,
    "failedStages": 0,
    "avgGenerationTime": 28
  },
  "lastRuns": [
    {
      "stage": "generation",
      "status": "success",
      "duration": 32,
      "timestamp": "2026-04-24T02:00:00Z"
    }
  ],
  "nextScheduledRuns": [
    {
      "stage": "Stage 0: Competitive Analysis",
      "scheduledTime": "2026-04-24T23:00:00Z",
      "timeUntilRun": "2h 45m"
    }
  ],
  "topicQueue": {
    "crypto": 15,
    "intelligence": 12,
    "onlinebiz": 18,
    "total": 45
  }
}
```

---

### Admin Dashboard (Requires Token)
```
GET /api/admin/dashboard?token={ADMIN_TOKEN}

Comprehensive monitoring and metrics dashboard.

Query Params:
  token: Admin token (required)

Response:
{
  "timestamp": "2026-04-24T...",
  "environment": "production",
  "overview": {
    "totalBlogs": 3,
    "totalArticles": 145,
    "publishedArticles": 140,
    "draftArticles": 5,
    "totalTopics": 60,
    "remainingTopicDays": 25
  },
  "contentMetrics": {
    "originalCount": 56,
    "transformedCount": 70,
    "aggregatedCount": 14,
    "originalAvgViews": 145,
    "transformedAvgViews": 132,
    "aggregatedAvgViews": 98
  },
  "dailyActivity": {
    "publishedToday": 12,
    "generatedToday": 12,
    "failurestoday": 0
  },
  "revenueTracking": {
    "totalAdSenseImpressions": 45000,
    "totalAdSenseRevenue": 125.50,
    "totalAffiliateClicks": 320,
    "estimatedMonthlyRevenue": 2500
  },
  "systemHealth": {
    "status": "healthy",
    "avgGenerationTime": 28,
    "errorRate": 0.5,
    "successfulRuns": 42,
    "failedRuns": 0,
    "lastRunTime": "2026-04-24T05:00:00Z"
  },
  "topPerformers": [...],
  "queueStatus": {
    "crypto": 15,
    "intelligence": 12,
    "onlinebiz": 18,
    "totalDays": 25
  }
}
```

---

## Analytics Endpoints

### Performance Analytics
```
GET /api/analytics/performance?appId={appId}&days={days}

Detailed performance metrics for a specific blog.

Query Params:
  appId: 'crypto' | 'intelligence' | 'onlinebiz' (default: 'crypto')
  days: 1-90 (default: 30)

Response:
{
  "appId": "crypto",
  "period": {
    "days": 30,
    "from": "2026-03-25",
    "to": "2026-04-24"
  },
  "articles": {
    "total": 145,
    "published": 140,
    "draft": 5,
    "archived": 0
  },
  "traffic": {
    "totalViews": 45000,
    "avgViewsPerArticle": 321,
    "avgTimeOnPage": 125,
    "avgBounceRate": 0.52
  },
  "revenue": {
    "totalAdSenseRevenue": 125.50,
    "totalAffiliateClicks": 320,
    "estimatedAffiliateRevenue": 160,
    "combinedRevenue": 285.50
  },
  "contentQuality": {
    "avgPlagiarismScore": 84.2,
    "avgEngagementScore": 0.68,
    "articlesWithPlagiarismIssues": 2
  },
  "topPerformers": [...],
  "approachComparison": {
    "original": {
      "count": 56,
      "avgViews": 145,
      "avgEngagement": 0.72
    },
    "transformed": {
      "count": 70,
      "avgViews": 132,
      "avgEngagement": 0.65
    }
  },
  "trends": {
    "viewsTrend": "up",
    "viewsChangePercent": 12.5,
    "publishingVelocity": 4.7
  },
  "recommendations": [
    "📈 \"transformed\" content performs best..."
  ]
}
```

---

### Content Recommendations
```
GET /api/recommendations?appId={appId}

AI-powered content recommendations based on performance.

Query Params:
  appId: 'crypto' | 'intelligence' | 'onlinebiz' (default: 'crypto')

Response:
{
  "appId": "crypto",
  "timestamp": "2026-04-24T...",
  "nextTopicToWrite": "Create follow-up to \"Bitcoin Security Guide\"",
  "quickInsights": {
    "totalRecommendations": 8,
    "byType": {
      "expansion": 3,
      "optimization": 2,
      "high_demand": 2,
      "rewrite": 1
    },
    "highImpactCount": 5,
    "easyWinsCount": 3,
    "topRecommendation": {...}
  },
  "recommendations": [
    {
      "type": "expansion",
      "title": "Create follow-up to \"Bitcoin Security Guide\"",
      "description": "This article gets 1250 views...",
      "impact": "high",
      "effort": "low",
      "topicOrArticle": "Bitcoin Security Guide",
      "details": {
        "views": 1250,
        "suggestion": "Advanced Bitcoin Security"
      }
    },
    ...
  ],
  "prioritized": {
    "highImpactLowEffort": [...],
    "quickWins": [...],
    "strategicOpportunities": [...]
  }
}
```

---

## Cron Job Endpoints (Authenticated)

### Manually Trigger Stage
```
GET /api/cron/stage-{n}-{name}

Requires: Authorization: Bearer {CRON_SECRET}

Available stages:
  /api/cron/stage-0-analysis        (Competitive analysis)
  /api/cron/stage-1-research        (Research topics)
  /api/cron/stage-2-generate        (Content generation)
  /api/cron/stage-3-visuals         (Visual enrichment)
  /api/cron/stage-4-plagiarism      (Plagiarism check)
  /api/cron/stage-5-editorial       (Editorial review)
  /api/cron/stage-6-publish         (Publishing)

Response:
{
  "statusCode": 200,
  "body": "Stage 2 complete"
}
```

---

## Status Codes

```
200 OK              Successful request
400 Bad Request     Invalid parameters
401 Unauthorized    Missing or invalid credentials
404 Not Found       Endpoint or resource not found
500 Server Error    Internal server error
```

---

## Example Usage

### Check Pipeline Health
```bash
curl https://crypto.zyperia.ai/api/pipeline-status
```

### View Admin Dashboard
```bash
TOKEN="your-admin-token"
curl "https://crypto.zyperia.ai/api/admin/dashboard?token=$TOKEN"
```

### Get Performance Metrics (Last 30 Days)
```bash
curl "https://crypto.zyperia.ai/api/analytics/performance?appId=crypto&days=30"
```

### Get Content Recommendations
```bash
curl "https://crypto.zyperia.ai/api/recommendations?appId=intelligence"
```

### Manually Trigger Content Generation (Requires CRON_SECRET)
```bash
CRON_SECRET="your-cron-secret"
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://crypto.zyperia.ai/api/cron/stage-2-generate
```

---

## Response Caching

Endpoints are cached to reduce load:
- `/api/pipeline-status`: 60 seconds
- `/api/admin/dashboard`: 300 seconds (5 minutes)
- `/api/analytics/performance`: 3600 seconds (1 hour)
- `/api/recommendations`: 3600 seconds (1 hour)

Add `?nocache=true` to bypass cache (not recommended for production).

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "timestamp": "2026-04-24T..."
}
```

---

## Rate Limiting

No rate limits for now. Implement if needed based on usage patterns.

---

## Monitoring Best Practices

### Daily Check (30 seconds)
```bash
# Check if pipeline is healthy
curl https://crypto.zyperia.ai/api/pipeline-status | jq '.status'
```

### Weekly Review
```bash
# Check detailed analytics
curl "https://crypto.zyperia.ai/api/analytics/performance?appId=crypto&days=7"

# Get improvement suggestions
curl "https://crypto.zyperia.ai/api/recommendations?appId=crypto"
```

### Monthly Analysis
```bash
# Full performance review
curl "https://crypto.zyperia.ai/api/analytics/performance?appId=crypto&days=30"

# Use admin dashboard
curl "https://crypto.zyperia.ai/api/admin/dashboard?token=$ADMIN_TOKEN"
```

---

## Integration Examples

### Slack Webhook (Post to Slack Channel)
```bash
# Send daily summary to Slack
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Daily Pipeline Summary",
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Check: https://crypto.zyperia.ai/api/pipeline-status"
        }
      }
    ]
  }'
```

### Custom Monitoring Script
```bash
#!/bin/bash
while true; do
  STATUS=$(curl -s https://crypto.zyperia.ai/api/pipeline-status | jq '.status')
  
  if [ "$STATUS" != "healthy" ]; then
    echo "⚠️ Pipeline status: $STATUS"
    # Send alert...
  fi
  
  sleep 3600  # Check every hour
done
```

---

## API Versioning

Currently on v1 (implicit). All endpoints are under `/api/`.

Future versioning scheme:
- `/api/v1/...`
- `/api/v2/...`

---

## Support

For API issues or questions:
1. Check this reference document
2. Review `/api/pipeline-status` for current state
3. Check Vercel Function logs
4. Review Supabase database
5. Check documentation in repository

---

**Last Updated:** 2026-04-24  
**API Version:** 1.0  
**Status:** Stable
