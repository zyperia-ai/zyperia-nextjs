'use client'

import { useEffect, useState } from 'react'

interface Comment {
  id: string
  author_name: string
  content: string
  likes: number
  created_at: string
}

interface CommentsListProps {
  articleId: string
}

export default function CommentsList({ articleId }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `/api/articles/comments?article_id=${articleId}`
        )
        const data = await response.json()
        setComments(data.comments || [])
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    if (articleId) {
      fetchComments()
    }
  }, [articleId])

  const handleLike = async (commentId: string) => {
    try {
      await fetch(`/api/articles/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      })
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      )
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading comments...</div>
  }

  if (comments.length === 0) {
    return null
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">
        Discussion ({comments.length})
      </h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg p-4 border">
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-slate-900">
                {comment.author_name}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{comment.content}</p>
            <button
              onClick={() => handleLike(comment.id)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              👍 {comment.likes > 0 && comment.likes}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
