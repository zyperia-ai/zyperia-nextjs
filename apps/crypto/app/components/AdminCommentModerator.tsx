'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, X, MessageCircle } from 'lucide-react'

interface Comment {
  id: string
  article_id: string
  author_name: string
  email: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  likes: number
  created_at: string
}

export default function AdminCommentModerator() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'pending'
  )

  useEffect(() => {
    fetchComments()
  }, [filterStatus])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const params = filterStatus !== 'all' ? `?status=${filterStatus}` : ''
      const response = await fetch(`/api/admin/comments${params}`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (commentId: string) => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: commentId,
          action: 'approve',
        }),
      })

      if (response.ok) {
        setComments(
          comments.map((c) => (c.id === commentId ? { ...c, status: 'approved' } : c))
        )
      }
    } catch (error) {
      console.error('Error approving comment:', error)
    }
  }

  const handleReject = async (commentId: string) => {
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment_id: commentId,
          action: 'reject',
        }),
      })

      if (response.ok) {
        setComments(
          comments.map((c) => (c.id === commentId ? { ...c, status: 'rejected' } : c))
        )
      }
    } catch (error) {
      console.error('Error rejecting comment:', error)
    }
  }

  const filteredComments = comments

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Comment Moderation</h2>
        <p className="text-gray-600 mt-1">Review and moderate user comments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filterStatus === status
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Comments List */}
      {!loading && filteredComments.length > 0 && (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{comment.author_name}</p>
                  <p className="text-xs text-gray-500">{comment.email}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    comment.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : comment.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                </span>
              </div>

              {/* Comment Content */}
              <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded border border-gray-200">
                {comment.content}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {comment.likes} likes
                </span>
              </div>

              {/* Actions */}
              {comment.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(comment.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(comment.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredComments.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No {filterStatus !== 'all' ? filterStatus : ''} comments</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {comments.filter((c) => c.status === 'pending').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {comments.filter((c) => c.status === 'approved').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {comments.filter((c) => c.status === 'rejected').length}
          </p>
        </div>
      </div>
    </div>
  )
}
