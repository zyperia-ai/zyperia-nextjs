'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Bookmark {
  id: string
  article_id: string
  saved_at: string
}

export default function BookmarksList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const userEmail = localStorage.getItem('user_email')
    if (userEmail) {
      setEmail(userEmail)
      fetchBookmarks(userEmail)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchBookmarks = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/users/bookmarks?email=${userEmail}`)
      const data = await response.json()
      setBookmarks(data.bookmarks || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="text-center py-8 text-gray-600">
        Please log in to see your bookmarks
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading bookmarks...</div>
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No bookmarks yet</p>
        <p className="text-sm">Click the bookmark icon to save articles for later</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Bookmarks</h2>
      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{bookmark.article_id}</p>
                <p className="text-sm text-gray-500">
                  Saved {new Date(bookmark.saved_at).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/articles/${bookmark.article_id}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                Read →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
