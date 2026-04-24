# ZYPERIA API Reference

Complete API documentation for the article, newsletter, and monetization system.

## Base URLs

- Crypto app: `https://crypto.zyperia.com/api`
- Intelligence app: `https://intelligence.zyperia.com/api`
- Online Biz app: `https://onlinebiz.zyperia.com/api`

## Articles API

### List Articles

```
GET /api/articles
```

Returns 50 most recent published articles ordered by publication date.

**Response:**
```json
{
  "articles": [
    {
      "id": "uuid",
      "app_id": "crypto",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Article excerpt",
      "content": "Full article content",
      "views": 42,
      "status": "published",
      "published_at": "2026-04-24T10:00:00Z"
    }
  ]
}
```

### Get Article by Slug

```
GET /api/articles/{slug}
```

Returns single article and increments view count.

**Parameters:**
- `slug` (string, required) - Article slug

**Response:**
```json
{
  "article": {
    "id": "uuid",
    "title": "Article Title",
    "slug": "article-slug",
    "content": "Full article content",
    "views": 43,
    "status": "published",
    "published_at": "2026-04-24T10:00:00Z"
  }
}
```

### Search Articles

```
GET /api/articles/search?q={query}&tag={category}
```

Search articles by keyword and/or filter by category/tag.

**Parameters:**
- `q` (string, optional) - Search query (searches title and excerpt)
- `tag` (string, optional) - Filter by category/tag

**Response:**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Search Result",
      "slug": "search-result",
      "excerpt": "Excerpt",
      "views": 10
    }
  ]
}
```

### Advanced Search Articles

```
GET /api/articles/search-advanced?q={query}&tag={tag}&author={email}&from={date}&to={date}&sort={field}&limit={limit}&offset={offset}
```

Advanced search with multiple filters including text, tags, author, date range, and sorting.

**Parameters:**
- `q` (string, optional) - Text search (searches title, content, excerpt with ilike)
- `tag` (string, optional) - Filter by single tag (case-insensitive)
- `author` (string, optional) - Filter by author email
- `from` (string, optional) - Start date (ISO 8601 format, filters published_at >= from)
- `to` (string, optional) - End date (ISO 8601 format, filters published_at <= to)
- `sort` (string, optional) - Sort field: `published_at`, `views`, or `title` (default: `published_at`)
- `limit` (number, optional) - Results per page (default: 20)
- `offset` (number, optional) - Pagination offset (default: 0)

**Response:**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Excerpt",
      "views": 42,
      "published_at": "2026-04-24T10:00:00Z",
      "author_email": "author@example.com"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

### Get Categories

```
GET /api/articles/categories
```

Get all available categories/tags for published articles.

**Response:**
```json
{
  "categories": [
    "bitcoin",
    "ethereum",
    "defi",
    "nft"
  ]
}
```

## Newsletter API

### Subscribe to Newsletter

```
POST /api/newsletter/subscribe
```

Subscribe email to newsletter.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Successfully subscribed",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "app_id": "crypto",
    "status": "active",
    "subscribed_at": "2026-04-24T10:00:00Z"
  }
}
```

**Errors:**
- 400: Valid email required
- 409: Already subscribed
- 500: Subscription failed

## User API

### Get User Profile

```
GET /api/users/profile?email={email}
```

Get user profile and newsletter subscription status.

**Parameters:**
- `email` (string, required) - User email

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "preferences": {
      "newsletter": true,
      "weeklyDigest": true,
      "newArticles": true
    },
    "updated_at": "2026-04-24T10:00:00Z"
  },
  "subscriber": {
    "id": "uuid",
    "status": "active",
    "subscribed_at": "2026-04-24T10:00:00Z"
  }
}
```

### Update User Profile

```
POST /api/users/profile
```

Create or update user profile and preferences.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "preferences": {
    "newsletter": true,
    "weeklyDigest": true,
    "newArticles": true,
    "productUpdates": false
  }
}
```

**Response:**
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "preferences": {...}
  }
}
```

## Admin API

### List Articles (Admin)

```
GET /api/admin/articles
```

List all articles (draft and published) for the app.

**Response:**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-slug",
      "status": "published",
      "views": 42,
      "published_at": "2026-04-24T10:00:00Z"
    }
  ]
}
```

### Create Article (Admin)

```
POST /api/admin/articles
```

Create new article.

**Request Body:**
```json
{
  "title": "New Article",
  "slug": "new-article",
  "content": "Article content",
  "excerpt": "Article excerpt",
  "status": "draft"
}
```

**Response:**
```json
{
  "article": {
    "id": "uuid",
    "title": "New Article",
    "slug": "new-article",
    "status": "draft",
    "created_at": "2026-04-24T10:00:00Z"
  }
}
```

### Update Article (Admin)

```
PATCH /api/admin/articles/{id}
```

Update article by ID.

**Parameters:**
- `id` (string, required) - Article ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "published"
}
```

**Response:**
```json
{
  "article": {
    "id": "uuid",
    "title": "Updated Title",
    "status": "published"
  }
}
```

### Delete Article (Admin)

```
DELETE /api/admin/articles/{id}
```

Delete article by ID.

**Response:**
```json
{
  "message": "Article deleted"
}
```

### List Subscribers (Admin)

```
GET /api/admin/subscribers
```

Get all newsletter subscribers for the app.

**Response:**
```json
{
  "subscribers": [
    {
      "id": "uuid",
      "email": "subscriber@example.com",
      "status": "active",
      "subscribed_at": "2026-04-24T10:00:00Z"
    }
  ]
}
```

### Send Newsletter (Admin)

```
POST /api/admin/newsletter/send
```

Send newsletter to all active subscribers.

**Request Body:**
```json
{
  "subject": "Latest Articles",
  "content": "<html>...</html>",
  "article_id": "optional-uuid"
}
```

**Response:**
```json
{
  "message": "Newsletter sent",
  "sent": 150,
  "failed": 2,
  "total": 152
}
```

### Get Analytics (Admin)

```
GET /api/admin/analytics
```

Get analytics metrics and top performing articles.

**Response:**
```json
{
  "metrics": {
    "totalArticles": 15,
    "publishedArticles": 12,
    "totalViews": 5420,
    "totalSubscribers": 234,
    "recentSubscribers": 45,
    "avgViewsPerArticle": 451
  },
  "topArticles": [
    {
      "id": "uuid",
      "title": "Top Article",
      "views": 542
    }
  ]
}
```

## Revenue API

### Track Revenue Event (Admin)

```
POST /api/admin/revenue/track
```

Track monetization events (clicks, conversions, impressions).

**Request Body:**
```json
{
  "email": "user@example.com",
  "article_id": "uuid",
  "event_type": "conversion",
  "amount": 25.50,
  "affiliate_code": "AFFILIATE123"
}
```

**Response:**
```json
{
  "event": {
    "id": "uuid",
    "event_type": "conversion",
    "amount": 25.50,
    "affiliate_code": "AFFILIATE123",
    "tracked_at": "2026-04-24T10:00:00Z"
  }
}
```

### Get Revenue Statistics (Admin)

```
GET /api/admin/revenue/stats
```

Get revenue metrics and affiliate performance.

**Response:**
```json
{
  "metrics": {
    "totalRevenue": 1250.75,
    "conversionCount": 45,
    "clickCount": 1200,
    "affiliateCount": 12,
    "conversionRate": 4
  },
  "topAffiliates": [
    {
      "code": "AFFILIATE123",
      "revenue": 450.00
    }
  ]
}
```

## Subscriptions API

### Get Subscription Tiers

```
GET /api/subscriptions/tiers
```

Get all available subscription tiers.

**Response:**
```json
{
  "tiers": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "features": ["Basic articles", "Community access"],
      "articleLimit": null
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": 9.99,
      "features": ["Unlimited articles", "Premium digest"],
      "articleLimit": null
    },
    {
      "id": "elite",
      "name": "Elite",
      "price": 24.99,
      "features": ["All pro features", "Personalization"],
      "articleLimit": null
    }
  ]
}
```

### Get User Subscription

```
GET /api/subscriptions/user?email={email}
```

Get user's current subscription tier.

**Parameters:**
- `email` (string, required) - User email

**Response:**
```json
{
  "subscription": {
    "email": "user@example.com",
    "tier": "pro",
    "started_at": "2026-04-24T10:00:00Z",
    "expires_at": "2026-05-24T10:00:00Z",
    "auto_renew": true
  }
}
```

### Update User Subscription

```
POST /api/subscriptions/user
```

Upgrade or downgrade user subscription.

**Request Body:**
```json
{
  "email": "user@example.com",
  "tier": "elite"
}
```

**Response:**
```json
{
  "subscription": {
    "email": "user@example.com",
    "tier": "elite",
    "started_at": "2026-04-24T10:00:00Z",
    "expires_at": "2026-05-24T10:00:00Z"
  }
}
```

### Check Article Access

```
GET /api/articles/access?email={email}&article_id={id}
```

Check if user has access to specific article based on subscription tier.

**Parameters:**
- `email` (string, required) - User email
- `article_id` (string, required) - Article ID

**Response:**
```json
{
  "hasAccess": true,
  "userTier": "pro",
  "articleAccessLevel": "pro",
  "message": "Access granted"
}
```

## Personalization API

### Get Recommendations

```
GET /api/articles/recommendations?email={email}&limit={limit}
```

Get personalized article recommendations based on reading history.

**Parameters:**
- `email` (string, required) - User email
- `limit` (number, optional) - Number of recommendations (default: 5)

**Response:**
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Excerpt",
      "views": 42
    }
  ]
}
```

### Get Trending Articles

```
GET /api/articles/trending?range={range}&limit={limit}
```

Get trending articles for a time range.

**Parameters:**
- `range` (string, optional) - Time range: '24h', '7d', '30d' (default: '7d')
- `limit` (number, optional) - Number of articles (default: 10)

**Response:**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Trending Article",
      "slug": "trending-article",
      "excerpt": "Excerpt",
      "views": 150
    }
  ]
}
```

### Get Related Articles

```
GET /api/articles/related?article_id={id}&limit={limit}
```

Get articles related by tags to a specific article.

**Parameters:**
- `article_id` (string, required) - Article ID
- `limit` (number, optional) - Number of articles (default: 5)

**Response:**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Related Article",
      "slug": "related-article",
      "excerpt": "Excerpt",
      "views": 45
    }
  ]
}
```

## Reading History API

### Get Reading History

```
GET /api/users/reading-history?email={email}&limit={limit}
```

Get user's reading history.

**Parameters:**
- `email` (string, required) - User email
- `limit` (number, optional) - Number of records (default: 20)

**Response:**
```json
{
  "history": [
    {
      "id": "uuid",
      "article_id": "uuid",
      "article_title": "Article Title",
      "read_at": "2026-04-24T10:00:00Z",
      "read_time": 5
    }
  ]
}
```

### Track Article Read

```
POST /api/users/reading-history
```

Record that user read an article.

**Request Body:**
```json
{
  "email": "user@example.com",
  "article_id": "uuid",
  "read_time": 5
}
```

**Response:**
```json
{
  "history": {
    "id": "uuid",
    "article_id": "uuid",
    "read_at": "2026-04-24T10:00:00Z"
  }
}
```

## Bookmarks API

### Get Bookmarks

```
GET /api/users/bookmarks?email={email}
```

Get user's bookmarked articles.

**Parameters:**
- `email` (string, required) - User email

**Response:**
```json
{
  "bookmarks": [
    {
      "id": "uuid",
      "article_id": "uuid",
      "article_title": "Bookmarked Article",
      "bookmarked_at": "2026-04-24T10:00:00Z"
    }
  ]
}
```

### Bookmark Article

```
POST /api/users/bookmarks
```

Save article to bookmarks.

**Request Body:**
```json
{
  "email": "user@example.com",
  "article_id": "uuid"
}
```

**Response:**
```json
{
  "bookmark": {
    "id": "uuid",
    "article_id": "uuid",
    "bookmarked_at": "2026-04-24T10:00:00Z"
  }
}
```

**Errors:**
- 409: Article already bookmarked

### Remove Bookmark

```
DELETE /api/users/bookmarks?email={email}&article_id={id}
```

Remove article from bookmarks.

**Parameters:**
- `email` (string, required) - User email
- `article_id` (string, required) - Article ID

**Response:**
```json
{
  "message": "Bookmark removed"
}
```

## Email & Digest API

### Get Digest Preferences

```
GET /api/emails/digest?email={email}
```

Get user's email digest preferences and top articles.

**Parameters:**
- `email` (string, required) - User email

**Response:**
```json
{
  "preferences": {
    "email": "user@example.com",
    "frequency": "weekly",
    "updated_at": "2026-04-24T10:00:00Z"
  },
  "topArticles": [
    {
      "id": "uuid",
      "title": "Top Article",
      "slug": "top-article"
    }
  ]
}
```

### Update Digest Preferences

```
POST /api/emails/digest
```

Update email digest frequency.

**Request Body:**
```json
{
  "email": "user@example.com",
  "frequency": "daily"
}
```

**Response:**
```json
{
  "preferences": {
    "email": "user@example.com",
    "frequency": "daily",
    "updated_at": "2026-04-24T10:00:00Z"
  }
}
```

**Frequency Options:**
- `off` - No digest emails
- `daily` - Daily digest at 8 AM
- `weekly` - Weekly digest on Monday at 9 AM

## Comments API

### Get Article Comments

```
GET /api/articles/comments?article_id={id}&limit={limit}
```

Get approved comments for an article.

**Parameters:**
- `article_id` (string, required) - Article ID
- `limit` (number, optional) - Number of comments (default: 50)

**Response:**
```json
{
  "comments": [
    {
      "id": "uuid",
      "author_name": "John Doe",
      "content": "Great article!",
      "likes": 5,
      "created_at": "2026-04-24T10:00:00Z"
    }
  ]
}
```

### Post Comment

```
POST /api/articles/comments
```

Submit a new comment (requires moderation).

**Request Body:**
```json
{
  "articleId": "uuid",
  "email": "user@example.com",
  "authorName": "John Doe",
  "content": "Great article and very informative!"
}
```

**Response:**
```json
{
  "comment": {
    "id": "uuid",
    "status": "pending"
  }
}
```

### Like Comment

```
PATCH /api/articles/comments/{id}
```

Like a comment.

**Request Body:**
```json
{
  "action": "like"
}
```

### Delete Comment

```
DELETE /api/articles/comments/{id}
```

Delete your own comment.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

## Ratings API

### Get Article Ratings

```
GET /api/articles/ratings?article_id={id}&email={email}
```

Get article rating stats and user's rating.

**Parameters:**
- `article_id` (string, required) - Article ID
- `email` (string, optional) - User email to get their rating

**Response:**
```json
{
  "userRating": {
    "rating": 5
  },
  "stats": {
    "averageRating": 4.5,
    "totalRatings": 42,
    "distribution": {
      "5": 25,
      "4": 12,
      "3": 4,
      "2": 1,
      "1": 0
    }
  }
}
```

### Rate Article

```
POST /api/articles/ratings
```

Submit or update article rating (1-5 stars).

**Request Body:**
```json
{
  "articleId": "uuid",
  "email": "user@example.com",
  "rating": 5
}
```

**Response:**
```json
{
  "rating": {
    "id": "uuid",
    "rating": 5
  }
}
```

## User Follow API

### Get User Follows

```
GET /api/users/follows?email={email}&type={type}
```

Get list of users the email is following or followers.

**Parameters:**
- `email` (string, required) - User email
- `type` (string, optional) - 'following' or 'followers' (default: 'following')

**Response:**
```json
{
  "following": [
    "author1@example.com",
    "author2@example.com"
  ],
  "count": 2
}
```

### Follow User

```
POST /api/users/follows
```

Follow a user.

**Request Body:**
```json
{
  "followerEmail": "user@example.com",
  "followingEmail": "author@example.com"
}
```

**Response:**
```json
{
  "follow": {
    "id": "uuid"
  }
}
```

### Unfollow User

```
DELETE /api/users/follows
```

Unfollow a user.

**Request Body:**
```json
{
  "followerEmail": "user@example.com",
  "followingEmail": "author@example.com"
}
```

### Activity Feed

```
GET /api/users/activity-feed?email={email}&limit={limit}&offset={offset}
```

Get paginated feed of recent articles from users the email is following.

**Parameters:**
- `email` (string, required) - User email
- `limit` (number, optional) - Results per page (default: 20)
- `offset` (number, optional) - Pagination offset (default: 0)

**Response:**
```json
{
  "articles": [
    {
      "id": "uuid",
      "title": "Article Title",
      "slug": "article-slug",
      "excerpt": "Excerpt",
      "views": 42,
      "published_at": "2026-04-24T10:00:00Z",
      "author_email": "author@example.com",
      "user_author_profiles": {
        "display_name": "Author Name",
        "avatar_url": "https://example.com/avatar.jpg"
      }
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

## Referral API

### Generate Referral Code

```
GET /api/referrals/generate?email={email}
```

Generate or retrieve user's referral code.

**Parameters:**
- `email` (string, required) - User email

**Response:**
```json
{
  "referralCode": "ABC12XYZ",
  "referralUrl": "https://crypto.zyperia.com?ref=ABC12XYZ",
  "stats": {
    "clicks": 45,
    "conversions": 8,
    "earnings": 125.50
  }
}
```

### Track Referral Event

```
POST /api/referrals/track
```

Track referral clicks or conversions.

**Request Body:**
```json
{
  "referralCode": "ABC12XYZ",
  "eventType": "click"
}
```

**Response:**
```json
{
  "event": {
    "id": "uuid",
    "referralCode": "ABC12XYZ",
    "eventType": "click",
    "tracked_at": "2026-04-24T10:00:00Z"
  }
}
```

**Event Types:**
- `click` - User clicked referral link
- `conversion` - User converted (subscribed/purchased)

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (missing or invalid parameters)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

## Rate Limiting

No rate limiting currently implemented. Consider adding in production.

## Authentication

Currently, admin endpoints are not protected. Implement authentication before production deployment.

Recommended:
- API key authentication for admin endpoints
- JWT tokens for user endpoints
- Row-level security (RLS) policies in Supabase

## Pagination

Most list endpoints return up to 50 items. Consider implementing cursor-based pagination for large datasets.

## CORS

CORS headers should be configured for production use. Update Next.js middleware as needed.
