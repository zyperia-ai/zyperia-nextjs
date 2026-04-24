'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  views: number
  published_at: string
  featured_image_url?: string
}

interface CategoryPageProps {
  tag: string
  appName?: string
}

export default function CategoryPage({
  tag,
  appName = 'Crypto Insights',
}: CategoryPageProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticlesByTag()
  }, [tag])

  const fetchArticlesByTag = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/articles/search-advanced?tag=${encodeURIComponent(tag)}&limit=50`
      )
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1)
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/articles" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        <h1 className="text-4xl font-bold text-gray-900">{formattedTag}</h1>
        <p className="text-gray-600 mt-2">
          {articles.length} article{articles.length !== 1 ? 's' : ''} •{' '}
          {totalViews.toLocaleString()} total views
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Articles Grid */}
      {!loading && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {article.featured_image_url && (
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{article.views.toLocaleString()} views</span>
                  </div>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No articles found in this category</p>
          <p className="text-gray-400 mt-1">Try exploring other categories</p>
        </div>
      )}

      {/* Related Categories */}
      {!loading && (
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {['Bitcoin', 'Ethereum', 'DeFi', 'NFT', 'Blockchain'].map((relatedTag) => (
              <Link
                key={relatedTag}
                href={`/category/${relatedTag.toLowerCase()}`}
                className="px-3 py-1 bg-white border border-blue-200 rounded-full text-sm text-blue-600 hover:bg-blue-100 transition-colors"
              >
                {relatedTag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
