'use client'

import { useState } from 'react'

type DigestFrequency = 'off' | 'daily' | 'weekly'

export default function DigestPreferences() {
  const [frequency, setFrequency] = useState<DigestFrequency>('weekly')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!email) {
      setMessage('Please enter your email')
      setStatus('error')
      return
    }

    setStatus('loading')
    try {
      const response = await fetch('/api/emails/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency }),
      })

      if (!response.ok) throw new Error('Failed to update preference')

      setStatus('success')
      setMessage('Digest preference updated!')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (error) {
      setStatus('error')
      setMessage('Error updating preference')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Email Digest</h3>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Frequency
        </label>
        <div className="space-y-3">
          {(['off', 'daily', 'weekly'] as const).map((option) => (
            <label key={option} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value={option}
                checked={frequency === option}
                onChange={(e) => setFrequency(e.target.value as DigestFrequency)}
                className="mr-3"
              />
              <span className="text-gray-700 capitalize">
                {option === 'off'
                  ? 'No digest'
                  : option === 'daily'
                    ? 'Daily digest'
                    : 'Weekly digest'}
              </span>
            </label>
          ))}
        </div>
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

      <button
        onClick={handleSave}
        disabled={status === 'loading'}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        {status === 'loading' ? 'Saving...' : 'Save Preferences'}
      </button>

      <p className="text-xs text-gray-500 mt-4">
        {frequency === 'off'
          ? "You won't receive any digest emails"
          : frequency === 'daily'
            ? 'Get the best articles from today delivered each morning'
            : 'Get the best articles from the week delivered every Monday'}
      </p>
    </div>
  )
}
