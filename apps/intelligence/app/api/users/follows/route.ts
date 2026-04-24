import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const APP_ID = 'intelligence'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const type = searchParams.get('type') || 'following'

  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  let query = supabase
    .from('user_follows')
    .select(
      type === 'following'
        ? 'following_email'
        : 'follower_email'
    )
    .eq('app_id', APP_ID)

  if (type === 'following') {
    query = query.eq('follower_email', email)
  } else {
    query = query.eq('following_email', email)
  }

  const { data: follows, error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const emails = follows?.map((f: any) =>
    type === 'following' ? f.following_email : f.follower_email
  ) || []

  return NextResponse.json({
    [type]: emails,
    count: emails.length,
  })
}

export async function POST(request: NextRequest) {
  const { followerEmail, followingEmail } = await request.json()

  if (!followerEmail || !followingEmail) {
    return NextResponse.json(
      { error: 'Both emails required' },
      { status: 400 }
    )
  }

  if (followerEmail === followingEmail) {
    return NextResponse.json(
      { error: 'Cannot follow yourself' },
      { status: 400 }
    )
  }

  const { data: existingFollow } = await supabase
    .from('user_follows')
    .select('id')
    .eq('app_id', APP_ID)
    .eq('follower_email', followerEmail)
    .eq('following_email', followingEmail)
    .single()

  if (existingFollow) {
    return NextResponse.json(
      { error: 'Already following this user' },
      { status: 409 }
    )
  }

  const { data: follow, error } = await supabase
    .from('user_follows')
    .insert({
      app_id: APP_ID,
      follower_email: followerEmail,
      following_email: followingEmail,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ follow }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { followerEmail, followingEmail } = await request.json()

  if (!followerEmail || !followingEmail) {
    return NextResponse.json(
      { error: 'Both emails required' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('app_id', APP_ID)
    .eq('follower_email', followerEmail)
    .eq('following_email', followingEmail)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Unfollowed' })
}
