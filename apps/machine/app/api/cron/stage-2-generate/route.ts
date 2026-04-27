/**
 * Vercel Cron Job - Stage 2: Content Generation
 * Runs daily at 02:00 UTC
 *
 * Trigger: https://your-domain.vercel.app/api/cron/stage-2-generate
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/stage-2-generate",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */

import { createClient } from '@supabase/supabase-js';
import { generateWithClaude } from '../../../lib/ai-router';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getNexusArticleLength(): Promise<{ min: number; max: number }> {
  const { data } = await supabase
    .from('nexus_config')
    .select('config_value')
    .eq('config_key', 'article_length')
    .single()

  return (data?.config_value as { min: number; max: number }) ?? { min: 800, max: 3000 }
}

async function generateArticleContent(
  topic: string,
  approach: string,
  systemPrompt: string,
  researchData: any,
  competitorUrl?: string,
  articleLength: { min: number; max: number } = { min: 800, max: 3000 }
) {
  try {
    let userPrompt = '';

    if (approach === 'original') {
      userPrompt = `Create a comprehensive, original article about: "${topic}"

Use the following research context:
${researchData?.sources?.join(', ') || 'N/A'}

Requirements:
- Write a unique, valuable article from scratch
- Length: between ${articleLength.min} and ${articleLength.max} words
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

    const response = await generateWithClaude(systemPrompt, userPrompt);

    const lines = response.content.split('\n');
    let titleLine = '';
    let contentStartIdx = 0;

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

    const firstParagraphMatch = content.match(/^[^\n]+/);
    const excerpt = firstParagraphMatch
      ? firstParagraphMatch[0].substring(0, 160).trim()
      : `Learn about ${topic} in this comprehensive guide.`;

    const metaDescription = `${title} - Updated guide for 2024-2026 with latest data and expert insights.`.substring(0, 160);

    const keywords = topic
      .split(' ')
      .filter((w) => w.length > 3)
      .concat([topic, `${topic} guide`, `how to ${topic}`])
      .slice(0, 10);

    return { title, slug, content, excerpt, metaDescription, keywords };
  } catch (error) {
    console.error('Error generating article:', error);
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

async function runStage2() {
  console.log('\n=== STAGE 2: CONTENT GENERATION (CRON JOB) ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    const { data: apps } = await supabase.from('theme_config').select('*');

    for (const app of apps || []) {
      console.log(`\nGenerating articles for: ${app.app_id}`);

      const articleLength = await getNexusArticleLength()
      const mix = {
        original: Math.ceil(app.articles_per_day * 0.4),
        transformed: Math.ceil(app.articles_per_day * 0.5),
        aggregated: Math.ceil(app.articles_per_day * 0.1),
      }

      console.log(`[NEXUS] article_length: ${articleLength.min}-${articleLength.max} palavras`)
      console.log(`Content mix: ${mix.original} original, ${mix.transformed} transformed, ${mix.aggregated} aggregated`);

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
        const startTime = Date.now();

        try {
          const articleData = await generateArticleContent(
            research.topic,
            'original',
            app.generation_system_prompt,
            research.research_data,
            undefined,
            articleLength
          );

          await supabase.from('blog_posts').insert({
            app_id: app.app_id,
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            excerpt: articleData.excerpt,
            meta_description: articleData.metaDescription,
            keywords: articleData.keywords,
            status: 'draft',
            generation_approach: 'original',
            is_original_generated: true,
            is_transformed_content: false,
            is_aggregated_content: false,
            language: 'en',
          });

          const duration = Math.round((Date.now() - startTime) / 1000);
          console.log(`✓ Generated original article: "${articleData.title}" (${duration}s)`);
          generatedCount.original++;

          await supabase.from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'success',
            generation_approach: 'original',
            duration_seconds: duration,
            ai_model_used: 'claude-3-5-sonnet',
            cost_usd: 0.01,
          });
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`✗ Error generating original article:`, error);

          await supabase.from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'failed',
            generation_approach: 'original',
            duration_seconds: duration,
            error_message: (error as Error).message,
            ai_model_used: 'claude-3-5-sonnet',
          });
        }
      }

      // Generate TRANSFORMED articles (50%)
      for (let i = 0; i < mix.transformed && currentIdx < researchItems.length; i++) {
        const research = researchItems[currentIdx++];
        const competitorUrl = research.competitive_analysis?.top_performing_articles?.[0]?.url;
        const startTime = Date.now();

        try {
          const articleData = await generateArticleContent(
            research.topic,
            'transformed',
            app.transformation_system_prompt,
            research.research_data,
            competitorUrl,
            articleLength
          );

          await supabase.from('blog_posts').insert({
            app_id: app.app_id,
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            excerpt: articleData.excerpt,
            meta_description: articleData.metaDescription,
            keywords: articleData.keywords,
            status: 'draft',
            generation_approach: 'transformed',
            is_original_generated: false,
            is_transformed_content: true,
            is_aggregated_content: false,
            transformation_of: competitorUrl,
            language: 'en',
          });

          const duration = Math.round((Date.now() - startTime) / 1000);
          console.log(`✓ Generated transformed article: "${articleData.title}" (${duration}s)`);
          generatedCount.transformed++;

          await supabase.from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'success',
            generation_approach: 'transformed',
            duration_seconds: duration,
            transformation_source_url: competitorUrl,
            ai_model_used: 'claude-3-5-sonnet',
            cost_usd: 0.01,
          });
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`✗ Error generating transformed article:`, error);

          await supabase.from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'failed',
            generation_approach: 'transformed',
            duration_seconds: duration,
            error_message: (error as Error).message,
            ai_model_used: 'claude-3-5-sonnet',
          });
        }
      }

      // Generate AGGREGATED articles (10%)
      for (let i = 0; i < mix.aggregated && currentIdx < researchItems.length; i++) {
        const research = researchItems[currentIdx++];
        const startTime = Date.now();

        try {
          const articleData = await generateArticleContent(
            research.topic,
            'aggregated',
            app.aggregation_system_prompt,
            research.research_data,
            undefined,
            articleLength
          );

          await supabase.from('blog_posts').insert({
            app_id: app.app_id,
            title: articleData.title,
            slug: articleData.slug,
            content: articleData.content,
            excerpt: articleData.excerpt,
            meta_description: articleData.metaDescription,
            keywords: articleData.keywords,
            status: 'draft',
            generation_approach: 'aggregated',
            is_original_generated: false,
            is_transformed_content: false,
            is_aggregated_content: true,
            language: 'en',
          });

          const duration = Math.round((Date.now() - startTime) / 1000);
          console.log(`✓ Generated aggregated article: "${articleData.title}" (${duration}s)`);
          generatedCount.aggregated++;

          await supabase.from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'success',
            generation_approach: 'aggregated',
            duration_seconds: duration,
            ai_model_used: 'claude-3-5-sonnet',
            cost_usd: 0.01,
          });
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`✗ Error generating aggregated article:`, error);

          await supabase.from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'generation',
            status: 'failed',
            generation_approach: 'aggregated',
            duration_seconds: duration,
            error_message: (error as Error).message,
            ai_model_used: 'claude-3-5-sonnet',
          });
        }
      }

      console.log(`Generated: ${generatedCount.original} original, ${generatedCount.transformed} transformed, ${generatedCount.aggregated} aggregated`);
    }

    console.log('\n=== STAGE 2 COMPLETE ===');
    return { statusCode: 200, body: 'Stage 2 complete' };
  } catch (error) {
    console.error('STAGE 2 FAILED:', error);
    return { statusCode: 500, body: (error as Error).message };
  }
}

/**
 * Vercel Cron Handler
 */
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await runStage2();
  return new Response(JSON.stringify(result), {
    status: result.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}
