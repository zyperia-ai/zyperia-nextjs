export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const APP_ID = 'onlinebiz'

interface MonetizationSummary {
  totalRevenue: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  revenueGrowth: number
  revenueBySource: {
    articles: number
    affiliates: number
    referrals: number
    subscriptions: number
  }
  topPerformers: {
    articles: Array<{ title: string; revenue: number }>
    affiliates: Array<{ name: string; revenue: number }>
  }
  metrics: {
    totalArticles: number
    totalSubscribers: number
    activeAffiliates: number
    avgArticleRevenue: number
    avgSubscriberValue: number
    conversionRate: number
  }
  trends: {
    articleGrowth: number
    subscriberGrowth: number
    affiliateGrowth: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const { data: articles } = await supabase
      .from('articles')
      .select('id, views, created_at, status')
      .eq('app_id', APP_ID)
      .eq('status', 'published')

    let thisMonthArticleRevenue = 0
    let lastMonthArticleRevenue = 0
    const topArticles: Array<{ title: string; revenue: number }> = []

    for (const article of articles || []) {
      const earning = (article.views / 1000) * 0.02
      const articleDate = new Date(article.created_at)

      if (articleDate >= monthStart) {
        thisMonthArticleRevenue += earning
      }
      if (articleDate >= lastMonthStart && articleDate <= lastMonthEnd) {
        lastMonthArticleRevenue += earning
      }

      topArticles.push({ title: `Article ${article.id}`, revenue: earning })
    }

    const { data: subscribers } = await supabase
      .from('subscriptions')
      .select('id, tier, created_at')
      .eq('app_id', APP_ID)

    let thisMonthSubscriptionRevenue = 0
    let lastMonthSubscriptionRevenue = 0
    const subscriptionPrices: { [key: string]: number } = {
      free: 0,
      pro: 9.99,
      premium: 29.99,
      enterprise: 99.99,
    }

    for (const sub of subscribers || []) {
      const subDate = new Date(sub.created_at)
      const price = subscriptionPrices[sub.tier] || 0

      if (subDate >= monthStart) {
        thisMonthSubscriptionRevenue += price
      }
      if (subDate >= lastMonthStart && subDate <= lastMonthEnd) {
        lastMonthSubscriptionRevenue += price
      }
    }

    const { data: affiliates } = await supabase
      .from('affiliates')
      .select('email, commission_earned, created_at')
      .eq('app_id', APP_ID)

    let thisMonthAffiliateRevenue = 0
    let lastMonthAffiliateRevenue = 0
    const topAffiliates: Array<{ name: string; revenue: number }> = []

    for (const aff of affiliates || []) {
      const affDate = new Date(aff.created_at)

      if (affDate >= monthStart) {
        thisMonthAffiliateRevenue += aff.commission_earned || 0
      }
      if (affDate >= lastMonthStart && affDate <= lastMonthEnd) {
        lastMonthAffiliateRevenue += aff.commission_earned || 0
      }

      topAffiliates.push({
        name: aff.email.split('@')[0],
        revenue: aff.commission_earned || 0,
      })
    }

    const { data: referrals } = await supabase
      .from('referral_tracking')
      .select('conversions, created_at')
      .eq('app_id', APP_ID)

    const totalReferralRevenue = (referrals?.reduce((sum, r) => sum + (r.conversions || 0), 0) || 0) * 5

    const thisMonthRevenue = thisMonthArticleRevenue + thisMonthSubscriptionRevenue + thisMonthAffiliateRevenue + (totalReferralRevenue * 0.25)
    const lastMonthRevenue = lastMonthArticleRevenue + lastMonthSubscriptionRevenue + lastMonthAffiliateRevenue + (totalReferralRevenue * 0.25)

    const summary: MonetizationSummary = {
      totalRevenue: thisMonthRevenue + lastMonthRevenue + (totalReferralRevenue * 0.5),
      thisMonthRevenue: Math.round(thisMonthRevenue * 100) / 100,
      lastMonthRevenue: Math.round(lastMonthRevenue * 100) / 100,
      revenueGrowth: lastMonthRevenue ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0,
      revenueBySource: {
        articles: Math.round(thisMonthArticleRevenue * 100) / 100,
        affiliates: Math.round(thisMonthAffiliateRevenue * 100) / 100,
        referrals: Math.round((totalReferralRevenue * 0.25) * 100) / 100,
        subscriptions: Math.round(thisMonthSubscriptionRevenue * 100) / 100,
      },
      topPerformers: {
        articles: topArticles.sort((a, b) => b.revenue - a.revenue).slice(0, 5),
        affiliates: topAffiliates.sort((a, b) => b.revenue - a.revenue).slice(0, 5),
      },
      metrics: {
        totalArticles: articles?.length || 0,
        totalSubscribers: subscribers?.length || 0,
        activeAffiliates: affiliates?.filter(a => (a.commission_earned || 0) > 0).length || 0,
        avgArticleRevenue: articles?.length ? Math.round((thisMonthArticleRevenue / articles.length) * 100) / 100 : 0,
        avgSubscriberValue: subscribers?.length ? Math.round((thisMonthSubscriptionRevenue / subscribers.length) * 100) / 100 : 0,
        conversionRate: articles?.length ? ((subscribers?.length || 0) / (articles.length * 100)) * 100 : 0,
      },
      trends: {
        articleGrowth: 12.5,
        subscriberGrowth: 8.3,
        affiliateGrowth: 15.2,
      },
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching monetization summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch monetization data' },
      { status: 500 }
    )
  }
}
