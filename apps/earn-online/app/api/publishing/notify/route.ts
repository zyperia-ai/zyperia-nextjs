import { NextRequest, NextResponse } from 'next/server';

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

    const mockSubscribers = [
      { email: 'subscriber1@example.com', name: 'John' },
      { email: 'subscriber2@example.com', name: 'Jane' },
    ];

    const baseUrl = 'https://earn-online.zyperia.ai';
    const articleUrl = `${baseUrl}/articles/${article_slug}`;

    console.log('Publishing notification:', {
      article_id,
      article_title,
      app_id,
      subscriber_count: mockSubscribers.length,
    });

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
