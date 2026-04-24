import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/articles/view
 * Track article views and engagement
 */

export async function POST(request: NextRequest) {
  try {
    const { articleId, articleSlug, appId, timestamp } = await request.json();

    if (!articleId || !appId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: On May 1st, update article views in database
    console.log('Article view tracked:', {
      articleId,
      articleSlug,
      appId,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for'),
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Article view tracking error:', error);
    // Don't fail on tracking errors
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  }
}
