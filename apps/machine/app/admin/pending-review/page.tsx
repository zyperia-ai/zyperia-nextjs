import PendingReviewClient from './PendingReviewClient'

export const dynamic = 'force-dynamic'

export default async function PendingReviewPage() {
  // Lazy load supabaseAdmin apenas em runtime
  const { supabaseAdmin } = await import('../../../lib/supabase-admin')

  const { data: articles, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, generation_approach, created_at, reading_time_minutes, content, meta_description, tags, slug')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div style={{ color: '#f87171', padding: '24px' }}>
        Erro ao carregar artigos: {error.message}
      </div>
    )
  }

  return <PendingReviewClient articles={articles ?? []} />
}
