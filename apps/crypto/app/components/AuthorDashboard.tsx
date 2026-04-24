'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Users, Eye, MessageSquare, TrendingUp } from 'lucide-react'

interface AuthorArticle {
  id: string
  title: string
  slug: string
  views: number
  status: string
  published_at: string
  rating?: number
}

interface AuthorStats {
  totalArticles: number
  totalViews: number
  totalFollowers: number
  avgRating: number
  articles: AuthorArticle[]
}

interface AuthorDashboardProps {
  email: string
}

export default function AuthorDashboard({ email }: AuthorDashboardProps) {
  const [stats, setStats] = useState<AuthorStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuthorStats()
  }, [email])

  const fetchAuthorStats = async () => {
    try {
      setLoading(true)
      // Fetch author profile
      const profileRes = await fetch(
        `/api/users/profile-public?email=${encodeURIComponent(email)}`
      )
      const profileData = await profileRes.json()

      // Fetch author's articles
      const articlesRes = await fetch(
        `/api/articles/search-advanced?author=${encodeURIComponent(email)}&limit=100`
      )
      const articlesData = await articlesRes.json()

      // Calculate stats
      const articles = articlesData.articles || []
      const totalViews = articles.reduce((sum: number, a: any) => sum + a.views, 0)
      const avgRating = profileData.profile?.avg_rating || 0

      setStats({
        totalArticles: articles.length,
        totalViews,
        totalFollowers: profileData.profile?.followers_count || 0,
        avgRating,
        articles,
      })
    } catch (error) {
      console.error('Error fetching author stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Unable to load author statistics</div>
  }

  const topArticles = [...stats.articles].sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Author Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your articles and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Articles</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{stats.totalArticles}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Views</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {(stats.totalViews / 1000).toFixed(1)}k
              </p>
            </div>
            <Eye className="h-8 w-8 text-purple-400 opacity-50" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Followers</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{stats.totalFollowers}</p>
            </div>
            <Users className="h-8 w-8 text-green-400 opacity-50" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Avg Rating</p>
              <p className="text-3xl font-bold text-orange-900 mt-1">{stats.avgRating.toFixed(1)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Top Articles */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Articles</h2>
        <div className="space-y-3">
          {topArticles.map((article, idx) => (
            <div
              key={article.id}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-500 w-6">#{idx + 1}</span>
                  <Link href={`/articles/${article.slug}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {article.title}
                  </Link>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(article.published_at).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{article.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500">views</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Articles */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">All Articles ({stats.totalArticles})</h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Title</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">Views</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/articles/${article.slug}`} className="hover:text-blue-600">
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 font-medium">
                    {article.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(article.published_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
