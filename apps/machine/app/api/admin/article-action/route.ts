import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { id, action, content, title, revert } = await req.json()

    if (!id || !action) {
      return NextResponse.json({ error: 'id e action são obrigatórios' }, { status: 400 })
    }

    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    if (action === 'delete') {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .delete()
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'edit') {
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
        last_edited_at: new Date().toISOString(),
      }
      if (content !== undefined) updates.content = content
      if (title !== undefined) updates.title = title

      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'approved') {
      if (revert) {
        const { error } = await supabaseAdmin
          .from('blog_posts')
          .update({ status: 'pending_review', updated_at: new Date().toISOString() })
          .eq('id', id)
        if (error) throw error
        return NextResponse.json({ ok: true })
      }

      const updates: Record<string, any> = {
        status: 'approved',
        updated_at: new Date().toISOString(),
        last_edited_at: new Date().toISOString(),
      }
      if (content !== undefined) updates.content = content
      if (title !== undefined) updates.title = title

      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'rejected') {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'unpublished') {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update({ status: 'unpublished', updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'pending_review') {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update({ status: 'pending_review', updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'republish') {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update({
          status: 'published',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
