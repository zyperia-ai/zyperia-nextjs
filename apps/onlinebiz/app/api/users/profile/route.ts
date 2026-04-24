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

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .eq('app_id', 'onlinebiz')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    if (!profile) {
      return Response.json(
        { profile: null, subscriber: null },
        { status: 200 }
      )
    }

    const { data: subscriber } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .eq('app_id', 'onlinebiz')
      .single()

    return Response.json({ profile, subscriber }, { status: 200 })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, preferences } = body

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        email,
        app_id: 'onlinebiz',
        name: name || '',
        preferences: preferences || {},
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return Response.json({ profile: data[0] }, { status: 200 })
  } catch (error) {
    console.error('Error updating profile:', error)
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
