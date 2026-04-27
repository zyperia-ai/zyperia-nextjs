/**
 * NEXUS Brain Tick — Cron diário às 03:00 UTC
 * Lê article_performance → calcula scores → actualiza topic_scores + nexus_config
 */

import { NextResponse } from 'next/server'
import { runBrainTick } from '../../../lib/nexus-brain'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runBrainTick()
    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[brain-tick] Erro:', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
