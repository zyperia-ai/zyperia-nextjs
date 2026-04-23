# ZYPERIA Deployment Checklist

Complete pre-deployment verification for ZYPERIA 3-Blog Content Machine (Crypto, Intelligence, OnlineBiz).

**Status:** Ready for deployment (subject to checklist completion)  
**Target Date:** May 1, 2026  
**Owner Responsibility:** Items marked 👤  
**Claude Code Responsibility:** Items marked 🤖

---

## Phase 1: Owner Setup (MUST COMPLETE BY APRIL 30)

### Domains & DNS
- [ ] 👤 Confirm domains registered:
  - [ ] crypto.zyperia.ai
  - [ ] intelligence.zyperia.ai
  - [ ] onlinebiz.zyperia.ai
- [ ] 👤 Verify DNS records point to Vercel:
  ```
  crypto.zyperia.ai CNAME -> cname.vercel-dns.com
  intelligence.zyperia.ai CNAME -> cname.vercel-dns.com
  onlinebiz.zyperia.ai CNAME -> cname.vercel-dns.com
  ```
- [ ] 👤 Check DNS propagation (use `dig` or online tool)

### API Keys Collection
**Important:** Don't add to repo. Use Vercel environment variables.

#### Critical Keys (REQUIRED by May 1)
- [ ] 👤 **SUPABASE_URL** — From Supabase project settings
- [ ] 👤 **SUPABASE_KEY** — Public anon key
- [ ] 👤 **SUPABASE_SERVICE_ROLE_KEY** — Service role key (secret)
- [ ] 👤 **ANTHROPIC_API_KEY** — From Anthropic console (Claude API)
  - Or **OLLAMA_BASE_URL** if using local Phi-4

#### Important Keys (NEEDED FOR STAGES)
- [ ] 👤 **SERP_API_KEY** — SerpAPI (Stage 0: competitive analysis)
- [ ] 👤 **REPLICATE_API_KEY** — Replicate (Stage 3: image generation)
- [ ] 👤 **COPYSCAPE_API_TOKEN** — Copyscape (Stage 4: plagiarism)
- [ ] 👤 **GEMINI_API_KEY** — Google Gemini (Stage 4: fact-checking, optional)

#### Publishing Keys (FOR DISTRIBUTION)
- [ ] 👤 **GSC_API_KEY** — Google Search Console (Stage 6)
- [ ] 👤 **GA4_PROPERTY_ID** — Google Analytics 4 property ID (Stage 6)

#### Optional Keys
- [ ] 👤 **BEEHIIV_API_KEY** — Newsletter (optional)
- [ ] 👤 **SLACK_WEBHOOK_URL** — Slack notifications (optional)

### Vercel Setup
- [ ] 👤 Create 3 Vercel projects (crypto, intelligence, onlinebiz)
- [ ] 👤 Connect GitHub repository to each project
- [ ] 👤 Set environment variables in Vercel for each project:
  - All keys from "API Keys Collection" above
  - See `.env.example` for complete list
- [ ] 👤 Verify build succeeds for each project:
  ```
  vercel build
  ```
- [ ] 👤 Verify cron endpoints are reachable:
  ```
  curl https://crypto.zyperia.ai/api/cron/stage-0-competitive-analysis
  ```

### Google Services
- [ ] 👤 Create Google Search Console property for each domain
- [ ] 👤 Verify domain ownership (via DNS record or HTML file)
- [ ] 👤 Create GA4 property for each blog
- [ ] 👤 Set up GA4 Measurement ID in each blog's code

### Content Setup
- [ ] 👤 Verify theme-config.json is correct for all 3 apps:
  - [ ] Generation prompts reviewed and approved
  - [ ] Affiliate programs configured
  - [ ] Publishing schedule set (articles_per_day, publish_times)
  - [ ] Visual enrichment styles chosen
- [ ] 👤 Seed initial content topics (60-90 total):
  - [ ] 20-30 per blog
  - [ ] Keywords and angles defined
  - [ ] Content mix targets set (40% original, 50% transformed, 10% aggregated)

### Newsletter & Email
- [ ] 👤 Setup Beehiiv or email capture service
- [ ] 👤 Create "Subscribe" forms on landing pages
- [ ] 👤 Test email capture end-to-end
- [ ] 👤 Create welcome email sequence

---

## Phase 2: Claude Code Implementation (COMPLETE BY MAY 1)

### Database Setup
- [ ] 🤖 Create Supabase project (if not exists)
- [ ] 🤖 Run all migrations:
  ```sql
  -- From packages/supabase/migrations/
  psql SUPABASE_URL -c "CREATE TABLE blog_posts (...)"
  psql SUPABASE_URL -c "CREATE TABLE content_research (...)"
  -- ... (all tables from STAGE_SCRIPTS_VERIFICATION.md)
  ```
- [ ] 🤖 Verify all tables exist:
  - blog_posts
  - content_research
  - content_topics
  - theme_config
  - generation_logs
  - blog_performance
- [ ] 🤖 Enable RLS (Row Level Security) policies if needed
- [ ] 🤖 Create Supabase Storage bucket: `zyperia-visuals`
  - Public access for hero images and OG images

### Content Machine Integration
- [ ] 🤖 Implement Stage 2: LLM Integration
  - [ ] Add Phi-4 via Ollama support
  - [ ] Add Claude API fallback
  - [ ] Test article generation quality
  - [ ] Verify token counting and cost tracking

- [ ] 🤖 Implement Stage 0: SerpAPI Integration
  - [ ] Connect SerpAPI key
  - [ ] Fetch top 20 competitors per keyword
  - [ ] Parse and store competitive analysis
  - [ ] Test with all keywords from theme-config

- [ ] 🤖 Implement remaining Stage scripts:
  - [ ] Stage 1: Research & topic selection
  - [ ] Stage 3: Visual enrichment (Replicate, Plotly)
  - [ ] Stage 4: Plagiarism checking (Copyscape, Gemini)
  - [ ] Stage 5: Editorial review (complete with all features)
  - [ ] Stage 6: Publishing (GSC, GA4 integration)

### Vercel Cron Setup
- [ ] 🤖 Create API endpoints for each stage:
  ```
  /api/cron/stage-0-competitive-analysis
  /api/cron/stage-1-research-topics
  /api/cron/stage-2-generate-articles
  /api/cron/stage-3-visual-enrichment
  /api/cron/stage-4-plagiarism-check
  /api/cron/stage-5-editorial-review
  /api/cron/stage-6-publishing-0900
  /api/cron/stage-6-publishing-1400
  /api/cron/stage-6-publishing-1800
  ```
- [ ] 🤖 Test each cron endpoint locally
- [ ] 🤖 Verify cron execution in Vercel logs

### Landing Pages & Design
- [ ] 🤖 Verify 3 premium landing pages:
  - [ ] Crypto theme (dark, gradient text, purple-blue)
  - [ ] Intelligence theme (clean, minimal, purple accents)
  - [ ] OnlineBiz theme (growth-focused, green accents, gradient hero)
- [ ] 🤖 Verify all components:
  - [ ] Header (logo, nav, language dropdown, 2 buttons)
  - [ ] Hero section (badge, title, subtitle, CTAs, stats)
  - [ ] Article grid (ArticleCard with placeholder images)
  - [ ] Newsletter signup section
  - [ ] Footer (all links, disclaimer, affiliate disclosure)
  - [ ] E-E-A-T section (expertise, authority, trustworthiness)
- [ ] 🤖 Core Web Vitals optimization:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
  - [ ] Lighthouse score > 90

### GitHub Actions & CI/CD
- [ ] 🤖 Verify GitHub Actions workflow (`ci-cd.yml`):
  - [ ] Linting passes (eslint, prettier)
  - [ ] Type checking passes (TypeScript)
  - [ ] All apps build successfully
  - [ ] Pipeline test passes (mock data)
  - [ ] All 3 blogs deploy to Vercel
- [ ] 🤖 Add GitHub secrets:
  - [ ] VERCEL_TOKEN
  - [ ] VERCEL_ORG_ID
  - [ ] VERCEL_PROJECT_ID_CRYPTO
  - [ ] VERCEL_PROJECT_ID_INTELLIGENCE
  - [ ] VERCEL_PROJECT_ID_ONLINEBIZ
  - [ ] SLACK_WEBHOOK (optional)

---

## Phase 3: Pre-Launch Testing (APRIL 30)

### Functionality Testing
- [ ] 🤖 Run full pipeline test with mock data:
  ```bash
  cd apps/machine
  npm run test:all
  ```
  Expected: All 7 stages complete in <30s, 15-20 articles generated

- [ ] 🤖 Run Stage scripts individually:
  ```bash
  npm run stage:0  # Competitive analysis
  npm run stage:1  # Research
  npm run stage:2  # Generation
  npm run stage:3  # Visual enrichment
  npm run stage:4  # Plagiarism
  npm run stage:5  # Editorial
  npm run stage:6  # Publishing
  ```

- [ ] 🤖 Test with real APIs (first batch):
  - [ ] Stage 0: Fetch 3-5 competitors per keyword
  - [ ] Stage 2: Generate 5-10 real articles
  - [ ] Stage 4: Run plagiarism checks
  - [ ] Review quality and plagiarism scores

### Website Testing
- [ ] 👤 & 🤖 Test each blog in browser:
  - [ ] crypto.zyperia.ai
  - [ ] intelligence.zyperia.ai
  - [ ] onlinebiz.zyperia.ai

  Test items:
  - [ ] Page loads < 3s
  - [ ] Hero section displays correctly
  - [ ] Article grid shows (with placeholder images)
  - [ ] Newsletter signup form works
  - [ ] Links work (internal and external)
  - [ ] Mobile responsive (test on iPhone/Android)
  - [ ] Dark mode (if applicable)

- [ ] 👤 Test on different browsers:
  - [ ] Chrome/Edge (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Mobile browsers

### Database Validation
- [ ] 🤖 Verify database can handle 10+ articles/day:
  - [ ] Insert performance acceptable
  - [ ] Query performance acceptable
  - [ ] No slow queries > 1s
- [ ] 🤖 Test backup/restore procedures
- [ ] 🤖 Verify RLS policies work correctly

### Security & Compliance
- [ ] 🤖 Verify no API keys in code:
  ```bash
  grep -r "SERP_API_KEY=" apps/  # Should return nothing
  grep -r "sk-ant-api03" apps/    # Should return nothing
  ```
- [ ] 🤖 Run security audit:
  ```bash
  npm audit
  ```
- [ ] 🤖 Verify SSL certificates:
  - [ ] All domains have valid HTTPS
  - [ ] No mixed content warnings

### Analytics Setup
- [ ] 🤖 Verify GA4 tracking installed:
  - [ ] Events firing in real-time dashboard
  - [ ] User count tracked
  - [ ] Page views tracked
- [ ] 🤖 Verify GSC setup:
  - [ ] Domains verified
  - [ ] URL indexing working
  - [ ] Sitemap submitted

---

## Phase 4: Go-Live (MAY 1)

### Pre-Launch (May 1, 08:00 UTC)
- [ ] 👤 Make final decision to launch
- [ ] 🤖 Seed initial 60-90 articles (manually or via batch script)
- [ ] 👤 Enable monitoring:
  - [ ] Set up Sentry error tracking
  - [ ] Set up Slack notifications
  - [ ] Monitor Vercel logs
  - [ ] Monitor Supabase dashboard

### Launch (May 1, 09:00 UTC)
- [ ] 🤖 Verify Stage 0 runs at 23:00 UTC (previous day)
- [ ] 🤖 Verify all 7 stages execute sequentially:
  - Stage 0: 23:00 UTC ✓
  - Stage 1: 00:30 UTC ✓
  - Stage 2: 02:00 UTC ✓
  - Stage 3: 03:00 UTC ✓
  - Stage 4: 04:00 UTC ✓
  - Stage 5: 05:00 UTC ✓
  - Stage 6: 09:00, 14:00, 18:00 UTC ✓

- [ ] 👤 Monitor first day:
  - [ ] Check for errors in logs
  - [ ] Verify articles are generating
  - [ ] Check article quality
  - [ ] Monitor performance metrics

- [ ] 👤 Announce launch:
  - [ ] Post to LinkedIn (personal)
  - [ ] Email newsletter (if setup)
  - [ ] Share in relevant communities

### Post-Launch Monitoring (Week 1)
- [ ] 👤 Daily checks (5-10 minutes):
  - [ ] Check generation_logs for errors
  - [ ] Review generated articles for quality
  - [ ] Monitor CTR and engagement
  - [ ] Check affiliate links work

- [ ] 👤 Weekly review:
  - [ ] Traffic analytics (Google Analytics)
  - [ ] Ranking movement (Google Search Console)
  - [ ] Revenue from affiliates
  - [ ] Newsletter signups
  - [ ] Content quality feedback

---

## Phase 5: Optimization (WEEKS 2-6)

### Content Optimization
- [ ] Adjust generation prompts if quality issues
- [ ] Increase content mix weighting if needed
- [ ] Test different article angles and structures
- [ ] Analyze top-performing articles and create more

### SEO Optimization
- [ ] Monitor ranking for primary keywords
- [ ] Add internal linking between related articles
- [ ] Optimize meta descriptions
- [ ] Submit high-performing pages for GSC indexing

### Performance Optimization
- [ ] Analyze Core Web Vitals
- [ ] Optimize images (compression, lazy loading)
- [ ] Cache static assets
- [ ] Minimize JavaScript

### Monetization Optimization
- [ ] Apply for Google AdSense (if not approved)
- [ ] Optimize affiliate link placement
- [ ] Test different CTA text
- [ ] Track conversion rates per affiliate program

---

## Rollback Plan

If critical issues occur post-launch:

### Immediate (< 1 hour)
- [ ] 🤖 Stop all cron jobs (pause Vercel crons)
- [ ] 🤖 Rollback to previous version (git revert)
- [ ] 👤 Alert team of issues
- [ ] 👤 Check monitoring/error logs

### Short-term (1-6 hours)
- [ ] 🤖 Identify root cause
- [ ] 🤖 Implement fix
- [ ] 🤖 Re-run tests
- [ ] 🤖 Deploy fix

### Medium-term (6-24 hours)
- [ ] 👤 Review incident report
- [ ] 👤 Determine if data loss occurred
- [ ] 🤖 Run database consistency checks
- [ ] 👤 Plan to prevent future incidents

### Data Recovery
- [ ] 👤 Use Supabase backups (if available)
- [ ] 👤 Restore from point-in-time (if configured)
- [ ] 👤 Manually recreate articles if needed

---

## Sign-Off

**Deployment Manager:**  
Name: _______________  
Date: _______________  
Signature: _______________

**Technical Lead (CC):**  
Name: Claude Code  
Date: _______________  
Sign-off: Deployment infrastructure ready ✓

**Owner (Luís):**  
Name: _______________  
Date: _______________  
Sign-off: All prerequisites complete ✓

---

## Appendix: Quick Reference

### Critical API Costs (Monthly)
| Service | Cost | Purpose |
|---------|------|---------|
| SerpAPI | €5-15 | Stage 0: Competitive analysis |
| Replicate | €10-30 | Stage 3: Image generation |
| Copyscape | €20-50 | Stage 4: Plagiarism checks |
| Gemini | €5-15 | Stage 4: Fact-checking |
| Anthropic | €50-100 | Stage 2: Claude API (if no Ollama) |
| **Total** | **€90-210** | All stages |

### Free Alternatives
- Phi-4 via Ollama (local, €0)
- Google Analytics 4 (€0, free tier)
- Google Search Console (€0)

### Cron Job Times (UTC)
```
23:00 → Stage 0: Competitive analysis
00:30 → Stage 1: Research & topic selection
02:00 → Stage 2: Content generation
03:00 → Stage 3: Visual enrichment
04:00 → Stage 4: Plagiarism check & verification
05:00 → Stage 5: Editorial review
09:00 → Stage 6: Publishing (batch 1)
14:00 → Stage 6: Publishing (batch 2)
18:00 → Stage 6: Publishing (batch 3)
```

### Contact & Support
- **Luís:** Owner, strategy, content review
- **Claude Code:** Implementation, monitoring, debugging
- **Vercel Support:** Infrastructure issues
- **Supabase Support:** Database issues
