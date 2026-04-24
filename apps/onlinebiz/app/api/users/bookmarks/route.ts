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

    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('email', email)
      .eq('app_id', 'onlinebiz')
      .order('saved_at', { ascending: false })
      .limit(parseInt(limit))

    if (error) throw error

    return Response.json({ bookmarks: bookmarks || [] }, { status: 200 })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return Response.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, article_id } = body

    if (!email || !article_id) {
      return Response.json(
        { error: 'Email and article_id required' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('email', email)
      .eq('article_id', article_id)
      .eq('app_id', 'onlinebiz')
      .single()

    if (existing) {
      return Response.json(
        { error: 'Already bookmarked' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        email,
        app_id: 'onlinebiz',
        article_id,
        saved_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return Response.json({ bookmark: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error saving bookmark:', error)
    return Response.json({ error: 'Failed to save bookmark' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, article_id } = body

    if (!email || !article_id) {
      return Response.json(
        { error: 'Email and article_id required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('email', email)
      .eq('article_id', article_id)
      .eq('app_id', 'onlinebiz')

    if (error) throw error

    return Response.json({ message: 'Bookmark removed' }, { status: 200 })
  } catch (error) {
    console.error('Error removing bookmark:', error)
    return Response.json({ error: 'Failed to remove bookmark' }, { status: 500 })
  }
}
