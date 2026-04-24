import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { referralCode, eventType, amount } = body

    if (!referralCode || !eventType) {
      return Response.json(
        { error: 'Referral code and event type required' },
        { status: 400 }
      )
    }

    // Get the referral code
    const { data: referral, error: refError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', referralCode)
      .eq('app_id', 'crypto')
      .single()

    if (refError || !referral) {
      return Response.json({ error: 'Referral code not found' }, { status: 404 })
    }

    // Update referral stats
    const updates: any = {}
    if (eventType === 'click') {
      updates.clicks = (referral.clicks || 0) + 1
    } else if (eventType === 'conversion') {
      updates.conversions = (referral.conversions || 0) + 1
      updates.earnings = (referral.earnings || 0) + (amount || 0)
    }

    const { data, error } = await supabase
      .from('referral_codes')
      .update(updates)
      .eq('code', referralCode)
      .eq('app_id', 'crypto')
      .select()

    if (error) throw error

    // Track in referral events
    await supabase.from('referral_events').insert({
      app_id: 'crypto',
      referral_code: referralCode,
      event_type: eventType,
      amount: amount || 0,
      tracked_at: new Date().toISOString(),
    })

    return Response.json({ referral: data[0] }, { status: 200 })
  } catch (error) {
    console.error('Error tracking referral:', error)
    return Response.json({ error: 'Failed to track referral' }, { status: 500 })
  }
}
