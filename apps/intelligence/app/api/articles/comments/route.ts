export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const APP_ID = 'intelligence'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const articleId = searchParams.get('article_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  if (!articleId) {
    return NextResponse.json({ error: 'article_id required' }, { status: 400 })
  }

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('app_id', APP_ID)
    .eq('article_id', articleId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comments })
}

export async function POST(request: NextRequest) {
  const { articleId, email, authorName, content } = await request.json()

  if (!articleId || !email || !authorName || !content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  if (content.length > 500) {
    return NextResponse.json(
      { error: 'Comment too long (max 500 characters)' },
      { status: 400 }
    )
  }

  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      app_id: APP_ID,
      article_id: articleId,
      email,
      author_name: authorName,
      content,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comment }, { status: 201 })
}
