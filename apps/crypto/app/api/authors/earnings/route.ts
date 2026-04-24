export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const APP_ID = 'crypto'

interface EarningsData {
  totalEarnings: number
  articleEarnings: number
  affiliateEarnings: number
  referralEarnings: number
  thisMonthEarnings: number
  articleCount: number
  totalViews: number
  averageEarningsPerArticle: number
}

interface ArticleEarning {
  articleId: string
  title: string
  earnings: number
  views: number
  publishedAt: string
}

interface PaymentInfo {
  lastPaymentDate: string | null
  nextPaymentDate: string
  accountStatus: 'active' | 'pending' | 'suspended'
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }

    // Get author profile
    const { data: authorData, error: authorError } = await supabase
      .from('user_author_profiles')
      .select('id, name, verified')
      .eq('email', email)
      .eq('app_id', APP_ID)
      .single()

    if (authorError || !authorData) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      )
    }

    // Get all published articles by author
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, views, created_at, updated_at')
      .eq('author_id', authorData.id)
      .eq('status', 'published')
      .eq('app_id', APP_ID)
      .order('created_at', { ascending: false })

    if (articlesError) throw articlesError

    const articleIds = articles?.map(a => a.id) || []

    // Calculate article earnings (base on views: $0.02 per 1000 views)
    let articleEarnings = 0
    const articleEarningsBreakdown: ArticleEarning[] = []

    if (articleIds.length > 0) {
      for (const article of articles || []) {
        const earning = (article.views / 1000) * 0.02
        articleEarnings += earning

        articleEarningsBreakdown.push({
          articleId: article.id,
          title: article.title,
          earnings: Math.round(earning * 100) / 100,
          views: article.views,
          publishedAt: article.created_at,
        })
      }
    }

    // Get affiliate earnings
    const { data: affiliateData, error: affiliateError } = await supabase
      .from('affiliates')
      .select('commission_earned, referral_count, last_paid_at')
      .eq('email', email)
      .eq('app_id', APP_ID)
      .single()

    const affiliateEarnings = affiliateData?.commission_earned || 0

    // Get referral earnings (referral bonus: $5 per successful conversion)
    const { data: referralData, error: referralError } = await supabase
      .from('referral_tracking')
      .select('conversions')
      .eq('referrer_email', email)
      .eq('app_id', APP_ID)

    const referralEarnings = (referralData?.reduce((sum, r) => sum + (r.conversions || 0), 0) || 0) * 5

    // Calculate this month's earnings
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthArticleEarnings = articleEarningsBreakdown
      .filter(a => new Date(a.publishedAt) >= monthStart)
      .reduce((sum, a) => sum + a.earnings, 0)

    const thisMonthEarnings = monthArticleEarnings +
      (affiliateData?.commission_earned ? affiliateData.commission_earned * 0.3 : 0) +
      (referralData?.reduce((sum, r) => sum + (r.conversions || 0), 0) || 0) * 5

    // Prepare payment info
    const paymentInfo: PaymentInfo = {
      lastPaymentDate: affiliateData?.last_paid_at || null,
      nextPaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      accountStatus: 'active',
    }

    const totalEarnings = articleEarnings + affiliateEarnings + referralEarnings

    const earningsData: EarningsData = {
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      articleEarnings: Math.round(articleEarnings * 100) / 100,
      affiliateEarnings: Math.round(affiliateEarnings * 100) / 100,
      referralEarnings: Math.round(referralEarnings * 100) / 100,
      thisMonthEarnings: Math.round(thisMonthEarnings * 100) / 100,
      articleCount: articles?.length || 0,
      totalViews: articles?.reduce((sum, a) => sum + a.views, 0) || 0,
      averageEarningsPerArticle: articles?.length ?
        Math.round((articleEarnings / articles.length) * 100) / 100 : 0,
    }

    return NextResponse.json({
      author: {
        name: authorData.name,
        email,
        verified: authorData.verified,
      },
      earnings: earningsData,
      articles: articleEarningsBreakdown,
      payment: paymentInfo,
    })
  } catch (error) {
    console.error('Error fetching author earnings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch earnings data' },
      { status: 500 }
    )
  }
}
