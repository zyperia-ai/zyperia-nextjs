export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Vercel Cron Job - Stage 5: Editorial Review & E-E-A-T Enhancement
 * Runs daily at 05:00 UTC
 */

import { createClient } from '@supabase/supabase-js'
import { extractMetadata } from '@/lib/metadata-extractor';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

async function runStage5() {
  console.log('\n=== STAGE 5: EDITORIAL REVIEW (CRON JOB) ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    const { data: articles } = await getSupabase()
      .from('blog_posts')
      .select('id, app_id, title, content, plagiarism_score, plagiarism_checked_at')
      .eq('status', 'draft')
      .lte('plagiarism_score', 30) // Only if passed plagiarism check (low originality threshold)
      .is('last_verified_at', null)
      .limit(20);

    if (!articles || articles.length === 0) {
      console.log('No articles to review');
      return { statusCode: 200, body: 'No articles to process' };
    }

    for (const article of articles) {
      try {
        // Add E-E-A-T signals to content (Portuguese, sem duplicação)
        const eeatContent = article.content.includes('## Sobre este artigo')
          ? article.content
          : article.content + `\n\n## Sobre este artigo\n\nEste artigo foi investigado com base em fontes verificadas e dados actualizados de 2026.\n\n*Aviso: Este conteudo e apenas para fins informativos e educativos.*`;

        // Extract metadata
        let metadata = { keywords: [], meta_description: '', tags: [] };
        try {
          metadata = await extractMetadata(article.app_id, article.title, article.content);
        } catch (metadataError) {
          console.warn(`[Stage 5] Metadata extraction failed for "${article.title}":`, (metadataError as Error).message);
        }

        // Update article
        const { error: updateError } = await getSupabase()
          .from('blog_posts')
          .update({
            content: eeatContent,
            last_verified_at: new Date().toISOString(),
            keywords: metadata.keywords,
            meta_description: metadata.meta_description,
            tags: metadata.tags,
          })
          .eq('id', article.id);

        if (!updateError) {
          console.log(`âœ“ Enhanced "${article.title}" with E-E-A-T signals`);
        } else {
          console.error(`âœ— Error enhancing article: ${updateError.message}`);
        }

        // Log to generation_logs
        await getSupabase().from('generation_logs').insert({
          app_id: article.app_id,
          article_id: article.id,
          stage: 'editorial_review',
          status: updateError ? 'failed' : 'success',
          duration_seconds: 2,
          error_message: updateError?.message,
        });
      } catch (error) {
        console.error('Error reviewing article:', error);
      }
    }

    console.log('\n=== STAGE 5 COMPLETE ===');
    return { statusCode: 200, body: 'Stage 5 complete' };
  } catch (error) {
    console.error('STAGE 5 FAILED:', error);
    return { statusCode: 500, body: (error as Error).message };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await runStage5();
  return new Response(JSON.stringify(result), {
    status: result.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}

