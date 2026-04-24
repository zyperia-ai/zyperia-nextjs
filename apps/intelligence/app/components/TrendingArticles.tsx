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

interface TrendingArticlesProps {
  timeRange?: '24h' | '7d' | '30d'
  limit?: number
}

export default function TrendingArticles({
  timeRange = '7d',
  limit = 5,
}: TrendingArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`/api/articles/trending?range=${timeRange}&limit=${limit}`)
        const data = await response.json()
        setArticles(data.articles || [])
      } catch (error) {
        console.error('Error fetching trending articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [timeRange, limit])

  if (loading) {
    return <div className="text-center py-4">Loading trending articles...</div>
  }

  if (articles.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 my-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">🔥 Trending Now</h3>
      <div className="space-y-3">
        {articles.map((article, index) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start">
                <span className="text-2xl font-bold text-purple-600 mr-4 min-w-fit">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 hover:text-purple-600 mb-1">
                    {article.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {article.excerpt}
                  </p>
                  <p className="text-xs text-gray-500">{article.views} views</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
