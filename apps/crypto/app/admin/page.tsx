'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  status: string
  views: number
  published_at: string
}

interface Subscriber {
  id: string
  email: string
  status: string
  subscribed_at: string
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'articles' | 'subscribers'>('articles')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, subscribersRes] = await Promise.all([
          fetch('/api/admin/articles'),
          fetch('/api/admin/subscribers'),
        ])

        if (!articlesRes.ok || !subscribersRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const articlesData = await articlesRes.json()
        const subscribersData = await subscribersRes.json()

        setArticles(articlesData.articles || [])
        setSubscribers(subscribersData.subscribers || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete article')

      setArticles(articles.filter((a) => a.id !== id))
    } catch (err) {
      alert('Error deleting article')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <Link
            href="/admin/articles/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Create Article
          </Link>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'articles'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300'
            }`}
          >
            Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'subscribers'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300'
            }`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>

        {activeTab === 'articles' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Articles</h2>
            {articles.length === 0 ? (
              <p className="text-gray-600">No articles yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Title</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Views</th>
                      <th className="text-left py-3 px-4 font-semibold">Published</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{article.title}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              article.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {article.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{article.views}</td>
                        <td className="py-3 px-4">
                          {new Date(article.published_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/articles/${article.id}/edit`}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Newsletter Subscribers</h2>
            {subscribers.length === 0 ? (
              <p className="text-gray-600">No subscribers yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{subscriber.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
