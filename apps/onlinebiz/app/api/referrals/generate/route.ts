import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('email', email)
      .eq('app_id', 'onlinebiz')
      .single()

    if (existing) {
      return Response.json({ referralCode: existing }, { status: 200 })
    }

    const code = generateReferralCode()

    const { data, error } = await supabase
      .from('referral_codes')
      .insert({
        email,
        app_id: 'onlinebiz',
        code,
        clicks: 0,
        conversions: 0,
        earnings: 0,
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return Response.json({ referralCode: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error generating referral code:', error)
    return Response.json({ error: 'Failed to generate code' }, { status: 500 })
  }
}
