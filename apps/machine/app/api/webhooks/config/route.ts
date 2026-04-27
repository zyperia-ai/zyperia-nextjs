/**
 * Webhook Configuration API
 * Manage Slack, Discord, and custom webhook integrations
 * Usage: GET/POST /api/webhooks/config?appId=crypto&token=ADMIN_TOKEN
 */

import { registerWebhook } from '@/lib/webhook-manager';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('appId') || 'crypto';
    const token = url.searchParams.get('token');

    // Require admin token
    if (token !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get all webhooks for this app
    const { data: webhooks, error } = await getSupabase()
      .from('webhook_config')
      .select('id, webhook_type, webhook_url, events, enabled, last_tested_at, test_successful')
      .eq('app_id', appId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get recent webhook logs
    const { data: logs } = await getSupabase()
      .from('webhook_logs')
      .select('webhook_id, event_type, success, sent_at')
      .in(
        'webhook_id',
        webhooks?.map((w) => w.id) || []
      )
      .order('sent_at', { ascending: false })
      .limit(50);

    return new Response(
      JSON.stringify({
        appId,
        webhooks: webhooks || [],
        recentLogs: logs || [],
        totalWebhooks: webhooks?.length || 0,
        activeWebhooks: webhooks?.filter((w) => w.enabled).length || 0,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=300',
        },
      }
    );
  } catch (error) {
    console.error('Webhook config error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to get webhook configuration',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('appId') || 'crypto';
    const action = url.searchParams.get('action');
    const token = url.searchParams.get('token');

    // Require admin token
    if (token !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();

    if (action === 'register') {
      return registerWebhookConfig(appId, body);
    } else if (action === 'test') {
      return testWebhook(appId, body);
    } else if (action === 'delete') {
      return deleteWebhook(appId, body);
    } else {
      return new Response(
        JSON.stringify({
          error: 'Invalid action',
          actions: ['register', 'test', 'delete'],
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Webhook POST error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process webhook request',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function registerWebhookConfig(appId: string, body: any) {
  const { webhookUrl, webhookType, events } = body;

  if (!webhookUrl || !webhookType || !events) {
    return new Response(
      JSON.stringify({
        error: 'Missing required fields: webhookUrl, webhookType, events',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const success = await registerWebhook({
    appId,
    webhookUrl,
    webhookType,
    events: Array.isArray(events) ? events : [events],
    enabled: true,
  });

  if (!success) {
    return new Response(
      JSON.stringify({ error: 'Failed to register webhook' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: `Webhook registered for ${webhookType}`,
      appId,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

async function testWebhook(appId: string, body: any) {
  const { webhookId } = body;

  if (!webhookId) {
    return new Response(
      JSON.stringify({ error: 'Missing webhookId' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Get webhook config
    const { data: webhook } = await getSupabase()
      .from('webhook_config')
      .select('*')
      .eq('id', webhookId)
      .eq('app_id', appId)
      .single();

    if (!webhook) {
      return new Response(
        JSON.stringify({ error: 'Webhook not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Send test payload
    const testPayload =
      webhook.webhook_type === 'slack'
        ? {
            attachments: [
              {
                color: '0099ff',
                title: 'ðŸ§ª Test Notification',
                text: 'This is a test notification from ZYPERIA',
                footer: `ZYPERIA ${appId}`,
              },
            ],
          }
        : webhook.webhook_type === 'discord'
          ? {
              embeds: [
                {
                  title: 'ðŸ§ª Test Notification',
                  description: 'This is a test notification from ZYPERIA',
                  color: 52479,
                },
              ],
            }
          : { test: true, message: 'Test notification from ZYPERIA' };

    const response = await fetch(webhook.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    const success = response.ok;

    // Log the test
    await getSupabase().from('webhook_logs').insert({
      webhook_id: webhookId,
      event_type: 'test',
      payload: testPayload,
      response_status: response.status,
      response_body: await response.text(),
      success,
    });

    // Update last tested
    await getSupabase()
      .from('webhook_config')
      .update({
        last_tested_at: new Date().toISOString(),
        test_successful: success,
      })
      .eq('id', webhookId);

    return new Response(
      JSON.stringify({
        success,
        message: success
          ? 'Webhook test successful'
          : `Webhook test failed with status ${response.status}`,
        webhookId,
      }),
      {
        status: success ? 200 : 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Test failed',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function deleteWebhook(appId: string, body: any) {
  const { webhookId } = body;

  if (!webhookId) {
    return new Response(
      JSON.stringify({ error: 'Missing webhookId' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { error } = await getSupabase()
    .from('webhook_config')
    .delete()
    .eq('id', webhookId)
    .eq('app_id', appId);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Webhook deleted successfully',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

