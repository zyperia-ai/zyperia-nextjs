import { NextRequest, NextResponse } from 'next/server'

const GENERATION_APPROACH: Record<string, string> = {
  '1': 'breaking_news',
  '2': 'youtube_newsletter',
  '3': 'evergreen',
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 100)
    + '-' + Date.now().toString(36)
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

const BYLINE: Record<string, string> = {
  'blog-crypto': 'Redacção ZYPERIA Crypto',
  'blog-intelligence': 'Redacção ZYPERIA Intelligence',
  'blog-onlinebiz': 'Redacção ZYPERIA OnlineBiz',
}

function toAppId(blog: string): string {
  return blog.replace('blog-', '')
}

export async function POST(req: NextRequest) {
  try {
    const { mode, blog, tipo, input, title } = await req.json()

    if (!mode || !blog || !tipo || !input) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta' }, { status: 400 })
    }

    const generation_approach = GENERATION_APPROACH[tipo] ?? 'evergreen'

    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    // Modo directo — INSERT directo em blog_posts
    if (mode === 'direct') {
      if (!title?.trim()) {
        return NextResponse.json({ error: 'Título obrigatório no modo directo' }, { status: 400 })
      }

      const slug = generateSlug(title)
      const reading_time = estimateReadingTime(input)

      const { error } = await supabaseAdmin
        .from('blog_posts')
        .insert({
          app_id: toAppId(blog),
          title: title.trim(),
          slug,
          content: input.trim(),
          status: 'pending_review',
          generation_approach,
          author_byline: BYLINE[blog] ?? 'Redacção ZYPERIA',
          reading_time_minutes: reading_time,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    // Modos URL, text, youtube — INSERT em content_research para processamento pelo pipeline
    const sourceContent = mode === 'text' ? input : null
    const sourceUrl = mode !== 'text' ? input : null

    let topic = input
    if (mode === 'text' && input.length > 120) {
      topic = input.slice(0, 120) + '...'
    }

    const { error } = await supabaseAdmin
      .from('content_research')
      .insert({
        app_id: toAppId(blog),
        source_url: sourceUrl,
        source_content: sourceContent,
        topic,
        status: 'pending',
        generation_approach,
        processed: false,
        created_at: new Date().toISOString(),
      })

    if (error) throw error
    return NextResponse.json({ ok: true })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
