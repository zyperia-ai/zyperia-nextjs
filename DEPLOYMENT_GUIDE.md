# ZYPERIA Deployment Guide

**Date:** April 23, 2026  
**Status:** Ready for May 1 Launch  
**Project:** zyperia-blogs (Vercel)  
**Repository:** github.com/zyperya-ai/relocate  

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
```bash
# Verify you have:
- Node.js 18+ (pnpm)
- Supabase account (with zyperia project)
- Vercel account (with zyperia-blogs project)
- SendGrid account (OPTIONAL for now, needed for May 1)
```

### Local Setup
```bash
# 1. Clone repo
git clone https://github.com/zyperya-ai/relocate.git
cd relocate

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Apply Supabase migrations
pnpm supabase migration up

# 5. Seed affiliate platforms
npx ts-node apps/machine/scripts/seed-affiliate-platforms.ts

# 6. Run local dev server
pnpm dev

# Visit: http://localhost:3000
```

---

## 📋 Pre-Launch Checklist (April 24-30)

### ✅ Vercel Configuration (10 minutes)

**Step 1: Rename Project**
```
Dashboard: https://vercel.com/dashboard
1. Find "relocate" or "relocate-peach" project
2. Settings → General
3. Rename to: zyperia-blogs
4. Save
```

**Step 2: Add Environment Variables**
```
Settings → Environment Variables

Add:
- NEXT_PUBLIC_SUPABASE_URL: [your-supabase-url]
- NEXT_PUBLIC_SUPABASE_ANON_KEY: [your-supabase-anon-key]
- SUPABASE_SERVICE_ROLE_KEY: [your-service-role-key]
- RESEND_API_KEY: [from Resend, optional for now]
- SENDGRID_API_KEY: [from SendGrid, needed May 1]
- NEXT_PUBLIC_APP_URL: https://zyperia.ai (after DNS setup)
```

**Step 3: Configure Domain**
```
Settings → Domains
1. Add: zyperia.ai
2. Copy Vercel nameservers
3. Go to your domain registrar
4. Update nameservers to Vercel's
5. Wait for DNS propagation (1-24 hours)

Verify with:
nslookup zyperia.ai
```

**Step 4: Auto-Deploy**
```
Connected to GitHub: ✅ (already set up)
Trigger: Any push to main branch
Auto-deploy: Enabled ✅
```

### ✅ Supabase Configuration (15 minutes)

**Step 1: Create Tables**
```bash
# In Supabase SQL Editor, run:
pnpm supabase migration up

# Or manually paste: packages/supabase/migrations/003_affiliate_tracking.sql

# Verify tables created:
- affiliate_platforms ✅
- affiliate_links ✅
- affiliate_clicks ✅
- affiliate_stats ✅
- affiliate_revenue ✅
```

**Step 2: Seed Platforms**
```bash
# Run seed script (populates 15 core platforms)
npx ts-node apps/machine/scripts/seed-affiliate-platforms.ts

# Verify in Supabase:
SELECT COUNT(*) FROM affiliate_platforms;
# Should show: 15
```

**Step 3: RLS Policies**
```
Verified: ✅
Tables have RLS enabled
Service role can manage all
Public can read active platforms
```

### ✅ SendGrid Configuration (30 minutes, REQUIRED for May 1)

**Step 1: Create Account**
```
1. Go to: https://sendgrid.com/pricing
2. Click "Start Free" or choose Essentials (€15/month)
3. Sign up with email
4. Verify email address
```

**Step 2: Create API Key**
```
Dashboard → Settings → API Keys
1. Create New Key
2. Name: zyperia-vercel
3. Copy full key (you won't see it again)
4. Save in secure location
```

**Step 3: Add to Vercel**
```
Vercel Dashboard → Settings → Environment Variables
1. Add: SENDGRID_API_KEY = [paste key here]
2. Save
3. Vercel will auto-redeploy
```

**Step 4: Verify Domain**
```
SendGrid → Settings → Sender Authentication
1. Add Domain: newsletter@zyperia.ai
2. Follow instructions (add DNS records)
3. Verify domain
4. Wait for verification (can take a few hours)

Check status:
DNS MX record, DKIM, SPF must all be verified
```

---

## 🧪 Testing (15 minutes before May 1)

### Test Newsletter Signup
```bash
# Test endpoint
curl -X POST https://zyperia-blogs.vercel.app/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "themes": ["crypto"],
    "source": "crypto_site"
  }'

# Expected response:
{
  "success": true,
  "message": "✓ Check your email to confirm your subscriptions!",
  "token": "abc123..."
}

# Check Supabase:
SELECT * FROM newsletter_subscriptions WHERE email = 'test@example.com';
# Should show: status='pending'
```

### Test Newsletter Confirmation
```bash
# Use token from above
curl "https://zyperia-blogs.vercel.app/api/newsletter/confirm?token=abc123"

# Should redirect to: /newsletter-confirmed?email=test@example.com&themes=Crypto

# Check Supabase:
SELECT * FROM newsletter_subscriptions WHERE email = 'test@example.com';
# Should show: status='confirmed', confirmed_at=[timestamp]
```

### Test Affiliate Links
```bash
# Seed platforms first
npx ts-node apps/machine/scripts/seed-affiliate-platforms.ts

# Create affiliate link
curl -X POST https://zyperia-blogs.vercel.app/api/affiliate/create \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "test-uuid",
    "platforms": ["Kraken", "Zapier"],
    "placement": "inline"
  }'

# Expected response:
{
  "success": true,
  "message": "Created 2 affiliate links",
  "links": [
    {
      "tracking_id": "aff_xxxx_yyyy_zzzz",
      "platform_name": "Kraken",
      "tracking_url": "/api/affiliate/click?id=aff_xxxx_yyyy_zzzz"
    }
  ]
}

# Test click tracking
curl -L "https://zyperia-blogs.vercel.app/api/affiliate/click?id=aff_xxxx_yyyy_zzzz"

# Should log to affiliate_clicks and redirect to Kraken

# Check Supabase:
SELECT * FROM affiliate_clicks WHERE tracking_id = 'aff_xxxx_yyyy_zzzz';
# Should show the click
```

### Test Blog Routes
```bash
# Root landing page
curl https://zyperia-blogs.vercel.app/
# Should show landing page with 3 blog links

# Crypto blog
curl https://zyperia-blogs.vercel.app/crypto/
# Should show crypto blog home page

# Intelligence blog
curl https://zyperia-blogs.vercel.app/intelligence/
# Should show intelligence blog home page

# OnlineBiz blog
curl https://zyperia-blogs.vercel.app/onlinebiz/
# Should show onlinebiz blog home page
```

---

## 🔄 Deployment Flow

### Local Development
```bash
pnpm dev
# http://localhost:3000
```

### Push to GitHub
```bash
git add .
git commit -m "your message"
git push origin main
```

### Automatic Vercel Deployment
```
GitHub push detected
  ↓
Vercel webhook triggered
  ↓
pnpm build && pnpm start
  ↓
Tests pass (if configured)
  ↓
Deploy to production
  ↓
https://zyperia-blogs.vercel.app (live in 1-2 minutes)
```

### Monitor Deployment
```
Vercel Dashboard → Deployments
- Watch build progress
- Check logs for errors
- Preview URL available immediately
- Production URL updated after build completes
```

---

## 📊 Verify Production

After May 1 deployment, verify:

```bash
# Health Check
curl -I https://zyperia.ai/
# HTTP/1.1 200 OK

# Test all 3 blogs load
curl -I https://zyperia.ai/crypto/
curl -I https://zyperia.ai/intelligence/
curl -I https://zyperia.ai/onlinebiz/

# Test newsletter endpoint
curl -X POST https://zyperia.ai/api/newsletter/subscribe \
  -d '...' # (see above)

# Check performance
# Vercel Analytics → Performance → Core Web Vitals
# Target: All "green" (>90 Lighthouse)
```

---

## 🚨 Troubleshooting

### Build Fails
```
Check:
1. All dependencies installed: pnpm install
2. TypeScript errors: pnpm build
3. Environment variables set in Vercel
4. Check build logs: Vercel Dashboard → Deployments → [build] → Logs
```

### Newsletter Not Sending (May 1+)
```
Check:
1. SendGrid API key set in Vercel
2. Sender domain verified in SendGrid
3. SendGrid account has credits (free tier: 5k/month)
4. Check SendGrid activity logs
```

### Affiliate Links Not Tracking
```
Check:
1. Supabase tables exist: \dt
2. Affiliate platforms seeded: SELECT COUNT(*) FROM affiliate_platforms;
3. API endpoint responds: curl https://zyperia.ai/api/affiliate/create
4. Check Supabase logs for errors
```

### DNS Not Resolving
```
Check:
1. Nameservers updated at registrar
2. DNS propagation: nslookup zyperia.ai
3. Vercel domain settings are correct
4. Wait 24 hours for full propagation
```

---

## 📞 Support

**Issue:** Build fails on Vercel  
→ Check: Package.json scripts, TypeScript errors, env vars

**Issue:** Newsletter signup returns 500 error  
→ Check: Supabase connection, NEXT_PUBLIC_SUPABASE_URL set

**Issue:** Affiliate links don't redirect  
→ Check: Seed script ran, affiliate_platforms table populated

**Issue:** Domain doesn't resolve  
→ Check: Nameservers updated, DNS propagation (wait 24h)

---

## ✅ Deployment Checklist

**Before May 1:**
- [ ] Vercel project renamed to zyperia-blogs
- [ ] Environment variables added (Supabase)
- [ ] Domain zyperia.ai configured (or at least working on Vercel URL)
- [ ] Supabase migrations applied
- [ ] Affiliate platforms seeded
- [ ] SendGrid account created + API key added (for May 1)
- [ ] All endpoints tested locally and in staging

**May 1 Launch:**
- [ ] Confirm deploy is live on zyperia.ai
- [ ] Test newsletter signup → confirmation flow
- [ ] Monitor Vercel logs for errors
- [ ] Monitor Supabase for new records
- [ ] Send first test newsletter (Monday 9am UTC)

**May 2-7:**
- [ ] Monitor newsletter metrics (open rate, click rate)
- [ ] Monitor affiliate clicks
- [ ] Review performance data
- [ ] Fix any issues found

---

**Last Updated:** April 23, 2026  
**Version:** 1.0 Production Ready  
**Status:** ✅ Ready for May 1 Launch
