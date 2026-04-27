-- NEXUS-lite Schema
-- Executar no Supabase Dashboard → SQL Editor
-- Sessão 8.5.2A — 27 Abril 2026

-- 1. article_performance
CREATE TABLE IF NOT EXISTS article_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  dwell_time_seconds INTEGER DEFAULT 0,
  scroll_depth_percent NUMERIC(5,2) DEFAULT 0,
  newsletter_signups INTEGER DEFAULT 0,
  affiliate_clicks INTEGER DEFAULT 0,
  plausible_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. topic_scores
CREATE TABLE IF NOT EXISTS topic_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  audience_level TEXT NOT NULL CHECK (audience_level IN ('iniciante','intermédio','avançado')),
  avg_views NUMERIC(10,2) DEFAULT 0,
  avg_dwell_time NUMERIC(10,2) DEFAULT 0,
  avg_scroll_depth NUMERIC(5,2) DEFAULT 0,
  avg_newsletter_rate NUMERIC(5,4) DEFAULT 0,
  article_count INTEGER DEFAULT 0,
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, audience_level)
);

-- 3. nexus_decisions
CREATE TABLE IF NOT EXISTS nexus_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type TEXT NOT NULL,
  decision_data JSONB DEFAULT '{}',
  reason TEXT,
  articles_affected INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. nexus_config
CREATE TABLE IF NOT EXISTS nexus_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  updated_by TEXT DEFAULT 'nexus_brain',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: desactivar (tabelas internas, acesso só via service role)
ALTER TABLE article_performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE topic_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE nexus_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE nexus_config DISABLE ROW LEVEL SECURITY;

-- Seed nexus_config com valores iniciais
INSERT INTO nexus_config (config_key, config_value, updated_by) VALUES
  ('topic_distribution', '{"how_to": 0.7, "comparison": 0.2, "analysis": 0.1}', 'seed'),
  ('audience_focus', '{"iniciante": 0.5, "intermédio": 0.4, "avançado": 0.1}', 'seed'),
  ('daily_publish_limit', '3', 'seed'),
  ('circuit_breaker_threshold', '3', 'seed'),
  ('min_word_count', '800', 'seed'),
  ('max_word_count', '3000', 'seed'),
  ('min_h2_count', '3', 'seed'),
  ('min_outbound_links', '2', 'seed'),
  ('plagiarism_min_score', '80', 'seed'),
  ('auto_review_min_score', '7', 'seed')
ON CONFLICT (config_key) DO NOTHING;

-- Índices
CREATE INDEX IF NOT EXISTS idx_article_performance_article_id ON article_performance(article_id);
CREATE INDEX IF NOT EXISTS idx_topic_scores_category ON topic_scores(category);
CREATE INDEX IF NOT EXISTS idx_nexus_decisions_type ON nexus_decisions(decision_type);
CREATE INDEX IF NOT EXISTS idx_nexus_decisions_created ON nexus_decisions(created_at DESC);
