/**
 * ZYPERIA BRUTAL SYSTEM — Stage 2: Multi-Approach Content Generation
 * Runs at: 02:00 UTC daily
 * Purpose: Generate articles using 3 approaches (40% original, 50% transformed, 10% aggregated)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

interface GenerationRequest {
  topic: string;
  approach: 'original' | 'transformed' | 'aggregated';
  researchId: string;
  competitorUrl?: string;
}

/**
 * Generate article using Phi-4 via Ollama or Claude API
 */
async function generateArticleContent(
  topic: string,
  approach: string,
  systemPrompt: string,
  researchData: any,
  competitorUrl?: string
): Promise<{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  keywords: string[];
}> {
  // In production, call Phi-4 via Ollama or Anthropic API
  // For now, return mock article structure

  const title = `${topic} – Complete Guide 2026`;
  const slug = topic.toLowerCase().replace(/\s+/g, '-');
  const excerpt = `Learn everything about ${topic} in this comprehensive guide.`;
  const metaDescription = `Complete guide to ${topic} – updated for 2026 with latest data and best practices.`;

  const content = `# ${title}

## Introduction
This is a comprehensive guide to ${topic}. Whether you're new to this topic or looking to deepen your understanding, we've got you covered.

## Key Points
- Point 1 about ${topic}
- Point 2 about ${topic}
- Point 3 about ${topic}

## How to Get Started
Step-by-step guide for beginners...

## Advanced Techniques
For those looking to master ${topic}...

## Conclusion
${topic} is an important skill/concept in today's world. By following this guide, you're well on your way to mastery.

**Source attribution:** This article ${approach === 'transformed' ? `builds on research from top competitor articles` : 'presents original research and insights'}.`;

  return {
    title,
    slug,
    content,
    excerpt,
    metaDescription,
    keywords: topic.split(' '),
  };
}

/**
 * Determine content mix distribution for the day
 */
function getContentMixDistribution(
  targetArticles: number
): { original: number; transformed: number; aggregated: number } {
  return {
    original: Math.ceil(targetArticles * 0.4),
    transformed: Math.ceil(targetArticles * 0.5),
    aggregated: Math.ceil(targetArticles * 0.1),
  };
}

async function runStage2() {
  console.log('\n=== STAGE 2: CONTENT GENERATION (BRUTAL SYSTEM) ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    // Get all apps with their config
    const { data: apps } = await supabase.from('theme_config').select('*');

    for (const app of apps || []) {
      console.log(`\nGenerating articles for: ${app.app_id}`);

      const mix = getContentMixDistribution(app.articles_per_day);
      console.log(`Content mix: ${mix.original} original, ${mix.transformed} transformed, ${mix.aggregated} aggregated`);

      // Get research data from Stage 1
      const { data: researchItems } = await supabase
        .from('content_research')
        .select('id, topic, research_data, content_gaps, competitive_analysis')
        .eq('app_id', app.app_id)
        .eq('research_type', 'original')
        .order('created_at', { ascending: false })
        .limit(mix.original + mix.transformed + mix.aggregated);

      if (!researchItems || researchItems.length === 0) {
        console.log(`⚠ No research data available for ${app.app_id}`);
        continue;
      }

      let generatedCount = { original: 0, transformed: 0, aggregated: 0 };
      let currentIdx = 0;

      // Generate ORIGINAL articles (40%)
      for (let i = 0; i < mix.original && currentIdx < researchItems.length; i++) {
        const research = researchItems[currentIdx++];
        await generateArticle(
          app,
          'original',
          research,
          app.generation_system_prompt,
          generatedCount
        );
      }

      // Generate TRANSFORMED articles (50%)
      for (let i = 0; i < mix.transformed && currentIdx < researchItems.length; i++) {
        const research = researchItems[currentIdx++];
        const competitorUrl = research.competitive_analysis?.top_performing_articles?.[0]?.url;
        await generateArticle(
          app,
          'transformed',
          research,
          app.transformation_system_prompt,
          generatedCount,
          competitorUrl
        );
      }

      // Generate AGGREGATED articles (10%)
      for (let i = 0; i < mix.aggregated && currentIdx < researchItems.length; i++) {
        const research = researchItems[currentIdx++];
        await generateArticle(
          app,
          'aggregated',
          research,
          app.aggregation_system_prompt,
          generatedCount
        );
      }

      console.log(`Generated: ${generatedCount.original} original, ${generatedCount.transformed} transformed, ${generatedCount.aggregated} aggregated`);
    }

    console.log('\n=== STAGE 2 COMPLETE ===');
  } catch (error) {
    console.error('STAGE 2 FAILED:', error);
    process.exit(1);
  }
}

async function generateArticle(
  app: any,
  approach: 'original' | 'transformed' | 'aggregated',
  research: any,
  systemPrompt: string,
  counter: any,
  competitorUrl?: string
) {
  const startTime = Date.now();

  try {
    const articleData = await generateArticleContent(
      research.topic,
      approach,
      systemPrompt,
      research.research_data,
      competitorUrl
    );

    const { error: insertError } = await supabase.from('blog_posts').insert({
      app_id: app.app_id,
      title: articleData.title,
      slug: articleData.slug,
      content: articleData.content,
      excerpt: articleData.excerpt,
      meta_description: articleData.metaDescription,
      keywords: articleData.keywords,
      status: 'draft',
      generation_approach: approach,
      is_original_generated: approach === 'original',
      is_transformed_content: approach === 'transformed',
      is_aggregated_content: approach === 'aggregated',
      transformation_of: competitorUrl,
      language: 'en', // Default to English for now
    });

    const duration = Math.round((Date.now() - startTime) / 1000);

    if (insertError) {
      console.error(`✗ Error generating ${approach} article for "${research.topic}":`, insertError.message);
      await supabase.from('generation_logs').insert({
        app_id: app.app_id,
        stage: 'generation',
        status: 'failed',
        generation_approach: approach,
        duration_seconds: duration,
        error_message: insertError.message,
        ai_model_used: 'phi4',
      });
    } else {
      console.log(`✓ Generated ${approach} article: "${articleData.title}" (${duration}s)`);
      counter[approach]++;

      await supabase.from('generation_logs').insert({
        app_id: app.app_id,
        stage: 'generation',
        status: 'success',
        generation_approach: approach,
        duration_seconds: duration,
        transformation_source_url: competitorUrl,
        ai_model_used: 'phi4',
        cost_usd: 0.0, // Phi-4 via Ollama is free
      });
    }
  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.error(`✗ Error in article generation:`, error);

    await supabase.from('generation_logs').insert({
      app_id: app.app_id,
      stage: 'generation',
      status: 'failed',
      generation_approach: approach,
      duration_seconds: duration,
      error_message: (error as Error).message,
      ai_model_used: 'phi4',
    });
  }
}

if (require.main === module) {
  runStage2();
}

export { runStage2 };
