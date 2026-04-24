export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('revenue_events')
      .select('*')
      .eq('app_id', 'crypto')

    if (error) throw error

    const totalRevenue = events?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0
    const conversionCount = events?.filter((e) => e.event_type === 'conversion').length || 0
    const clickCount = events?.filter((e) => e.event_type === 'click').length || 0
    const affiliateCount = events?.filter((e) => e.affiliate_code).length || 0

    // Revenue by affiliate
    const affiliateRevenue: { [key: string]: number } = {}
    events?.forEach((event) => {
      if (event.affiliate_code) {
        affiliateRevenue[event.affiliate_code] =
          (affiliateRevenue[event.affiliate_code] || 0) + (event.amount || 0)
      }
    })

    // Revenue by article
    const articleRevenue: { [key: string]: number } = {}
    events?.forEach((event) => {
      if (event.article_id) {
        articleRevenue[event.article_id] =
          (articleRevenue[event.article_id] || 0) + (event.amount || 0)
      }
    })

    const topAffiliates = Object.entries(affiliateRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([code, revenue]) => ({ code, revenue }))

    return Response.json(
      {
        metrics: {
          totalRevenue,
          conversionCount,
          clickCount,
          affiliateCount,
          conversionRate:
            clickCount > 0 ? Math.round((conversionCount / clickCount) * 100) : 0,
        },
        topAffiliates,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching revenue stats:', error)
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
