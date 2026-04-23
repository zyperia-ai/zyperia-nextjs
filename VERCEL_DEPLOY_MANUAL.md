# 🚀 ZYPERIA Vercel Deployment - Manual Guide

## Issue with Monorepo

Vercel has limitations with pnpm monorepos. The automatic deploy doesn't work as expected. 
**Solution: Deploy each app as a separate Vercel project using the UI or CLI with individual repos.**

---

## Option A: Deploy via Vercel Dashboard (Easiest)

### Step 1: Create Vercel Projects

1. Go to: https://vercel.com/dashboard
2. Click "New Project"
3. Import from Git: **Skip for now** (monorepo issue)
4. Instead, use "Deploy" button below

### Step 2: For Each App (crypto, intelligence, onlinebiz)

1. **Go to:** https://vercel.com/new
2. **Paste:** Repository URL or create via Import
3. **Settings:**
   - Project Name: `zyperia-crypto` (or `intelligence`, `onlinebiz`)
   - Root Directory: `apps/crypto` (or respective app)
   - Build Command: `cd ../.. && pnpm build --filter=crypto`
   - Install Command: `cd ../.. && pnpm install`
   - Output Directory: `.next`

4. **Environment Variables:**
   Add for each project:
   ```
   SUPABASE_URL=https://echhftptqtznxqpvjgta.supabase.co
   SUPABASE_KEY=sb_publishable_x97fdNFMpSHyvBVQSRukJA_iENLv8dH
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_SUPABASE_URL=https://echhftptqtznxqpvjgta.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_x97fdNFMpSHyvBVQSRukJA_iENLv8dH
   RESEND_API_KEY=re_X1R32haY_A1VUKTLGpTu2Jz1mZFA1aqtB
   ```

5. **Click Deploy**

---

## Option B: Deploy Using Separate Repos (Recommended)

### Step 1: Create Git Subtrees

```bash
# Create separate repos for each app
git subtree push --prefix apps/crypto git@github.com:yourusername/zyperia-crypto.git main
git subtree push --prefix apps/intelligence git@github.com:yourusername/zyperia-intelligence.git main
git subtree push --prefix apps/onlinebiz git@github.com:yourusername/zyperia-onlinebiz.git main
```

### Step 2: Deploy Each from Vercel

1. Go to: https://vercel.com/new
2. Import from GitHub: `zyperia-crypto`
3. Set settings as above
4. Deploy
5. Repeat for other apps

---

## Option C: Using GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'apps/crypto/**'
      - 'apps/intelligence/**'
      - 'apps/onlinebiz/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy crypto
        run: vercel deploy --token ${{ secrets.VERCEL_TOKEN }} apps/crypto
      - name: Deploy intelligence
        run: vercel deploy --token ${{ secrets.VERCEL_TOKEN }} apps/intelligence
      - name: Deploy onlinebiz
        run: vercel deploy --token ${{ secrets.VERCEL_TOKEN }} apps/onlinebiz
```

---

## After Deployment

### 1. Add Custom Domains

In Vercel Dashboard for each project:

- **crypto** → `crypto.zyperia.ai`
- **intelligence** → `intelligence.zyperia.ai`
- **onlinebiz** → `onlinebiz.zyperia.ai`

### 2. Update DNS

Use Vercel's nameservers or CNAME records:

```
crypto.zyperia.ai  →  cname.vercel-dns.com
intelligence...     →  cname.vercel-dns.com
onlinebiz...        →  cname.vercel-dns.com
```

### 3. Test Deployments

```bash
curl https://crypto.zyperia.ai/
curl https://intelligence.zyperia.ai/
curl https://onlinebiz.zyperia.ai/
```

---

## Troubleshooting

**Q: "No Next.js version detected"**
- A: Check that next.config.ts exists in the root of each app

**Q: "Build failed: pnpm install"**
- A: Vercel may not support monorepo builds well
- Solution: Use separate repos or GitHub Actions

**Q: "Environment variables not found"**
- A: Add them in Vercel Dashboard Settings → Environment Variables

---

## Current Status

✅ Code is ready for deployment
✅ Build passes locally
⏳ Vercel: Manual deployment needed (monorepo limitation)
⏳ Database: Migrations still need manual application
⏳ Domains: Need to be configured after deployment

Next: Apply migrations to Supabase, then deploy manually via Vercel Dashboard
