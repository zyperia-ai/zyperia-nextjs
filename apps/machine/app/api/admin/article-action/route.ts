import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { id, action, content } = await req.json()

    if (!id || !action) {
      return NextResponse.json({ error: 'id e action são obrigatórios' }, { status: 400 })
    }

    // Lazy load supabaseAdmin apenas em runtime (não em build-time)
    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    if (action === 'delete') {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .delete()
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'approved' || action === 'rejected') {
      const updates: Record<string, any> = {
        status: action,
        updated_at: new Date().toISOString(),
        last_edited_at: new Date().toISOString(),
      }
      if (content !== undefined) {
        updates.content = content
      }
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
