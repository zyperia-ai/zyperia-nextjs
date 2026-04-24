'use client'

import { useEffect, useState } from 'react'

interface ReferralCode {
  code: string
  clicks: number
  conversions: number
  earnings: number
}

export default function ReferralDashboard() {
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerateCode = async () => {
    if (!email) {
      alert('Please enter your email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/referrals/generate?email=${email}`)
      const data = await response.json()
      setReferralCode(data.referralCode)
      localStorage.setItem('user_email', email)
    } catch (error) {
      alert('Error generating referral code')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (!referralCode) return

    const referralUrl = `${window.location.origin}?ref=${referralCode.code}`
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Earn with Referrals</h2>
      <p className="text-gray-700 mb-6">Share and earn money from every referral</p>

      {!referralCode ? (
        <div className="bg-white rounded-lg p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Email Address
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleGenerateCode}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">Clicks</p>
              <p className="text-4xl font-bold text-purple-600">{referralCode.clicks}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">Conversions</p>
              <p className="text-4xl font-bold text-green-600">{referralCode.conversions}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">Earnings</p>
              <p className="text-4xl font-bold text-purple-600">
                ${referralCode.earnings.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Referral Code
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={referralCode.code}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 font-mono"
              />
              <button
                onClick={handleCopyLink}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {copied ? '✓ Copied' : 'Copy Link'}
              </button>
            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Share Your Link
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold">
                Share on Twitter
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold">
                Share on WhatsApp
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold">
                Share on Email
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold">
                Copy Link
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
