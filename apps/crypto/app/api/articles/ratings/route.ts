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
  const articleId = searchParams.get('article_id')
  const email = searchParams.get('email')

  if (!articleId) {
    return NextResponse.json({ error: 'article_id required' }, { status: 400 })
  }

  if (email) {
    const { data: userRating, error } = await supabase
      .from('article_ratings')
      .select('*')
      .eq('app_id', APP_ID)
      .eq('article_id', articleId)
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const statsQuery = await supabase
      .from('article_ratings')
      .select('rating')
      .eq('app_id', APP_ID)
      .eq('article_id', articleId)

    if (statsQuery.error) {
      return NextResponse.json(
        { error: statsQuery.error.message },
        { status: 500 }
      )
    }

    const ratings = statsQuery.data || []
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0

    return NextResponse.json({
      userRating: userRating || null,
      stats: {
        averageRating: parseFloat(String(avgRating)),
        totalRatings: ratings.length,
        distribution: {
          5: ratings.filter((r) => r.rating === 5).length,
          4: ratings.filter((r) => r.rating === 4).length,
          3: ratings.filter((r) => r.rating === 3).length,
          2: ratings.filter((r) => r.rating === 2).length,
          1: ratings.filter((r) => r.rating === 1).length,
        },
      },
    })
  }

  const { data: ratings, error } = await supabase
    .from('article_ratings')
    .select('*')
    .eq('app_id', APP_ID)
    .eq('article_id', articleId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const avgRating =
    ratings && ratings.length > 0
      ? (ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0

  return NextResponse.json({
    stats: {
      averageRating: parseFloat(String(avgRating)),
      totalRatings: ratings?.length || 0,
      distribution: {
        5: ratings?.filter((r: any) => r.rating === 5).length || 0,
        4: ratings?.filter((r: any) => r.rating === 4).length || 0,
        3: ratings?.filter((r: any) => r.rating === 3).length || 0,
        2: ratings?.filter((r: any) => r.rating === 2).length || 0,
        1: ratings?.filter((r: any) => r.rating === 1).length || 0,
      },
    },
  })
}

export async function POST(request: NextRequest) {
  const { articleId, email, rating } = await request.json()

  if (!articleId || !email || !rating) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json(
      { error: 'Rating must be between 1 and 5' },
      { status: 400 }
    )
  }

  const { data: existingRating } = await supabase
    .from('article_ratings')
    .select('id')
    .eq('app_id', APP_ID)
    .eq('article_id', articleId)
    .eq('email', email)
    .single()

  if (existingRating) {
    const { data: updated, error } = await supabase
      .from('article_ratings')
      .update({ rating })
      .eq('id', existingRating.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rating: updated })
  }

  const { data: newRating, error } = await supabase
    .from('article_ratings')
    .insert({
      app_id: APP_ID,
      article_id: articleId,
      email,
      rating,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rating: newRating }, { status: 201 })
}
