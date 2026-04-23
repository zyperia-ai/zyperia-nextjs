# Content Machine - Quick Start Deployment

**Get automated content generation running in 10 minutes.**

---

## Pre-Deployment Checklist

- [ ] Git repo ready (changes staged)
- [ ] ANTHROPIC_API_KEY configured (✅ already in SUPABASE_KEY in Vercel)
- [ ] Supabase connection working

---

## Deploy (3 Commands)

### 1. Commit
```bash
git add .
git commit -m "feat: Content machine - Production deployment (Claude + cron jobs)"
```

### 2. Push to GitHub
```bash
git push origin main
```

### 3. Vercel Auto-Deploys
- Navigate to https://vercel.com/dashboard
- Verify "Deployed ✓" status appears
- Deployment takes ~2-3 minutes

---

## Configure Environment (2 minutes)

Go to Vercel → **Settings → Environment Variables** for **each project**:

Add these 3 variables:

```
CRON_SECRET=<generate with: openssl rand -base64 32>
[ANTHROPIC_API_KEY already configured]
[SUPABASE_* already configured]
```

**Apply to:** All 3 projects (crypto, intelligence, onlinebiz)

---

## That's It! 🎉

Next cron run: **23:00 UTC tomorrow**

To verify working:
```sql
-- In Supabase, after 06:00 UTC tomorrow:
SELECT COUNT(*) FROM blog_posts WHERE status='published';
-- Should show 3-4+ articles published
```

---

## Optional: Trigger Manually Today

```bash
CRON_SECRET="your-cron-secret"

# Trigger Stage 0 (competitive analysis)
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://crypto.zyperia.ai/api/cron/stage-0-analysis

# Trigger Stage 1 (research)
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://crypto.zyperia.ai/api/cron/stage-1-research

# Trigger Stage 2 (generation) - MAIN EVENT
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://crypto.zyperia.ai/api/cron/stage-2-generate

# Check results in Supabase:
# SELECT COUNT(*) FROM blog_posts WHERE status='draft'
```

---

## What's Running Now

✅ **Stage 0:** Competitive analysis (mocked, ready for SerpAPI)
✅ **Stage 1:** Research topic selection (fully functional)
✅ **Stage 2:** Claude-powered content generation (LIVE)
✅ **Stage 3:** Visual enrichment (mocked, ready for Replicate)
✅ **Stage 4:** Plagiarism checking (mocked, ready for Copyscape)
✅ **Stage 5:** E-E-A-T enhancement (fully functional)
✅ **Stage 6:** Auto-publishing (fully functional)

**Daily output:** 10-12 articles across 3 blogs

---

## Help

- Full guide: `CONTENT_MACHINE_SETUP.md`
- Status: `CONTENT_MACHINE_STATUS.md`
- Troubleshooting: `DEPLOYMENT_CHECKLIST.md`
- Detailed guide: `TESTING_GUIDE.md`

---

**Ready? Push to Vercel and let it run! 🚀**
