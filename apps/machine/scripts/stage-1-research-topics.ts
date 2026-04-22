/**
 * ZYPERIA BRUTAL SYSTEM — Stage 1: Research & Topic Selection
 * Runs at: 00:30 UTC daily
 * Purpose: Select topics from queue, perform fresh research, identify competitive gaps
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runStage1() {
  console.log('\n=== STAGE 1: RESEARCH & TOPIC SELECTION ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    // Get all apps with their configuration
    const { data: apps } = await supabase.from('theme_config').select('app_id, articles_per_day');

    for (const app of apps || []) {
      console.log(`\nSelecting topics for: ${app.app_id} (${app.articles_per_day} articles)`);

      // Get topics from queue, ordered by priority
      const { data: topics } = await supabase
        .from('content_topics')
        .select('id, title, priority, search_volume')
        .eq('app_id', app.app_id)
        .is('last_used_at', null) // Unused topics first
        .order('priority', { ascending: false })
        .order('search_volume', { ascending: false })
        .limit(app.articles_per_day);

      if (!topics || topics.length === 0) {
        console.log(`⚠ No topics available for ${app.app_id}`);
        continue;
      }

      for (const topic of topics) {
        const startTime = Date.now();

        try {
          // Fetch recent research data for this topic (web search, news, etc)
          // In production, integrate with Google News API, web search APIs
          const researchData = {
            topic: topic.title,
            keywords: topic.title.split(' '),
            search_volume: topic.search_volume,
            recent_news: [], // Would fetch from Google News API
            official_sources: [], // From theme config
            updated_at: new Date().toISOString(),
          };

          // Check for competitive analysis from Stage 0
          const { data: competitiveData } = await supabase
            .from('content_research')
            .select('competitive_analysis, content_gaps')
            .eq('app_id', app.app_id)
            .eq('topic', topic.title)
            .eq('research_type', 'competitive_analysis')
            .order('analyzed_at', { ascending: false })
            .limit(1);

          // Store research
          const { error: insertError } = await supabase
            .from('content_research')
            .insert({
              app_id: app.app_id,
              topic: topic.title,
              research_type: 'original',
              research_data: researchData,
              content_gaps: competitiveData?.[0]?.content_gaps,
              confidence_score: 75,
            });

          const duration = Math.round((Date.now() - startTime) / 1000);

          if (insertError) {
            console.error(`✗ Error researching "${topic.title}":`, insertError.message);
            await supabase.from('generation_logs').insert({
              app_id: app.app_id,
              stage: 'research',
              status: 'failed',
              duration_seconds: duration,
              error_message: insertError.message,
              ai_model_used: 'serp_api',
            });
          } else {
            console.log(`✓ Researched "${topic.title}" (${duration}s)`);

            // Mark topic as used
            await supabase
              .from('content_topics')
              .update({ last_used_at: new Date().toISOString() })
              .eq('id', topic.id);

            await supabase.from('generation_logs').insert({
              app_id: app.app_id,
              stage: 'research',
              status: 'success',
              duration_seconds: duration,
              ai_model_used: 'serp_api',
              cost_usd: 0.005,
            });
          }
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`✗ Error in research stage:`, error);

          await supabase.from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'research',
            status: 'failed',
            duration_seconds: duration,
            error_message: (error as Error).message,
            ai_model_used: 'serp_api',
          });
        }
      }
    }

    console.log('\n=== STAGE 1 COMPLETE ===');
  } catch (error) {
    console.error('STAGE 1 FAILED:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runStage1();
}

export { runStage1 };
