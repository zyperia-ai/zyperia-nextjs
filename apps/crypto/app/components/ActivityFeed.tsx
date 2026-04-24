'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Eye } from 'lucide-react'

interface Author {
  display_name: string
  avatar_url: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  slug: string
  views: number
  published_at: string
  author_email: string
  user_author_profiles: Author
}

interface ActivityFeedProps {
  email: string
  limit?: number
}

export default function ActivityFeed({ email, limit = 20 }: ActivityFeedProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)

  const fetchFeed = useCallback(
    async (pageOffset: number) => {
      try {
        const response = await fetch(
          `/api/users/activity-feed?email=${encodeURIComponent(email)}&limit=${limit}&offset=${pageOffset}`
        )
        const data = await response.json()
        if (pageOffset === 0) {
          setArticles(data.articles || [])
        } else {
          setArticles((prev) => [...prev, ...(data.articles || [])])
        }
        setTotal(data.total || 0)
      } catch (error) {
        console.error('Error fetching activity feed:', error)
      } finally {
        setLoading(false)
      }
    },
    [email, limit]
  )

  useEffect(() => {
    fetchFeed(0)
  }, [email, fetchFeed])

  const handleLoadMore = () => {
    const newOffset = offset + limit
    setOffset(newOffset)
    fetchFeed(newOffset)
  }

  if (loading && articles.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 h-48 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No articles from people you follow yet.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Follow authors to see their latest articles here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <article
          key={article.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            {/* Author info */}
            <div className="flex items-center gap-3 mb-4">
              {article.user_author_profiles?.avatar_url && (
                <Image
                  src={article.user_author_profiles.avatar_url}
                  alt={article.user_author_profiles.display_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {article.user_author_profiles?.display_name || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(article.published_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Article title and excerpt */}
            <Link href={`/articles/${article.slug}`}>
              <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 mb-2">
                {article.title}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>

            {/* Stats */}
            <div className="flex gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {article.views}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                Comments
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                Likes
              </span>
            </div>

            {/* Read more */}
            <Link
              href={`/articles/${article.slug}`}
              className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-700"
            >
              Read article →
            </Link>
          </div>
        </article>
      ))}

      {/* Load more button */}
      {articles.length < total && (
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load more articles'}
        </button>
      )}
    </div>
  )
}
