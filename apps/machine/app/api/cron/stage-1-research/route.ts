export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Vercel Cron Job - Stage 1: Research & Topic Selection
 * Runs daily at 00:30 UTC
 */

import { createClient } from '@supabase/supabase-js';
import { searchAndExtractWithClaude } from '@/lib/ai-router';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

async function getNexusAudienceFocus(): Promise<Record<string, number>> {
  const { data } = await getSupabase()
    .from('nexus_config')
    .select('config_value')
    .eq('config_key', 'audience_focus')
    .single()

  return (data?.config_value as Record<string, number>) ?? {
    iniciante: 0.5,
    intermediário: 0.4,
    avançado: 0.1,
  }
}

async function runStage1(appFilter?: string | null) {
  console.log('\n=== STAGE 1: RESEARCH & TOPIC SELECTION (CRON JOB) ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    const { data: apps, error: appsError } = await getSupabase().from('theme_config').select('app_id, articles_per_day');

    for (const app of apps || []) {
      if (appFilter && app.app_id !== appFilter) continue
      console.log(`\nSelecting topics for: ${app.app_id} (${app.articles_per_day} articles)`);

      // BLOCO A — Processa submits manuais com source_content (PRIORIDADE 0)
      console.log(`[Stage 1] Checking for manual submissions in ${app.app_id}...`)

      const { data: manualSubmissions } = await getSupabase()
        .from('content_research')
        .select('*')
        .eq('app_id', app.app_id)
        .not('source_content', 'is', null)
        .eq('processed', false)

      if (manualSubmissions && manualSubmissions.length > 0) {
        console.log(`  Found ${manualSubmissions.length} manual submissions`)

        for (const submission of manualSubmissions.slice(0, app.articles_per_day)) {
          const startTime = Date.now()

          try {
            console.log(`  [Stage 1] Processing manual: "${submission.topic}"`)

            // Construir researchDataComplete usando source_content já fornecido (SEM web_search)
            const researchDataComplete = {
              topic: submission.topic,
              content_type: submission.generation_approach || 'manual_submit',
              sourceContent: submission.source_content,
              sourceUrl: submission.source_url || '',
              articleFound: true,
              updated_at: new Date().toISOString(),
            }

            // UPDATE com processed=false para Stage 2a buscar
            const { error: updateError } = await getSupabase()
              .from('content_research')
              .update({
                processed: false,
                research_data: researchDataComplete,
                status: 'researched',
              })
              .eq('id', submission.id)

            const duration = Math.round((Date.now() - startTime) / 1000)

            if (updateError) {
              console.error(`  ✗ Error: ${updateError.message}`)
              await getSupabase().from('generation_logs').insert({
                stage: 'research',
                status: 'failed',
                duration_seconds: duration,
                error_message: updateError.message,
              })
            } else {
              console.log(`  ✓ Manual processed: "${submission.topic}" (${duration}s)`)
              await getSupabase().from('generation_logs').insert({
                stage: 'research',
                status: 'success',
                duration_seconds: duration,
              })
            }
          } catch (error) {
            const duration = Math.round((Date.now() - startTime) / 1000)
            console.error(`  ✗ Error in manual submission:`, error)
            await getSupabase().from('generation_logs').insert({
              stage: 'research',
              status: 'failed',
              duration_seconds: duration,
              error_message: (error as Error).message,
            })
          }
        }
      }

      // NEXUS audience_focus — preferência mas sem bloquear se não há tópicos suficientes
      const audienceFocus = await getNexusAudienceFocus()
      const preferredAudience = Object.entries(audienceFocus).sort((a, b) => b[1] - a[1])[0][0]

      // Buscar todos os tópicos disponíveis ordenados por prioridade
      const { data: allTopics } = await getSupabase()
        .from('content_topics')
        .select('id, title, priority, search_volume, audience_level')
        .eq('app_id', app.app_id)
        .is('last_used_at', null)
        .order('priority', { ascending: false })
        .limit(app.articles_per_day * 3)

      // Separar preferidos dos restantes
      const preferred = (allTopics ?? []).filter(t => t.audience_level === preferredAudience)
      const others = (allTopics ?? []).filter(t => t.audience_level !== preferredAudience)

      // Combinar: preferidos primeiro, depois os restantes até ao limite
      const topics = [...preferred, ...others].slice(0, app.articles_per_day)

      if (!topics || topics.length === 0) {
        console.log(`⚠️  No topics available for ${app.app_id}`);
        continue;
      }

      // PRIORIDADE 1 — Breaking news (TIPO 1)
      const { data: breaking } = await getSupabase()
        .from('breaking_queue')
        .select('*')
        .eq('app_id', app.app_id)
        .eq('processed', false)
        .order('detected_at', { ascending: true })
        .limit(1)
        .single()

      if (breaking) {
        console.log(`[Stage 1] TIPO 1 breaking: "${breaking.title}"`)
        await getSupabase().from('breaking_queue').update({ processed: true }).eq('id', breaking.id)
        await getSupabase().from('content_research').insert({
          app_id: app.app_id,
          topic: breaking.title,
          research_type: 'tipo1',
          research_data: {
            topic: breaking.title,
            content_type: 'tipo1',
            sourceUrl: breaking.source_url,
            sourceTitle: breaking.title,
            sourceContent: breaking.content,
            sourceType: breaking.source_type,
            articleFound: true,
            updated_at: new Date().toISOString(),
          },
          confidence_score: 95,
          created_at: new Date().toISOString(),
        })
        console.log(`✓ Breaking queued: "${breaking.title}"`)
        continue
      }

      // PRIORIDADE 2 — YouTube (TIPO 2)
      const { data: video } = await getSupabase()
        .from('content_queue')
        .select('*')
        .eq('app_id', app.app_id)
        .eq('processed', false)
        .order('detected_at', { ascending: true })
        .limit(1)
        .single()

      if (video && video.transcript && video.transcript.length > 500) {
        console.log(`[Stage 1] TIPO 2 YouTube: "${video.video_title}"`)
        await getSupabase().from('content_queue').update({ processed: true }).eq('id', video.id)
        await getSupabase().from('content_research').insert({
          app_id: app.app_id,
          topic: video.video_title,
          research_type: 'tipo2',
          research_data: {
            topic: video.video_title,
            content_type: 'tipo2',
            sourceUrl: `https://youtube.com/watch?v=${video.video_id}`,
            sourceTitle: video.video_title,
            sourceContent: video.transcript,
            articleFound: true,
            updated_at: new Date().toISOString(),
          },
          confidence_score: 85,
          created_at: new Date().toISOString(),
        })
        console.log(`✓ YouTube queued: "${video.video_title}"`)
        continue
      }

      // PRIORIDADE 3 — Evergreen (TIPO 3) — lógica existente abaixo
      for (const topic of topics) {
        const startTime = Date.now();

        try {
          console.log(`Researching: "${topic.title}"...`)

          const extracted = await searchAndExtractWithClaude(topic.title, app.app_id)

          const researchData = {
            topic: topic.title,
            keywords: topic.title.split(' '),
            search_volume: topic.search_volume,
            sources: extracted.sources,
            keyFacts: extracted.keyFacts,
            lusophoneContext: extracted.lusophoneContext,
            searchQueries: extracted.searchQueries,
            updated_at: new Date().toISOString(),
          }

          console.log(`Found ${extracted.sources.length} sources, ${extracted.keyFacts.length} key facts`)

          // Fetch do conteúdo do melhor artigo encontrado
          let sourceContent = ''
          let sourceUrl = ''
          let articleFound = false

          if (extracted.sources && extracted.sources.length > 0) {
            // Lista de domínios a rejeitar directamente
            const rejectedDomains = [
              'etherscan.io',
              'bscscan.com',
              'polygonscan.com',
              'coinmarketcap.com',
              'coingecko.com',
              'tradingview.com',
              'binance.com',
              'coinbase.com',
              'kraken.com',
              'bybit.com',
              'okx.com',
              'dexscreener.com',
              'dextools.io',
            ]

            // Tenta fetch das primeiras 8 sources até encontrar conteúdo
            for (const url of extracted.sources.slice(0, 8)) {
              try {
                if (!url || !url.startsWith('http')) continue

                // Rejeita domínios bloqueados
                const isRejectedDomain = rejectedDomains.some(domain => url.includes(domain))
                if (isRejectedDomain) {
                  console.log(`✗ Rejeitada (domínio bloqueado): ${url.slice(0, 60)}`)
                  continue
                }

                const response = await fetch(url, {
                  headers: { 'User-Agent': 'ZyperiaBot/1.0' },
                  signal: AbortSignal.timeout(10000),
                })
                if (!response.ok) continue
                const html = await response.text()
                // Extrai texto limpo do HTML
                const cleanText = html
                  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&#\d+;/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()

                const wordCount = cleanText.split(/\s+/).filter((w: string) => w.length > 0).length

                if (wordCount < 500) {
                  console.log(`✗ Rejeitada (${wordCount} palavras < 500): ${url.slice(0, 60)}`)
                  continue
                }

                if (wordCount > 4000) {
                  console.log(`✗ Rejeitada (${wordCount} palavras > 4000): ${url.slice(0, 60)}`)
                  continue
                }

                // Rejeita páginas dinâmicas e de dados
                const dynamicIndicators = [
                  /\$[\d,]+\.\d{2}/g,           // preços como $2,293.77
                  /gwei/gi,                      // taxas de gas
                  /gas price/gi,
                  /live price/gi,
                  /price today/gi,
                  /buy.*sell.*crypto/gi,
                  /trade now/gi,
                  /market cap.*volume/gi,
                  /showing \d+ results/gi,
                  /filter by/gi,
                  /sort by/gi,
                ]

                const dynamicMatches = dynamicIndicators.filter(pattern => pattern.test(cleanText)).length

                if (dynamicMatches >= 3) {
                  console.log(`✗ Rejeitada (página dinâmica, ${dynamicMatches} indicadores): ${url.slice(0, 60)}`)
                  continue
                }

                // Verifica se tem conteúdo mínimo substancial
                // (pelo menos 500 palavras já verificado acima)
                // Verifica se não é uma lista de links apenas
                const sentenceCount = (cleanText.match(/[.!?]+/g) || []).length
                if (sentenceCount < 10) {
                  console.log(`✗ Rejeitada (conteúdo insuficiente, ${sentenceCount} frases): ${url.slice(0, 60)}`)
                  continue
                }

                sourceContent = cleanText
                sourceUrl = url
                articleFound = true
                console.log(`✓ Aceite (${wordCount} palavras): ${url.slice(0, 60)}`)
                break
              } catch (e) {
                console.log(`✗ Failed to fetch: ${url.slice(0, 60)}`)
              }
            }
          }

          // Adiciona ao researchData
          const researchDataComplete = {
            ...researchData,
            sourceContent,
            sourceUrl,
            articleFound,
            content_type: 'tipo3',
          }

          // Get competitive analysis from Stage 0
          const { data: competitiveData } = await getSupabase()
            .from('content_research')
            .select('competitive_analysis, content_gaps')
            .eq('app_id', app.app_id)
            .eq('topic', topic.title)
            .eq('research_type', 'competitive_analysis')
            .order('analyzed_at', { ascending: false })
            .limit(1);

          // Store research
          const { error: insertError } = await getSupabase().from('content_research').insert({
            app_id: app.app_id,
            topic: topic.title,
            research_type: 'original',
            research_data: researchDataComplete,
            content_gaps: competitiveData?.[0]?.content_gaps,
            confidence_score: 75,
            created_at: new Date().toISOString(),
          });

          const duration = Math.round((Date.now() - startTime) / 1000);

          if (insertError) {
            console.error(`✗ Error researching "${topic.title}":`, insertError.message);
            await getSupabase().from('generation_logs').insert({
              app_id: app.app_id,
              stage: 'research',
              status: 'failed',
              duration_seconds: duration,
              error_message: insertError.message,
            });
          } else {
            console.log(`✓ Researched "${topic.title}" (${duration}s)`);

            // Mark topic as used
            await getSupabase()
              .from('content_topics')
              .update({ last_used_at: new Date().toISOString() })
              .eq('id', topic.id);

            // Log success
            await getSupabase().from('generation_logs').insert({
              app_id: app.app_id,
              stage: 'research',
              status: 'success',
              duration_seconds: duration,
            });
          }
        } catch (error) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          console.error(`✗ Error in topic research:`, error);

          await getSupabase().from('generation_logs').insert({
            app_id: app.app_id,
            stage: 'research',
            status: 'failed',
            duration_seconds: duration,
            error_message: (error as Error).message,
          });
        }
      }
    }

    console.log('\n=== STAGE 1 COMPLETE ===');
    return { statusCode: 200, body: 'Stage 1 complete' };
  } catch (error) {
    console.error('STAGE 1 FAILED:', error);
    return { statusCode: 500, body: (error as Error).message };
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url)
  const appFilter = searchParams.get('app') || null

  const result = await runStage1(appFilter);
  return new Response(JSON.stringify(result), {
    status: result.statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}
