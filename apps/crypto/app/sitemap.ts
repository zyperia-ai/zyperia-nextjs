import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BASE_URL = 'https://crypto.zyperia.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all published articles
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('app_id', 'crypto')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    // Build sitemap entries for articles
    const articleSitemap: MetadataRoute.Sitemap = (articles || []).map(
      (article) => ({
        url: `${BASE_URL}/articles/${article.slug}`,
        lastModified: new Date(article.updated_at || article.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    )

    // Static pages
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

    return [...staticPages, ...articleSitemap]
  } catch (error) {
    console.error('Sitemap generation error:', error)
    // Return minimal sitemap on error
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ]
  }
}
