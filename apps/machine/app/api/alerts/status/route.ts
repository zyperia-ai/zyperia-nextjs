/**
 * Alert Status API
 * Monitor and manage system alerts
 * Usage: GET /api/alerts/status?appId=crypto&token=ADMIN_TOKEN
 */

export const dynamic = 'force-dynamic';

import { checkAlerts, getAlertHistory } from '@/lib/alert-system';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('appId') || 'crypto';
    const token = url.searchParams.get('token');
    const action = url.searchParams.get('action') || 'current';
    const days = parseInt(url.searchParams.get('days') || '7');

    // Optional auth for sensitive data
    if (token && token !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'history') {
      const history = await getAlertHistory(appId, days);
      return new Response(JSON.stringify(history), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=300',
        },
      });
    }

    // Get current alerts
    const alerts = await checkAlerts(appId);

    const critical = alerts.filter((a) => a.severity === 'critical');
    const warnings = alerts.filter((a) => a.severity === 'warning');
    const info = alerts.filter((a) => a.severity === 'info');

    return new Response(
      JSON.stringify({
        appId,
        timestamp: new Date().toISOString(),
        alertSummary: {
          total: alerts.length,
          critical: critical.length,
          warnings: warnings.length,
          info: info.length,
        },
        criticalAlerts: critical,
        warnings: warnings,
        infoAlerts: info,
        needsImmedateAction: critical.length > 0,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, max-age=60',
        },
      }
    );
  } catch (error) {
    console.error('Alert status error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to check alerts',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
