import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')
    const tag = searchParams.get('tag')

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', 'intelligence')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (q) {
      query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    }

    const { data: articles, error } = await query.limit(50)

    if (error) throw error

    let filtered = articles || []
    if (tag) {
      filtered = filtered.filter((article) =>
        article.tags && Array.isArray(article.tags) && article.tags.includes(tag)
      )
    }

    return Response.json({ articles: filtered }, { status: 200 })
  } catch (error) {
    console.error('Error searching articles:', error)
    return Response.json({ error: 'Failed to search articles' }, { status: 500 })
  }
}
