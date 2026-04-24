import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const limit = request.nextUrl.searchParams.get('limit') || '5'

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    const { data: history } = await supabase
      .from('reading_history')
      .select('article_id')
      .eq('email', email)
      .eq('app_id', 'onlinebiz')
      .limit(10)

    const readArticleIds = history?.map((h) => h.article_id) || []

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', 'onlinebiz')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(parseInt(limit) + 5)

    const { data: recommendations, error } = await query

    if (error) throw error

    const filtered = (recommendations || [])
      .filter((article) => !readArticleIds.includes(article.id))
      .slice(0, parseInt(limit))

    return Response.json({ recommendations: filtered }, { status: 200 })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return Response.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}
