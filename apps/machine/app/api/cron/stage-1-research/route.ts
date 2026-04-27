export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Vercel Cron Job - Stage 1: Research & Topic Selection
 * Runs daily at 00:30 UTC
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

async function getNexusAudienceFocus(): Promise<Record<string, number>> {
  const { data } = await getSupabase()
    .from('nexus_config')
    .select('config_value')
    .eq('config_key', 'audience_focus')
    .single()

  return (data?.config_value as Record<string, number>) ?? {
    iniciante: 0.5,
    intermediário: 0.4,
    avançado: 0.1,
  }
}

async function runStage1() {
  console.log('\n=== STAGE 1: RESEARCH & TOPIC SELECTION (CRON JOB) ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    console.log('Tentando conectar ao Supabase...')
    console.log('SUPABASE_URL presente:', !!process.env.SUPABASE_URL)
    console.log('SUPABASE_KEY presente:', !!process.env.SUPABASE_KEY)

    console.log('ENV CHECK:', !!process.env.SUPABASE_URL, !!process.env.SUPABASE_KEY)
    const { data: apps, error: appsError } = await getSupabase().from('theme_config').select('app_id, articles_per_day');
    console.log('theme_config result:', apps?.length, appsError?.message)

    for (const app of apps || []) {
      console.log(`\nSelecting topics for: ${app.app_id} (${app.articles_per_day} articles)`);

      const audienceFocus = await getNexusAudienceFocus()

      // Determinar audience_level preferido pelo NEXUS (maior peso)
      const preferredAudience = Object.entries(audienceFocus).sort((a, b) => b[1] - a[1])[0][0]

      // Tentar primeiro tópicos com o audience_level preferido
      let { data: topics } = await getSupabase()
        .from('content_topics')
        .select('id, title, priority, search_volume, audience_level')
        .eq('app_id', app.app_id)
        .is('last_used_at', null)
        .eq('audience_level', preferredAudience)
        .order('priority', { ascending: false })
        .order('search_volume', { ascending: false })
        .limit(app.articles_per_day)

      // Fallback: se não há tópicos com o audience preferido, pegar todos
      if (!topics || topics.length < app.articles_per_day) {
        const needed = app.articles_per_day - (topics?.length ?? 0)
        const existingIds = topics?.map((t: { id: string }) => t.id) ?? []

        const { data: fallbackTopics } = await getSupabase()
          .from('content_topics')
          .select('id, title, priority, search_volume, audience_level')
          .eq('app_id', app.app_id)
          .is('last_used_at', null)
          .not('id', 'in', existingIds.length > 0 ? `(${existingIds.join(',')})` : '()')
          .order('priority', { ascending: false })
          .order('search_volume', { ascending: false })
          .limit(needed)

        topics = [...(topics ?? []), ...(fallbackTopics ?? [])]
      }

      if (!topics || topics.length === 0) {
        console.log(`⚠️  No topics available for ${app.app_id}`);
        continue;
      }

      for (const topic of topics) {
        const startTime = Date.now();

        try {
          const researchData = {
            topic: topic.title,
            keywords: topic.title.split(' '),
            search_volume: topic.search_volume,
            recent_news: [],
            official_sources: [],
            updated_at: new Date().toISOString(),
          };

          // Get competitive analysis from Stage 0
          const { data: competitiveData } = await getSupabase()
            .from('content_research')
            .select('competitive_analysis, content_gaps')
            .eq('app_id', app.app_id)
            .eq('topic', topic.title)
            .eq('research_type', 'competitive_analysis')
            .order('analyzed_at', { ascending: false })
            .limit(1);

          // Store research
          const { error: insertError } = await getSupabase().from('content_research').insert({
            app_id: app.app_id,
            topic: topic.title,
            research_type: 'original',
            research_data: researchData,
            content_gaps: competitiveData?.[0]?.content_gaps,
            confidence_score: 75,
            created_at: new Date().toISOString(),
          });

          const duration = Math.round((Date.now() - startTime) / 1000);

          if (insertError) {
            console.error(`✗ Error researching "${topic.title}":`, insertError.message);
            await getSupabase().from('generation_logs').insert({
              app_id: app.app_id,
              stage: 'research',
              status: 'failed',
              duration_seconds: duration,
              error_message: insertError.message,
            });
          } else {
            console.log(`✓ Researched "${topic.title}" (${duration}s)`);

            // Mark topic as used
            await getSupabase()
              .from('content_topics')
              .update({ last_used_at: new Date().toISOString() })
              .eq('id', topic.id);

            // Log success
            await getSupabase().from('generation_logs').insert({
              app_id: app.app_id,
              stage: 'research',
              status: 'success',
              duration_seconds: duration,
            });
          }
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`✗ Error in topic research:`, error);

          await getSupabase().from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'research',
            status: 'failed',
            duration_seconds: duration,
            error_message: (error as Error).message,
          });
        }
      }
    }

    console.log('\n=== STAGE 1 COMPLETE ===');
    return { statusCode: 200, body: 'Stage 1 complete' };
  } catch (error) {
    console.error('STAGE 1 FAILED:', error);
    return { statusCode: 500, body: (error as Error).message };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await runStage1();
  return new Response(JSON.stringify(result), {
    status: result.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}
