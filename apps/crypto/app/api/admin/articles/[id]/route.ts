import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: article, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('app_id', 'crypto')
      .single()

    if (error) throw error
    if (!article) return Response.json({ error: 'Article not found' }, { status: 404 })

    return Response.json({ article }, { status: 200 })
  } catch (error) {
    console.error('Error fetching article:', error)
    return Response.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, content, excerpt, status } = body

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title,
        slug,
        content,
        excerpt,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .eq('app_id', 'crypto')
      .select()

    if (error) throw error

    return Response.json({ article: data[0] }, { status: 200 })
  } catch (error) {
    console.error('Error updating article:', error)
    return Response.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .eq('app_id', 'crypto')

    if (error) throw error

    return Response.json({ message: 'Article deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting article:', error)
    return Response.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
