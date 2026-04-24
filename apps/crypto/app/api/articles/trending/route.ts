import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const timeRange = request.nextUrl.searchParams.get('range') || '7d'
    const limit = request.nextUrl.searchParams.get('limit') || '10'

    // Calculate date range
    let daysBack = 7
    if (timeRange === '24h') daysBack = 1
    if (timeRange === '30d') daysBack = 30

    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - daysBack)

    // Get most viewed articles in time range
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', 'crypto')
      .eq('status', 'published')
      .gte('published_at', fromDate.toISOString())
      .order('views', { ascending: false })
      .limit(parseInt(limit))

    if (error) throw error

    return Response.json({ articles: articles || [] }, { status: 200 })
  } catch (error) {
    console.error('Error fetching trending articles:', error)
    return Response.json({ error: 'Failed to fetch trending articles' }, { status: 500 })
  }
}
