/**
 * GET /api/affiliate/click?id=xxx&ref=xxx
 * Track affiliate link click and redirect to affiliate URL
 *
 * Query params:
 * - id: affiliate_links.tracking_id (required)
 * - ref: referrer context (optional)
 * - s: session_id (optional)
 *
 * Behavior:
 * 1. Look up affiliate link by tracking_id
 * 2. Log click to affiliate_clicks table with metadata
 * 3. Redirect to affiliate_platforms.affiliate_url
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');
    const sessionId = searchParams.get('s');
    const referrer = searchParams.get('ref') || request.headers.get('referer') || 'direct';

    if (!trackingId) {
      return Response.json(
        { error: 'Missing tracking ID' },
        { status: 400 }
      );
    }

    // Get affiliate link details
    const { data: link, error: linkError } = await supabase
      .from('affiliate_links')
      .select(`
        id,
        post_id,
        platform_id,
        affiliate_platforms (
          affiliate_url
        )
      `)
      .eq('tracking_id', trackingId)
      .single();

    if (linkError || !link) {
      console.error('Affiliate link not found:', trackingId);
      return Response.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Log the click
    const { error: clickError } = await supabase.from('affiliate_clicks').insert({
      link_id: link.id,
      post_id: link.post_id,
      platform_id: link.platform_id,
      user_ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      referrer,
      session_id: sessionId || undefined,
    });

    if (clickError) {
      console.error('Failed to log affiliate click:', clickError);
      // Don't fail the redirect, still send user to affiliate URL
    }

    // Redirect to affiliate URL
    const affiliateUrl = link.affiliate_platforms?.affiliate_url;
    if (!affiliateUrl) {
      return Response.json(
        { error: 'Affiliate URL not found' },
        { status: 404 }
      );
    }

    return Response.redirect(affiliateUrl, 302);
  } catch (error) {
    console.error('Affiliate click error:', error);
    return Response.json(
      { error: 'Failed to process affiliate link' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/affiliate/click (alternative for tracking)
 * Log affiliate click with conversion data (called from client after conversion)
 *
 * Body:
 * {
 *   tracking_id: string (required)
 *   conversion_id?: string (order ID, user ID, etc.)
 *   conversion_value?: number (revenue amount)
 * }
 */
export async function POST(request: Request) {
  try {
    const { tracking_id, conversion_id, conversion_value } = await request.json();

    if (!tracking_id) {
      return Response.json(
        { error: 'Missing tracking_id' },
        { status: 400 }
      );
    }

    // Find most recent click for this link (within cookie window, typically 30-90 days)
    const { data: links, error: linkError } = await supabase
      .from('affiliate_links')
      .select('id, platform_id')
      .eq('tracking_id', tracking_id)
      .single();

    if (linkError || !links) {
      return Response.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Update most recent click with conversion data
    const { error: updateError } = await supabase
      .from('affiliate_clicks')
      .update({
        conversion_id,
        converted_at: new Date().toISOString(),
        conversion_value,
      })
      .eq('link_id', links.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (updateError) {
      console.error('Failed to log conversion:', updateError);
      return Response.json(
        { error: 'Failed to log conversion' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Conversion logged',
    });
  } catch (error) {
    console.error('Affiliate conversion error:', error);
    return Response.json(
      { error: 'Failed to process conversion' },
      { status: 500 }
    );
  }
}
