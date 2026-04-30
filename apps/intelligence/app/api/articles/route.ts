import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const tag = searchParams.get('tag')
    const q = searchParams.get('q')
    const sort = searchParams.get('sort') || 'newest'

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('app_id', 'intelligence')
      .eq('status', 'published')

    if (tag) query = query.contains('keywords', [tag])
    if (q) query = query.ilike('title', `%${q}%`)
    if (sort === 'popular') query = query.order('views', { ascending: false })
    else query = query.order('published_at', { ascending: false })

    query = query.range(offset, offset + limit - 1)

    const { data: articles, count, error } = await query

    if (error) throw error

    return Response.json({ articles: articles || [], total: count || 0 }, { status: 200 })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return Response.json({ error: 'Failed to fetch articles', articles: [], total: 0 }, { status: 500 })
  }
}
