-- ============================================================================
-- SUPABASE MIGRATIONS — INTERNAL LINKING COM EMBEDDINGS
-- ============================================================================
-- Executar estas queries no Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → Novo Query
-- ============================================================================

-- 1️⃣ Activar pgvector (se não existir)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2️⃣ Adicionar coluna embedding na tabela blog_posts (Voyage API retorna 1024, não 512)
ALTER TABLE blog_posts DROP COLUMN IF EXISTS content_embedding;
ALTER TABLE blog_posts ADD COLUMN content_embedding vector(1024);

-- 3️⃣ Criar tabela de registo de links internos
CREATE TABLE IF NOT EXISTS article_internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  target_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  anchor_text TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(source_id, target_id)
);

-- 4️⃣ Criar função de similaridade para buscar artigos relacionados
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

-- ============================================================================
-- VERIFICAÇÃO (após executar as queries acima)
-- ============================================================================
-- Confirmar que a coluna foi adicionada:
SELECT column_name FROM information_schema.columns
WHERE table_name='blog_posts' AND column_name='content_embedding';

-- Confirmar que a tabela foi criada:
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_name = 'article_internal_links'
);

-- Confirmar que a função foi criada:
SELECT EXISTS (
  SELECT 1 FROM information_schema.routines
  WHERE routine_name = 'match_articles'
);
