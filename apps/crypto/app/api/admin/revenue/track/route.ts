import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, article_id, event_type, amount, affiliate_code } = body

    if (!email || !event_type) {
      return Response.json(
        { error: 'Email and event_type required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('revenue_events')
      .insert({
        app_id: 'crypto',
        email,
        article_id: article_id || null,
        event_type,
        amount: amount || 0,
        affiliate_code: affiliate_code || null,
        tracked_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return Response.json({ event: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error tracking revenue event:', error)
    return Response.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
