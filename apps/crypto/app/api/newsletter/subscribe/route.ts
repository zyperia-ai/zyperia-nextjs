import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 })
    }

    const { data: existing, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .eq('app_id', 'crypto')
      .single()

    if (existing) {
      return Response.json({ error: 'Already subscribed' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        app_id: 'crypto',
        subscribed_at: new Date().toISOString(),
        status: 'active',
      })
      .select()

    if (error) throw error

    return Response.json(
      { message: 'Successfully subscribed', data: data[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return Response.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
