-- Sessão 8.7 — Update generation_approach vocabulary
-- Old: original / transformed / aggregated (módulo content-generation.ts morto)
-- New: breaking_news / youtube_newsletter / evergreen (alinhado com Bíblia 72 / 8.6C)

ALTER TABLE blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_generation_approach_check;

ALTER TABLE blog_posts
  ADD CONSTRAINT blog_posts_generation_approach_check
  CHECK (generation_approach IS NULL OR generation_approach IN (
    'breaking_news',
    'youtube_newsletter',
    'evergreen'
  ));
