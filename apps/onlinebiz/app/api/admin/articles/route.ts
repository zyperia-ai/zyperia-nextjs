export const dynamic = 'force-dynamic'; export const runtime = 'nodejs';
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data: articles, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', 'onlinebiz')
      .order('published_at', { ascending: false })

    if (error) throw error

    return Response.json({ articles }, { status: 200 })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return Response.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, excerpt, status } = body

    if (!title || !slug || !content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        app_id: 'onlinebiz',
        title,
        slug,
        content,
        excerpt: excerpt || '',
        status: status || 'draft',
        published_at: status === 'published' ? new Date().toISOString() : null,
        views: 0,
      })
      .select()

    if (error) throw error

    return Response.json({ article: data[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return Response.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
