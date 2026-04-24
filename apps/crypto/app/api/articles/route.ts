import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/articles
 * List articles with filtering, searching, and pagination
 *
 * Query params:
 * - search: string (search in title/excerpt)
 * - category: string (filter by category)
 * - limit: number (default 10, max 100)
 * - offset: number (default 0)
 * - sortBy: 'date' | 'views' | 'engagement' (default 'date')
 *
 * Response:
 * {
 *   articles: Article[]
 *   total: number
 *   limit: number
 *   offset: number
 * }
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'date';

    // TODO: On May 1st, replace with real Supabase query
    // For now, return mock data
    const mockArticles = [
      {
        id: '1',
        slug: 'bitcoin-beginners-guide',
        title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
        excerpt: 'Learn the fundamentals of Bitcoin, how wallets work, and how to make your first purchase safely.',
        category: 'Bitcoin',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        readingTime: 8,
        views: 1250,
        engagement_score: 0.75,
        author: 'Crypto Expert',
      },
      {
        id: '2',
        slug: 'ethereum-smart-contracts',
        title: 'Understanding Ethereum Smart Contracts: A Technical Deep Dive',
        excerpt: 'Explore how smart contracts work, their applications in DeFi, and security best practices.',
        category: 'Ethereum',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        readingTime: 12,
        views: 890,
        engagement_score: 0.82,
        author: 'Crypto Expert',
      },
    ];

    // Apply filters
    let filtered = mockArticles;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(lowerSearch) ||
          a.excerpt.toLowerCase().includes(lowerSearch)
      );
    }

    if (category) {
      filtered = filtered.filter((a) => a.category === category);
    }

    // Sort
    if (sortBy === 'views') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'engagement') {
      filtered.sort((a, b) => b.engagement_score - a.engagement_score);
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    // Paginate
    const total = filtered.length;
    const articles = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      articles,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
