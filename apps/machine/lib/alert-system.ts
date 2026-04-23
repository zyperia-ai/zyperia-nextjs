/**
 * Intelligent Alert System
 * Monitors pipeline health, revenue, rankings, and performance
 * Sends alerts to owner via email, Slack, or webhooks
 */

import { createClient } from '@supabase/supabase-js';
import { sendEmail } from './email-notifications';
import { sendWebhook } from './webhook-manager';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface AlertConfig {
  appId: string;
  alertType: string;
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  enabled: boolean;
  channels: ('email' | 'slack' | 'discord')[];
  cooldown_minutes: number; // Don't alert again for X minutes
}

export interface AlertTrigger {
  id?: string;
  appId: string;
  alertType: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  data: Record<string, any>;
  triggered_at?: string;
  resolved_at?: string;
}

/**
 * Check all alert conditions for an app
 */
export async function checkAlerts(appId: string): Promise<AlertTrigger[]> {
  const alerts: AlertTrigger[] = [];

  try {
    // 1. Pipeline error rate alert
    alerts.push(...(await checkErrorRateAlert(appId)));

    // 2. Low traffic alert
    alerts.push(...(await checkTrafficAlert(appId)));

    // 3. High error rate in generation
    alerts.push(...(await checkGenerationErrorAlert(appId)));

    // 4. Ranking drop alert
    alerts.push(...(await checkRankingDropAlert(appId)));

    // 5. Low engagement alert
    alerts.push(...(await checkEngagementAlert(appId)));

    // 6. Revenue drop alert
    alerts.push(...(await checkRevenueAlert(appId)));

    // 7. Quality alert (plagiarism score)
    alerts.push(...(await checkQualityAlert(appId)));

    // 8. Backlink acquisition success (positive alert)
    alerts.push(...(await checkBacklinkAlert(appId)));

    // Filter out duplicate recent alerts
    const uniqueAlerts = await filterRecentAlerts(alerts);

    // Log all triggered alerts
    for (const alert of uniqueAlerts) {
      await logAlert(alert);
    }

    return uniqueAlerts;
  } catch (error) {
    console.error('Error checking alerts:', error);
    return [];
  }
}

/**
 * Alert: Pipeline error rate too high
 */
async function checkErrorRateAlert(appId: string): Promise<AlertTrigger[]> {
  const { data: logs } = await supabase
    .from('generation_logs')
    .select('status')
    .eq('app_id', appId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24h

  if (!logs || logs.length === 0) return [];

  const errorCount = logs.filter((l: any) => l.status === 'failed').length;
  const errorRate = (errorCount / logs.length) * 100;

  if (errorRate > 10) {
    return [
      {
        appId,
        alertType: 'high_error_rate',
        severity: 'critical',
        message: `Pipeline error rate is ${errorRate.toFixed(1)}% (threshold: 10%)`,
        data: {
          errorCount,
          totalRuns: logs.length,
          errorRate: errorRate.toFixed(1),
          lastErrorAt: logs.find((l: any) => l.status === 'failed')?.created_at,
        },
      },
    ];
  }

  return [];
}

/**
 * Alert: Traffic drop detected
 */
async function checkTrafficAlert(appId: string): Promise<AlertTrigger[]> {
  const { data: perfData } = await supabase
    .from('blog_performance')
    .select('views')
    .eq('app_id', appId)
    .order('date', { ascending: false })
    .limit(7); // Last 7 days

  if (!perfData || perfData.length < 2) return [];

  const recentAvg = perfData.slice(0, 3).reduce((sum: number, p: any) => sum + (p.views || 0), 0) / 3;
  const previousAvg = perfData.slice(3, 7).reduce((sum: number, p: any) => sum + (p.views || 0), 0) / 4;

  const trafficDrop = ((previousAvg - recentAvg) / previousAvg) * 100;

  if (trafficDrop > 30) {
    return [
      {
        appId,
        alertType: 'traffic_drop',
        severity: 'warning',
        message: `Traffic dropped ${trafficDrop.toFixed(1)}% in last 3 days`,
        data: {
          previousAvgDaily: previousAvg.toFixed(0),
          currentAvgDaily: recentAvg.toFixed(0),
          dropPercent: trafficDrop.toFixed(1),
          recommendation: 'Check if articles are losing rankings or if there are indexing issues',
        },
      },
    ];
  }

  return [];
}

/**
 * Alert: Generation errors in specific stage
 */
async function checkGenerationErrorAlert(appId: string): Promise<AlertTrigger[]> {
  const { data: logs } = await supabase
    .from('generation_logs')
    .select('stage, status')
    .eq('app_id', appId)
    .eq('status', 'failed')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24h

  if (!logs || logs.length === 0) return [];

  const stageErrors: Record<string, number> = {};
  logs.forEach((l: any) => {
    stageErrors[l.stage] = (stageErrors[l.stage] || 0) + 1;
  });

  const alerts: AlertTrigger[] = [];
  Object.entries(stageErrors).forEach(([stage, count]) => {
    if (count >= 3) {
      alerts.push({
        appId,
        alertType: 'stage_error_recurring',
        severity: 'warning',
        message: `Stage "${stage}" failed ${count} times in last 24 hours`,
        data: { stage, failureCount: count },
      });
    }
  });

  return alerts;
}

/**
 * Alert: Keyword ranking drop
 */
async function checkRankingDropAlert(appId: string): Promise<AlertTrigger[]> {
  const { data: rankings } = await supabase
    .from('ranking_history')
    .select('keyword, rank')
    .eq('app_id', appId)
    .order('tracked_at', { ascending: false })
    .limit(100);

  if (!rankings || rankings.length < 2) return [];

  const keywordRanks: Record<string, number[]> = {};
  rankings.forEach((r: any) => {
    if (!keywordRanks[r.keyword]) keywordRanks[r.keyword] = [];
    keywordRanks[r.keyword].push(r.rank);
  });

  const alerts: AlertTrigger[] = [];
  Object.entries(keywordRanks).forEach(([keyword, ranks]) => {
    if (ranks.length >= 2) {
      const rankDrop = ranks[ranks.length - 1] - ranks[0];
      if (rankDrop > 10) {
        // Dropped more than 10 positions
        alerts.push({
          appId,
          alertType: 'ranking_drop',
          severity: 'warning',
          message: `Keyword "${keyword}" dropped ${rankDrop} positions`,
          data: {
            keyword,
            previousRank: ranks[ranks.length - 1],
            currentRank: ranks[0],
            rankDrop,
          },
        });
      }
    }
  });

  return alerts;
}

/**
 * Alert: Low engagement on articles
 */
async function checkEngagementAlert(appId: string): Promise<AlertTrigger[]> {
  const { data: articles } = await supabase
    .from('blog_posts')
    .select('id, title, engagement_score, views')
    .eq('app_id', appId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10); // Last 10 published

  if (!articles || articles.length === 0) return [];

  const lowEngagement = articles.filter((a: any) => (a.engagement_score || 0) < 0.3 && (a.views || 0) > 10);

  if (lowEngagement.length >= 3) {
    return [
      {
        appId,
        alertType: 'low_engagement',
        severity: 'warning',
        message: `${lowEngagement.length} recent articles have low engagement (<0.3)`,
        data: {
          articleCount: lowEngagement.length,
          articles: lowEngagement.map((a: any) => ({
            title: a.title.substring(0, 50),
            engagement: (a.engagement_score || 0).toFixed(2),
          })),
        },
      },
    ];
  }

  return [];
}

/**
 * Alert: Revenue drop
 */
async function checkRevenueAlert(appId: string): Promise<AlertTrigger[]> {
  const { data: perfData } = await supabase
    .from('blog_performance')
    .select('adsense_revenue')
    .eq('app_id', appId)
    .order('date', { ascending: false })
    .limit(14); // Last 14 days

  if (!perfData || perfData.length < 2) return [];

  const recentRevenue = perfData.slice(0, 7).reduce((sum: number, p: any) => sum + (p.adsense_revenue || 0), 0);
  const previousRevenue = perfData.slice(7, 14).reduce((sum: number, p: any) => sum + (p.adsense_revenue || 0), 0);

  const revenueDrop = previousRevenue > 0 ? ((previousRevenue - recentRevenue) / previousRevenue) * 100 : 0;

  if (revenueDrop > 25 && previousRevenue > 10) {
    return [
      {
        appId,
        alertType: 'revenue_drop',
        severity: 'critical',
        message: `Revenue dropped ${revenueDrop.toFixed(1)}% (week-over-week)`,
        data: {
          previousWeek: previousRevenue.toFixed(2),
          currentWeek: recentRevenue.toFixed(2),
          dropPercent: revenueDrop.toFixed(1),
        },
      },
    ];
  }

  return [];
}

/**
 * Alert: Quality issues (plagiarism/uniqueness score)
 */
async function checkQualityAlert(appId: string): Promise<AlertTrigger[]> {
  const { data: articles } = await supabase
    .from('blog_posts')
    .select('id, title, plagiarism_score')
    .eq('app_id', appId)
    .eq('status', 'published')
    .lt('plagiarism_score', 70)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!articles || articles.length === 0) return [];

  return [
    {
      appId,
      alertType: 'low_quality',
      severity: 'warning',
      message: `${articles.length} articles have uniqueness <70%`,
      data: {
        articleCount: articles.length,
        articles: articles.map((a: any) => ({
          title: a.title.substring(0, 40),
          uniqueness: (a.plagiarism_score || 0).toFixed(1),
        })),
      },
    },
  ];
}

/**
 * Alert: Backlink acquired (positive alert)
 */
async function checkBacklinkAlert(appId: string): Promise<AlertTrigger[]> {
  const { data: recentBacklinks } = await supabase
    .from('backlink_acquisitions')
    .select('source_domain, anchor_text, discovered_at')
    .eq('app_id', appId)
    .eq('status', 'verified')
    .gte('discovered_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24h

  if (!recentBacklinks || recentBacklinks.length === 0) return [];

  return recentBacklinks.map((bl: any) => ({
    appId,
    alertType: 'backlink_acquired',
    severity: 'info',
    message: `🎉 New backlink acquired from ${bl.source_domain}`,
    data: {
      sourceDomain: bl.source_domain,
      anchorText: bl.anchor_text || '(not specified)',
      acquiredAt: bl.discovered_at,
    },
  }));
}

/**
 * Filter out duplicate recent alerts
 */
async function filterRecentAlerts(alerts: AlertTrigger[]): Promise<AlertTrigger[]> {
  const filtered: AlertTrigger[] = [];

  for (const alert of alerts) {
    // Check if similar alert was sent recently
    const { data: recent } = await supabase
      .from('alert_logs')
      .select('*')
      .eq('app_id', alert.appId)
      .eq('alert_type', alert.alertType)
      .gte('triggered_at', new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()); // Last 3 hours

    if (!recent || recent.length === 0) {
      filtered.push(alert);
    }
  }

  return filtered;
}

/**
 * Log alert to database
 */
async function logAlert(alert: AlertTrigger): Promise<void> {
  try {
    await supabase.from('alert_logs').insert({
      app_id: alert.appId,
      alert_type: alert.alertType,
      severity: alert.severity,
      message: alert.message,
      data: alert.data,
      triggered_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log alert:', error);
  }
}

/**
 * Send alert to owner
 */
export async function sendAlert(alert: AlertTrigger, email?: string): Promise<boolean> {
  try {
    const emailSubject =
      alert.severity === 'critical'
        ? `🚨 CRITICAL: ${alert.message}`
        : alert.severity === 'warning'
          ? `⚠️ WARNING: ${alert.message}`
          : `ℹ️ ${alert.message}`;

    // Send email if provided
    if (email) {
      await sendEmail({
        to: email,
        subject: emailSubject,
        html: `
          <h2>${alert.message}</h2>
          <p><strong>Alert Type:</strong> ${alert.alertType}</p>
          <p><strong>Severity:</strong> ${alert.severity}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <h3>Details:</h3>
          <pre>${JSON.stringify(alert.data, null, 2)}</pre>
          <p><a href="https://${alert.appId}.zyperia.ai/api/pipeline-status">View Dashboard</a></p>
        `,
      });
    }

    // Send webhook
    await sendWebhook({
      event: alert.severity === 'critical' ? 'error_alert' : 'stage_failed',
      appId: alert.appId,
      timestamp: new Date().toISOString(),
      data: {
        message: alert.message,
        alertType: alert.alertType,
        severity: alert.severity,
        ...alert.data,
      },
    });

    return true;
  } catch (error) {
    console.error('Failed to send alert:', error);
    return false;
  }
}

/**
 * Get alert history for an app
 */
export async function getAlertHistory(appId: string, days: number = 7) {
  try {
    const { data: logs } = await supabase
      .from('alert_logs')
      .select('*')
      .eq('app_id', appId)
      .gte('triggered_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('triggered_at', { ascending: false });

    return {
      appId,
      days,
      totalAlerts: logs?.length || 0,
      bySeverity: {
        critical: logs?.filter((l: any) => l.severity === 'critical').length || 0,
        warning: logs?.filter((l: any) => l.severity === 'warning').length || 0,
        info: logs?.filter((l: any) => l.severity === 'info').length || 0,
      },
      byType: logs?.reduce((acc: Record<string, number>, l: any) => {
        acc[l.alert_type] = (acc[l.alert_type] || 0) + 1;
        return acc;
      }, {}),
      logs: logs || [],
    };
  } catch (error) {
    console.error('Error getting alert history:', error);
    return null;
  }
}
