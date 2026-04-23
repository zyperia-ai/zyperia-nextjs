/**
 * Content Machine Performance Benchmark
 * Tests the entire pipeline and measures performance metrics
 *
 * Usage:
 * npx ts-node scripts/performance-benchmark.ts crypto
 * npx ts-node scripts/performance-benchmark.ts crypto full
 * npx ts-node scripts/performance-benchmark.ts crypto stages
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface BenchmarkResult {
  stage: string;
  duration: number;
  successCount: number;
  failureCount: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  errorRate: number;
}

async function main() {
  const appId = process.argv[2] || 'crypto';
  const mode = process.argv[3] || 'summary';

  console.log(`\n⚡ Content Machine Performance Benchmark (${appId})`);
  console.log(`Mode: ${mode}\n`);

  try {
    if (mode === 'full') {
      await runFullBenchmark(appId);
    } else if (mode === 'stages') {
      await benchmarkStages(appId);
    } else {
      await runSummaryBenchmark(appId);
    }
  } catch (error) {
    console.error('Benchmark error:', error);
    process.exit(1);
  }
}

/**
 * Full comprehensive benchmark
 */
async function runFullBenchmark(appId: string) {
  console.log('🔍 Running full comprehensive benchmark...\n');

  const startTime = Date.now();

  // 1. Test database connectivity
  console.log('1️⃣ Testing database connectivity...');
  const dbStart = Date.now();
  try {
    const { data, error } = await supabase.from('blog_posts').select('count');
    if (error) throw error;
    const dbTime = Date.now() - dbStart;
    console.log(`   ✅ Database: ${dbTime}ms\n`);
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error}\n`);
    return;
  }

  // 2. Test article retrieval performance
  console.log('2️⃣ Testing article retrieval performance...');
  const retrieveStart = Date.now();
  try {
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('id, title, views, engagement_score, generation_approach')
      .eq('app_id', appId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    const retrieveTime = Date.now() - retrieveStart;
    console.log(`   ✅ Retrieved ${articles?.length || 0} articles in ${retrieveTime}ms`);
    console.log(`   📊 Avg per article: ${(retrieveTime / Math.max(articles?.length || 1, 1)).toFixed(2)}ms\n`);

    // Analyze content mix
    if (articles && articles.length > 0) {
      const approaches = {
        original: 0,
        transformed: 0,
        aggregated: 0,
      };

      articles.forEach((a: any) => {
        const approach = a.generation_approach || 'unknown';
        if (approach in approaches) {
          approaches[approach as keyof typeof approaches]++;
        }
      });

      console.log('   Content Mix:');
      Object.entries(approaches).forEach(([approach, count]) => {
        const pct = ((count / articles.length) * 100).toFixed(1);
        console.log(`     - ${approach}: ${count} (${pct}%)`);
      });
      console.log();
    }
  } catch (error) {
    console.log(`   ❌ Article retrieval failed: ${error}\n`);
  }

  // 3. Test analytics performance
  console.log('3️⃣ Testing analytics performance...');
  const analyticsStart = Date.now();
  try {
    const { data: perf } = await supabase
      .from('blog_performance')
      .select('*')
      .eq('app_id', appId)
      .order('date', { ascending: false })
      .limit(30);

    const analyticsTime = Date.now() - analyticsStart;
    if (perf && perf.length > 0) {
      const totalViews = perf.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
      const avgViews = (totalViews / perf.length).toFixed(0);
      console.log(`   ✅ Analytics: ${analyticsTime}ms`);
      console.log(`   📈 Total views (30d): ${totalViews}`);
      console.log(`   📊 Avg daily views: ${avgViews}\n`);
    }
  } catch (error) {
    console.log(`   ❌ Analytics retrieval failed: ${error}\n`);
  }

  // 4. Test generation logs performance
  console.log('4️⃣ Testing generation logs performance...');
  const logsStart = Date.now();
  try {
    const { data: logs } = await supabase
      .from('generation_logs')
      .select('stage, status, duration_seconds, cost_usd')
      .eq('app_id', appId)
      .order('created_at', { ascending: false })
      .limit(200);

    const logsTime = Date.now() - logsStart;
    console.log(`   ✅ Logs retrieved: ${logsTime}ms\n`);

    if (logs && logs.length > 0) {
      await analyzeStagePerformance(logs);
    }
  } catch (error) {
    console.log(`   ❌ Logs retrieval failed: ${error}\n`);
  }

  // 5. Test complex queries
  console.log('5️⃣ Testing complex analytical queries...');
  const complexStart = Date.now();
  try {
    // Simulate performance analytics query
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, views, engagement_score, plagiarism_score, generation_approach')
      .eq('app_id', appId)
      .eq('status', 'published')
      .limit(50);

    const complexTime = Date.now() - complexStart;
    console.log(`   ✅ Complex query: ${complexTime}ms\n`);
  } catch (error) {
    console.log(`   ❌ Complex query failed: ${error}\n`);
  }

  const totalTime = Date.now() - startTime;
  console.log(`\n✅ Full benchmark completed in ${(totalTime / 1000).toFixed(2)}s`);
}

/**
 * Benchmark by stage
 */
async function benchmarkStages(appId: string) {
  console.log('📊 Benchmarking by pipeline stage...\n');

  try {
    const stages = [
      'competitive_analysis',
      'research',
      'generation',
      'visual_enrichment',
      'plagiarism',
      'editorial',
      'publishing',
    ];

    const results: BenchmarkResult[] = [];

    for (const stage of stages) {
      const { data: logs, error } = await supabase
        .from('generation_logs')
        .select('duration_seconds, status')
        .eq('app_id', appId)
        .eq('stage', stage)
        .limit(100);

      if (error) {
        console.log(`⚠️ ${stage}: No data`);
        continue;
      }

      const successCount = logs?.filter((l: any) => l.status === 'success').length || 0;
      const failureCount = logs?.filter((l: any) => l.status === 'failed').length || 0;
      const durations = logs
        ?.filter((l: any) => l.duration_seconds)
        .map((l: any) => l.duration_seconds) || [0];

      const totalDuration = durations.reduce((a: number, b: number) => a + b, 0);
      const avgDuration = durations.length > 0 ? totalDuration / durations.length : 0;
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);
      const errorRate =
        logs && logs.length > 0 ? (failureCount / logs.length) * 100 : 0;

      results.push({
        stage,
        duration: totalDuration,
        successCount,
        failureCount,
        avgDuration,
        minDuration,
        maxDuration,
        errorRate,
      });

      const emoji = errorRate === 0 ? '✅' : errorRate > 10 ? '⚠️' : '✔️';
      console.log(`${emoji} ${stage}`);
      console.log(`   Runs: ${successCount} successful, ${failureCount} failed`);
      console.log(`   Duration: avg ${avgDuration.toFixed(2)}s, min ${minDuration}s, max ${maxDuration}s`);
      console.log(`   Error rate: ${errorRate.toFixed(1)}%\n`);
    }

    // Summary
    const totalTime = results.reduce((sum, r) => sum + r.duration, 0);
    const totalRuns = results.reduce((sum, r) => sum + r.successCount, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.failureCount, 0);
    const avgErrorRate = (totalErrors / Math.max(totalRuns + totalErrors, 1)) * 100;

    console.log('📈 Summary:');
    console.log(`   Total pipeline time: ${(totalTime / 3600).toFixed(2)} hours`);
    console.log(`   Total successful runs: ${totalRuns}`);
    console.log(`   Total errors: ${totalErrors}`);
    console.log(`   Overall error rate: ${avgErrorRate.toFixed(1)}%`);
  } catch (error) {
    console.error('Benchmark failed:', error);
  }
}

/**
 * Summary benchmark
 */
async function runSummaryBenchmark(appId: string) {
  console.log('📋 Performance Summary\n');

  try {
    // Quick stats
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, views, engagement_score, plagiarism_score')
      .eq('app_id', appId)
      .eq('status', 'published');

    const { data: logs } = await supabase
      .from('generation_logs')
      .select('duration_seconds, cost_usd, status')
      .eq('app_id', appId);

    if (articles && articles.length > 0) {
      const totalViews = articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0);
      const avgViews = (totalViews / articles.length).toFixed(0);
      const avgEngagement = (
        articles.reduce((sum: number, a: any) => sum + (a.engagement_score || 0), 0) / articles.length
      ).toFixed(2);
      const avgQuality = (
        articles.reduce((sum: number, a: any) => sum + (a.plagiarism_score || 0), 0) / articles.length
      ).toFixed(1);

      console.log(`📄 Content Statistics:`);
      console.log(`   Total articles: ${articles.length}`);
      console.log(`   Total views: ${totalViews.toLocaleString()}`);
      console.log(`   Avg views per article: ${avgViews}`);
      console.log(`   Avg engagement score: ${avgEngagement}`);
      console.log(`   Avg plagiarism score: ${avgQuality}%\n`);
    }

    if (logs && logs.length > 0) {
      const totalDuration = logs.reduce((sum: number, l: any) => sum + (l.duration_seconds || 0), 0);
      const totalCost = logs.reduce((sum: number, l: any) => sum + (l.cost_usd || 0), 0);
      const successCount = logs.filter((l: any) => l.status === 'success').length;
      const errorRate = ((logs.length - successCount) / logs.length) * 100;

      console.log(`⚙️ Pipeline Statistics:`);
      console.log(`   Total runs: ${logs.length}`);
      console.log(`   Successful: ${successCount}`);
      console.log(`   Error rate: ${errorRate.toFixed(1)}%`);
      console.log(`   Total duration: ${(totalDuration / 3600).toFixed(2)} hours`);
      console.log(`   Avg per run: ${(totalDuration / logs.length).toFixed(2)}s`);
      console.log(`   Total cost: $${totalCost.toFixed(2)}`);
      console.log(`   Cost per article: $${(totalCost / Math.max(logs.length, 1)).toFixed(3)}\n`);
    }

    console.log('✅ Benchmark complete');
  } catch (error) {
    console.error('Summary benchmark failed:', error);
  }
}

/**
 * Analyze stage performance from logs
 */
async function analyzeStagePerformance(logs: any[]) {
  const stageStats: Record<string, any> = {};

  logs.forEach((log: any) => {
    if (!stageStats[log.stage]) {
      stageStats[log.stage] = {
        count: 0,
        totalDuration: 0,
        durations: [],
        failures: 0,
      };
    }
    stageStats[log.stage].count++;
    stageStats[log.stage].totalDuration += log.duration_seconds || 0;
    stageStats[log.stage].durations.push(log.duration_seconds);
    if (log.status === 'failed') {
      stageStats[log.stage].failures++;
    }
  });

  console.log('Stage Performance Analysis:');
  Object.entries(stageStats).forEach(([stage, stats]: [string, any]) => {
    const avg = stats.totalDuration / stats.count;
    const errorRate = (stats.failures / stats.count) * 100;
    console.log(`   ${stage}: avg ${avg.toFixed(2)}s, ${stats.count} runs, error rate ${errorRate.toFixed(1)}%`);
  });
  console.log();
}

main();
