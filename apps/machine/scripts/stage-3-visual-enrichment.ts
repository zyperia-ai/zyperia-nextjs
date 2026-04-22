/**
 * ZYPERIA BRUTAL SYSTEM — Stage 3: Visual Enrichment
 * Runs at: 03:00 UTC daily
 * Purpose: Generate hero images, data visualizations, and OG images
 */

import { createClient } from '@supabase/supabase-js';
import { enrichArticleWithVisuals } from '../lib/visual-enrichment';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const replicateApiKey = process.env.REPLICATE_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runStage3() {
  console.log('\n=== STAGE 3: VISUAL ENRICHMENT ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    // Get all draft articles (status='draft') that haven't been visually enriched
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, app_id, title, content, brutal_system')
      .eq('status', 'draft')
      .is('hero_image_url', null)
      .limit(20);

    if (!articles || articles.length === 0) {
      console.log('No articles to enrich');
      return;
    }

    for (const article of articles) {
      const startTime = Date.now();

      try {
        // Get visual enrichment config for this app
        const { data: themeConfig } = await supabase
          .from('theme_config')
          .select('brutal_system')
          .eq('app_id', article.app_id)
          .single();

        const visualConfig = themeConfig?.brutal_system?.visual_enrichment;

        if (!visualConfig?.['hero_images']?.enabled) {
          console.log(`⊘ Visual enrichment disabled for ${article.app_id}`);
          continue;
        }

        // Generate visuals
        const visuals = await enrichArticleWithVisuals(
          article.title,
          article.content,
          article.app_id,
          visualConfig,
          replicateApiKey,
          'zyperia-visuals' // Supabase bucket name
        );

        // Update article with visual URLs
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update({
            hero_image_url: visuals.heroImageUrl,
            hero_image_prompt: visuals.heroImagePrompt,
            og_image_url: visuals.ogImageUrl,
            visualizations: visuals.visualizations,
          })
          .eq('id', article.id);

        const duration = Math.round((Date.now() - startTime) / 1000);

        if (updateError) {
          console.error(`✗ Error enriching visuals for "${article.title}":`, updateError.message);
          await supabase.from('generation_logs').insert({
            app_id: article.app_id,
            article_id: article.id,
            stage: 'visual_enrichment',
            status: 'failed',
            duration_seconds: duration,
            error_message: updateError.message,
          });
        } else {
          console.log(
            `✓ Visual enrichment complete: "${article.title}" (hero + ${visuals.visualizations.charts.length} charts, ${duration}s)`
          );

          const visualDetails = {
            hero_image_generated: !!visuals.heroImageUrl,
            charts_count: visuals.visualizations.charts.length,
            og_image_created: !!visuals.ogImageUrl,
          };

          await supabase.from('generation_logs').insert({
            app_id: article.app_id,
            article_id: article.id,
            stage: 'visual_enrichment',
            status: 'success',
            duration_seconds: duration,
            visual_enrichment_details: visualDetails,
            ai_model_used: 'stable_diffusion',
            cost_usd: 0.01, // Approximate Stable Diffusion cost
          });
        }
      } catch (error) {
        const duration = Math.round((Date.now() - startTime) / 1000);
        console.error(`✗ Error in visual enrichment:`, error);

        await supabase.from('generation_logs').insert({
          app_id: article.app_id,
          article_id: article.id,
          stage: 'visual_enrichment',
          status: 'failed',
          duration_seconds: duration,
          error_message: (error as Error).message,
          ai_model_used: 'stable_diffusion',
        });
      }
    }

    console.log('\n=== STAGE 3 COMPLETE ===');
  } catch (error) {
    console.error('STAGE 3 FAILED:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runStage3();
}

export { runStage3 };
