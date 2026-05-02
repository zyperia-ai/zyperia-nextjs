import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, action, topic } = body
    if (!id || !action) return NextResponse.json({ error: 'id e action obrigatórios' }, { status: 400 })

    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    if (action === 'delete') {
      const { error } = await supabaseAdmin
        .from('content_research')
        .delete()
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'edit') {
      if (!topic) return NextResponse.json({ error: 'topic obrigatório' }, { status: 400 })
      const { error } = await supabaseAdmin
        .from('content_research')
        .update({ topic })
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
