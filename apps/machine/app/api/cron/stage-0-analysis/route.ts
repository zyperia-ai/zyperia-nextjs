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

  console.log(`\n=== STAGE 0: TOPIC AUDIT (${appId}) ===`)
  console.log(`Started at: ${new Date().toISOString()}`)

  try {
    // Contar tópicos disponíveis
    const { count: available } = await getSupabase()
      .from('content_topics')
      .select('*', { count: 'exact', head: true })
      .eq('app_id', appId)
      .is('last_used_at', null)

    // Contar tópicos já usados
    const { count: used } = await getSupabase()
      .from('content_topics')
      .select('*', { count: 'exact', head: true })
      .eq('app_id', appId)
      .not('last_used_at', 'is', null)

    // Se stock baixo (menos de 7 tópicos), logar aviso
    if ((available ?? 0) < 7) {
      console.log(`⚠️  Stock baixo para ${appId}: apenas ${available} tópicos disponíveis`)
    } else {
      console.log(`✓ Stock OK para ${appId}: ${available} disponíveis, ${used} já usados`)
    }

    console.log(`=== STAGE 0 COMPLETE ===`)
    return NextResponse.json({
      success: true,
      app: appId,
      available,
      used,
      warning: (available ?? 0) < 7 ? 'stock_baixo' : null
    })

  } catch (error: any) {
    console.error('Erro no Stage 0:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
