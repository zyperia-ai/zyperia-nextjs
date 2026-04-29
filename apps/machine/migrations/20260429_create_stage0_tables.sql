-- Create breaking_queue table
CREATE TABLE IF NOT EXISTS breaking_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT,
  title TEXT NOT NULL,
  content TEXT,
  detected_at TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_breaking_queue_app_id ON breaking_queue(app_id);
CREATE INDEX idx_breaking_queue_processed ON breaking_queue(processed);

-- Create content_queue table
CREATE TABLE IF NOT EXISTS content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  youtube_channel_id TEXT,
  video_id TEXT,
  video_title TEXT NOT NULL,
  transcript TEXT,
  detected_at TIMESTAMP DEFAULT NOW(),
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_queue_app_id ON content_queue(app_id);
CREATE INDEX idx_content_queue_processed ON content_queue(processed);

-- Create seen_items table
CREATE TABLE IF NOT EXISTS seen_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_url TEXT UNIQUE NOT NULL,
  seen_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_seen_items_url ON seen_items(item_url);

-- Create trend_config table
CREATE TABLE IF NOT EXISTS trend_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT UNIQUE NOT NULL,
  trends JSONB,
  month_year TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trend_config_app_id ON trend_config(app_id);

-- Create source_quality table
CREATE TABLE IF NOT EXISTS source_quality (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  url TEXT NOT NULL,
  name TEXT,
  tier INTEGER,
  active BOOLEAN DEFAULT true,
  success_rate NUMERIC DEFAULT 100,
  last_used_at TIMESTAMP,
  discovered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(app_id, url)
);

CREATE INDEX idx_source_quality_app_id ON source_quality(app_id);
CREATE INDEX idx_source_quality_url ON source_quality(url);
