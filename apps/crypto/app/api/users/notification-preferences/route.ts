import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const APP_ID = 'crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const { data: preferences, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('app_id', APP_ID)
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!preferences) {
    return NextResponse.json({
      preferences: {
        email,
        new_articles_from_followed: true,
        weekly_digest: true,
        newsletter: true,
        comments_on_articles: false,
      },
    })
  }

  return NextResponse.json({ preferences })
}

export async function POST(request: NextRequest) {
  const {
    email,
    newArticlesFromFollowed,
    weeklyDigest,
    newsletter,
    commentsOnArticles,
  } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const { data: existingPrefs } = await supabase
    .from('notification_preferences')
    .select('id')
    .eq('app_id', APP_ID)
    .eq('email', email)
    .single()

  if (existingPrefs) {
    const { data: updated, error } = await supabase
      .from('notification_preferences')
      .update({
        new_articles_from_followed: newArticlesFromFollowed,
        weekly_digest: weeklyDigest,
        newsletter,
        comments_on_articles: commentsOnArticles,
      })
      .eq('id', existingPrefs.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ preferences: updated })
  }

  const { data: newPrefs, error } = await supabase
    .from('notification_preferences')
    .insert({
      app_id: APP_ID,
      email,
      new_articles_from_followed: newArticlesFromFollowed,
      weekly_digest: weeklyDigest,
      newsletter,
      comments_on_articles: commentsOnArticles,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ preferences: newPrefs }, { status: 201 })
}
