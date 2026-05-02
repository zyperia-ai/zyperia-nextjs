import { NextRequest, NextResponse } from 'next/server'

const GENERATION_APPROACH: Record<string, string> = {
  '1': 'breaking_news',
  '2': 'youtube_newsletter',
  '3': 'evergreen',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    const { supabaseAdmin } = await import('../../../../lib/supabase-admin')

    if (action === 'add_rule') {
      const { term_original, term_correct, match_type, case_sensitive } = body
      if (!term_original || !term_correct) {
        return NextResponse.json({ error: 'Campos obrigatórios em falta' }, { status: 400 })
      }
      const { data, error } = await supabaseAdmin
        .from('editorial_glossary')
        .insert({
          term_original: term_original.trim(),
          term_correct: term_correct.trim(),
          match_type: match_type ?? 'exact',
          case_sensitive: case_sensitive ?? false,
          times_applied: 0,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()
      if (error) throw error
      return NextResponse.json({ ok: true, rule: data })
    }

    if (action === 'delete_rule') {
      const { id } = body
      const { error } = await supabaseAdmin
        .from('editorial_glossary')
        .delete()
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'add_preserve') {
      const { term } = body
      if (!term) return NextResponse.json({ error: 'Termo obrigatório' }, { status: 400 })
      const { data, error } = await supabaseAdmin
        .from('editorial_preserve_terms')
        .insert({ term: term.trim(), created_at: new Date().toISOString() })
        .select()
        .single()
      if (error) throw error
      return NextResponse.json({ ok: true, term: data })
    }

    if (action === 'delete_preserve') {
      const { id } = body
      const { error } = await supabaseAdmin
        .from('editorial_preserve_terms')
        .delete()
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
