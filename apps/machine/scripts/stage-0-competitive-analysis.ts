/**
 * ZYPERIA BRUTAL SYSTEM — Stage 0: Competitive Analysis
 * Runs at: 23:00 UTC daily
 * Purpose: Analyze top-performing competitor articles and identify content gaps
 */

import { createClient } from '@supabase/supabase-js';
import { runCompetitiveAnalysis } from '../lib/competitive-intelligence';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const serpApiKey = process.env.SERP_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

interface StageConfig {
  appId: string;
  keywords: string[];
  maxCompetitors: number;
}

async function getStageConfig(): Promise<StageConfig[]> {
  try {
    const { data: themeConfigs } = await supabase
      .from('theme_config')
      .select('app_id, brutal_system');

    const configs: StageConfig[] = [];

    for (const config of themeConfigs || []) {
      configs.push({
        appId: config.app_id,
        keywords: config.brutal_system?.competitive_analysis?.serp_api_keywords || [],
        maxCompetitors: config.brutal_system?.competitive_analysis?.max_competitors_to_analyze || 20,
      });
    }

    return configs;
  } catch (error) {
    console.error('Error fetching stage config:', error);
    return [];
  }
}

async function runStage0() {
  console.log('\n=== STAGE 0: COMPETITIVE ANALYSIS ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    const configs = await getStageConfig();

    for (const config of configs) {
      console.log(`\nAnalyzing competitive landscape for: ${config.appId}`);

      for (const keyword of config.keywords) {
        const startTime = Date.now();

        try {
          // Run competitive analysis
          const analysis = await runCompetitiveAnalysis(keyword, config.appId, serpApiKey);

          const duration = Math.round((Date.now() - startTime) / 1000);

          // Store result in content_research
          const { data: inserted, error: insertError } = await supabase
            .from('content_research')
            .insert({
              app_id: config.appId,
              topic: keyword,
              research_type: 'competitive_analysis',
              competitive_analysis: {
                top_performing_articles: analysis.topPerformingArticles,
                content_gaps: analysis.contentGaps,
                improvement_opportunities: analysis.improvementOpportunities,
                common_sources: analysis.commonSources,
                average_article_length: analysis.averageArticleLength,
                common_sections: analysis.commonSections,
                recommended_approach: analysis.recommendedApproach,
              },
              competitor_urls: analysis.topPerformingArticles.map((a) => a.url),
              content_gaps: analysis.contentGaps.map((g) => g.gap),
              confidence_score: 85, // Competitive analysis confidence
              analyzed_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error(`Error storing competitive analysis for "${keyword}":`, insertError.message);
          } else {
            console.log(
              `✓ Analyzed "${keyword}": ${analysis.topPerformingArticles.length} competitors, ${analysis.contentGaps.length} gaps identified (${duration}s)`
            );
          }

          // Log to generation_logs
          await supabase.from('generation_logs').insert({
            app_id: config.appId,
            stage: 'competitive_analysis',
            status: insertError ? 'failed' : 'success',
            duration_seconds: duration,
            error_message: insertError?.message,
            ai_model_used: 'serp_api',
            cost_usd: 0.01, // Approximate SerpAPI cost
          });
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`✗ Error analyzing "${keyword}":`, error);

          await supabase.from('generation_logs').insert({
            app_id: config.appId,
            stage: 'competitive_analysis',
            status: 'failed',
            duration_seconds: duration,
            error_message: (error as Error).message,
            ai_model_used: 'serp_api',
            cost_usd: 0.01,
          });
        }
      }
    }

    console.log('\n=== STAGE 0 COMPLETE ===');
    console.log(`Finished at: ${new Date().toISOString()}`);
  } catch (error) {
    console.error('STAGE 0 FAILED:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runStage0();
}

export { runStage0 };
