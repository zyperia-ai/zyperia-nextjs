export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const limit = request.nextUrl.searchParams.get('limit') || '20'

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    const { data: history, error } = await supabase
      .from('reading_history')
      .select('*')
      .eq('email', email)
      .eq('app_id', 'onlinebiz')
      .order('read_at', { ascending: false })
      .limit(parseInt(limit))

    if (error) throw error

    return Response.json({ history: history || [] }, { status: 200 })
  } catch (error) {
    console.error('Error fetching reading history:', error)
    return Response.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, article_id, read_time } = body

    if (!email || !article_id) {
      return Response.json(
        { error: 'Email and article_id required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('reading_history')
      .upsert({
        email,
        app_id: 'onlinebiz',
        article_id,
        read_at: new Date().toISOString(),
        read_time: read_time || 0,
      })
      .select()

    if (error) throw error

    return Response.json({ record: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error tracking read:', error)
    return Response.json({ error: 'Failed to track read' }, { status: 500 })
  }
}
