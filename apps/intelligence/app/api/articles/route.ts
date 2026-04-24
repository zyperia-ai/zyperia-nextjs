import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', 'intelligence')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return Response.json({ articles }, { status: 200 })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return Response.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}
