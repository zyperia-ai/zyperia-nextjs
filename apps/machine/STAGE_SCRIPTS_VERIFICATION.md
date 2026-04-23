# Stage Scripts Verification Checklist

Complete verification of all 7 Stage scripts for ZYPERIA Brutal System.

**Status:** ✓ All stage files created and partially implemented  
**Last Updated:** 2026-04-22  
**Total Lines:** 1,927 across 7 scripts + 4 libraries

---

## STAGE 0: Competitive Analysis
**File:** `scripts/stage-0-competitive-analysis.ts` (134 lines)  
**Library:** `lib/competitive-intelligence.ts` (217 lines)

### Script Checklist
- [x] Main script exists and imports correctly
- [x] Supabase client initialized
- [x] Config loading from theme_config table
- [x] Loop through apps and keywords
- [x] Call competitive analysis library function
- [x] Store results in content_research table
- [x] Error handling with try-catch
- [x] Logging at each step
- [x] Generate generation_logs entries
- [ ] **NEEDS:** SerpAPI integration for real API (currently mock)
- [ ] **NEEDS:** BuzzSumo API integration (optional)
- [ ] **NEEDS:** Retry logic for API failures
- [ ] **NEEDS:** Cost tracking for SerpAPI usage

### Library Checklist
- [x] getTopCompetitors function defined
- [x] analyzeArticleStructure function
- [x] identifyContentGaps function
- [x] extractCommonSources function
- [x] recommendGenerationApproach function
- [x] runCompetitiveAnalysis main function
- [ ] **NEEDS:** Actual SerpAPI fetch implementation (has mock)
- [ ] **NEEDS:** HTML parsing for competitor articles
- [ ] **NEEDS:** Backlink analysis
- [ ] **NEEDS:** Social media engagement data

### Status: 70% COMPLETE
**Blockers:** SerpAPI integration needed for real data  
**Workaround:** Uses mock data for testing

---

## STAGE 1: Research & Topic Selection
**File:** `scripts/stage-1-research-topics.ts` (134 lines)

### Script Checklist
- [x] Main script exists
- [x] Supabase client initialized
- [x] Load content_topics table
- [x] For each topic, perform research
- [x] Store research in content_research table
- [x] Error handling
- [ ] **NEEDS:** Web search implementation (Google/Bing)
- [ ] **NEEDS:** News aggregation (for breaking updates)
- [ ] **NEEDS:** Reference official sources per blog type
- [ ] **NEEDS:** Extract key facts and statistics

### Status: 50% COMPLETE
**Blockers:** Web search API integration  
**Workaround:** Manual topic selection during setup

---

## STAGE 2: Content Generation
**File:** `scripts/stage-2-generate-articles.ts` (253 lines)

### Script Checklist
- [x] Main script exists
- [x] Supabase client initialized
- [x] Calculate content mix (40/50/10)
- [x] Load research from Stage 1
- [x] Loop through apps
- [x] Generate original, transformed, aggregated articles
- [x] Store drafts in blog_posts table
- [x] Error handling and logging
- [x] Track generation_approach
- [x] Cost tracking
- [ ] **NEEDS:** Phi-4 integration (Ollama or Replicate)
- [ ] **NEEDS:** Claude API fallback
- [ ] **NEEDS:** Streaming for long content
- [ ] **NEEDS:** Token counting and cost estimation
- [ ] **NEEDS:** Retry with different prompts if low quality

### Status: 75% COMPLETE
**Blockers:** LLM integration (Phi-4 / Claude API)  
**Workaround:** Mock article generation for testing

---

## STAGE 3: Visual Enrichment
**File:** `scripts/stage-3-visual-enrichment.ts` (134 lines)  
**Library:** `lib/visual-enrichment.ts` (288 lines)

### Script Checklist
- [x] Main script exists
- [x] Supabase client initialized
- [x] Load draft articles without hero_image_url
- [x] Get visual config per app
- [x] Call visual enrichment library
- [x] Update articles with image URLs
- [x] Error handling
- [x] Logging with image URLs
- [ ] **NEEDS:** Replicate API integration for Stable Diffusion
- [ ] **NEEDS:** Plotly chart generation
- [ ] **NEEDS:** Canvas OG image generation
- [ ] **NEEDS:** Image storage in Supabase
- [ ] **NEEDS:** Retry on image generation failure

### Library Checklist
- [x] enrichArticleWithVisuals function signature
- [ ] **NEEDS:** Hero image generation (Stable Diffusion)
  - [ ] Crypto theme prompts
  - [ ] Intelligence theme prompts
  - [ ] OnlineBiz theme prompts
- [ ] **NEEDS:** Data visualization detection
  - [ ] Extract numeric data from content
  - [ ] Generate Plotly charts (line, bar, candlestick)
- [ ] **NEEDS:** OG image generation (Canvas)
  - [ ] Title + theme color + logo
  - [ ] Dimensions: 1200x630px
- [ ] **NEEDS:** Supabase Storage upload
  - [ ] Naming: `/articles/[id]/hero-[version].png`
  - [ ] Public URL generation

### Status: 40% COMPLETE
**Blockers:** Replicate/Stable Diffusion, Plotly integration  
**Workaround:** Mock images for testing

---

## STAGE 4: Plagiarism Check & Verification
**File:** `scripts/stage-4-plagiarism-check.ts` (141 lines)  
**Library:** `lib/plagiarism-checker.ts` (258 lines)

### Script Checklist
- [x] Main script exists
- [x] Supabase client initialized
- [x] Load draft articles without plagiarism_checked_at
- [x] Get original article content if transformed
- [x] Call plagiarism checker library
- [x] Update plagiarism_score
- [x] Error handling
- [ ] **NEEDS:** Copyscape API integration
- [ ] **NEEDS:** Gemini Flash fact-checking
- [ ] **NEEDS:** Confidence scoring logic
- [ ] **NEEDS:** Article rejection workflow

### Library Checklist
- [x] runPlagiarismCheck function signature
- [ ] **NEEDS:** Copyscape API integration
  - [ ] Authenticate with token
  - [ ] Submit article for checking
  - [ ] Parse plagiarism percentage
  - [ ] Identify plagiarized sources
- [ ] **NEEDS:** Uniqueness calculation
  - [ ] Original: 85%+ unique
  - [ ] Transformed: 70%+ unique (>30% rewrite)
  - [ ] Aggregated: 80%+ unique
- [ ] **NEEDS:** Fact-checking with Gemini
  - [ ] Extract claims from article
  - [ ] Verify against official sources
  - [ ] Generate verification report

### Status: 60% COMPLETE
**Blockers:** Copyscape, Gemini API integration  
**Workaround:** Mock plagiarism scores for testing

---

## STAGE 5: Editorial Review & E-E-A-T
**File:** `scripts/stage-5-editorial-review.ts` (194 lines)

### Script Checklist
- [x] Main script exists
- [x] Supabase client initialized
- [x] Load draft articles with plagiarism_checked_at
- [x] Check plagiarism_score >= 70
- [x] Call E-E-A-T enhancement
- [x] Update last_verified_at
- [x] Error handling
- [x] Function: enhanceWithEEAT (adds disclaimer, bio, sources)
- [x] Function: generateSchemaMarkup (JSON-LD)
- [ ] **NEEDS:** Internal linking logic
  - [ ] Find related articles
  - [ ] Generate contextual links
- [ ] **NEEDS:** Readability optimization
  - [ ] Flesch score calculation
  - [ ] Sentence variation
- [ ] **NEEDS:** Mobile formatting check
- [ ] **NEEDS:** Alt text generation for images

### Status: 75% COMPLETE
**Blockers:** Internal linking, readability optimization  
**Workaround:** Basic E-E-A-T signals added

---

## STAGE 6: Publishing
**File:** `scripts/stage-6-publish-articles.ts` (139 lines)

### Script Checklist
- [x] Main script exists
- [x] Supabase client initialized
- [x] Load scheduled articles with last_verified_at
- [x] Final plagiarism check (score < 30)
- [x] Update status='published' and published_at
- [x] Generate article URLs
- [x] Error handling
- [ ] **NEEDS:** Google Search Console submission
  - [ ] GSC API authentication
  - [ ] Submit URL for indexing
  - [ ] Parse GSC response
- [ ] **NEEDS:** GA4 event tracking
  - [ ] Measurement Protocol setup
  - [ ] Send article_published event
  - [ ] Track metadata (topic, approach, length)
- [ ] **NEEDS:** Sitemap update
  - [ ] Add article URL to sitemap
  - [ ] Notify Google
- [ ] **NEEDS:** Email newsletter integration
  - [ ] Send to Beehiiv or email list
  - [ ] Include article summary
  - [ ] Track newsletter engagement

### Status: 65% COMPLETE
**Blockers:** GSC, GA4 API integration  
**Workaround:** Manual submission via GSC UI

---

## Supporting Libraries

### lib/ai-router.ts (35 lines)
- [x] File exists
- [x] Phi-4 integration signature
- [x] Claude API fallback signature
- [ ] **NEEDS:** Actual implementation
  - [ ] Ollama connection for Phi-4
  - [ ] Anthropic SDK for Claude
  - [ ] Streaming response handling

**Status:** 20% COMPLETE

### lib/competitive-intelligence.ts (217 lines)
- [x] Data structures defined
- [x] Helper functions implemented
- [ ] **NEEDS:** SerpAPI integration (see Stage 0)

**Status:** 70% COMPLETE

### lib/plagiarism-checker.ts (258 lines)
- [x] Data structures defined
- [x] Function signatures
- [ ] **NEEDS:** Copyscape API integration
- [ ] **NEEDS:** Gemini fact-checking

**Status:** 60% COMPLETE

### lib/visual-enrichment.ts (288 lines)
- [x] Data structures defined
- [x] Function signatures
- [ ] **NEEDS:** Stable Diffusion integration
- [ ] **NEEDS:** Plotly integration
- [ ] **NEEDS:** Canvas OG image generation

**Status:** 40% COMPLETE

---

## Configuration

### config/theme-config.json
- [x] File exists with all 3 apps configured
- [x] Generation prompts defined (original, transformed, aggregated)
- [x] Verification sources listed
- [x] Affiliate programs configured
- [x] Publishing schedule set (articles_per_day, publish_times)
- [x] Brutal system settings for all apps
- [x] Visual enrichment styles configured
- [x] Plagiarism check settings defined

**Status:** ✓ 100% COMPLETE

---

## Implementation Priority

### Phase 1 (CRITICAL) — Before May 1
1. **Stage 2: LLM Integration**
   - [ ] Integrate Phi-4 (Ollama or Replicate API)
   - [ ] Add Claude API fallback
   - [ ] Test generation quality

2. **Stage 0: SerpAPI Integration**
   - [ ] Setup SerpAPI key
   - [ ] Implement competitor fetching
   - [ ] Test with mock keywords

3. **Database Schema**
   - [ ] Verify all tables exist
   - [ ] Check columns match stage scripts
   - [ ] Enable RLS policies

4. **Vercel Cron Setup**
   - [ ] Setup cron endpoint for each stage
   - [ ] Test cron trigger locally
   - [ ] Monitor execution logs

### Phase 2 (IMPORTANT) — During May
5. **Stage 3: Visual Enrichment**
   - [ ] Integrate Replicate API for Stable Diffusion
   - [ ] Implement Plotly chart generation
   - [ ] Implement Canvas OG image generation

6. **Stage 4: Plagiarism**
   - [ ] Setup Copyscape API
   - [ ] Integrate Gemini fact-checking
   - [ ] Implement quality thresholds

7. **Stage 6: Publishing**
   - [ ] Setup Google Search Console API
   - [ ] Setup GA4 Measurement Protocol
   - [ ] Implement newsletter integration

### Phase 3 (NICE-TO-HAVE) — June+
8. **Optimization**
   - [ ] Internal linking algorithm
   - [ ] Readability optimization
   - [ ] Content A/B testing
   - [ ] Performance monitoring

---

## Testing Completeness

### Unit Tests Needed
- [ ] Stage 0: Competitive analysis logic
- [ ] Stage 1: Topic selection and ranking
- [ ] Stage 2: Article generation quality
- [ ] Stage 3: Visual generation
- [ ] Stage 4: Plagiarism logic
- [ ] Stage 5: E-E-A-T signal injection
- [ ] Stage 6: Publishing and tracking

### Integration Tests Needed
- [ ] Full pipeline end-to-end
- [ ] Error recovery between stages
- [ ] Database transactions
- [ ] API failure handling

### Performance Tests Needed
- [ ] Single article generation time
- [ ] Batch processing (10 articles/day)
- [ ] Database query performance
- [ ] API rate limit handling

---

## Summary

| Stage | Files | Lines | Status | Blockers | Priority |
|-------|-------|-------|--------|----------|----------|
| 0: Analysis | 2 | 351 | 70% | SerpAPI | HIGH |
| 1: Research | 1 | 134 | 50% | Web Search API | MEDIUM |
| 2: Generation | 1 | 253 | 75% | LLM Integration | CRITICAL |
| 3: Visuals | 2 | 422 | 40% | Replicate, Plotly | HIGH |
| 4: Plagiarism | 2 | 399 | 60% | Copyscape, Gemini | HIGH |
| 5: Editorial | 1 | 194 | 75% | Internal Linking | MEDIUM |
| 6: Publishing | 1 | 139 | 65% | GSC, GA4 APIs | MEDIUM |
| Config | 1 | - | 100% | - | DONE |

**Total Coverage: 65% of core functionality**

---

## Next Steps

1. [ ] Update .env with API keys
2. [ ] Implement Stage 2 LLM integration
3. [ ] Implement Stage 0 SerpAPI integration
4. [ ] Run full local test with mock data
5. [ ] Iterate on prompts and quality
6. [ ] Deploy to Vercel with cron jobs
7. [ ] Monitor first batch of generated articles
8. [ ] Implement remaining stage integrations (3, 4, 6)

---

See TESTING_GUIDE.md for how to test each stage locally.
