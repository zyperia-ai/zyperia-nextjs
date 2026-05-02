export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const { supabaseAdmin } = await import('../../../lib/supabase-admin')

  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date(now)
  todayEnd.setHours(23, 59, 59, 999)

  // Pending review count
  const { count: pendingCount } = await supabaseAdmin
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review')

  // Approved queue
  const { data: approved } = await supabaseAdmin
    .from('blog_posts')
    .select('id, app_id, scheduled_for')
    .eq('status', 'approved')
    .order('scheduled_for', { ascending: true })

  // Published today
  const { data: publishedToday } = await supabaseAdmin
    .from('blog_posts')
    .select('id, app_id')
    .eq('status', 'published')
    .gte('published_at', todayStart.toISOString())
    .lte('published_at', todayEnd.toISOString())

  // Recent breakings (last 48h)
  const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000)
  const { data: recentBreakings } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, published_at, slug')
    .eq('status', 'published')
    .eq('generation_approach', 'breaking_news')
    .gte('published_at', cutoff48h.toISOString())
    .order('published_at', { ascending: false })

  // Recently published (last 10)
  const { data: recentPublished } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, published_at, slug, generation_approach')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10)

  // Pending review articles (first 5)
  const { data: pendingArticles } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, generation_approach, created_at')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })
    .limit(5)

  // Next scheduled
  const { data: nextScheduled } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, scheduled_for')
    .eq('status', 'approved')
    .gte('scheduled_for', now.toISOString())
    .order('scheduled_for', { ascending: true })
    .limit(6)

  const DashboardClient = (await import('./DashboardClient')).default
  return (
    <DashboardClient
      pendingCount={pendingCount ?? 0}
      approved={approved ?? []}
      publishedToday={publishedToday ?? []}
      recentBreakings={recentBreakings ?? []}
      recentPublished={recentPublished ?? []}
      pendingArticles={pendingArticles ?? []}
      nextScheduled={nextScheduled ?? []}
    />
  )
}
