/**
 * Webhook Manager
 * Sends notifications to Slack, Discord, and custom webhooks
 * Integrates with pipeline stages for real-time alerts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface WebhookConfig {
  appId: string;
  webhookUrl: string;
  webhookType: 'slack' | 'discord' | 'custom';
  events: WebhookEvent[];
  enabled: boolean;
}

export type WebhookEvent =
  | 'article_published'
  | 'article_generated'
  | 'stage_completed'
  | 'stage_failed'
  | 'high_revenue'
  | 'high_traffic'
  | 'ranking_improved'
  | 'backlink_acquired'
  | 'error_alert';

export interface WebhookPayload {
  event: WebhookEvent;
  appId: string;
  timestamp: string;
  data: Record<string, any>;
}

/**
 * Send webhook notification
 */
export async function sendWebhook(payload: WebhookPayload): Promise<boolean> {
  try {
    // Get configured webhooks for this app
    const { data: webhooks } = await supabase
      .from('webhook_config')
      .select('*')
      .eq('app_id', payload.appId)
      .eq('enabled', true);

    if (!webhooks || webhooks.length === 0) {
      return false;
    }

    let successCount = 0;

    for (const webhook of webhooks) {
      // Check if webhook is configured for this event type
      if (!webhook.events.includes(payload.event)) {
        continue;
      }

      try {
        const formatted =
          webhook.webhookType === 'slack'
            ? formatSlackWebhook(payload)
            : webhook.webhookType === 'discord'
              ? formatDiscordWebhook(payload)
              : payload;

        const response = await fetch(webhook.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formatted),
        });

        if (response.ok) {
          successCount++;
        }
      } catch (error) {
        console.error(`Failed to send ${webhook.webhookType} webhook:`, error);
      }
    }

    return successCount > 0;
  } catch (error) {
    console.error('Error sending webhooks:', error);
    return false;
  }
}

/**
 * Format payload for Slack
 */
function formatSlackWebhook(payload: WebhookPayload) {
  const colors: Record<WebhookEvent, string> = {
    article_published: '#36a64f',
    article_generated: '#0099ff',
    stage_completed: '#36a64f',
    stage_failed: '#ff0000',
    high_revenue: '#ffa500',
    high_traffic: '#0099ff',
    ranking_improved: '#36a64f',
    backlink_acquired: '#9933ff',
    error_alert: '#ff0000',
  };

  const titles: Record<WebhookEvent, string> = {
    article_published: '📄 Article Published',
    article_generated: '✍️ Article Generated',
    stage_completed: '✅ Stage Completed',
    stage_failed: '❌ Stage Failed',
    high_revenue: '💰 High Revenue',
    high_traffic: '📈 High Traffic',
    ranking_improved: '📊 Ranking Improved',
    backlink_acquired: '🔗 Backlink Acquired',
    error_alert: '⚠️ Error Alert',
  };

  return {
    attachments: [
      {
        color: colors[payload.event],
        title: titles[payload.event],
        text: payload.data.message || JSON.stringify(payload.data),
        fields: Object.entries(payload.data).map(([key, value]) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          value: String(value),
          short: true,
        })),
        footer: `ZYPERIA ${payload.appId}`,
        ts: Math.floor(new Date(payload.timestamp).getTime() / 1000),
      },
    ],
  };
}

/**
 * Format payload for Discord
 */
function formatDiscordWebhook(payload: WebhookPayload) {
  const colors: Record<WebhookEvent, number> = {
    article_published: 3381759, // Green
    article_generated: 52479, // Blue
    stage_completed: 3381759, // Green
    stage_failed: 15158332, // Red
    high_revenue: 16776960, // Orange
    high_traffic: 52479, // Blue
    ranking_improved: 3381759, // Green
    backlink_acquired: 9662975, // Purple
    error_alert: 15158332, // Red
  };

  const titles: Record<WebhookEvent, string> = {
    article_published: '📄 Article Published',
    article_generated: '✍️ Article Generated',
    stage_completed: '✅ Stage Completed',
    stage_failed: '❌ Stage Failed',
    high_revenue: '💰 High Revenue',
    high_traffic: '📈 High Traffic',
    ranking_improved: '📊 Ranking Improved',
    backlink_acquired: '🔗 Backlink Acquired',
    error_alert: '⚠️ Error Alert',
  };

  return {
    embeds: [
      {
        title: titles[payload.event],
        description: payload.data.message || JSON.stringify(payload.data),
        color: colors[payload.event],
        fields: Object.entries(payload.data)
          .slice(0, 25) // Discord limit
          .map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: String(value),
            inline: true,
          })),
        footer: {
          text: `ZYPERIA ${payload.appId}`,
        },
        timestamp: payload.timestamp,
      },
    ],
  };
}

/**
 * Register new webhook
 */
export async function registerWebhook(config: WebhookConfig): Promise<boolean> {
  try {
    const { error } = await supabase.from('webhook_config').insert({
      app_id: config.appId,
      webhook_url: config.webhookUrl,
      webhook_type: config.webhookType,
      events: config.events,
      enabled: config.enabled,
      created_at: new Date().toISOString(),
    });

    return !error;
  } catch (error) {
    console.error('Error registering webhook:', error);
    return false;
  }
}

/**
 * Send article published notification
 */
export async function notifyArticlePublished(
  appId: string,
  article: {
    id: string;
    title: string;
    slug: string;
    approach: string;
    readTime: number;
  }
) {
  return sendWebhook({
    event: 'article_published',
    appId,
    timestamp: new Date().toISOString(),
    data: {
      message: `New article published: "${article.title}"`,
      title: article.title,
      slug: article.slug,
      approach: article.approach,
      read_time: `${article.readTime} min`,
      url: `/articles/${article.slug}`,
    },
  });
}

/**
 * Send stage failure alert
 */
export async function notifyStageFailed(appId: string, stage: string, error: string) {
  return sendWebhook({
    event: 'stage_failed',
    appId,
    timestamp: new Date().toISOString(),
    data: {
      message: `⚠️ Stage failed: ${stage}`,
      stage,
      error: error.substring(0, 200),
    },
  });
}

/**
 * Send high revenue alert
 */
export async function notifyHighRevenue(
  appId: string,
  data: {
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
  }
) {
  return sendWebhook({
    event: 'high_revenue',
    appId,
    timestamp: new Date().toISOString(),
    data: {
      message: `💰 Strong revenue day: €${data.todayRevenue}`,
      today: `€${data.todayRevenue}`,
      week: `€${data.weekRevenue}`,
      month: `€${data.monthRevenue}`,
    },
  });
}

/**
 * Send backlink acquired alert
 */
export async function notifyBacklinkAcquired(
  appId: string,
  data: {
    sourceDomain: string;
    targetArticle: string;
    linkType: string;
  }
) {
  return sendWebhook({
    event: 'backlink_acquired',
    appId,
    timestamp: new Date().toISOString(),
    data: {
      message: `🔗 New backlink acquired from ${data.sourceDomain}`,
      source_domain: data.sourceDomain,
      target_article: data.targetArticle,
      link_type: data.linkType,
    },
  });
}

/**
 * Send ranking improvement alert
 */
export async function notifyRankingImproved(
  appId: string,
  data: {
    keyword: string;
    previousRank: number;
    newRank: number;
    improvement: number;
  }
) {
  return sendWebhook({
    event: 'ranking_improved',
    appId,
    timestamp: new Date().toISOString(),
    data: {
      message: `📊 Ranking improved: "${data.keyword}" (#${data.previousRank} → #${data.newRank})`,
      keyword: data.keyword,
      previous_rank: data.previousRank,
      new_rank: data.newRank,
      improvement: `+${data.improvement} positions`,
    },
  });
}
