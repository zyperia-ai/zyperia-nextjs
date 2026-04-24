'use client'

import { useEffect, useState } from 'react'

interface FollowButtonProps {
  targetEmail: string
  currentUserEmail?: string
}

export default function FollowButton({
  targetEmail,
  currentUserEmail,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUserEmail) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `/api/users/follows?email=${currentUserEmail}&type=following`
        )
        const data = await response.json()
        setIsFollowing(data.following?.includes(targetEmail) || false)
      } catch (err) {
        console.error('Error checking follow status:', err)
      } finally {
        setLoading(false)
      }
    }

    checkFollowStatus()
  }, [currentUserEmail, targetEmail])

  const handleFollow = async () => {
    if (!currentUserEmail) {
      setError('Please provide your email to follow')
      return
    }

    setLoading(true)
    setError('')

    try {
      const method = isFollowing ? 'DELETE' : 'POST'
      const response = await fetch('/api/users/follows', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerEmail: currentUserEmail,
          followingEmail: targetEmail,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update follow status')
      }

      setIsFollowing(!isFollowing)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!currentUserEmail) {
    return (
      <button disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed text-sm font-medium">
        Log in to follow
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isFollowing
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
      </button>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  )
}
