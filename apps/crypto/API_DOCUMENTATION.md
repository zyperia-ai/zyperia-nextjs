# ZYPERIA API Documentation

**Base URLs:**
- Crypto: `https://crypto.zyperia.ai/api`
- Intelligence: `https://intelligence.zyperia.ai/api`
- OnlineBiz: `https://earn-online.zyperia.ai/api`

**Last Updated:** 2026-04-24  
**Status:** Production Ready (May 1st database integration)

---

## Table of Contents

1. [Newsletter API](#newsletter)
2. [Affiliate Tracking API](#affiliate)
3. [Publishing & Scheduling API](#publishing)
4. [Analytics API](#analytics)

---

## NEWSLETTER API {#newsletter}

### Subscribe to Newsletter
```
POST /api/newsletter/subscribe
```

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",  // optional
  "themes": ["crypto"],  // or ["crypto", "intelligence"]
  "source": "crypto_site"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "✓ Check your email to confirm your subscriptions!",
  "token": "hex-token-for-testing"
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Email and at least one theme required"
}
```

---

### Check Subscription Status
```
GET /api/newsletter/subscribe?email=user@example.com&app_id=crypto
```

**Response (200):**
```json
{
  "subscribed": false,
  "confirmed": false
}
```

---

### Confirm Email (from confirmation link)
```
GET /api/newsletter/confirm?token=xxx
```

**Response:** Redirects to `/newsletter-confirmed?email=xxx&themes=xxx`

---

### Resend Confirmation Email
```
POST /api/newsletter/confirm
```

**Request:**
```json
{
  "email": "user@example.com",
  "app_id": "crypto"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Confirmation email resent"
}
```

---

### Unsubscribe
```
POST /api/newsletter/unsubscribe
```

**Request:**
```json
{
  "email": "user@example.com",
  "app_id": "crypto",
  "reason": "Too many emails"  // optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "You have been unsubscribed"
}
```

---

## AFFILIATE TRACKING API {#affiliate}

### Get Affiliate Links for Article
```
GET /api/affiliate/links?article_id=123&category=crypto
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "123:kraken",
      "article_id": "123",
      "program_id": "kraken",
      "program_name": "Kraken",
      "commission_rate": 0.25,
      "url": "https://kraken.com/?c=ref-ZYPERIA",
      "clicks": 42,
      "conversions": 5
    }
  ]
}
```

---

### Track Affiliate Click
```
POST /api/affiliate/track
```

**Request:**
```json
{
  "link_id": "123:kraken",
  "article_id": "123",
  "program_id": "kraken",
  "converted": false,
  "conversion_value": null
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Click tracked"
}
```

---

### Decode Tracking Code
```
GET /api/affiliate/track?code=BASE64_ENCODED_DATA
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "link_id": "123:kraken",
    "article_id": "123",
    "timestamp": 1640000000000
  }
}
```

---

### Create Affiliate Link
```
POST /api/affiliate/links
```

**Request:**
```json
{
  "article_id": "123",
  "program_id": "kraken",
  "custom_url": "https://kraken.com/custom",  // optional
  "label": "Recommended Exchange"  // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Affiliate link created",
  "link_id": "123:kraken"
}
```

---

### Delete Affiliate Link
```
DELETE /api/affiliate/links?link_id=123:kraken
```

**Response (200):**
```json
{
  "success": true,
  "message": "Affiliate link deleted"
}
```

---

## PUBLISHING & SCHEDULING API {#publishing}

### Get Publishing Schedule
```
GET /api/publishing/schedule?start_date=2026-05-01&end_date=2026-05-31
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Bitcoin Trading Strategies",
      "slug": "bitcoin-trading-strategies",
      "scheduled_for": "2026-05-01T09:00:00Z",
      "category": "Bitcoin",
      "status": "scheduled"
    }
  ],
  "count": 1
}
```

---

### Schedule Article
```
POST /api/publishing/schedule
```

**Request:**
```json
{
  "article_id": "123",
  "scheduled_for": "2026-05-01T09:00:00Z",
  "notify_subscribers": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Article scheduled successfully",
  "scheduled_for": "2026-05-01T09:00:00Z"
}
```

---

### Update Schedule
```
PUT /api/publishing/schedule
```

**Request:**
```json
{
  "article_id": "123",
  "scheduled_for": "2026-05-01T14:00:00Z"
}
```

---

### Remove Schedule
```
DELETE /api/publishing/schedule?article_id=123
```

---

### Send Publishing Notification
```
POST /api/publishing/notify
```

**Request:**
```json
{
  "article_id": "123",
  "article_title": "Bitcoin Trading Strategies",
  "article_slug": "bitcoin-trading-strategies",
  "excerpt": "Learn pro trading techniques...",
  "featured_image_url": "https://example.com/image.jpg",
  "app_id": "crypto",
  "theme_colors": {
    "primary": "#7C6FF7",
    "accent": "#06B6D4"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification sent to 150 subscribers",
  "article_url": "https://crypto.zyperia.ai/articles/bitcoin-trading-strategies",
  "subscribers_notified": 150
}
```

---

### Get Notification Status
```
GET /api/publishing/notify?article_id=123
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "article_id": "123",
    "notification_sent_at": "2026-05-01T09:15:00Z",
    "subscribers_notified": 150,
    "email_opens": 45,
    "email_clicks": 12,
    "open_rate": 0.30,
    "click_rate": 0.08
  }
}
```

---

## ANALYTICS API {#analytics}

*(Previously documented in earlier session)*

### Track Article View
```
POST /api/articles/view
```

**Request:**
```json
{
  "article_id": "123",
  "time_on_page": 180,
  "scroll_depth": 0.75
}
```

---

### Track Analytics Event
```
POST /api/analytics/track
```

**Request:**
```json
{
  "event": "article_feedback",
  "appId": "crypto",
  "data": {
    "article_id": "123",
    "feedback": "helpful"
  }
}
```

---

## ERROR HANDLING

All endpoints follow this error format:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

**HTTP Status Codes:**
- `200` — OK
- `201` — Created
- `400` — Bad Request
- `404` — Not Found
- `409` — Conflict (e.g., already subscribed)
- `500` — Server Error

---

## RATE LIMITING

- Newsletter API: 10 requests/minute per IP
- Affiliate API: 100 requests/minute per IP
- Analytics API: 1000 requests/minute per IP
- Publishing API: 50 requests/minute per IP

---

## AUTHENTICATION

Currently: None (public endpoints)

**On May 1st:** Admin endpoints will require:
```
Authorization: Bearer <ADMIN_API_KEY>
```

---

## TESTING WITH CURL

### Test Newsletter Subscription
```bash
curl -X POST https://crypto.zyperia.ai/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "themes": ["crypto"],
    "source": "crypto_site"
  }'
```

### Test Affiliate Click Tracking
```bash
curl -X POST https://crypto.zyperia.ai/api/affiliate/track \
  -H "Content-Type: application/json" \
  -d '{
    "link_id": "123:kraken",
    "article_id": "123",
    "program_id": "kraken",
    "converted": false
  }'
```

### Test Publishing Schedule
```bash
curl -X POST https://crypto.zyperia.ai/api/publishing/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "article_id": "123",
    "scheduled_for": "2026-05-01T09:00:00Z",
    "notify_subscribers": true
  }'
```

---

## WEBHOOK INTEGRATIONS

**Planned for May 15th:**

- Stripe webhook for payment processing
- Mailgun webhook for email bounces
- Google Analytics webhook for real-time metrics
- Affiliate network webhooks for conversion confirmations

---

## MOCK DATA AVAILABLE UNTIL MAY 1ST

All endpoints return mock data with realistic structures until Supabase integration on May 1st. This allows testing UI/flows without database.

**Example mock response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "email": "subscriber@example.com",
      "status": "confirmed",
      "email_opens": 12,
      "email_clicks": 3
    }
  ]
}
```

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-24 | Initial API documentation |
| 1.1 | 2026-05-01 | Supabase integration |
| 2.0 | 2026-05-15 | Webhook support |

---

**Last Updated:** 2026-04-24  
**Maintained By:** Luís (ZYPERIA Team)
