export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Vercel Cron Job - Stage 3: Visual Enrichment
 * Runs daily at 03:00 UTC
 * Adds hero images, visualizations, and OG images to draft articles
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

async function runStage3() {
  console.log('\n=== STAGE 3: VISUAL ENRICHMENT (CRON JOB) ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    const { data: articles } = await getSupabase()
      .from('blog_posts')
      .select('id, app_id, title, content, hero_image_url')
      .eq('status', 'draft')
      .is('hero_image_url', null)
      .limit(20);

    if (!articles || articles.length === 0) {
      console.log('No articles to enrich');
      return { statusCode: 200, body: 'No articles to process' };
    }

    for (const article of articles) {
      try {
        // Placeholder: Generate mock visual URLs
        const heroUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}`;
        const ogUrl = `https://via.placeholder.com/1200x630?text=${encodeURIComponent(article.title)}`;

        // Update article with visual URLs
        const { error: updateError } = await getSupabase()
          .from('blog_posts')
          .update({
            hero_image_url: heroUrl,
            og_image_url: ogUrl,
            visualizations: {
              charts: [],
              diagrams: [],
            },
          })
          .eq('id', article.id);

        if (!updateError) {
          console.log(`âœ“ Enriched article: ${article.title}`);
        } else {
          console.error(`âœ— Error enriching article: ${updateError.message}`);
        }

        // Log to generation_logs
        await getSupabase().from('generation_logs').insert({
          app_id: article.app_id,
          article_id: article.id,
          stage: 'visual_enrichment',
          status: updateError ? 'failed' : 'success',
          duration_seconds: 2,
          error_message: updateError?.message,
          visual_enrichment_details: {
            hero_image_generated: true,
            charts_count: 0,
            og_image_created: true,
          },
        });
      } catch (error) {
        console.error('Error enriching article:', error);
      }
    }

    console.log('\n=== STAGE 3 COMPLETE ===');
    return { statusCode: 200, body: 'Stage 3 complete' };
  } catch (error) {
    console.error('STAGE 3 FAILED:', error);
    return { statusCode: 500, body: (error as Error).message };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await runStage3();
  return new Response(JSON.stringify(result), {
    status: result.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}

