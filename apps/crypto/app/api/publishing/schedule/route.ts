import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/publishing/schedule?start_date=2026-05-01&end_date=2026-05-31
 *
 * Get scheduled articles for date range
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'start_date and end_date required' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, query Supabase
    // SELECT * FROM blog_posts
    // WHERE status = 'scheduled'
    // AND scheduled_for BETWEEN $1 AND $2
    // ORDER BY scheduled_for ASC

    // Mock data
    const scheduledArticles = [
      {
        id: '1',
        title: 'Bitcoin Trading Strategies',
        slug: 'bitcoin-trading-strategies',
        scheduled_for: '2026-05-01T09:00:00Z',
        category: 'Bitcoin',
        author_id: 'author-1',
        status: 'scheduled',
      },
      {
        id: '2',
        title: 'DeFi Security Best Practices',
        slug: 'defi-security-practices',
        scheduled_for: '2026-05-01T14:00:00Z',
        category: 'DeFi',
        author_id: 'author-2',
        status: 'scheduled',
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: scheduledArticles,
        count: scheduledArticles.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get schedule error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/publishing/schedule
 *
 * Schedule an article for publishing
 *
 * Body:
 * {
 *   article_id: string;
 *   scheduled_for: ISO string;
 *   notify_subscribers: boolean;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { article_id, scheduled_for, notify_subscribers } = body;

    if (!article_id || !scheduled_for) {
      return NextResponse.json(
        { success: false, message: 'article_id and scheduled_for required' },
        { status: 400 }
      );
    }

    // Validate date
    const scheduledDate = new Date(scheduled_for);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid scheduled_for date' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, update in Supabase
    // UPDATE blog_posts
    // SET status = 'scheduled', scheduled_for = $1, updated_at = NOW()
    // WHERE id = $2

    console.log('Article scheduled:', {
      article_id,
      scheduled_for,
      notify_subscribers,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Article scheduled successfully',
        scheduled_for,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Schedule article error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to schedule article' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/publishing/schedule
 *
 * Update scheduled article
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { article_id, scheduled_for } = body;

    if (!article_id || !scheduled_for) {
      return NextResponse.json(
        { success: false, message: 'article_id and scheduled_for required' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, update in Supabase
    // UPDATE blog_posts SET scheduled_for = $1, updated_at = NOW()
    // WHERE id = $2 AND status = 'scheduled'

    console.log('Update schedule:', { article_id, scheduled_for });

    return NextResponse.json(
      {
        success: true,
        message: 'Schedule updated',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update schedule error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/publishing/schedule?article_id=xxx
 *
 * Remove scheduled article
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('article_id');

    if (!articleId) {
      return NextResponse.json(
        { success: false, message: 'article_id required' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, update in Supabase
    // UPDATE blog_posts SET status = 'draft', scheduled_for = NULL
    // WHERE id = $1

    console.log('Remove schedule:', articleId);

    return NextResponse.json(
      { success: true, message: 'Schedule removed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove schedule error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove schedule' },
      { status: 500 }
    );
  }
}
