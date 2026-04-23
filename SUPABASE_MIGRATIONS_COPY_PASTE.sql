-- Blog posts table (main content storage)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL CHECK (app_id IN ('crypto', 'intelligence', 'onlinebiz')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_description TEXT,
  keywords TEXT[],
  author_id UUID,
  author_byline TEXT,
  featured_image_url TEXT,
  og_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  language TEXT DEFAULT 'pt' CHECK (language IN ('en', 'pt', 'es', 'fr')),
  views INT DEFAULT 0,
  engagement_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_verified_at TIMESTAMP WITH TIME ZONE,
  needs_update BOOLEAN DEFAULT FALSE,
  UNIQUE(app_id, slug)
);

-- Content research table (stores research data for articles)
CREATE TABLE IF NOT EXISTS content_research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL CHECK (app_id IN ('crypto', 'intelligence', 'onlinebiz')),
  topic TEXT NOT NULL,
  research_data JSONB,
  web_search_results JSONB,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content topics queue (tracks available topics for generation)
CREATE TABLE IF NOT EXISTS content_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL CHECK (app_id IN ('crypto', 'intelligence', 'onlinebiz')),
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT[],
  angle TEXT,
  priority INT CHECK (priority >= 1 AND priority <= 5),
  search_volume INT,
  last_used_at TIMESTAMP WITH TIME ZONE,
  generated_article_id UUID REFERENCES blog_posts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog performance metrics (tracks views, clicks, revenue per article)
CREATE TABLE IF NOT EXISTS blog_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  avg_time_on_page NUMERIC,
  bounce_rate NUMERIC CHECK (bounce_rate >= 0 AND bounce_rate <= 1),
  scroll_depth NUMERIC CHECK (scroll_depth >= 0 AND scroll_depth <= 1),
  affiliate_clicks INT DEFAULT 0,
  adsense_impressions INT DEFAULT 0,
  adsense_clicks INT DEFAULT 0,
  adsense_revenue NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, date)
);

-- Theme configuration (per-app settings: prompts, sources, affiliates)
CREATE TABLE IF NOT EXISTS theme_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL UNIQUE CHECK (app_id IN ('crypto', 'intelligence', 'onlinebiz')),
  generation_system_prompt TEXT,
  verification_system_prompt TEXT,
  editorial_system_prompt TEXT,
  official_sources JSONB,
  affiliate_programs JSONB,
  articles_per_day INT DEFAULT 3,
  publish_times TEXT[] DEFAULT ARRAY['09:00', '14:00', '18:00'],
  theme_color TEXT,
  accent_color TEXT,
  font_family TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generation logs (audit trail of content generation)
CREATE TABLE IF NOT EXISTS generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL CHECK (app_id IN ('crypto', 'intelligence', 'onlinebiz')),
  article_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  stage TEXT NOT NULL CHECK (stage IN ('research', 'generation', 'verification', 'editorial', 'publishing')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'warning')),
  duration_seconds INT,
  error_message TEXT,
  ai_model_used TEXT CHECK (ai_model_used IN ('phi4', 'gemini', 'claude', 'hybrid')),
  cost_usd NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_app_status ON blog_posts(app_id, status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_content_research_app ON content_research(app_id);
CREATE INDEX IF NOT EXISTS idx_content_topics_app ON content_topics(app_id);
CREATE INDEX IF NOT EXISTS idx_blog_performance_post ON blog_performance(post_id, date);
CREATE INDEX IF NOT EXISTS idx_generation_logs_app ON generation_logs(app_id, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies (public read, only admins can write)
-- For now, allow public read on published posts
CREATE POLICY "Enable public read access for published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

-- Allow public read on performance metrics
CREATE POLICY "Enable public read for performance data" ON blog_performance
  FOR SELECT USING (TRUE);

-- Allow public read on theme configs
CREATE POLICY "Enable public read for theme config" ON theme_config
  FOR SELECT USING (TRUE);
-- BRUTAL SYSTEM EXTENSION — Competitive intelligence, visual enrichment, plagiarism detection

-- Extend blog_posts table with brutal system fields
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS generation_approach TEXT CHECK (generation_approach IN ('original', 'transformed', 'aggregated'));
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS transformation_of TEXT; -- URL of original article if transformed
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_original_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_transformed_content BOOLEAN DEFAULT FALSE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_aggregated_content BOOLEAN DEFAULT FALSE;

-- Plagiarism & uniqueness tracking
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS plagiarism_score NUMERIC CHECK (plagiarism_score >= 0 AND plagiarism_score <= 100); -- 0=unique, 100=duplicate
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS plagiarism_checked_at TIMESTAMP WITH TIME ZONE;

-- Visual enrichment fields
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS hero_image_prompt TEXT; -- Stable Diffusion prompt used
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS visualizations JSONB; -- { charts: [...], diagrams: [...], infographics: [...] }

-- Engagement & revenue fields
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS affiliate_clicks INT DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS adsense_impressions INT DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS adsense_revenue NUMERIC DEFAULT 0;

-- E-E-A-T signals
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS citation_count INT DEFAULT 0; -- How many external sites cite this
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS internal_link_count INT DEFAULT 0; -- Links to other articles on site

-- Rewrite tracking (for underperformers)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS original_article_id UUID REFERENCES blog_posts(id); -- If this is a rewrite
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS rewrite_reason TEXT; -- "low_engagement", "outdated", "low_ranking"

-- Extend content_research with competitive analysis
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS research_type TEXT CHECK (research_type IN ('original', 'competitive_analysis'));
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS competitive_analysis JSONB; -- { top_performing_articles: [...], content_gaps: [...], ... }
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS competitor_urls JSONB; -- URLs of top 20 competing articles
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS content_gaps TEXT[]; -- Specific gaps identified
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMP WITH TIME ZONE; -- When competitive analysis was run

-- Extend generation_logs with brutal system details
ALTER TABLE generation_logs DROP CONSTRAINT IF EXISTS stage_check;
ALTER TABLE generation_logs ADD CONSTRAINT stage_check CHECK (stage IN ('competitive_analysis', 'research', 'generation', 'visual_enrichment', 'verification', 'plagiarism', 'editorial', 'publishing'));

ALTER TABLE generation_logs ADD COLUMN IF NOT EXISTS generation_approach TEXT; -- original|transformed|aggregated (for generation stage)
ALTER TABLE generation_logs ADD COLUMN IF NOT EXISTS transformation_source_url TEXT; -- Which article was transformed
ALTER TABLE generation_logs ADD COLUMN IF NOT EXISTS visual_enrichment_details JSONB; -- { hero_image_generated, charts_count, og_image_created }
ALTER TABLE generation_logs ADD COLUMN IF NOT EXISTS plagiarism_check_result JSONB; -- { plagiarism_score, matches_found, improvement_percentage }

ALTER TABLE generation_logs DROP CONSTRAINT IF EXISTS ai_model_used_check;
ALTER TABLE generation_logs ADD CONSTRAINT ai_model_used_check CHECK (ai_model_used IN ('phi4', 'gemini', 'claude', 'stable_diffusion', 'plotly', 'copyscape', 'hybrid'));

-- Extend theme_config with brutal system settings
ALTER TABLE theme_config ADD COLUMN IF NOT EXISTS transformation_system_prompt TEXT;
ALTER TABLE theme_config ADD COLUMN IF NOT EXISTS aggregation_system_prompt TEXT;
ALTER TABLE theme_config ADD COLUMN IF NOT EXISTS brutal_system JSONB; -- { content_mix, competitive_analysis, visual_enrichment, plagiarism_check, eeat_signals }

-- Create index for generation_approach (needed for content mix analytics)
CREATE INDEX IF NOT EXISTS idx_blog_posts_generation_approach ON blog_posts(app_id, generation_approach);

-- Create index for plagiarism_score (needed for quality filtering)
CREATE INDEX IF NOT EXISTS idx_blog_posts_plagiarism_score ON blog_posts(app_id, plagiarism_score DESC);

-- Create index for hero_image_url (needed for visual content filtering)
CREATE INDEX IF NOT EXISTS idx_blog_posts_has_hero_image ON blog_posts(app_id) WHERE hero_image_url IS NOT NULL;

-- Create index for transformation_of (needed to track content lineage)
CREATE INDEX IF NOT EXISTS idx_blog_posts_transformation_of ON blog_posts(transformation_of);

-- Create index for original_article_id (needed to track rewrites)
CREATE INDEX IF NOT EXISTS idx_blog_posts_original_article_id ON blog_posts(original_article_id);

-- Ensure plagiarism_score defaults to high (optimistic, verified later)
UPDATE blog_posts SET plagiarism_score = 90 WHERE plagiarism_score IS NULL AND status IN ('published', 'approved');
UPDATE blog_posts SET plagiarism_score = 80 WHERE plagiarism_score IS NULL;
-- Affiliate Monetization System
-- Tracks affiliate links, clicks, and revenue per article

-- 1. Affiliate Platforms Table
CREATE TABLE IF NOT EXISTS affiliate_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., "Kraken", "Zapier", "Gumroad"
  platform_type TEXT NOT NULL, -- "exchange", "tool", "ecommerce", "learning", "freelancing", etc.
  category TEXT NOT NULL, -- "crypto", "intelligence", "onlinebiz"
  affiliate_url TEXT NOT NULL,
  commission_type TEXT NOT NULL, -- "percentage", "fixed_usd", "revenue_share"
  commission_value TEXT, -- e.g., "0.25-0.5%", "€0.03", "30%"
  cookie_window_days INT, -- days user has to convert after click
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Affiliate Links Table (per article)
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES affiliate_platforms(id),
  tracking_id TEXT NOT NULL UNIQUE, -- unique ID for this link (e.g., platform_article_12345)
  short_url TEXT, -- shortened URL for tracking
  placement TEXT NOT NULL, -- "inline", "comparison_table", "recommended_section", "footer"
  context TEXT, -- context where link appears (e.g., "for beginners", "advanced trading")
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Affiliate Clicks Table (real-time tracking)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES blog_posts(id),
  platform_id UUID NOT NULL REFERENCES affiliate_platforms(id),

  -- Click metadata
  user_ip VARCHAR,
  user_agent TEXT,
  referrer TEXT,
  session_id VARCHAR, -- track same user across clicks

  -- Conversion tracking (filled later when user converts)
  conversion_id VARCHAR, -- if we can track it back
  converted_at TIMESTAMP,
  conversion_value NUMERIC, -- estimated revenue

  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Affiliate Stats (aggregated daily)
CREATE TABLE IF NOT EXISTS affiliate_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES affiliate_platforms(id),

  -- Daily snapshot
  stat_date DATE NOT NULL,
  clicks INT DEFAULT 0,
  unique_clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  conversion_rate NUMERIC, -- conversions / clicks
  estimated_revenue NUMERIC, -- sum of conversion_value

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(post_id, platform_id, stat_date)
);

-- 5. Affiliate Revenue Summary (monthly)
CREATE TABLE IF NOT EXISTS affiliate_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,

  -- Monthly summary
  revenue_month DATE NOT NULL, -- first day of month
  total_clicks INT DEFAULT 0,
  total_conversions INT DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,

  -- Top performing platforms
  top_platform_id UUID REFERENCES affiliate_platforms(id),
  top_platform_clicks INT,
  top_platform_revenue NUMERIC,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(post_id, revenue_month)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_affiliate_links_post ON affiliate_links(post_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_platform ON affiliate_links(platform_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link ON affiliate_clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_post ON affiliate_clicks(post_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created ON affiliate_clicks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_conversion ON affiliate_clicks(conversion_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_stats_post ON affiliate_stats(post_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_stats_date ON affiliate_stats(stat_date DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_revenue_post ON affiliate_revenue(post_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_revenue_month ON affiliate_revenue(revenue_month DESC);

-- 6. Add affiliate tracking columns to blog_posts (if not already present)
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS affiliate_links_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_affiliate_clicks INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_affiliate_revenue NUMERIC DEFAULT 0;

-- Enable RLS for tracking tables
ALTER TABLE affiliate_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_revenue ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read for active platforms
CREATE POLICY "Allow public read affiliate_platforms"
  ON affiliate_platforms
  FOR SELECT
  USING (is_active = true);

-- RLS Policies: Service role can manage everything
CREATE POLICY "Allow service role all affiliate_links"
  ON affiliate_links
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role all affiliate_clicks"
  ON affiliate_clicks
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role all affiliate_stats"
  ON affiliate_stats
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role all affiliate_revenue"
  ON affiliate_revenue
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
