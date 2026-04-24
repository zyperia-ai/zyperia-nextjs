'use client'

import { useState } from 'react'

interface PreferencesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState({
    newsletter: true,
    weeklyDigest: true,
    newArticles: true,
    productUpdates: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!email) {
      setMessage('Please enter your email')
      return
    }

    setStatus('loading')
    try {
      const response = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences }),
      })

      if (!response.ok) throw new Error('Failed to save preferences')

      setStatus('success')
      setMessage('Preferences saved!')
      setTimeout(() => {
        onClose()
        setStatus('idle')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setMessage('Error saving preferences')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Preferences</h2>

        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="space-y-3 mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.newsletter}
              onChange={(e) =>
                setPreferences({ ...preferences, newsletter: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Subscribe to newsletter</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.weeklyDigest}
              onChange={(e) =>
                setPreferences({ ...preferences, weeklyDigest: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Weekly digest</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.newArticles}
              onChange={(e) =>
                setPreferences({ ...preferences, newArticles: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Notify on new articles</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={preferences.productUpdates}
              onChange={(e) =>
                setPreferences({ ...preferences, productUpdates: e.target.checked })
              }
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Product updates</span>
          </label>
        </div>

        {message && (
          <p
            className={`text-sm mb-4 ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={status === 'loading'}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
          >
            {status === 'loading' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
