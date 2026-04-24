'use client'

import { useEffect, useState } from 'react'

interface Metrics {
  totalRevenue: number
  conversionCount: number
  clickCount: number
  affiliateCount: number
  conversionRate: number
}

interface Affiliate {
  code: string
  revenue: number
}

export default function RevenuePage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [topAffiliates, setTopAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch('/api/admin/revenue/stats')
        if (!response.ok) throw new Error('Failed to fetch revenue data')

        const data = await response.json()
        setMetrics(data.metrics)
        setTopAffiliates(data.topAffiliates)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading revenue data')
      } finally {
        setLoading(false)
      }
    }

    fetchRevenue()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading revenue data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Revenue Analytics</h1>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">
                ${metrics.totalRevenue.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Conversions</h3>
              <p className="text-3xl font-bold text-purple-600">{metrics.conversionCount}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Clicks</h3>
              <p className="text-3xl font-bold text-purple-600">{metrics.clickCount}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold text-orange-600">{metrics.conversionRate}%</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Affiliates</h3>
              <p className="text-3xl font-bold text-indigo-600">{metrics.affiliateCount}</p>
            </div>
          </div>
        )}

        {topAffiliates.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">Top Affiliates</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Affiliate Code</th>
                    <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topAffiliates.map((affiliate) => (
                    <tr key={affiliate.code} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono">{affiliate.code}</td>
                      <td className="py-3 px-4 font-semibold text-green-600">
                        ${affiliate.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {topAffiliates.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <p className="text-gray-600">No affiliate data yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
