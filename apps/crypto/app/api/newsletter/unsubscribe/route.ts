import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/newsletter/unsubscribe?token=xxx
 *
 * Unsubscribe using secure token
 *
 * Query params:
 * - token: string (unsubscribe token)
 *
 * Response:
 * {
 *   success: boolean;
 *   message: string;
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Invalid unsubscribe link' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, decode token and unsubscribe
    // Unsubscribe tokens typically contain email in encoded format
    // SELECT * FROM subscribers WHERE unsubscribe_token = $1
    // If found: UPDATE status = 'unsubscribed', unsubscribed_at = NOW()

    console.log('Unsubscribe request:', { token });

    return NextResponse.json(
      {
        success: true,
        message: 'You have been unsubscribed',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process unsubscribe' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/newsletter/unsubscribe
 *
 * Unsubscribe using email (requires confirmation)
 *
 * Request body:
 * {
 *   email: string;
 *   app_id: string;
 *   reason?: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, app_id, reason } = body;

    if (!email || !app_id) {
      return NextResponse.json(
        { success: false, message: 'Email and app_id are required' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, mark as unsubscribed
    // UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = NOW(),
    // unsubscribe_reason = $3
    // WHERE email = $1 AND app_id = $2

    console.log('Unsubscribe request:', { email, app_id, reason });

    return NextResponse.json(
      {
        success: true,
        message: 'You have been unsubscribed',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process unsubscribe' },
      { status: 500 }
    );
  }
}
