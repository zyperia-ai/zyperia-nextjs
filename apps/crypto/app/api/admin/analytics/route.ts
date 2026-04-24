import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, title, views, published_at, status')
      .eq('app_id', 'crypto')

    const { data: subscribers } = await supabase
      .from('newsletter_subscribers')
      .select('id, subscribed_at, status')
      .eq('app_id', 'crypto')

    const totalArticles = articles?.length || 0
    const publishedArticles = articles?.filter((a) => a.status === 'published').length || 0
    const totalViews = articles?.reduce((sum, a) => sum + (a.views || 0), 0) || 0
    const totalSubscribers = subscribers?.length || 0

    const topArticles = articles
      ?.sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5) || []

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentSubscribers =
      subscribers?.filter(
        (s) => new Date(s.subscribed_at) > thirtyDaysAgo && s.status === 'active'
      ).length || 0

    return Response.json(
      {
        metrics: {
          totalArticles,
          publishedArticles,
          totalViews,
          totalSubscribers,
          recentSubscribers,
          avgViewsPerArticle:
            publishedArticles > 0 ? Math.round(totalViews / publishedArticles) : 0,
        },
        topArticles,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
