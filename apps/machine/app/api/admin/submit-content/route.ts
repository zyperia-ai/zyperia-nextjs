import { NextRequest, NextResponse } from 'next/server'

const GENERATION_APPROACH: Record<string, string> = {
  '1': 'breaking_news',
  '2': 'youtube_newsletter',
  '3': 'evergreen',
}

export async function POST(req: NextRequest) {
  try {
    const { mode, blog, tipo, input } = await req.json()

    if (!mode || !blog || !tipo || !input) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta' }, { status: 400 })
    }

    const generation_approach = GENERATION_APPROACH[tipo] ?? 'evergreen'

    // Lazy load supabaseAdmin apenas em runtime
    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    // Criar entrada em content_research para processamento pelo pipeline
    const sourceContent = mode === 'text' ? input : null
    const sourceUrl = mode !== 'text' ? input : null

    const { error } = await supabaseAdmin
      .from('content_research')
      .insert({
        app_id: blog,
        source_url: sourceUrl,
        source_content: sourceContent,
        topic: `[MANUAL SUBMIT — ${mode.toUpperCase()}]`,
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
