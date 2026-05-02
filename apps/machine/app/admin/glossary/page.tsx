import GlossaryClient from './GlossaryClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GlossaryPage() {
  const { supabaseAdmin } = await import('../../../lib/supabase-admin')

  const { data: rules, error } = await supabaseAdmin
    .from('editorial_glossary')
    .select('*')
    .order('times_applied', { ascending: false })

  const { data: preserve, error: preserveError } = await supabaseAdmin
    .from('editorial_preserve_terms')
    .select('*')
    .order('created_at', { ascending: true })

  if (error || preserveError) {
    return (
      <div style={{ color: '#f87171', padding: '24px' }}>
        Erro: {error?.message ?? preserveError?.message}
      </div>
    )
  }

  return <GlossaryClient rules={rules ?? []} preserve={preserve ?? []} />
}
