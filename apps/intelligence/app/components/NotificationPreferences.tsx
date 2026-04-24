'use client'

import { useEffect, useState } from 'react'

interface Preferences {
  new_articles_from_followed: boolean
  weekly_digest: boolean
  newsletter: boolean
  comments_on_articles: boolean
}

interface NotificationPreferencesProps {
  email?: string
}

export default function NotificationPreferences({
  email,
}: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState<Preferences>({
    new_articles_from_followed: true,
    weekly_digest: true,
    newsletter: true,
    comments_on_articles: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!email) {
      setLoading(false)
      return
    }

    const fetchPreferences = async () => {
      try {
        const response = await fetch(
          `/api/users/notification-preferences?email=${encodeURIComponent(email)}`
        )
        const data = await response.json()
        setPrefs(data.preferences)
      } catch (error) {
        console.error('Error fetching preferences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [email])

  const handleToggle = (key: keyof Preferences) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    if (!email) {
      setMessage('Email is required')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/users/notification-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newArticlesFromFollowed: prefs.new_articles_from_followed,
          weeklyDigest: prefs.weekly_digest,
          newsletter: prefs.newsletter,
          commentsOnArticles: prefs.comments_on_articles,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      setMessage('✅ Preferences saved!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('❌ Error saving preferences')
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading preferences...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h3 className="text-xl font-bold text-slate-900 mb-6">
        Notification Preferences
      </h3>

      <div className="space-y-4 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.new_articles_from_followed}
            onChange={() =>
              handleToggle('new_articles_from_followed')
            }
            className="w-5 h-5 rounded"
          />
          <span className="text-gray-700">
            New articles from followed authors
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.weekly_digest}
            onChange={() => handleToggle('weekly_digest')}
            className="w-5 h-5 rounded"
          />
          <span className="text-gray-700">Weekly digest email</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.newsletter}
            onChange={() => handleToggle('newsletter')}
            className="w-5 h-5 rounded"
          />
          <span className="text-gray-700">Newsletter subscription</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs.comments_on_articles}
            onChange={() => handleToggle('comments_on_articles')}
            className="w-5 h-5 rounded"
          />
          <span className="text-gray-700">
            Replies to my comments
          </span>
        </label>
      </div>

      {message && (
        <p className="text-sm text-center mb-4 text-purple-600">{message}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  )
}
