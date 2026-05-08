-- FIX: Voyage AI retorna 1024 dimensões, não 512
-- Executar no Supabase SQL Editor

-- 1. Remover coluna existente e recriar com vector(1024)
ALTER TABLE blog_posts DROP COLUMN IF EXISTS content_embedding;
ALTER TABLE blog_posts ADD COLUMN content_embedding vector(1024);

-- 2. Atualizar função match_articles para vector(1024)
CREATE OR REPLACE FUNCTION match_articles(
  query_embedding vector(1024),
  match_blog_id text,
  exclude_article_id uuid,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  slug text,
  title text,
  excerpt text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bp.id,
    bp.slug,
    bp.title,
    bp.excerpt,
    1 - (bp.content_embedding <=> query_embedding) AS similarity
  FROM blog_posts bp
  WHERE bp.app_id = match_blog_id
    AND bp.id != exclude_article_id
    AND bp.status = 'published'
    AND bp.content_embedding IS NOT NULL
  ORDER BY bp.content_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Verificar
SELECT column_name FROM information_schema.columns
WHERE table_name='blog_posts' AND column_name='content_embedding';

SELECT EXISTS (
  SELECT 1 FROM information_schema.routines
  WHERE routine_name = 'match_articles'
);
