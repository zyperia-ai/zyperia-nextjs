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
  const email = searchParams.get('email')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  // Get list of users that this user follows
  const { data: follows } = await supabase
    .from('user_follows')
    .select('following_email')
    .eq('app_id', APP_ID)
    .eq('follower_email', email)

  const followedEmails = follows?.map((f) => f.following_email) || []

  if (followedEmails.length === 0) {
    return NextResponse.json({
      articles: [],
      total: 0,
      limit,
      offset,
    })
  }

  // Get recent articles from followed users
  const { data: articles, error, count } = await supabase
    .from('blog_posts')
    .select('*, user_author_profiles(display_name, avatar_url)', { count: 'exact' })
    .eq('app_id', APP_ID)
    .eq('status', 'published')
    .in('author_email', followedEmails)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

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
