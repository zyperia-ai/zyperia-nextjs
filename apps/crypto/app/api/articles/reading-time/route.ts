import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const APP_ID = 'crypto'

/**
 * POST /api/articles/reading-time
 * Track article reading time (optional analytics)
 */
export async function POST(request: NextRequest) {
  try {
    const { email, articleId, timeSpent } = await request.json()

    if (!email || !articleId || typeof timeSpent !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: email, articleId, timeSpent' },
        { status: 400 }
      )
    }

    // Update or insert reading history with time spent
    const { data, error } = await supabase
      .from('reading_history')
      .upsert(
        {
          app_id: APP_ID,
          email,
          article_id: articleId,
          read_time: timeSpent,
          read_at: new Date().toISOString(),
        },
        {
          onConflict: 'app_id,email,article_id',
        }
      )
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Reading time tracked',
      data,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
