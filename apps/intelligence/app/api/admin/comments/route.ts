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
  const status = searchParams.get('status') || 'pending'
  const articleId = searchParams.get('article_id')

  let query = supabase
    .from('comments')
    .select('*')
    .eq('app_id', APP_ID)

  if (status) {
    query = query.eq('status', status)
  }

  if (articleId) {
    query = query.eq('article_id', articleId)
  }

  const { data: comments, error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comments })
}

export async function PATCH(request: NextRequest) {
  const { commentId, status } = await request.json()

  if (!commentId || !['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json(
      { error: 'Invalid comment ID or status' },
      { status: 400 }
    )
  }

  const { data: comment, error } = await supabase
    .from('comments')
    .update({ status })
    .eq('id', commentId)
    .eq('app_id', APP_ID)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ comment })
}

export async function DELETE(request: NextRequest) {
  const { commentId } = await request.json()

  if (!commentId) {
    return NextResponse.json({ error: 'Comment ID required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('app_id', APP_ID)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Comment deleted' })
}
