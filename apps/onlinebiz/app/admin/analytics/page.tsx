'use client'

import { useEffect, useState } from 'react'

interface Metrics {
  totalArticles: number
  publishedArticles: number
  totalViews: number
  totalSubscribers: number
  recentSubscribers: number
  avgViewsPerArticle: number
}

interface Article {
  id: string
  title: string
  views: number
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [topArticles, setTopArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics')
        if (!response.ok) throw new Error('Failed to fetch analytics')

        const data = await response.json()
        setMetrics(data.metrics)
        setTopArticles(data.topArticles)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Analytics</h1>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Views</h3>
              <p className="text-4xl font-bold text-green-600">{metrics.totalViews}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Subscribers</h3>
              <p className="text-4xl font-bold text-green-600">{metrics.totalSubscribers}</p>
              <p className="text-sm text-gray-500 mt-2">
                {metrics.recentSubscribers} in last 30 days
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Avg Views/Article</h3>
              <p className="text-4xl font-bold text-blue-600">{metrics.avgViewsPerArticle}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Articles</h2>
            {metrics && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">{metrics.totalArticles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published</span>
                  <span className="font-semibold">{metrics.publishedArticles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drafts</span>
                  <span className="font-semibold">
                    {metrics.totalArticles - metrics.publishedArticles}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Top Articles</h2>
            {topArticles.length === 0 ? (
              <p className="text-gray-600">No articles yet.</p>
            ) : (
              <ul className="space-y-3">
                {topArticles.map((article) => (
                  <li key={article.id} className="flex justify-between items-center">
                    <span className="text-gray-700 truncate">{article.title}</span>
                    <span className="text-sm font-semibold text-green-600 ml-2">
                      {article.views} views
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
