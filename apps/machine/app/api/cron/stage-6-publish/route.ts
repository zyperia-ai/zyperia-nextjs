export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

import { runQualityPipeline } from '@/lib/quality-gates'
import { checkDailyLimit, checkCircuitBreaker } from '@/lib/circuit-breaker'

export async function GET(request: Request) {
  // Auth
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    published: 0,
    rejected: 0,
    skipped_rate_limit: false,
    skipped_circuit_breaker: false,
    errors: [] as string[],
  }

  try {
    // ── Camada 5a: Circuit Breaker ───────────────────────────────────────────
    const cb = await checkCircuitBreaker()
    if (cb.open) {
      results.skipped_circuit_breaker = true
      return NextResponse.json({
        success: false,
        reason: `Circuit breaker aberto: ${cb.consecutive_rejections} rejeições consecutivas`,
        results,
      })
    }

    // ── Camada 5b: Rate Limit ────────────────────────────────────────────────
    const rl = await checkDailyLimit()
    if (!rl.allowed) {
      results.skipped_rate_limit = true
      return NextResponse.json({
        success: true,
        reason: `Daily limit atingido: ${rl.published_today}/${rl.limit}`,
        results,
      })
    }

    const slots = rl.limit - rl.published_today

    // ── Buscar candidatos a publicar ─────────────────────────────────────────
    const { data: candidates, error: fetchError } = await getSupabase()
      .from('blog_posts')
      .select('id, title, content, app_name')
      .eq('status', 'draft')
      .not('last_verified_at', 'is', null)
      .order('created_at', { ascending: true })
      .limit(slots)

    if (fetchError) {
      throw new Error(`Erro ao buscar candidatos: ${fetchError.message}`)
    }

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ success: true, reason: 'Sem artigos candidatos', results })
    }

    // ── Processar cada candidato ─────────────────────────────────────────────
    for (const article of candidates) {
      try {
        // Camadas 1-4: Quality Pipeline
        const quality = await runQualityPipeline({
          id: article.id,
          content: article.content ?? '',
          title: article.title ?? 'Sem título',
          app_name: article.app_name ?? 'crypto',
        })

        if (!quality.approved) {
          results.rejected++

          // Log em generation_logs
          await getSupabase().from('generation_logs').insert({
            blog_post_id: article.id,
            stage: 'stage-6-publish',
            status: 'rejected',
            error_message: quality.reason,
            ai_model_used: 'quality-pipeline',
            cost_usd: 0.01, // custo do auto-review Haiku
          })

          continue
        }

        // ── Publicar ────────────────────────────────────────────────────────
        const now = new Date().toISOString()

        const { error: publishError } = await getSupabase()
          .from('blog_posts')
          .update({
            status: 'published',
            published_at: now,
          })
          .eq('id', article.id)

        if (publishError) {
          results.errors.push(`Erro ao publicar ${article.id}: ${publishError.message}`)
          continue
        }

        // Criar entrada em article_performance (NEXUS tracking)
        await getSupabase().from('article_performance').insert({
          article_id: article.id,
          views: 0,
          unique_views: 0,
          dwell_time_seconds: 0,
          scroll_depth_percent: 0,
          newsletter_signups: 0,
          affiliate_clicks: 0,
        })

        // Log sucesso
        await getSupabase().from('generation_logs').insert({
          blog_post_id: article.id,
          stage: 'stage-6-publish',
          status: 'success',
          ai_model_used: 'quality-pipeline',
          cost_usd: 0.01,
        })

        // Escrever decisão NEXUS
        await getSupabase().from('nexus_decisions').insert({
          decision_type: 'article_published',
          decision_data: {
            article_id: article.id,
            app_name: article.app_name,
            quality_layers_passed: quality.results.length,
          },
          reason: 'Todas as camadas de qualidade aprovadas',
          articles_affected: 1,
        })

        results.published++
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        results.errors.push(`Artigo ${article.id}: ${msg}`)

        await getSupabase().from('generation_logs').insert({
          blog_post_id: article.id,
          stage: 'stage-6-publish',
          status: 'failed',
          error_message: msg,
          ai_model_used: 'quality-pipeline',
          cost_usd: 0,
        })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg, results }, { status: 500 })
  }
}
