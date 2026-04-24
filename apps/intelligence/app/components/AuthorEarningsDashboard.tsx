'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, FileText, Users, Calendar, AlertCircle } from 'lucide-react'

interface EarningsData {
  totalEarnings: number
  articleEarnings: number
  affiliateEarnings: number
  referralEarnings: number
  thisMonthEarnings: number
  articleCount: number
  totalViews: number
  averageEarningsPerArticle: number
}

interface ArticleEarning {
  articleId: string
  title: string
  earnings: number
  views: number
  publishedAt: string
}

interface PaymentInfo {
  lastPaymentDate: string | null
  nextPaymentDate: string
  accountStatus: 'active' | 'pending' | 'suspended'
}

interface EarningsResponse {
  author: {
    name: string
    email: string
    verified: boolean
  }
  earnings: EarningsData
  articles: ArticleEarning[]
  payment: PaymentInfo
}

export default function AuthorEarningsDashboard() {
  const [data, setData] = useState<EarningsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState<'earnings' | 'views'>('earnings')
  const [email, setEmail] = useState('')
  const [showLoginForm, setShowLoginForm] = useState(true)

  const handleFetchEarnings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/authors/earnings?email=${email}`)
      if (!response.ok) throw new Error('Failed to fetch earnings')

      const result = await response.json()
      setData(result)
      setShowLoginForm(false)
      localStorage.setItem('author_email', email)
    } catch (err) {
      setError('Could not load earnings data. Please check your email.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedEmail = localStorage.getItem('author_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setLoading(true)
      fetch(`/api/authors/earnings?email=${savedEmail}`)
        .then(r => r.json())
        .then(d => {
          setData(d)
          setShowLoginForm(false)
        })
        .catch(err => setError('Failed to load earnings'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showLoginForm || !data) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Author Earnings</h2>

          <form onSubmit={handleFetchEarnings} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Loading...' : 'View Earnings'}
            </button>
          </form>

          <p className="text-xs text-gray-600 mt-4 text-center">
            Log in with your author email to view earnings and payment history.
          </p>
        </div>
      </div>
    )
  }

  const sortedArticles = [...data.articles].sort((a, b) =>
    sortBy === 'earnings' ? b.earnings - a.earnings : b.views - a.views
  )

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="font-semibold">{data.author.name}</span>
            {data.author.verified && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✓ Verified</span>}
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('author_email')
            setShowLoginForm(true)
            setEmail('')
          }}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
        >
          Logout
        </button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${data.earnings.totalEarnings.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                ${data.earnings.thisMonthEarnings.toFixed(2)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">From Articles</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">
                ${data.earnings.articleEarnings.toFixed(2)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Affiliates</p>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                ${data.earnings.affiliateEarnings.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Referrals</p>
              <p className="text-2xl font-bold text-pink-900 mt-2">
                ${data.earnings.referralEarnings.toFixed(2)}
              </p>
            </div>
            <Users className="h-8 w-8 text-pink-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Articles Published</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{data.earnings.articleCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            Avg: ${data.earnings.averageEarningsPerArticle.toFixed(2)}/article
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Total Views</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {(data.earnings.totalViews / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ${(data.earnings.totalViews / 1000 * 0.02).toFixed(2)} earned
          </p>
        </div>

        <div className={`border rounded-lg p-6 ${
          data.payment.accountStatus === 'active'
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <p className={`text-sm font-medium ${
            data.payment.accountStatus === 'active'
              ? 'text-green-700'
              : 'text-yellow-700'
          }`}>
            Payment Status
          </p>
          <p className={`text-lg font-bold mt-2 ${
            data.payment.accountStatus === 'active'
              ? 'text-green-900'
              : 'text-yellow-900'
          }`}>
            {data.payment.accountStatus.charAt(0).toUpperCase() + data.payment.accountStatus.slice(1)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Next payment: {new Date(data.payment.nextPaymentDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Top Articles */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Top Performing Articles</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('earnings')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sortBy === 'earnings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Earnings
              </button>
              <button
                onClick={() => setSortBy('views')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sortBy === 'views'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                By Views
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Views</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Published</th>
              </tr>
            </thead>
            <tbody>
              {sortedArticles.slice(0, 10).map((article) => (
                <tr key={article.articleId} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{article.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ${article.earnings.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.articles.length > 10 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Showing 10 of {data.articles.length} articles
            </p>
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Last Payment</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {data.payment.lastPaymentDate
                ? new Date(data.payment.lastPaymentDate).toLocaleDateString()
                : 'No payments yet'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Next Payment</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {new Date(data.payment.nextPaymentDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Minimum Payout Threshold</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">$10.00</p>
            <p className="text-xs text-gray-600 mt-1">
              {data.earnings.totalEarnings >= 10
                ? '✓ Eligible for payout'
                : `$${(10 - data.earnings.totalEarnings).toFixed(2)} to go`}
            </p>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 How earnings work:</span> Articles earn $0.02 per 1,000 views. Affiliate commissions are calculated based on sales. Referral bonuses are $5 per successful conversion.
        </p>
      </div>
    </div>
  )
}
