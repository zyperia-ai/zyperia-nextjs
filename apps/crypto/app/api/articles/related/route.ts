import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const articleId = request.nextUrl.searchParams.get('article_id')
    const limit = request.nextUrl.searchParams.get('limit') || '5'

    if (!articleId) {
      return Response.json({ error: 'Article ID required' }, { status: 400 })
    }

    // Get the current article to find its tags
    const { data: currentArticle, error: articleError } = await supabase
      .from('blog_posts')
      .select('tags')
      .eq('id', articleId)
      .eq('app_id', 'crypto')
      .single()

    if (articleError) throw articleError
    if (!currentArticle) {
      return Response.json({ error: 'Article not found' }, { status: 404 })
    }

    const tags = currentArticle.tags || []

    // Get all published articles
    const { data: allArticles, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', 'crypto')
      .eq('status', 'published')
      .neq('id', articleId)

    if (error) throw error

    // Score articles based on tag overlap
    const scoredArticles = (allArticles || [])
      .map((article) => {
        const articleTags = article.tags || []
        const commonTags = articleTags.filter((tag: string) =>
          tags.includes(tag)
        ).length
        return { ...article, score: commonTags }
      })
      .filter((article) => article.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit))

    return Response.json({ articles: scoredArticles }, { status: 200 })
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return Response.json(
      { error: 'Failed to fetch related articles' },
      { status: 500 }
    )
  }
}
