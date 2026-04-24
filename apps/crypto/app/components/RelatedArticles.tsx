'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  views: number
}

interface RelatedArticlesProps {
  articleId: string
  limit?: number
}

export default function RelatedArticles({
  articleId,
  limit = 3,
}: RelatedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(
          `/api/articles/related?article_id=${articleId}&limit=${limit}`
        )
        const data = await response.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error('Error fetching related articles:', error)
      } finally {
        setLoading(false)
      }
    }

    if (articleId) {
      fetchRelated()
    }
  }, [articleId, limit])

  if (loading || articles.length === 0) {
    return null
  }

  return (
    <div className="my-12 border-t pt-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 h-full cursor-pointer">
              <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-blue-600">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{article.views} views</span>
                <span className="text-blue-600 font-semibold">Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
