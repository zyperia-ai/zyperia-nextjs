'use client'

import { useState } from 'react'
import { X, Mail, CheckCircle2 } from 'lucide-react'

interface NewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.status === 409) {
        setError('This email is already subscribed')
        setLoading(false)
        return
      }

      if (response.ok) {
        setSubmitted(true)
        setEmail('')
        setTimeout(() => {
          onClose()
          setSubmitted(false)
        }, 2000)
      } else {
        setError('Failed to subscribe. Please try again.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Subscribe to Newsletter</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-900 font-medium">Thank you for subscribing!</p>
              <p className="text-gray-600 text-sm mt-2">Check your email for confirmation</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Get the latest crypto insights, analysis, and market updates delivered to your inbox
                weekly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                <label className="flex items-start gap-2">
                  <input type="checkbox" defaultChecked className="mt-0.5" />
                  <span>
                    I'd like to receive weekly crypto insights and market updates from Crypto Zyperia
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input type="checkbox" defaultChecked className="mt-0.5" />
                  <span>I agree to the privacy policy and terms of service</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
