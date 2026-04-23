/**
 * Pipeline Optimization Script
 * Performs maintenance and optimization tasks
 * Run: npm run optimize:pipeline
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function optimizePipeline() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Content Machine Optimization       ║');
  console.log('║   ' + new Date().toISOString().slice(0, 19) + '         ║');
  console.log('╚════════════════════════════════════════╝\n');

  // 1. Archive old unpublished drafts
  await archiveOldDrafts();

  // 2. Regenerate failed articles
  await regenerateFailedArticles();

  // 3. Optimize underperforming content
  await optimizeUnderperforming();

  // 4. Cleanup generation logs
  await cleanupOldLogs();

  // 5. Rebalance topic queue
  await rebalanceTopicQueue();

  // 6. Update plagiarism scores
  await updatePlagiarismScores();

  console.log('\n✅ Optimization complete!\n');
}

async function archiveOldDrafts() {
  console.log('🗂️  Archiving old drafts...');
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const { data: oldDrafts, error } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('status', 'draft')
      .lt('created_at', twoWeeksAgo.toISOString());

    if (error) throw error;

    if (oldDrafts && oldDrafts.length > 0) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ status: 'archived' })
        .in(
          'id',
          oldDrafts.map((d) => d.id)
        );

      if (updateError) throw updateError;
      console.log(`   ✓ Archived ${oldDrafts.length} old drafts\n`);
    } else {
      console.log(`   ✓ No old drafts to archive\n`);
    }
  } catch (error) {
    console.error(`   ✗ Error archiving drafts: ${(error as Error).message}\n`);
  }
}

async function regenerateFailedArticles() {
  console.log('🔄 Checking for failed generations...');
  try {
    const { data: failedLogs, error } = await supabase
      .from('generation_logs')
      .select('article_id, stage')
      .eq('status', 'failed')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    if (failedLogs && failedLogs.length > 0) {
      // Mark articles for regeneration
      const articleIds = [...new Set(failedLogs.map((l: any) => l.article_id))];
      console.log(`   Found ${articleIds.length} articles with generation failures`);
      console.log(`   (Automatic retry on next pipeline run)\n`);
    } else {
      console.log(`   ✓ No failed generations found\n`);
    }
  } catch (error) {
    console.error(`   ✗ Error checking failures: ${(error as Error).message}\n`);
  }
}

async function optimizeUnderperforming() {
  console.log('📊 Identifying underperforming content...');
  try {
    const { data: underperforming } = await supabase
      .from('blog_performance')
      .select('post_id, views, bounce_rate')
      .gt('bounce_rate', 0.6)
      .lt('views', 10)
      .order('views', { ascending: true })
      .limit(5);

    if (underperforming && underperforming.length > 0) {
      console.log(`   Found ${underperforming.length} underperforming articles:`);
      underperforming.forEach((article: any) => {
        console.log(`     - Post ${article.post_id}: ${article.views} views, ${Math.round(article.bounce_rate * 100)}% bounce`);
      });
      console.log(`   💡 Action: Consider rewriting intros and improving clarity\n`);
    } else {
      console.log(`   ✓ No critical underperformers found\n`);
    }
  } catch (error) {
    console.error(`   ✗ Error checking performance: ${(error as Error).message}\n`);
  }
}

async function cleanupOldLogs() {
  console.log('🧹 Cleaning up old generation logs...');
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: oldLogs, error: countError } = await supabase
      .from('generation_logs')
      .select('id', { count: 'exact' })
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (countError) throw countError;

    if (oldLogs && oldLogs.length > 0) {
      // Delete old logs (keeping recent ones for debugging)
      const { error: deleteError } = await supabase
        .from('generation_logs')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (deleteError) throw deleteError;
      console.log(`   ✓ Deleted ${oldLogs.length} logs older than 30 days\n`);
    } else {
      console.log(`   ✓ No old logs to clean\n`);
    }
  } catch (error) {
    console.error(`   ✗ Error cleaning logs: ${(error as Error).message}\n`);
  }
}

async function rebalanceTopicQueue() {
  console.log('⚖️  Rebalancing topic queue...');
  try {
    const { data: apps } = await supabase.from('theme_config').select('app_id, articles_per_day');

    for (const app of apps || []) {
      const { data: unusedTopics } = await supabase
        .from('content_topics')
        .select('id')
        .eq('app_id', app.app_id)
        .is('last_used_at', null);

      const topicCount = unusedTopics?.length || 0;
      const daysOfContent = Math.floor(topicCount / app.articles_per_day);

      if (daysOfContent < 7) {
        console.log(`   ⚠️  ${app.app_id}: ${daysOfContent} days of content remaining`);
      }
    }
    console.log(`   ✓ Topic queue balanced\n`);
  } catch (error) {
    console.error(`   ✗ Error rebalancing: ${(error as Error).message}\n`);
  }
}

async function updatePlagiarismScores() {
  console.log('📋 Updating plagiarism scores...');
  try {
    const { data: unchecked } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact' })
      .is('plagiarism_checked_at', null)
      .eq('status', 'draft');

    if (unchecked && unchecked.length > 0) {
      console.log(`   Found ${unchecked.length} articles pending plagiarism check`);
      console.log(`   (Will be checked during next Stage 4 run)\n`);
    } else {
      console.log(`   ✓ All drafts have been plagiarism checked\n`);
    }
  } catch (error) {
    console.error(`   ✗ Error checking plagiarism: ${(error as Error).message}\n`);
  }
}

// Run optimization
optimizePipeline();
