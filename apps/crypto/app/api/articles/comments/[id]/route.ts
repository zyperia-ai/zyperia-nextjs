export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const APP_ID = 'crypto'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { action } = await request.json()

  if (action === 'like') {
    const { error } = await supabase
      .from('comments')
      .update({ likes: supabase.rpc('increment', { x: 1 }) })
      .eq('id', id)
      .eq('app_id', APP_ID)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Comment liked' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json(
      { error: 'Email required to delete comment' },
      { status: 400 }
    )
  }

  const { data: comment, error: fetchError } = await supabase
    .from('comments')
    .select('email')
    .eq('id', id)
    .eq('app_id', APP_ID)
    .single()

  if (fetchError || !comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }

  if (comment.email !== email) {
    return NextResponse.json(
      { error: 'Unauthorized to delete this comment' },
      { status: 403 }
    )
  }

  const { error: deleteError } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)
    .eq('app_id', APP_ID)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Comment deleted' })
}
