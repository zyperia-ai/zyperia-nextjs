import PendingReviewClient from './PendingReviewClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PendingReviewPage() {
  const { supabaseAdmin } = await import('../../../lib/supabase-admin')

  const { data: articles, error, count } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, generation_approach, created_at, reading_time_minutes, content, meta_description, tags, slug', { count: 'exact' })
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div style={{ color: '#f87171', padding: '24px' }}>
        Erro: {error.message}
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div style={{ color: '#fff', padding: '24px' }}>
        <div>Debug: query correu sem erro</div>
        <div>Count: {count}</div>
        <div>Articles length: {articles?.length ?? 'null'}</div>
        <div>Raw data: {JSON.stringify(articles)}</div>
      </div>
    )
  }

  return <PendingReviewClient articles={articles ?? []} />
}
