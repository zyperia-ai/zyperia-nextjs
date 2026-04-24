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
  const tag = searchParams.get('tag')

  let query = supabase
    .from('article_tags')
    .select('*')
    .eq('app_id', APP_ID)

  if (articleId) {
    query = query.eq('article_id', articleId)
  }

  if (tag) {
    query = query.eq('tag', tag)
  }

  const { data: tags, error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tags })
}

export async function POST(request: NextRequest) {
  const { articleId, tags } = await request.json()

  if (!articleId || !tags || !Array.isArray(tags)) {
    return NextResponse.json(
      { error: 'articleId and tags array required' },
      { status: 400 }
    )
  }

  const tagRecords = tags.map((tag: string) => ({
    app_id: APP_ID,
    article_id: articleId,
    tag: tag.toLowerCase().trim(),
  }))

  const { data: inserted, error } = await supabase
    .from('article_tags')
    .insert(tagRecords)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tags: inserted }, { status: 201 })
}
