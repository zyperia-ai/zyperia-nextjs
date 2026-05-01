import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { id, scheduled_for } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
    }

    // Lazy load supabaseAdmin apenas em runtime
    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    const { error } = await supabaseAdmin
      .from('blog_posts')
      .update({
        scheduled_for: scheduled_for ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('status', 'approved')

    if (error) throw error

    return NextResponse.json({ ok: true })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
