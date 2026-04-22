/**
 * ZYPERIA BRUTAL SYSTEM — Stage 6: Publishing
 * Runs at: 09:00, 14:00, 18:00 UTC daily
 * Purpose: Auto-publish scheduled articles, submit to Google Search Console
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Submit URL to Google Search Console for indexing
 */
async function submitToGSC(articleUrl: string, gscApiKey?: string) {
  // In production, use GSC API to submit URL for immediate indexing
  console.log(`[GSC] Queued for indexing: ${articleUrl}`);
}

/**
 * Trigger GA4 event for article publication
 */
async function triggerGA4Event(
  articleId: string,
  articleTitle: string,
  appId: string,
  ga4PropertyId?: string
) {
  // In production, send event to GA4 via Measurement Protocol
  console.log(`[GA4] Event: article_published – ${articleTitle}`);
}

async function runStage6() {
  console.log('\n=== STAGE 6: PUBLISHING ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    // Get scheduled articles ready for publishing
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, app_id, title, slug, excerpt, plagiarism_score')
      .eq('status', 'scheduled')
      .not('last_verified_at', 'is', null) // Has passed editorial review
      .limit(20);

    if (!articles || articles.length === 0) {
      console.log('No articles ready for publishing');
      return;
    }

    for (const article of articles) {
      const startTime = Date.now();

      try {
        // Double-check plagiarism score one more time
        if ((article.plagiarism_score || 100) > 30) {
          console.log(`⊘ Skipping publication of "${article.title}" – plagiarism check failed`);
          continue;
        }

        // Publish article
        const publishedAt = new Date().toISOString();
        const articleUrl = `https://${article.app_id}.zyperia.ai/${article.slug}`;

        const { error: publishError } = await supabase
          .from('blog_posts')
          .update({
            status: 'published',
            published_at: publishedAt,
          })
          .eq('id', article.id);

        const duration = Math.round((Date.now() - startTime) / 1000);

        if (publishError) {
          console.error(`✗ Error publishing "${article.title}":`, publishError.message);
          await supabase.from('generation_logs').insert({
            app_id: article.app_id,
            article_id: article.id,
            stage: 'publishing',
            status: 'failed',
            duration_seconds: duration,
            error_message: publishError.message,
          });
        } else {
          console.log(`✓ Published: "${article.title}" → ${articleUrl} (${duration}s)`);

          // Submit to GSC
          await submitToGSC(articleUrl, process.env.GSC_API_KEY);

          // Trigger GA4 event
          await triggerGA4Event(article.id, article.title, article.app_id, process.env.GA4_PROPERTY_ID);

          // Create blog_performance entry
          await supabase.from('blog_performance').insert({
            post_id: article.id,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            views: 0,
            unique_visitors: 0,
          });

          await supabase.from('generation_logs').insert({
            app_id: article.app_id,
            article_id: article.id,
            stage: 'publishing',
            status: 'success',
            duration_seconds: duration,
            cost_usd: 0.0, // Publishing is free
          });
        }
      } catch (error) {
        const duration = Math.round((Date.now() - startTime) / 1000);
        console.error(`✗ Error in publishing:`, error);

        await supabase.from('generation_logs').insert({
          app_id: article.app_id,
          article_id: article.id,
          stage: 'publishing',
          status: 'failed',
          duration_seconds: duration,
          error_message: (error as Error).message,
        });
      }
    }

    console.log('\n=== STAGE 6 COMPLETE ===');
  } catch (error) {
    console.error('STAGE 6 FAILED:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runStage6();
}

export { runStage6 };
