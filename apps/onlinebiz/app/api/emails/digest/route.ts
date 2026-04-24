import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, frequency } = body

    if (!email || !frequency) {
      return Response.json(
        { error: 'Email and frequency required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('email_preferences')
      .upsert({
        email,
        app_id: 'onlinebiz',
        digest_frequency: frequency,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return Response.json(
      { message: 'Digest preference updated', preference: data[0] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating digest preference:', error)
    return Response.json({ error: 'Failed to update preference' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    const { data: preference } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('email', email)
      .eq('app_id', 'onlinebiz')
      .single()

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: topArticles } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', 'onlinebiz')
      .eq('status', 'published')
      .gte('published_at', sevenDaysAgo.toISOString())
      .order('views', { ascending: false })
      .limit(5)

    return Response.json(
      {
        preference,
        topArticles: topArticles || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching digest:', error)
    return Response.json({ error: 'Failed to fetch digest' }, { status: 500 })
  }
}
