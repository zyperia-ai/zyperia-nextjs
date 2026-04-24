import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { data: article, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', 'intelligence')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) throw error
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 })

    // Increment view count
    await supabase
      .from('blog_posts')
      .update({ views: (article.views || 0) + 1 })
      .eq('id', article.id)

    return Response.json({ article }, { status: 200 })
  } catch (error) {
    console.error('Error fetching article:', error)
    return Response.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}
