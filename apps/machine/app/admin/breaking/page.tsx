export const dynamic = 'force-dynamic'

export default async function BreakingPage() {
  const { supabaseAdmin } = await import('../../../lib/supabase-admin')

  const { data: articles, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, app_id, generation_approach, published_at, slug, content, meta_description')
    .eq('status', 'published')
    .eq('generation_approach', 'breaking_news')
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) {
    return (
      <div style={{ color: '#f87171', padding: '24px' }}>
        Erro ao carregar breakings: {error.message}
      </div>
    )
  }

  const BreakingClient = (await import('./BreakingClient')).default
  return <BreakingClient articles={articles ?? []} />
}
