import QueueClient from './QueueClient'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function QueuePage() {
  // Lazy load supabaseAdmin apenas em runtime
  const { supabaseAdmin } = await import('../../../lib/supabase-admin')

  const { data: articles, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, generation_approach, created_at, scheduled_for, reading_time_minutes, slug')
    .eq('status', 'approved')
    .order('scheduled_for', { ascending: true, nullsFirst: false })

  if (error) {
    return (
      <div style={{ color: '#f87171', padding: '24px' }}>
        Erro ao carregar fila: {error.message}
      </div>
    )
  }

  return <QueueClient articles={articles ?? []} />
}
