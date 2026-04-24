import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('email', email)
      .eq('app_id', 'intelligence')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    if (!subscription) {
      return Response.json({
        subscription: {
          email,
          app_id: 'intelligence',
          tier: 'free',
          status: 'active',
          current_period_start: null,
          current_period_end: null,
        },
      })
    }

    return Response.json({ subscription }, { status: 200 })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return Response.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, tier } = body

    if (!email || !tier) {
      return Response.json({ error: 'Email and tier required' }, { status: 400 })
    }

    const now = new Date()
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const { data, error } = await supabase
      .from('user_subscriptions')
      .upsert({
        email,
        app_id: 'intelligence',
        tier,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .select()

    if (error) throw error

    return Response.json({ subscription: data[0] }, { status: 200 })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return Response.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}
