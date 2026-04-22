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
