/**
 * Backlink Opportunities API
 * Discover and manage backlink opportunities
 * Usage: GET /api/backlinks/opportunities?appId=crypto&limit=50
 */

import { findBacklinkOpportunities, getBacklinkAnalytics } from '../../../lib/backlink-hunter';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('appId') || 'crypto';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const analytics = url.searchParams.get('analytics') === 'true';

    if (analytics) {
      // Return campaign analytics instead of opportunities
      const stats = await getBacklinkAnalytics(appId);
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=3600',
        },
      });
    }

    // Find opportunities for top articles
    const opportunities = await findBacklinkOpportunities(appId, []);

    return new Response(
      JSON.stringify({
        appId,
        timestamp: new Date().toISOString(),
        totalOpportunitiesFound: opportunities.length,
        opportunities: opportunities.slice(0, limit),
        topOpportunities: opportunities.slice(0, 10),
        stats: {
          highRelevance: opportunities.filter((o) => o.relevance_score > 80).length,
          highAuthority: opportunities.filter((o) => o.authority_score > 50).length,
          avgRelevance: Math.round(
            opportunities.reduce((sum, o) => sum + o.relevance_score, 0) / Math.max(opportunities.length, 1)
          ),
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Backlink opportunities error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to find backlink opportunities',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
