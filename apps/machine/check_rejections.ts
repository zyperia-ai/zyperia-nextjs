import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function check() {
  // Check rejected articles
  const { data: rejected } = await supabase
    .from('rejected_articles')
    .select('id, blog_post_id, rejection_layer, rejection_reason, app_name')
    .order('created_at', { ascending: false })
    .limit(10)

  console.log('=== REJECTED ARTICLES (Last 10) ===')
  if (rejected) {
    for (const r of rejected) {
      console.log(`\n[${r.app_name}] Layer ${r.rejection_layer}: ${r.rejection_reason?.substring(0, 80)}...`)
    }
  }

  // Check blog posts status distribution
  const { data: stats } = await supabase
    .from('blog_posts')
    .select('status, app_id')
    .order('created_at', { ascending: false })

  console.log('\n\n=== BLOG POSTS STATUS DISTRIBUTION ===')
  const distribution: Record<string, Record<string, number>> = {}
  if (stats) {
    for (const post of stats) {
      if (!distribution[post.app_id]) distribution[post.app_id] = {}
      distribution[post.app_id][post.status] = (distribution[post.app_id][post.status] || 0) + 1
    }
  }

  for (const [app, statuses] of Object.entries(distribution)) {
    console.log(`\n${app}:`)
    for (const [status, count] of Object.entries(statuses)) {
      console.log(`  ${status}: ${count}`)
    }
  }
}

check().catch(console.error)
