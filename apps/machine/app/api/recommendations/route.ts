/**
 * Content Recommendations API
 * Suggests what to write next based on performance analysis
 * Usage: GET /api/recommendations?appId=crypto
 */

export const dynamic = 'force-dynamic';

import { generateRecommendations, getQuickInsights, suggestNextTopic } from '@/lib/content-recommendations';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('appId') || 'crypto';

    const recommendations = await generateRecommendations(appId);
    const insights = await getQuickInsights(appId);
    const nextTopic = await suggestNextTopic(appId);

    return new Response(
      JSON.stringify({
        appId,
        timestamp: new Date().toISOString(),
        nextTopicToWrite: nextTopic,
        quickInsights: insights,
        recommendations: recommendations.slice(0, 10),
        prioritized: {
          highImpactLowEffort: recommendations.filter((r) => r.impact === 'high' && r.effort === 'low'),
          quickWins: recommendations.filter((r) => r.effort === 'low').slice(0, 3),
          strategicOpportunities: recommendations.filter((r) => r.type === 'high_demand'),
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Recommendations error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate recommendations',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
