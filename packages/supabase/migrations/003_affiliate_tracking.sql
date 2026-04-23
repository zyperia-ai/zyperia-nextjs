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
