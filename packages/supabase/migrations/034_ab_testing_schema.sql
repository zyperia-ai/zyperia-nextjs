-- A/B Testing Schema
-- Manages content variation tests and performance comparison

CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  article_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL CHECK (test_type IN (
    'headline',
    'intro',
    'cta',
    'layout',
    'structure',
    'visual'
  )),
  variation_a TEXT NOT NULL,
  variation_b TEXT NOT NULL,
  variant_a_views INT DEFAULT 0,
  variant_b_views INT DEFAULT 0,
  variant_a_engagement INT DEFAULT 0, -- Number of engaged users
  variant_b_engagement INT DEFAULT 0,
  variant_a_ctr INT DEFAULT 0, -- Clicks
  variant_b_ctr INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_a_engagement_rate NUMERIC,
  variant_b_engagement_rate NUMERIC,
  improvement_percent NUMERIC, -- How much better is winner vs loser
  statistical_confidence NUMERIC, -- 0-100, confidence in result
  winner TEXT CHECK (winner IN ('a', 'b', 'tie', 'insufficient_data')),
  calculated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ab_test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL, -- Cookie/session based tracking
  variant TEXT NOT NULL CHECK (variant IN ('a', 'b')),
  views INT DEFAULT 1,
  engagement BOOLEAN DEFAULT false,
  clicks INT DEFAULT 0,
  time_on_page INT, -- Seconds
  created_at TIMESTAMP DEFAULT NOW(),
  engaged_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_ab_tests_app_id ON ab_tests(app_id);
CREATE INDEX idx_ab_tests_article_id ON ab_tests(article_id);
CREATE INDEX idx_ab_tests_status ON ab_tests(status);
CREATE INDEX idx_ab_test_results_test_id ON ab_test_results(test_id);
CREATE INDEX idx_ab_test_sessions_test_id ON ab_test_sessions(test_id);
CREATE INDEX idx_ab_test_sessions_variant ON ab_test_sessions(variant);

-- Enable RLS
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage A/B tests for their apps"
  ON ab_tests FOR ALL
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can view test results for their apps"
  ON ab_test_results FOR SELECT
  USING (test_id IN (
    SELECT id FROM ab_tests
    WHERE app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid())
  ));

CREATE POLICY "Users can view test sessions for their apps"
  ON ab_test_sessions FOR SELECT
  USING (test_id IN (
    SELECT id FROM ab_tests
    WHERE app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid())
  ));
