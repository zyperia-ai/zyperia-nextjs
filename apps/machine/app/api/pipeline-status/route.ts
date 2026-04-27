/**
 * Real-time Pipeline Status API
 * Returns current state of content generation pipeline
 * Usage: GET /api/pipeline-status
 */

export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

interface PipelineStatus {
  status: 'healthy' | 'degraded' | 'error';
  timestamp: string;
  stats: {
    totalArticles: number;
    publishedToday: number;
    draftArticles: number;
    failedStages: number;
    avgGenerationTime: number;
  };
  lastRuns: Array<{
    stage: string;
    status: 'success' | 'failed';
    duration: number;
    timestamp: string;
  }>;
  nextScheduledRuns: Array<{
    stage: string;
    scheduledTime: string;
    timeUntilRun: string;
  }>;
  topicQueue: {
    crypto: number;
    intelligence: number;
    onlinebiz: number;
    total: number;
  };
}

async function getPipelineStatus(): Promise<PipelineStatus> {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Get article stats
    const { data: articles } = await getSupabase()
      .from('blog_posts')
      .select('status, published_at', { count: 'exact' });

    const { data: draftArticles, count: draftCount } = await getSupabase()
      .from('blog_posts')
      .select('id', { count: 'exact' })
      .eq('status', 'draft');

    const publishedToday = articles?.filter((a: any) => a.published_at?.startsWith(today)).length || 0;

    // Get generation logs
    const { data: logs } = await getSupabase()
      .from('generation_logs')
      .select('stage, status, duration_seconds, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    // Calculate stats
    const failedStages = logs?.filter((l: any) => l.status === 'failed').length || 0;
    const avgGenerationTime =
      logs && logs.length > 0
        ? logs.reduce((sum: number, l: any) => sum + (l.duration_seconds || 0), 0) / logs.length
        : 0;

    // Get topic queue
    const { data: cryptoTopics, count: cryptoCount } = await getSupabase()
      .from('content_topics')
      .select('id', { count: 'exact' })
      .eq('app_id', 'crypto')
      .is('last_used_at', null);

    const { data: intTopics, count: intCount } = await getSupabase()
      .from('content_topics')
      .select('id', { count: 'exact' })
      .eq('app_id', 'intelligence')
      .is('last_used_at', null);

    const { data: bizTopics, count: bizCount } = await getSupabase()
      .from('content_topics')
      .select('id', { count: 'exact' })
      .eq('app_id', 'onlinebiz')
      .is('last_used_at', null);

    // Build scheduled runs (based on cron schedule)
    const nextScheduledRuns = getNextScheduledRuns(now);

    // Determine overall status
    const status = failedStages > 10 ? 'error' : failedStages > 3 ? 'degraded' : 'healthy';

    return {
      status,
      timestamp: now.toISOString(),
      stats: {
        totalArticles: articles?.length || 0,
        publishedToday,
        draftArticles: draftCount || 0,
        failedStages,
        avgGenerationTime: Math.round(avgGenerationTime),
      },
      lastRuns:
        logs
          ?.slice(0, 10)
          .map((l: any) => ({
            stage: l.stage,
            status: l.status,
            duration: l.duration_seconds || 0,
            timestamp: l.created_at,
          })) || [],
      nextScheduledRuns,
      topicQueue: {
        crypto: cryptoCount || 0,
        intelligence: intCount || 0,
        onlinebiz: bizCount || 0,
        total: (cryptoCount || 0) + (intCount || 0) + (bizCount || 0),
      },
    };
  } catch (error) {
    console.error('Error getting pipeline status:', error);
    throw error;
  }
}

function getNextScheduledRuns(now: Date) {
  const stages = [
    { name: 'Stage 0: Competitive Analysis', hour: 23, minute: 0 },
    { name: 'Stage 1: Research', hour: 0, minute: 30 },
    { name: 'Stage 2: Generation', hour: 2, minute: 0 },
    { name: 'Stage 3: Visuals', hour: 3, minute: 0 },
    { name: 'Stage 4: Plagiarism', hour: 4, minute: 0 },
    { name: 'Stage 5: Editorial', hour: 5, minute: 0 },
    { name: 'Stage 6: Publishing', hour: 9, minute: 0 },
    { name: 'Stage 6: Publishing', hour: 14, minute: 0 },
    { name: 'Stage 6: Publishing', hour: 18, minute: 0 },
  ];

  const upcoming = stages.map((stage) => {
    let nextRun = new Date(now);
    nextRun.setHours(stage.hour, stage.minute, 0, 0);

    // If that time has passed, schedule for tomorrow
    if (nextRun < now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const diffMs = nextRun.getTime() - now.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let timeUntilRun = '';
    if (hours > 0) {
      timeUntilRun = `${hours}h ${minutes}m`;
    } else {
      timeUntilRun = `${minutes}m`;
    }

    return {
      stage: stage.name,
      scheduledTime: nextRun.toISOString(),
      timeUntilRun,
    };
  });

  return upcoming.slice(0, 5); // Return next 5 scheduled runs
}

export async function GET(request: Request) {
  try {
    const status = await getPipelineStatus();

    return new Response(JSON.stringify(status), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, max-age=60', // Cache for 60 seconds
      },
    });
  } catch (error) {
    console.error('Pipeline status error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to get pipeline status',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

