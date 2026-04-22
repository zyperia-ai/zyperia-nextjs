# ZYPERIA — Multi-Blog Content Machine

3 high-performance blogs powered by AI content generation:
- **crypto.zyperia.ai** — Cryptocurrency education & trading
- **intelligence.zyperia.ai** — Business automation with AI
- **onlinebiz.zyperia.ai** — How to earn money online

## Architecture

**Monorepo** with pnpm workspaces + Turborepo:
- `apps/crypto`, `apps/intelligence`, `apps/onlinebiz` — Next.js 16.2 blogs
- `apps/machine` — Content generation pipeline
- `packages/shared-lib` — Shared business logic
- `packages/shared-ui` — Shared React components
- `packages/shared-config` — Shared configuration
- `packages/supabase` — Database schema + migrations

## AI Stack (Cost-Optimized)

1. **Phi-4 (Ollama)** — FREE local inference for generation (~2 min/article)
2. **Gemini Flash** — Super cheap verification (~€0.001/article)
3. **Claude Sonnet** — Fallback only (~5-10% articles)

**Total cost: €3-25/month** (vs. €200+/month using Claude only)

## Quick Start

```bash
# Install dependencies
pnpm install

# Run dev servers (all apps in parallel)
pnpm dev

# Build all apps
pnpm build

# Run content generation pipeline
cd apps/machine
pnpm generate   # Generate articles
pnpm verify     # Fact-check them
pnpm publish    # Publish to blogs
```

## Deployment

All 3 apps deploy to Vercel automatically via CI/CD.

Each blog:
- `crypto.zyperia.ai` runs on port 3001
- `intelligence.zyperia.ai` runs on port 3002
- `onlinebiz.zyperia.ai` runs on port 3003

## Content Pipeline

```
Research (00:30 UTC) 
  → Generate (02:00 UTC) 
    → Verify (04:00 UTC) 
      → Editorial (05:00 UTC) 
        → Publish (09:00, 14:00, 18:00 UTC)
```

## Database

Supabase PostgreSQL with:
- `blog_posts` — Main content
- `content_research` — Research data
- `content_topics` — Topic queue
- `blog_performance` — Metrics
- `theme_config` — Per-app settings
- `generation_logs` — Audit trail

See `packages/supabase/migrations/` for schema.

## Status

✅ **WEEK 1:** Monorepo + apps + schema ready
⏳ **WEEK 2:** Content machine + landing pages
⏳ **WEEK 3:** Automation + SEO
⏳ **WEEK 4:** Monetization (AdSense + affiliates)

---

Built with ❤️ by Claude Code
