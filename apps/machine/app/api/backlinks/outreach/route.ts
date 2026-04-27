/**
 * Backlink Outreach Management API
 * Track and manage outreach campaigns
 * Usage: GET /api/backlinks/outreach?appId=crypto&action=status|start|track
 */

import { generateOutreachMessage, trackBacklinkAcquired } from '@/lib/backlink-hunter';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('appId') || 'crypto';
    const action = url.searchParams.get('action') || 'status';

    if (action === 'status') {
      return getOutreachStatus(appId);
    } else if (action === 'campaign') {
      return getCampaignDetails(appId);
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action', actions: ['status', 'campaign'] }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Outreach error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to get outreach status',
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
    const action = url.searchParams.get('action');
    const token = url.searchParams.get('token');

    // Require admin token for write operations
    if (token !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();

    if (action === 'track-backlink') {
      return trackBacklink(body);
    } else if (action === 'start-campaign') {
      return startOutreachCampaign(body);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Outreach POST error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process outreach request',
        message: (error as Error).message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function getOutreachStatus(appId: string) {
  const { data: outreach } = await supabase
    .from('backlink_outreach')
    .select('status')
    .eq('app_id', appId);

  const statusCounts = {
    pending: 0,
    sent: 0,
    responded: 0,
    rejected: 0,
    linked: 0,
  };

  outreach?.forEach((o: any) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  const totalSent = statusCounts.sent + statusCounts.responded + statusCounts.linked;
  const responseRate = totalSent > 0 ? ((statusCounts.responded + statusCounts.linked) / totalSent) * 100 : 0;

  return new Response(
    JSON.stringify({
      appId,
      timestamp: new Date().toISOString(),
      outreach: statusCounts,
      totalOutreachSent: totalSent,
      responseRate: Math.round(responseRate),
      backlinksAcquired: statusCounts.linked,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300',
      },
    }
  );
}

async function getCampaignDetails(appId: string) {
  const { data: campaigns } = await supabase
    .from('backlink_campaigns')
    .select('*')
    .eq('app_id', appId)
    .order('created_at', { ascending: false });

  return new Response(JSON.stringify({ appId, campaigns: campaigns || [] }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=300',
    },
  });
}

async function trackBacklink(body: any) {
  const { opportunityId, backlink_url, appId } = body;

  if (!opportunityId || !backlink_url || !appId) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: opportunityId, backlink_url, appId' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  await trackBacklinkAcquired(opportunityId, backlink_url, new Date().toISOString());

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Backlink tracked successfully',
      opportunityId,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

async function startOutreachCampaign(body: any) {
  const { appId, prospectIds } = body;

  if (!appId || !prospectIds || prospectIds.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Missing appId or prospectIds' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Create campaign record
  const { data: campaign, error } = await supabase
    .from('backlink_campaigns')
    .insert({
      app_id: appId,
      prospect_count: prospectIds.length,
      status: 'started',
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create campaign', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: `Outreach campaign started for ${prospectIds.length} prospects`,
      campaignId: campaign.id,
      appId,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
