/**
 * Vercel Cron Job - Stage 6: Publishing & Indexing
 * Runs daily at 09:00, 14:00, and 18:00 UTC
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runStage6() {
  console.log('\n=== STAGE 6: PUBLISHING (CRON JOB) ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, app_id, slug, title, status, plagiarism_score, last_verified_at')
      .eq('status', 'draft')
      .isNotNull('last_verified_at')
      .gte('plagiarism_score', 70)
      .order('created_at', { ascending: true })
      .limit(3); // Publish max 3 per cron run

    if (!articles || articles.length === 0) {
      console.log('No articles ready to publish');
      return { statusCode: 200, body: 'No articles ready' };
    }

    for (const article of articles) {
      try {
        const publishedAt = new Date();
        const articleUrl = `https://${article.app_id}.zyperia.ai/${article.slug}`;

        // Update article status to published
        const { error: publishError } = await supabase
          .from('blog_posts')
          .update({
            status: 'published',
            published_at: publishedAt.toISOString(),
          })
          .eq('id', article.id);

        if (publishError) {
          console.error(`✗ Error publishing article: ${publishError.message}`);
          continue;
        }

        console.log(`✓ Published: ${article.title}`);
        console.log(`  URL: ${articleUrl}`);

        // Create blog_performance entry for tracking
        await supabase.from('blog_performance').insert({
          post_id: article.id,
          date: publishedAt.toISOString().split('T')[0],
          views: 0,
          unique_visitors: 0,
          avg_time_on_page: 0,
          bounce_rate: 0,
          scroll_depth: 0,
          affiliate_clicks: 0,
          adsense_impressions: 0,
          adsense_clicks: 0,
          adsense_revenue: 0,
          created_at: publishedAt.toISOString(),
        });

        // Log to generation_logs
        await supabase.from('generation_logs').insert({
          app_id: article.app_id,
          article_id: article.id,
          stage: 'publishing',
          status: 'success',
          duration_seconds: 1,
        });
      } catch (error) {
        console.error('Error publishing article:', error);

        await supabase.from('generation_logs').insert({
          app_id: article.app_id,
          article_id: article.id,
          stage: 'publishing',
          status: 'failed',
          duration_seconds: 0,
          error_message: (error as Error).message,
        });
      }
    }

    console.log('\n=== STAGE 6 COMPLETE ===');
    return { statusCode: 200, body: 'Stage 6 complete' };
  } catch (error) {
    console.error('STAGE 6 FAILED:', error);
    return { statusCode: 500, body: (error as Error).message };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await runStage6();
  return new Response(JSON.stringify(result), {
    status: result.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}
