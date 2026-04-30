-- Sessão 8.7 — Metadata gap fix (Bíblia Secção 74)
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER;

CREATE INDEX IF NOT EXISTS idx_blog_posts_tags
  ON blog_posts USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_blog_posts_keywords
  ON blog_posts USING GIN (keywords);
