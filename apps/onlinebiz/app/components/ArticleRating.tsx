'use client'

import { useEffect, useState } from 'react'

interface RatingStats {
  averageRating: number
  totalRatings: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ArticleRatingProps {
  articleId: string
  email?: string
}

export default function ArticleRating({
  articleId,
  email,
}: ArticleRatingProps) {
  const [userRating, setUserRating] = useState<number | null>(null)
  const [stats, setStats] = useState<RatingStats | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const url = email
          ? `/api/articles/ratings?article_id=${articleId}&email=${email}`
          : `/api/articles/ratings?article_id=${articleId}`

        const response = await fetch(url)
        const data = await response.json()
        setUserRating(data.userRating?.rating || null)
        setStats(data.stats)
      } catch (error) {
        console.error('Error fetching ratings:', error)
      } finally {
        setLoading(false)
      }
    }

    if (articleId) {
      fetchRatings()
    }
  }, [articleId, email])

  const handleRate = async (rating: number) => {
    if (!email) {
      alert('Please provide your email to rate this article')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/articles/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          email,
          rating,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit rating')
      }

      setUserRating(rating)

      const refreshResponse = await fetch(
        `/api/articles/ratings?article_id=${articleId}`
      )
      const refreshData = await refreshResponse.json()
      setStats(refreshData.stats)
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading ratings...</div>
  }

  if (!stats) {
    return null
  }

  return (
    <div className="my-8 bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          How helpful was this article?
        </h3>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                disabled={submitting}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                className={`text-3xl transition-colors ${
                  (hoveredRating !== null
                    ? star <= hoveredRating
                    : star <= (userRating || 0))
                    ? 'text-green-400'
                    : 'text-gray-300'
                } ${submitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                ★
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {userRating && `You rated: ${userRating} star${userRating !== 1 ? 's' : ''}`}
          </span>
        </div>

        <div className="text-sm text-gray-600">
          <div className="font-semibold mb-2">
            {stats.averageRating.toFixed(1)} / 5 ({stats.totalRatings}{' '}
            rating{stats.totalRatings !== 1 ? 's' : ''})
          </div>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats.distribution[stars as keyof typeof stats.distribution]
            const percentage =
              stats.totalRatings > 0
                ? ((count / stats.totalRatings) * 100).toFixed(0)
                : 0
            return (
              <div key={stars} className="flex items-center gap-2 mb-1">
                <span className="text-xs w-6">{stars}★</span>
                <div className="w-24 h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-green-400 rounded"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
