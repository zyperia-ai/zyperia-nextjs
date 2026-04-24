'use client'

import { useState } from 'react'

interface CommentFormProps {
  articleId: string
  onCommentAdded?: () => void
}

export default function CommentForm({
  articleId,
  onCommentAdded,
}: CommentFormProps) {
  const [email, setEmail] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  )
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !authorName || !content.trim()) {
      setMessage('Please fill in all fields')
      setStatus('error')
      return
    }

    if (content.length > 500) {
      setMessage('Comment is too long (max 500 characters)')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/articles/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          email,
          authorName,
          content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to post comment')
      }

      setMessage('Comment posted! It will appear after moderation.')
      setStatus('success')
      setEmail('')
      setAuthorName('')
      setContent('')
      setTimeout(() => setStatus('idle'), 3000)

      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      setMessage('Error posting comment')
      setStatus('error')
    }
  }

  return (
    <div className="my-8 bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Leave a Comment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Comment ({content.length}/500)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {message && (
          <p
            className={`text-sm ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          {status === 'loading' ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        Comments are moderated before appearing. Please be respectful and follow
        community guidelines.
      </p>
    </div>
  )
}
