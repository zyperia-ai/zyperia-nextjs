import { NextRequest, NextResponse } from 'next/server';
import { decodeAffiliateLink } from '@zyperia/shared-lib';

/**
 * POST /api/affiliate/track
 *
 * Track affiliate link clicks and conversions
 *
 * Body:
 * {
 *   link_id: string;
 *   article_id: string;
 *   program_id: string;
 *   converted: boolean;
 *   conversion_value?: number;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { link_id, article_id, program_id, converted, conversion_value } = body;

    if (!link_id || !article_id || !program_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, log to Supabase
    // INSERT INTO affiliate_clicks (
    //   link_id, article_id, program_id, timestamp,
    //   ip_address, user_agent, referrer, converted, conversion_value
    // ) VALUES (...)

    console.log('Affiliate click tracked:', {
      link_id,
      article_id,
      program_id,
      converted,
      conversion_value,
      ip: request.headers.get('x-forwarded-for'),
      user_agent: request.headers.get('user-agent'),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Click tracked',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Affiliate tracking error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track click' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/affiliate/track?code=xxx
 *
 * Decode and return tracking data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Missing code parameter' },
        { status: 400 }
      );
    }

    const decoded = decodeAffiliateLink(code);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid tracking code' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: decoded,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Decode tracking code error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to decode tracking code' },
      { status: 500 }
    );
  }
}
