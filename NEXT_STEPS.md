# 🚀 NEXT STEPS - O QUE FALTA FAZER

**Status:** Deployment completo ✅  
**Próxima Fase:** Content Machine + Monetization  
**Timeline:** 4-6 semanas até revenue significativa  

---

## 📋 PRIORITY 1: CONTENT MACHINE (SEMANAS 1-2)

### STAGE 0: Competitive Intelligence (SerpAPI)
- [ ] Implementar SerpAPI integration
- [ ] Criar script para análise de top 20 competitors (por topic)
- [ ] Extrair estrutura, tone, comprimento de artigos concorrentes
- [ ] Identificar content gaps
- [ ] Armazenar em `content_research` table

**Ficheiros a criar:**
- `apps/machine/scripts/competitive-analysis.ts`
- `apps/machine/lib/competitive-intelligence.ts`

**APIs needed:**
- SerpAPI key (€5-15/mth)

**Tempo estimado:** 4-6 horas

---

### STAGE 1: Research & Topic Selection
- [ ] Criar topic queue em `content_topics` table
- [ ] Web search para cada topic (SerpAPI)
- [ ] Compilar research data (facts, stats, angles)
- [ ] Selecionar geração strategy (40% original, 50% transformed, 10% aggregated)

**Ficheiros a criar:**
- `apps/machine/scripts/research-topics.ts`

**Tempo estimado:** 3-4 horas

---

### STAGE 2: Content Generation (Phi-4 + Gemini)
- [ ] Implementar 3 generation approaches:
  - **Original:** Fresh perspective + research
  - **Transformed:** Improve competitor articles (>30% rewrite)
  - **Aggregated:** Synthesize 3-5 sources
- [ ] Structured prompt engineering para cada approach
- [ ] Use Phi-4 (Ollama ou Replicate) para generation
- [ ] Store drafts em `blog_posts` table (status='draft')

**Ficheiros a criar:**
- `apps/machine/scripts/generate-original.ts`
- `apps/machine/scripts/generate-transformed.ts`
- `apps/machine/scripts/generate-aggregated.ts`
- `apps/machine/config/theme-config.json` (per-app prompts)

**APIs needed:**
- Phi-4 (Ollama local OU Replicate €0.001/invocation)
- Anthropic API (fallback)

**Tempo estimado:** 8-10 horas

---

### STAGE 3: Visual Enrichment (Stable Diffusion + Plotly)
- [ ] Integrar Stable Diffusion para hero images
  - Per-app aesthetic (crypto_tech, intelligence_minimal, onlinebiz_growth)
  - 1200x630 dimensions
  - Store em Supabase Storage
- [ ] Auto-generate data visualizations (Plotly)
  - Auto-detect numeric data em articles
  - Chart types: line, bar, pie, candlestick
  - SVG/PNG export
- [ ] Generate OG images (Canvas/Node-canvas)
  - 1200x630px
  - Title + theme color + logo overlay

**Ficheiros a criar:**
- `apps/machine/scripts/generate-hero-images.ts`
- `apps/machine/scripts/generate-visualizations.ts`
- `apps/machine/scripts/generate-og-images.ts`
- `apps/machine/lib/visual-enrichment.ts`

**APIs needed:**
- Replicate (Stable Diffusion) €0.001-0.01/image
- Plotly (open source)
- Node-canvas (open source)

**Tempo estimado:** 6-8 horas

---

### STAGE 4: Plagiarism & Verification
- [ ] Integrar Copyscape para plagiarism detection
- [ ] Gemini Flash para fact-checking
- [ ] Confidence scoring (0-100%)
  - <80% = reject, regenrate
  - 80-95% = flag for owner review
  - >95% = auto-approve
- [ ] Multi-layer verification

**Ficheiros a criar:**
- `apps/machine/scripts/verify-plagiarism.ts`
- `apps/machine/scripts/fact-checker.ts`
- `apps/machine/lib/plagiarism-checker.ts`

**APIs needed:**
- Copyscape API (€0.10-0.20/article)
- Gemini Flash (€0.001/article)

**Tempo estimado:** 4-6 horas

---

### STAGE 5: Editorial Review & Polish
- [ ] E-E-A-T signal enhancement
  - Author bio
  - Source citations
  - Expert review notes
- [ ] JSON-LD schema markup
- [ ] Internal linking optimization
- [ ] Readability check (Flesch >60)
- [ ] Mobile-responsive formatting

**Ficheiros a criar:**
- `apps/machine/scripts/editorial-review.ts`

**Tempo estimado:** 3-4 horas

---

### STAGE 6: Publishing & Indexing
- [ ] Auto-publish em horários específicos (09:00, 14:00, 18:00 UTC)
- [ ] Sitemap generation
- [ ] Google Search Console manual indexing
- [ ] Slack notifications (optional)
- [ ] GA4 event logging

**Ficheiros a criar:**
- `apps/machine/scripts/publish-articles.ts`

**Tempo estimado:** 3-4 horas

---

## 📊 PRIORITY 2: MONITORING & OPTIMIZATION (SEMANA 2-3)

### Analytics Dashboard
- [ ] GA4 setup e tracking
- [ ] Performance metrics per article:
  - Views, time-on-page, bounce rate
  - Engagement score = (views × time_on_page) / avg_on_site
  - Affiliate CTR
- [ ] Topic performance analysis
- [ ] Content approach ROI (original vs transformed vs aggregated)

**Ficheiros:**
- Update `blog_performance` table with GA4 data

**Tempo estimado:** 2-3 horas

---

### Content Optimization Loop
- [ ] Monitor articles after 7 days
- [ ] <2min avg time: rewrite for clarity
- [ ] >50% bounce rate: revise intro
- [ ] Top performers: expand para 2-3 follow-ups
- [ ] Underperformers: archive + rewrite

**Tempo estimado:** Ongoing (1-2h/week)

---

## 💰 PRIORITY 3: MONETIZATION (SEMANA 3-4)

### Google AdSense Setup
- [ ] Aplicar a cada blog quando tiver >10 artigos
- [ ] Esperar aprovação (1-2 semanas)
- [ ] Setup ad placements
- [ ] Monitor RPM (revenue per 1000 impressions)

**Tempo estimado:** Pendente de aprovação

---

### Affiliate Optimization
- [ ] CJ already setup ✅
- [ ] Add affiliate links contextually em articles
  - Tool comparisons
  - Product recommendations
  - "Learn more" sections
- [ ] Track CTR + conversion rates
- [ ] Optimize placement + CTA copy based on data

**Ficheiros:**
- Create `affiliate_links` + `affiliate_stats` data entry scripts
- Add affiliate widget/component

**Tempo estimado:** 2-3 horas

---

## 🔧 PRIORITY 4: INFRASTRUCTURE & AUTOMATION

### Vercel Cron Jobs
- [ ] Setup cron triggers para cada stage:
  - 23:00 UTC: Stage 0 (competitive analysis)
  - 00:30 UTC: Stage 1 (research)
  - 02:00 UTC: Stage 2 (generation)
  - 03:00 UTC: Stage 3 (visuals)
  - 04:00 UTC: Stages 4-5 (verification + editorial)
  - 09:00, 14:00, 18:00 UTC: Stage 6 (publishing)

**Ficheiros:**
- `vercel.json` cron configuration
- `apps/machine/api/cron-*.ts` route handlers

**Tempo estimado:** 2-3 horas

---

### Logging & Error Handling
- [ ] Structured logging para cada stage
- [ ] Sentry integration para error tracking
- [ ] `generation_logs` table populated com details:
  - Success/failure status
  - Duration, cost, errors
  - AI model used
  - Stage-specific details

**Tempo estimado:** 2 horas

---

## 📅 TIMELINE RECOMENDADA

```
SEMANA 1 (Próximos 7 dias):
  Days 1-3: Implement Stages 0-2 (research + generation)
  Days 4-5: Implement Stages 3-4 (visuals + plagiarism)
  Days 6-7: Implement Stages 5-6 (editorial + publishing)
  Result: Content machine pronto para manual testing

SEMANA 2 (Dias 8-14):
  Days 1-3: Setup cron jobs + monitoring
  Days 4-5: QA + debug pipeline
  Days 6-7: Generate 60-90 seed articles (20-30 per blog)
  Result: 3 blogs com conteúdo inicial

SEMANA 3-4 (Dias 15-30):
  Days 1-7: Monitor performance + optimize
  Days 8-14: Apply AdSense + setup affiliate links
  Days 15-28: Continue generating 2-4 articles/day per blog
  Result: Pipeline stable, revenue tracking active

SEMANA 5-6 (Dias 31-42):
  Focus: Optimization + content improvement
  Goal: 50-100k total visitors, AdSense + affiliate revenue flowing
```

---

## 🎯 SUCESSO CRITERIA (FIM DA SEMANA 4)

| Métrica | Target | Status |
|---------|--------|--------|
| **Articles Published** | 60-120 total (20-40 per blog) | ⏳ Pending |
| **Visitors** | 5-15k total | ⏳ Pending |
| **Affiliate Clicks** | 10-50/week | ⏳ Pending |
| **AdSense Status** | Approved ou rejected | ⏳ Pending |
| **Content Stability** | 2-4 articles/day per blog | ⏳ Pending |
| **Error Rate** | <5% pipeline failures | ⏳ Pending |

---

## 💡 NICE-TO-HAVES (Depois de MVP)

- [ ] Backlink hunting automation (Stage 7b)
- [ ] A/B testing visual styles
- [ ] Multi-language support (EN/PT/ES/FR)
- [ ] Advanced competitor tracking (BuzzSumo integration)
- [ ] Email newsletter integration (existing Resend)
- [ ] Social media auto-posting (Twitter, LinkedIn)

---

## 🚨 CRITICAL BLOCKERS

**Nenhum!** Tudo está pronto. Apenas falta implementar a content machine.

**Dependencies:**
- ✅ APIs: SerpAPI, Stable Diffusion, Gemini, Copyscape keys
- ✅ Database: Supabase ready
- ✅ Hosting: Vercel ready
- ✅ Infrastructure: All configured

---

## 📝 FICHEIROS A CRIAR

**Total: 15+ ficheiros**

Pasta: `apps/machine/scripts/`
- competitive-analysis.ts
- research-topics.ts
- generate-original.ts
- generate-transformed.ts
- generate-aggregated.ts
- generate-hero-images.ts
- generate-visualizations.ts
- generate-og-images.ts
- verify-plagiarism.ts
- fact-checker.ts
- editorial-review.ts
- publish-articles.ts

Pasta: `apps/machine/lib/`
- competitive-intelligence.ts
- visual-enrichment.ts
- plagiarism-checker.ts

Pasta: `apps/machine/config/`
- theme-config.json

Pasta: `apps/machine/api/`
- cron-stage0.ts (ou similar)

---

**PRONTOS PARA COMEÇAR?** 🚀

Qual quer fazer primeiro: Stages 0-2 ou outra coisa?
