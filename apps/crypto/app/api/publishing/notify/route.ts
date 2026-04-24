import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/publishing/notify
 *
 * Send email notification to subscribers when a new article is published
 *
 * Body:
 * {
 *   article_id: string;
 *   article_title: string;
 *   article_slug: string;
 *   excerpt: string;
 *   featured_image_url?: string;
 *   app_id: 'crypto' | 'intelligence' | 'onlinebiz';
 *   theme_colors: { primary: string; accent: string };
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      article_id,
      article_title,
      article_slug,
      excerpt,
      featured_image_url,
      app_id,
      theme_colors,
    } = body;

    if (!article_id || !article_title || !article_slug || !app_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, fetch subscribers for this app
    // SELECT email FROM newsletter_subscriptions
    // WHERE status = 'confirmed'
    // AND ${app_id} = true
    //
    // Then send email to each subscriber using Resend API

    const mockSubscribers = [
      { email: 'subscriber1@example.com', name: 'John' },
      { email: 'subscriber2@example.com', name: 'Jane' },
    ];

    const baseUrl =
      app_id === 'crypto'
        ? 'https://crypto.zyperia.ai'
        : app_id === 'intelligence'
          ? 'https://intelligence.zyperia.ai'
          : 'https://earn-online.zyperia.ai';

    const articleUrl = `${baseUrl}/articles/${article_slug}`;

    console.log('Publishing notification:', {
      article_id,
      article_title,
      app_id,
      subscriber_count: mockSubscribers.length,
    });

    // TODO: Send emails to subscribers
    // Use email template with article details
    // Include: title, excerpt, featured image, read more link
    // Track email opens and clicks

    return NextResponse.json(
      {
        success: true,
        message: `Notification sent to ${mockSubscribers.length} subscribers`,
        article_url: articleUrl,
        subscribers_notified: mockSubscribers.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Publishing notification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/publishing/notify?article_id=xxx
 *
 * Get notification status for an article
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('article_id');

    if (!articleId) {
      return NextResponse.json(
        { success: false, message: 'Missing article_id' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, fetch notification status from Supabase
    // SELECT notification_sent_at, email_opens, email_clicks
    // FROM publishing_notifications
    // WHERE article_id = $1

    return NextResponse.json(
      {
        success: true,
        data: {
          article_id: articleId,
          notification_sent_at: null,
          subscribers_notified: 0,
          email_opens: 0,
          email_clicks: 0,
          open_rate: 0,
          click_rate: 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get notification status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notification status' },
      { status: 500 }
    );
  }
}
