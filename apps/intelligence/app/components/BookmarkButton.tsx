'use client'

import { useState } from 'react'

interface BookmarkButtonProps {
  articleId: string
  articleTitle?: string
}

export default function BookmarkButton({
  articleId,
  articleTitle = 'Article',
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleBookmark = async () => {
    const email = localStorage.getItem('user_email')
    if (!email) {
      alert('Please log in to bookmark articles')
      return
    }

    setStatus('loading')
    try {
      const response = await fetch('/api/users/bookmarks', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, article_id: articleId }),
      })

      if (response.status === 409) {
        setIsBookmarked(true)
        setStatus('success')
        return
      }

      if (!response.ok) throw new Error('Failed to bookmark')

      setIsBookmarked(!isBookmarked)
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={status === 'loading'}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        isBookmarked
          ? 'bg-purple-100 text-purple-700 border border-purple-300'
          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
      } disabled:opacity-50`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
    >
      <span className="text-lg">{isBookmarked ? '📌' : '🔖'}</span>
      <span>{isBookmarked ? 'Saved' : 'Save'}</span>
    </button>
  )
}
