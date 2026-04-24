export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const APP_ID = 'intelligence'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const tag = searchParams.get('tag')
  const author = searchParams.get('author')
  const dateFrom = searchParams.get('from')
  const dateTo = searchParams.get('to')
  const sortBy = searchParams.get('sort') || 'published_at'
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let baseQuery = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('app_id', APP_ID)
    .eq('status', 'published')

  // Text search
  if (query.trim()) {
    baseQuery = baseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
    )
  }

  // Tag filter (via article_tags table)
  if (tag) {
    const { data: articleIds } = await supabase
      .from('article_tags')
      .select('article_id')
      .eq('app_id', APP_ID)
      .eq('tag', tag.toLowerCase())

    const ids = articleIds?.map((a) => a.article_id) || []
    if (ids.length > 0) {
      baseQuery = baseQuery.in('id', ids)
    } else {
      return NextResponse.json({ articles: [], total: 0 })
    }
  }

  // Author filter
  if (author) {
    baseQuery = baseQuery.eq('author_email', author)
  }

  // Date range filter
  if (dateFrom) {
    baseQuery = baseQuery.gte('published_at', dateFrom)
  }
  if (dateTo) {
    baseQuery = baseQuery.lte('published_at', dateTo)
  }

  // Sort
  const sortMap: Record<string, boolean> = {
    published_at: false,
    views: false,
    title: true,
  }
  const ascending = sortMap[sortBy] ?? false
  baseQuery = baseQuery.order(sortBy, { ascending })

  // Pagination
  baseQuery = baseQuery.range(offset, offset + limit - 1)

  const { data: articles, error, count } = await baseQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    articles: articles || [],
    total: count || 0,
    limit,
    offset,
  })
}
