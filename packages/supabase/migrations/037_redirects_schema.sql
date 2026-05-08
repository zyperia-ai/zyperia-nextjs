-- Redirects table for managing 301 permanent redirects
CREATE TABLE IF NOT EXISTS redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT NOT NULL,
  to_path TEXT NOT NULL,
  status_code INTEGER DEFAULT 301 CHECK (status_code IN (301, 302, 307, 308)),
  app_id TEXT NOT NULL CHECK (app_id IN ('crypto', 'intelligence', 'onlinebiz')),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  UNIQUE(app_id, from_path)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_redirects_app_from_path
  ON redirects(app_id, from_path) WHERE active = TRUE;

-- Enable RLS
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Enable public read on active redirects" ON redirects
  FOR SELECT USING (active = TRUE);

-- Allow all operations (future: restrict to authenticated users)
CREATE POLICY "Allow all operations" ON redirects
  FOR ALL USING (TRUE) WITH CHECK (TRUE);
