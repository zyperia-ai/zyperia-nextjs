import { MetadataRoute } from 'next'

const BASE_URL = 'https://onlinebiz.zyperia.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages always present
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Articles from Supabase — only if env vars available
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return staticPages
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: articles } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('app_id', 'onlinebiz')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    const articleSitemap: MetadataRoute.Sitemap = (articles || []).map(
      (article) => ({
        url: `${BASE_URL}/articles/${article.slug}`,
        lastModified: new Date(article.updated_at || article.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    )

    return [...staticPages, ...articleSitemap]
  } catch {
    return staticPages
  }
}
