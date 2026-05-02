import ArticlesClient from './ArticlesClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ArticlesPage() {
  const { supabaseAdmin } = await import('../../../lib/supabase-admin')

  const { data: articles, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, generation_approach, status, created_at, published_at, scheduled_for, reading_time_minutes, slug')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return (
      <div style={{ color: '#f87171', padding: '24px' }}>
        Erro ao carregar artigos: {error.message}
      </div>
    )
  }

  return <ArticlesClient articles={articles ?? []} />
}
