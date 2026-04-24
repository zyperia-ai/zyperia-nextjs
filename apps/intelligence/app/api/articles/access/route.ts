import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const articleId = request.nextUrl.searchParams.get('article_id')

    if (!email || !articleId) {
      return Response.json(
        { error: 'Email and article_id required' },
        { status: 400 }
      )
    }

    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('tier')
      .eq('email', email)
      .eq('app_id', 'intelligence')
      .single()

    const userTier = subscription?.tier || 'free'

    const { data: article, error } = await supabase
      .from('blog_posts')
      .select('id, access_level')
      .eq('id', articleId)
      .eq('app_id', 'intelligence')
      .single()

    if (error) throw error
    if (!article) {
      return Response.json({ error: 'Article not found' }, { status: 404 })
    }

    const articleAccessLevel = article.access_level || 'free'

    const tierHierarchy = { free: 0, pro: 1, elite: 2 }
    const accessHierarchy = { free: 0, pro: 1, elite: 2 }

    const userLevel = tierHierarchy[userTier as keyof typeof tierHierarchy] || 0
    const requiredLevel = accessHierarchy[articleAccessLevel as keyof typeof accessHierarchy] || 0

    const hasAccess = userLevel >= requiredLevel

    return Response.json(
      {
        hasAccess,
        userTier,
        articleAccessLevel,
        message: hasAccess ? 'Access granted' : 'Upgrade required',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking access:', error)
    return Response.json({ error: 'Failed to check access' }, { status: 500 })
  }
}
