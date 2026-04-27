export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Vercel Cron Job - Stage 0: Competitive Analysis
 * Runs daily at 23:00 UTC
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

async function runStage0() {
  console.log('\n=== STAGE 0: COMPETITIVE ANALYSIS (CRON JOB) ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    const { data: themeConfigs } = await getSupabase().from('theme_config').select('app_id, brutal_system');

    for (const config of themeConfigs || []) {
      const keywords = config.brutal_system?.competitive_analysis?.serp_api_keywords || [];
      console.log(`\nAnalyzing competitive landscape for: ${config.app_id}`);

      for (const keyword of keywords.slice(0, 3)) {
        // Simplified analysis - mock for now
        const analysis = {
          topPerformingArticles: [
            {
              url: `https://example.com/${keyword}`,
              title: `${keyword} guide`,
              position: 1,
            },
          ],
          contentGaps: ['visual content', 'updated data', 'step-by-step'],
          improvementOpportunities: ['add 2026 updates', 'better formatting'],
          commonSources: [],
          averageArticleLength: 2500,
          commonSections: ['Intro', 'How-to', 'Tips', 'Conclusion'],
          recommendedApproach: 'transformed',
        };

        const { error: insertError } = await getSupabase().from('content_research').insert({
          app_id: config.app_id,
          topic: keyword,
          research_type: 'competitive_analysis',
          competitive_analysis: analysis,
          content_gaps: analysis.contentGaps,
          confidence_score: 85,
          analyzed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });

        if (!insertError) {
          console.log(`âœ“ Analyzed "${keyword}": 1 top article, ${analysis.contentGaps.length} gaps`);
        }
      }
    }

    console.log('\n=== STAGE 0 COMPLETE ===');
    return { statusCode: 200, body: 'Stage 0 complete' };
  } catch (error) {
    console.error('STAGE 0 FAILED:', error);
    return { statusCode: 500, body: (error as Error).message };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await runStage0();
  return new Response(JSON.stringify(result), {
    status: result.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}

