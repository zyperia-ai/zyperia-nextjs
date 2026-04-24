export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('app_id', 'onlinebiz')
      .order('subscribed_at', { ascending: false })

    if (error) throw error

    return Response.json({ subscribers }, { status: 200 })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}
