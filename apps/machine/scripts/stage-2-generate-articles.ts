/**
 * ZYPERIA BRUTAL SYSTEM — Stage 2: Multi-Approach Content Generation
 * Runs at: 02:00 UTC daily
 * Purpose: Generate articles using 3 approaches (40% original, 50% transformed, 10% aggregated)
 */

import { createClient } from '@supabase/supabase-js';
import { generateWithClaude } from '../lib/ai-router';

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
 * Generate article using Claude API
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
  try {
    // Build the user prompt based on approach
    let userPrompt = '';

    if (approach === 'original') {
      userPrompt = `Create a comprehensive, original article about: "${topic}"

Use the following research context:
${researchData?.sources?.join(', ') || 'N/A'}

Requirements:
- Write a unique, valuable article from scratch
- Include 3-4 main sections with detailed explanations
- Use markdown formatting with H2 headers
- Include practical examples and actionable tips
- Add a strong introduction and conclusion
- Include a Sources section citing the research

Format your response as valid markdown starting with the title as H1.`;
    } else if (approach === 'transformed') {
      userPrompt = `Transform and improve an article about: "${topic}"

Competitor source: ${competitorUrl || 'N/A'}

Requirements:
- Rewrite with at least 30% new content
- Add updated data, statistics, or examples from 2024-2026
- Include new insights or perspectives
- Keep the core structure but improve clarity
- Add sections the original may have missed
- Cite the original source in a transparent way
- Make it 15-20% longer with more depth

Format as markdown with H1 title.`;
    } else {
      // aggregated
      userPrompt = `Create a synthesized meta-analysis about: "${topic}"

Compile insights from multiple sources:
${researchData?.sources?.slice(0, 5).join(', ') || 'N/A'}

Requirements:
- Create a "State of ${topic}" or "Comprehensive Overview" style article
- Identify common themes and disagreements
- Present multiple perspectives
- Cite each source clearly
- Add your own synthesis and analysis
- Include practical takeaways
- Compare different approaches or tools

Format as markdown with H1 title.`;
    }

    // Generate article content using Claude
    const response = await generateWithClaude(systemPrompt, userPrompt);

    // Parse the generated markdown to extract title and content
    const lines = response.content.split('\n');
    let titleLine = '';
    let contentStartIdx = 0;

    // Find H1 title
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        titleLine = lines[i].replace('# ', '').trim();
        contentStartIdx = i + 1;
        break;
      }
    }

    const title = titleLine || `${topic} – Complete Guide 2026`;
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const content = lines.slice(contentStartIdx).join('\n').trim();

    // Extract excerpt (first 160 chars of content, or first paragraph)
    const firstParagraphMatch = content.match(/^[^\n]+/);
    const excerpt = firstParagraphMatch
      ? firstParagraphMatch[0].substring(0, 160).trim()
      : `Learn about ${topic} in this comprehensive guide.`;

    // Generate meta description
    const metaDescription = `${title} - Updated guide for 2024-2026 with latest data and expert insights.`.substring(0, 160);

    // Extract keywords from topic
    const keywords = topic
      .split(' ')
      .filter(w => w.length > 3)
      .concat([topic, `${topic} guide`, `how to ${topic}`])
      .slice(0, 10);

    return {
      title,
      slug,
      content,
      excerpt,
      metaDescription,
      keywords,
    };
  } catch (error) {
    console.error('Error generating article:', error);
    // Return fallback mock if Claude fails
    const title = `${topic} – Complete Guide 2026`;
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      title,
      slug,
      content: `# ${title}\n\n[Content generation failed, please retry]`,
      excerpt: `Guide to ${topic}`,
      metaDescription: `Guide to ${topic}`,
      keywords: topic.split(' '),
    };
  }
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
