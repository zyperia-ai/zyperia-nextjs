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

export default function RecommendedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      const email = localStorage.getItem('user_email')
      if (!email) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/articles/recommendations?email=${email}&limit=4`)
        const data = await response.json()
        setArticles(data.recommendations || [])
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading || articles.length === 0) {
    return null
  }

  return (
    <div className="my-12">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Recommended for You</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 h-full cursor-pointer">
              <h4 className="font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-purple-600">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
              <p className="text-xs text-gray-500">{article.views} views</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
