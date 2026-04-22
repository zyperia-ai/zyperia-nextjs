-- BRUTAL SYSTEM EXTENSION — Competitive intelligence, visual enrichment, plagiarism detection

-- Extend blog_posts table with brutal system fields
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS generation_approach TEXT CHECK (generation_approach IN ('original', 'transformed', 'aggregated'));
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS transformation_of TEXT; -- URL of original article if transformed
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_original_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_transformed_content BOOLEAN DEFAULT FALSE;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_aggregated_content BOOLEAN DEFAULT FALSE;

-- Plagiarism & uniqueness tracking
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS plagiarism_score NUMERIC CHECK (plagiarism_score >= 0 AND plagiarism_score <= 100); -- 0=unique, 100=duplicate
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS plagiarism_checked_at TIMESTAMP WITH TIME ZONE;

-- Visual enrichment fields
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS hero_image_prompt TEXT; -- Stable Diffusion prompt used
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS visualizations JSONB; -- { charts: [...], diagrams: [...], infographics: [...] }

-- Engagement & revenue fields
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS affiliate_clicks INT DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS adsense_impressions INT DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS adsense_revenue NUMERIC DEFAULT 0;

-- E-E-A-T signals
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS citation_count INT DEFAULT 0; -- How many external sites cite this
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS internal_link_count INT DEFAULT 0; -- Links to other articles on site

-- Rewrite tracking (for underperformers)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS original_article_id UUID REFERENCES blog_posts(id); -- If this is a rewrite
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS rewrite_reason TEXT; -- "low_engagement", "outdated", "low_ranking"

-- Extend content_research with competitive analysis
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS research_type TEXT CHECK (research_type IN ('original', 'competitive_analysis'));
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS competitive_analysis JSONB; -- { top_performing_articles: [...], content_gaps: [...], ... }
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS competitor_urls JSONB; -- URLs of top 20 competing articles
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS content_gaps TEXT[]; -- Specific gaps identified
ALTER TABLE content_research ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMP WITH TIME ZONE; -- When competitive analysis was run

-- Extend generation_logs with brutal system details
ALTER TABLE generation_logs ALTER COLUMN stage DROP CONSTRAINT stage_check;
ALTER TABLE generation_logs ADD CONSTRAINT stage_check CHECK (stage IN ('competitive_analysis', 'research', 'generation', 'visual_enrichment', 'verification', 'plagiarism', 'editorial', 'publishing'));

ALTER TABLE generation_logs ADD COLUMN IF NOT EXISTS generation_approach TEXT; -- original|transformed|aggregated (for generation stage)
ALTER TABLE generation_logs ADD COLUMN IF NOT EXISTS transformation_source_url TEXT; -- Which article was transformed
ALTER TABLE generation_logs ADD COLUMN IF NOT EXISTS visual_enrichment_details JSONB; -- { hero_image_generated, charts_count, og_image_created }
ALTER TABLE generation_logs ADD COLUMN IF NOT EXISTS plagiarism_check_result JSONB; -- { plagiarism_score, matches_found, improvement_percentage }

ALTER TABLE generation_logs ALTER COLUMN ai_model_used DROP CONSTRAINT ai_model_used_check;
ALTER TABLE generation_logs ADD CONSTRAINT ai_model_used_check CHECK (ai_model_used IN ('phi4', 'gemini', 'claude', 'stable_diffusion', 'plotly', 'copyscape', 'hybrid'));

-- Extend theme_config with brutal system settings
ALTER TABLE theme_config ADD COLUMN IF NOT EXISTS transformation_system_prompt TEXT;
ALTER TABLE theme_config ADD COLUMN IF NOT EXISTS aggregation_system_prompt TEXT;
ALTER TABLE theme_config ADD COLUMN IF NOT EXISTS brutal_system JSONB; -- { content_mix, competitive_analysis, visual_enrichment, plagiarism_check, eeat_signals }

-- Create index for generation_approach (needed for content mix analytics)
CREATE INDEX IF NOT EXISTS idx_blog_posts_generation_approach ON blog_posts(app_id, generation_approach);

-- Create index for plagiarism_score (needed for quality filtering)
CREATE INDEX IF NOT EXISTS idx_blog_posts_plagiarism_score ON blog_posts(app_id, plagiarism_score DESC);

-- Create index for hero_image_url (needed for visual content filtering)
CREATE INDEX IF NOT EXISTS idx_blog_posts_has_hero_image ON blog_posts(app_id) WHERE hero_image_url IS NOT NULL;

-- Create index for transformation_of (needed to track content lineage)
CREATE INDEX IF NOT EXISTS idx_blog_posts_transformation_of ON blog_posts(transformation_of);

-- Create index for original_article_id (needed to track rewrites)
CREATE INDEX IF NOT EXISTS idx_blog_posts_original_article_id ON blog_posts(original_article_id);

-- Ensure plagiarism_score defaults to high (optimistic, verified later)
UPDATE blog_posts SET plagiarism_score = 90 WHERE plagiarism_score IS NULL AND status IN ('published', 'approved');
UPDATE blog_posts SET plagiarism_score = 80 WHERE plagiarism_score IS NULL;
