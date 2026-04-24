export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
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

  const { data: profile, error: profileError } = await supabase
    .from('user_author_profiles')
    .select('*')
    .eq('app_id', APP_ID)
    .eq('email', email)
    .single()

  if (profileError && profileError.code !== 'PGRST116') {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  if (!profile) {
    return NextResponse.json(
      { error: 'Author profile not found' },
      { status: 404 }
    )
  }

  const { data: articles } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, published_at, views')
    .eq('app_id', APP_ID)
    .eq('author_email', email)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10)

  const { data: followers } = await supabase
    .from('user_follows')
    .select('follower_email')
    .eq('app_id', APP_ID)
    .eq('following_email', email)

  return NextResponse.json({
    profile,
    articles: articles || [],
    followerCount: followers?.length || 0,
  })
}

export async function POST(request: NextRequest) {
  const { email, displayName, bio, avatarUrl, twitterUrl, linkedinUrl, websiteUrl } =
    await request.json()

  if (!email || !displayName) {
    return NextResponse.json(
      { error: 'email and displayName required' },
      { status: 400 }
    )
  }

  const { data: existingProfile } = await supabase
    .from('user_author_profiles')
    .select('id')
    .eq('app_id', APP_ID)
    .eq('email', email)
    .single()

  if (existingProfile) {
    const { data: updated, error } = await supabase
      .from('user_author_profiles')
      .update({
        display_name: displayName,
        bio,
        avatar_url: avatarUrl,
        twitter_url: twitterUrl,
        linkedin_url: linkedinUrl,
        website_url: websiteUrl,
      })
      .eq('id', existingProfile.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: updated })
  }

  const { data: newProfile, error } = await supabase
    .from('user_author_profiles')
    .insert({
      app_id: APP_ID,
      email,
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
      twitter_url: twitterUrl,
      linkedin_url: linkedinUrl,
      website_url: websiteUrl,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: newProfile }, { status: 201 })
}
