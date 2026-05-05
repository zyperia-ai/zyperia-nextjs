export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('app') || 'crypto'

  console.log(`\n=== STAGE 0: TOPIC SELECTION (${appId}) ===`)
  console.log(`Started at: ${new Date().toISOString()}`)

  try {
    // Buscar tópicos disponíveis por prioridade — nunca usados primeiro
    const { data: topics, error } = await getSupabase()
      .from('content_topics')
      .select('*')
      .eq('app_id', appId)
      .is('last_used_at', null)
      .order('priority', { ascending: true })
      .limit(7)

    if (error) throw new Error(`Erro ao buscar tópicos: ${error.message}`)

    if (!topics || topics.length === 0) {
      // Fallback: buscar tópicos mais antigos (já usados há mais tempo)
      const { data: oldTopics } = await getSupabase()
        .from('content_topics')
        .select('*')
        .eq('app_id', appId)
        .order('last_used_at', { ascending: true })
        .limit(7)

      if (!oldTopics || oldTopics.length === 0) {
        console.log(`Sem tópicos disponíveis para ${appId}`)
        return NextResponse.json({ success: true, reason: 'Sem tópicos disponíveis', inserted: 0 })
      }

      topics?.push(...(oldTopics || []))
    }

    console.log(`Encontrados ${topics.length} tópicos para ${appId}`)

    let inserted = 0
    for (const topic of topics) {
      // Verificar se já existe em content_research não processado
      const { data: existing } = await getSupabase()
        .from('content_research')
        .select('id')
        .eq('app_id', appId)
        .eq('topic', topic.title)
        .eq('processed', false)
        .limit(1)
        .single()

      if (existing) {
        console.log(`  Skip (já existe): "${topic.title}"`)
        continue
      }

      // Inserir em content_research
      const { error: insertError } = await getSupabase()
        .from('content_research')
        .insert({
          app_id: appId,
          topic: topic.title,
          generation_approach: 'evergreen',
          status: 'pending',
          processed: false,
          created_at: new Date().toISOString(),
        })

      if (insertError) {
        console.error(`  ✗ Erro ao inserir "${topic.title}": ${insertError.message}`)
        continue
      }

      // Marcar tópico como usado
      await getSupabase()
        .from('content_topics')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', topic.id)

      console.log(`  ✓ Inserido: "${topic.title}"`)
      inserted++
    }

    console.log(`\n=== STAGE 0 COMPLETE === (${inserted} tópicos inseridos)`)
    return NextResponse.json({ success: true, app: appId, inserted, total_available: topics.length })

  } catch (error: any) {
    console.error('Erro no Stage 0:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
