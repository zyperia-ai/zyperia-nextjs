export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Vercel Cron Job - Stage 1: Research & Topic Selection
 * Runs daily at 00:30 UTC
 */

import { createClient } from '@supabase/supabase-js';
import { searchAndExtractWithClaude } from '@/lib/ai-router';

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
    const { data: apps, error: appsError } = await getSupabase().from('theme_config').select('app_id, articles_per_day');

    for (const app of apps || []) {
      console.log(`\nSelecting topics for: ${app.app_id} (${app.articles_per_day} articles)`);

      // NEXUS audience_focus — preferência mas sem bloquear se não há tópicos suficientes
      const audienceFocus = await getNexusAudienceFocus()
      const preferredAudience = Object.entries(audienceFocus).sort((a, b) => b[1] - a[1])[0][0]

      // Buscar todos os tópicos disponíveis ordenados por prioridade
      const { data: allTopics } = await getSupabase()
        .from('content_topics')
        .select('id, title, priority, search_volume, audience_level')
        .eq('app_id', app.app_id)
        .is('last_used_at', null)
        .order('priority', { ascending: false })
        .limit(app.articles_per_day * 3)

      // Separar preferidos dos restantes
      const preferred = (allTopics ?? []).filter(t => t.audience_level === preferredAudience)
      const others = (allTopics ?? []).filter(t => t.audience_level !== preferredAudience)

      // Combinar: preferidos primeiro, depois os restantes até ao limite
      const topics = [...preferred, ...others].slice(0, app.articles_per_day)

      if (!topics || topics.length === 0) {
        console.log(`⚠️  No topics available for ${app.app_id}`);
        continue;
      }

      // PRIORIDADE 1 — Breaking news (TIPO 1)
      const { data: breaking } = await getSupabase()
        .from('breaking_queue')
        .select('*')
        .eq('app_id', app.app_id)
        .eq('processed', false)
        .order('detected_at', { ascending: true })
        .limit(1)
        .single()

      if (breaking) {
        console.log(`[Stage 1] TIPO 1 breaking: "${breaking.title}"`)
        await getSupabase().from('breaking_queue').update({ processed: true }).eq('id', breaking.id)
        await getSupabase().from('content_research').insert({
          app_id: app.app_id,
          topic: breaking.title,
          research_type: 'tipo1',
          research_data: {
            topic: breaking.title,
            content_type: 'tipo1',
            sourceUrl: breaking.source_url,
            sourceTitle: breaking.title,
            sourceContent: breaking.content,
            sourceType: breaking.source_type,
            articleFound: true,
            updated_at: new Date().toISOString(),
          },
          confidence_score: 95,
          created_at: new Date().toISOString(),
        })
        console.log(`✓ Breaking queued: "${breaking.title}"`)
        continue
      }

      // PRIORIDADE 2 — YouTube (TIPO 2)
      const { data: video } = await getSupabase()
        .from('content_queue')
        .select('*')
        .eq('app_id', app.app_id)
        .eq('processed', false)
        .order('detected_at', { ascending: true })
        .limit(1)
        .single()

      if (video && video.transcript && video.transcript.length > 500) {
        console.log(`[Stage 1] TIPO 2 YouTube: "${video.video_title}"`)
        await getSupabase().from('content_queue').update({ processed: true }).eq('id', video.id)
        await getSupabase().from('content_research').insert({
          app_id: app.app_id,
          topic: video.video_title,
          research_type: 'tipo2',
          research_data: {
            topic: video.video_title,
            content_type: 'tipo2',
            sourceUrl: `https://youtube.com/watch?v=${video.video_id}`,
            sourceTitle: video.video_title,
            sourceContent: video.transcript,
            articleFound: true,
            updated_at: new Date().toISOString(),
          },
          confidence_score: 85,
          created_at: new Date().toISOString(),
        })
        console.log(`✓ YouTube queued: "${video.video_title}"`)
        continue
      }

      // PRIORIDADE 3 — Evergreen (TIPO 3) — lógica existente abaixo
      for (const topic of topics) {
        const startTime = Date.now();

        try {
          console.log(`Researching: "${topic.title}"...`)

          const extracted = await searchAndExtractWithClaude(topic.title, app.app_id)

          const researchData = {
            topic: topic.title,
            keywords: topic.title.split(' '),
            search_volume: topic.search_volume,
            sources: extracted.sources,
            keyFacts: extracted.keyFacts,
            lusophoneContext: extracted.lusophoneContext,
            searchQueries: extracted.searchQueries,
            updated_at: new Date().toISOString(),
          }

          console.log(`Found ${extracted.sources.length} sources, ${extracted.keyFacts.length} key facts`)

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
