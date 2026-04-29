export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// ── Configuração de fontes ──────────────────────────────────────────────────

const NITTER_INSTANCE = 'https://nitter.privacyredirect.com'

const SOURCES = {
  crypto: {
    nitter: [
      'VitalikButerin','brian_armstrong','cz_binance','saylor','coinbase',
      'ethereum','Ripple','solana','APompliano','novogratz','arthurhayes',
      'tyler','cameron','BalajisS','jackmallers','stani','haydenzadeh',
      'RaoulGMI','PlanBTC','WatcherGuru','whale_alert','MessariCrypto',
      'TheBlock__','CoinDesk','Cointelegraph','Decrypt','ErikVoorhees',
      'aantonop','LauraShin','scottmelker','hasufl','sassal0x','TimBeiko',
      'blknoiz06','a16zcrypto','paradigm','dragonfly_cap'
    ],
    rss: [
      'https://coindesk.com/arc/outboundfeeds/rss/',
      'https://decrypt.co/feed',
      'https://theblock.co/rss/all',
      'https://cointelegraph.com/rss',
      'https://thedefiant.io/api/feeds/rss.xml',
      'https://banklesshq.com/feed',
      'https://unchainedcrypto.com/feed/',
      'https://dlnews.com/rss/',
      'https://protos.com/feed/',
      'https://cryptoslate.com/feed/',
    ],
    youtube: [
      'UCqK_GSMbpiV8spgD3ZGloSw','UCRvqjQPSeaWn-uEx-w0XLIg',
      'UCN9Nj4tjXbVTLYWN0EKly_Q','UCCatR7nWbYrkVXdxXb4cGXtg',
      'UCbLhGKVY-bJPcawebgtNfbw','UCAl9Ld79qaZxp9JzEOwd3aA',
      'UCWN3xxRkmTPmbKwht9FuE5A','UCynLzLd5qen2OVxgSRzmrMw',
      'UCJgHxpqfhWEEjYH9cLXqhIQ','UCo6jtKEYHhRJ2CJPX4rHNQA',
      'UCl2oCaw8hdR_kbqyqd2klFQ','UCO5orMZ9GHJfAa8qaHdCnEg',
      'UCb6zcOZkD7FQTL_jyCvHG9A','UC7UBBVcnOqmNwrEFCbJkNtQ',
      'UCatItl6C7wJv-QcFykiL9eg','UCMdSGJLqMxrMYBFAhGBQPOg',
      'UCXmhbGXOeFJMz6JVMgfFTuA','UCcStKTjFtNNqd7Fkd9Xj4Lg',
      'UCCr2PTXQQ5fLzHrFuasAQng','UCKiJ4L6VY7diKbRLQ61ZkKg',
    ],
  },
  intelligence: {
    nitter: [
      'sama','demishassabis','ylecun','karpathy','AnthropicAI','OpenAI',
      'GoogleDeepMind','mistralai','gdb','satyanadella','jimfan',
      'alexandr_wang','GaryMarcus','ilyasut','andrewyng','jeremyphoward',
      'fchollet','sleepinyourhat','TheRundownAI','AIatMeta','GoogleAI',
      'NvidiaAI','huggingface','LangChainAI','weights_biases','simonw',
      'swyx','emollick','benedictevans','xlr8harder','amandalaskell',
      'mmitchell_ai','timnitGebru','pervognsen','theresanaiforit'
    ],
    rss: [
      'https://techcrunch.com/feed/',
      'https://venturebeat.com/feed/',
      'https://technologyreview.com/feed/',
      'https://aiandnews.com/feed/',
      'https://thedecoder.de/feed/',
      'https://artificialintelligence-news.com/feed/',
      'https://therundown.ai/feed/',
      'https://simonwillison.net/atom/entries/',
      'https://importai.substack.com/feed/',
      'https://interconnects.ai/feed/',
    ],
    youtube: [
      'UCbmNph6atAoGfqLoCL_duAg','UCZHmQk67mSJgfCCTn7xBfew',
      'UCbfYPyITQ-7l4upoX8nvctg','UCnUYZLuoy1rq1aVMwx4aTzw',
      'UCob_TD2IYObMCrBFkTJhruaA','UCx9F_ZBOW_TBnC1OJSaFcIg',
      'UCSHZKyawb77ixDdsGog4iWA','UCfzlCWGWYyIQ0aLC5w48gBQ',
      'UCsH6yQpRwlhQ0iFGpFlRIrg','UCWN3xxRkmTPmbKwht9FuE5A',
      'UCUfX5y7BU8yHcVbp72kZ3_A','UCbXgNpp0jedKWclzcgEVV_A',
      'UCX7Y2qWriXpqocG97SFW2OQ','UCYO_jab_esuFRV4b17AJtAw',
      'UCsBjURrPoezykLs9EqgamOA','UCbXgNpp0jedKWclzcgEVV_A',
      'UC_Oa7Ph3v94om5OyxY4pPpg','UCHXa4OpASJEwrHrLeP6U8Eg',
      'UCjFG3GXoGSiZ34WelzMI1nA','UCtYLUTtgS3k1Fg4y5tAhLbw',
      'UCJMowYtxtfkk_T3aQ5TG8Sg','UCHCCGSnjLpHwL2bv-d4yz7g',
    ],
  },
  onlinebiz: {
    nitter: [
      'paulg','levelsio','dvassallo','naval','justinkan','gregisenberg',
      'noahkagan','csallen','pjrvs','ajlkn','danmartell','heyblake',
      'stephsmithio','arvidkahl','tylertringas','nathanbarry','jackbutcher',
      'wes_kao','SahilBloom','dickiebush','nateliason','coreyhainesco',
      'pat_walls','theSamParr','awilkinson','fortelabs','AliAbdaal',
      'tferriss','garyvee','neilpatel','ahrefs','semrush',
      'ProductHunt','IndieHackers','ycombinator'
    ],
    rss: [
      'https://indiehackers.com/feed',
      'https://producthunt.com/feed',
      'https://starterstory.com/feed',
      'https://failory.com/feed',
      'https://microacquire.com/blog/rss/',
      'https://myfirstmillion.substack.com/feed/',
    ],
    youtube: [
      'UCg6LmqAbqxAeVuAhMqMiXkA','UCGk1LitxAayzMoUmbD_XYUA',
      'UCsT8WRVikLkBXuDjdm4GKJA','UCoY0M4alDGkAkQ9CRFI_E9A',
      'UCVXlBELAYDLYy3MvJOgA_Pg','UCcefcZRL2oaA_uBNeo5UOWg',
      'UCiSBFbDGFqMhpLhBcHDQENA','UCLdEGGiRTfJHQZFNWFHrSmw',
      'UCBkcent-MvRMBJHN0cBHkXA','UCoOae5nYA7VqaXzerajD0lg',
      'UCcoXz_P5MraN3PsEODCmBYkw','UCY2CnhPCWcFEBQdnVtafAlA',
      'UCznv7Vf9nBdJYvBagFdAHWw','UCctXZhXmG-kf3tlIXgVZUlw',
      'UC2D2CMWXMOVWx7giW1n3LIg','UCbmBruTjMXrm3ZXCuXVFNbw',
      'UCasLFMHEoh3pMeExdY-2oLg','UCX6b17PVsYBQ0ip5gyeme-Q',
      'UCl3xelKmZN_oiDqNRgbEpqg','UCo_HJNRGnhMF3J7HFPDokgw',
    ],
  },
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function isItemSeen(url: string): Promise<boolean> {
  const { data } = await getSupabase()
    .from('seen_items')
    .select('id')
    .eq('item_url', url)
    .single()
  return !!data
}

async function markItemSeen(url: string) {
  await getSupabase().from('seen_items').upsert({ item_url: url, seen_at: new Date().toISOString() }, { onConflict: 'item_url' })
}

async function fetchRSS(url: string): Promise<Array<{ title: string; link: string; description: string }>> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ZyperiaBot/1.0' },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return []
    const text = await response.text()
    const items: Array<{ title: string; link: string; description: string }> = []
    const itemMatches = Array.from(text.matchAll(/<item>([\s\S]*?)<\/item>/g))
    for (const match of itemMatches) {
      const content = match[1]
      const title = content.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || ''
      const link = content.match(/<link[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/)?.[1]?.trim() || ''
      const description = content.match(/<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/)?.[1]?.replace(/<[^>]+>/g, '').trim().slice(0, 500) || ''
      if (title && link) items.push({ title, link, description })
    }
    return items.slice(0, 10)
  } catch {
    return []
  }
}

async function classifyItem(title: string, description: string, appId: string): Promise<boolean> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 64,
      messages: [{
        role: 'user',
        content: `É este item relevante e importante para um blog lusófono de ${appId}?
Título: ${title}
Descrição: ${description.slice(0, 200)}
Responde APENAS: {"relevant": true} ou {"relevant": false}`,
      }],
    })
    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const match = text.match(/\{[\s\S]*?\}/)
    if (match) return JSON.parse(match[0]).relevant === true
  } catch { /* skip */ }
  return false
}

// ── Modo 1: Monitorização RSS + Nitter ──────────────────────────────────────

async function monitorRSSAndNitter(mode: 'hourly' | 'all' = 'hourly') {
  let newItems = 0

  for (const [appId, sources] of Object.entries(SOURCES)) {
    // RSS feeds
    for (const rssUrl of sources.rss) {
      const items = await fetchRSS(rssUrl)
      for (const item of items) {
        if (await isItemSeen(item.link)) continue
        await markItemSeen(item.link)
        const relevant = await classifyItem(item.title, item.description, appId)
        if (relevant) {
          await getSupabase().from('breaking_queue').insert({
            app_id: appId,
            source_url: item.link,
            source_type: 'rss',
            title: item.title,
            content: item.description,
            detected_at: new Date().toISOString(),
            processed: false,
            priority: 1,
          })
          console.log(`[Stage 0] BREAKING ${appId}: ${item.title.slice(0, 60)}`)
          newItems++
        }
      }
    }

    // Nitter RSS
    for (const handle of sources.nitter) {
      const nitterUrl = `${NITTER_INSTANCE}/${handle}/rss`
      const items = await fetchRSS(nitterUrl)
      for (const item of items) {
        if (await isItemSeen(item.link)) continue
        await markItemSeen(item.link)
        const relevant = await classifyItem(item.title, item.description, appId)
        if (relevant) {
          await getSupabase().from('breaking_queue').insert({
            app_id: appId,
            source_url: item.link,
            source_type: 'nitter',
            title: item.title,
            content: item.description,
            detected_at: new Date().toISOString(),
            processed: false,
            priority: 2,
          })
          console.log(`[Stage 0] TWITTER ${appId} @${handle}: ${item.title.slice(0, 60)}`)
          newItems++
        }
      }
    }
  }

  return newItems
}

// ── Modo 2: Check YouTube diário ─────────────────────────────────────────────

async function checkYouTube() {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) { console.log('[Stage 0] YOUTUBE_API_KEY não configurada'); return 0 }

  let newVideos = 0
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  for (const [appId, sources] of Object.entries(SOURCES)) {
    for (const channelId of sources.youtube) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?channelId=${channelId}&publishedAfter=${yesterday}&order=date&type=video&part=snippet&maxResults=3&key=${apiKey}`
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
        if (!response.ok) continue

        const data = await response.json()
        for (const item of data.items || []) {
          const videoId = item.id?.videoId
          const title = item.snippet?.title
          const description = item.snippet?.description?.slice(0, 300)
          if (!videoId || !title) continue

          const videoUrl = `https://youtube.com/watch?v=${videoId}`
          if (await isItemSeen(videoUrl)) continue
          await markItemSeen(videoUrl)

          const relevant = await classifyItem(title, description || '', appId)
          if (!relevant) continue

          await getSupabase().from('content_queue').insert({
            app_id: appId,
            youtube_channel_id: channelId,
            video_id: videoId,
            video_title: title,
            transcript: '',
            detected_at: new Date().toISOString(),
            processed: false,
          })

          console.log(`[Stage 0] YOUTUBE ${appId}: ${title.slice(0, 60)}`)
          newVideos++
        }
      } catch (error) {
        console.error(`[Stage 0] YouTube error channel ${channelId}:`, error)
      }
    }
  }

  return newVideos
}

// ── Modo 3: Descoberta de trends semanal ────────────────────────────────────

async function discoverTrends() {
  const now = new Date()
  const monthYear = now.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })

  for (const appId of ['crypto', 'intelligence', 'onlinebiz']) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        tools: [{ type: 'web_search_20250305' as any, name: 'web_search' } as any],
        system: `Analisa as trends actuais de ${monthYear} para conteúdo de ${appId}.
Responde APENAS com JSON: {"trends": ["trend1","trend2",...]} com exactamente 15 trends.`,
        messages: [{
          role: 'user',
          content: `Quais são os 15 temas mais pesquisados e em alta para ${appId} em ${monthYear}?`,
        }],
      })

      const text = response.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
      const match = text.match(/\{[\s\S]*?\}/)
      if (match) {
        const parsed = JSON.parse(match[0])
        if (parsed.trends?.length > 0) {
          console.log(`[Stage 0] Trends actualizadas ${appId}: ${parsed.trends.length} temas`)
        }
      }
    } catch (error) {
      console.error(`[Stage 0] Trend discovery error ${appId}:`, error)
    }
  }
}

// ── Handler principal ────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') || 'hourly'

  console.log(`\n=== STAGE 0: INTELLIGENCE (mode: ${mode}) ===`)
  console.log(`Started at: ${new Date().toISOString()}`)

  const results: Record<string, number> = {}

  try {
    if (mode === 'hourly' || mode === 'all') {
      results.newBreaking = await monitorRSSAndNitter()
    }

    if (mode === 'youtube' || mode === 'all') {
      results.newVideos = await checkYouTube()
    }

    if (mode === 'trends' || mode === 'all') {
      await discoverTrends()
      results.trendsUpdated = 3
    }

    console.log('\n=== STAGE 0 COMPLETE ===', results)

    return NextResponse.json({ success: true, mode, results })
  } catch (error) {
    console.error('STAGE 0 ERROR:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
