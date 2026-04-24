import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('app_id', 'intelligence')
      .eq('status', 'published')

    if (error) throw error

    const tagsSet = new Set<string>()
    articles?.forEach((article) => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag: string) => tagsSet.add(tag))
      }
    })

    const categories = Array.from(tagsSet).sort()

    return Response.json({ categories }, { status: 200 })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
