'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Share2, Users, Zap, DollarSign, Target } from 'lucide-react'

interface AffiliateMetrics {
  totalReferrals: number
  activeAffiliates: number
  totalCommissions: number
  thisMonthCommissions: number
  conversionRate: number
  averageOrderValue: number
  topAffiliateEarnings: number
}

interface AffiliateData {
  id: string
  name: string
  email: string
  referralCode: string
  clicks: number
  conversions: number
  earnings: number
  commissionRate: number
  status: 'active' | 'pending' | 'suspended'
  joinedDate: string
}

interface ConversionFunnel {
  stage: string
  count: number
  percentage: number
}

export default function AffiliateAnalytics() {
  const [metrics, setMetrics] = useState<AffiliateMetrics>({
    totalReferrals: 342,
    activeAffiliates: 58,
    totalCommissions: 4250.50,
    thisMonthCommissions: 890.25,
    conversionRate: 3.2,
    averageOrderValue: 45.50,
    topAffiliateEarnings: 385.00,
  })

  const [affiliates] = useState<AffiliateData[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      referralCode: 'ALICE123',
      clicks: 342,
      conversions: 28,
      earnings: 385.00,
      commissionRate: 15,
      status: 'active',
      joinedDate: '2026-02-15',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      referralCode: 'BOB456',
      clicks: 218,
      conversions: 12,
      earnings: 165.50,
      commissionRate: 15,
      status: 'active',
      joinedDate: '2026-03-01',
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      referralCode: 'CAROL789',
      clicks: 156,
      conversions: 8,
      earnings: 110.00,
      commissionRate: 15,
      status: 'active',
      joinedDate: '2026-03-10',
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@example.com',
      referralCode: 'DAVID321',
      clicks: 98,
      conversions: 5,
      earnings: 68.75,
      commissionRate: 15,
      status: 'pending',
      joinedDate: '2026-04-05',
    },
    {
      id: '5',
      name: 'Eve Martinez',
      email: 'eve@example.com',
      referralCode: 'EVE654',
      clicks: 245,
      conversions: 6,
      earnings: 82.50,
      commissionRate: 15,
      status: 'active',
      joinedDate: '2026-02-28',
    },
  ])

  const [funnel] = useState<ConversionFunnel[]>([
    { stage: 'Clicks', count: 342, percentage: 100 },
    { stage: 'Signed Up', count: 89, percentage: 26 },
    { stage: 'Conversion', count: 28, percentage: 8.2 },
  ])

  const [sortBy, setSortBy] = useState<'earnings' | 'clicks' | 'conversions'>('earnings')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('active')
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateData | null>(null)

  const sortedAffiliates = affiliates
    .filter(a => filterStatus === 'all' || a.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'earnings') return b.earnings - a.earnings
      if (sortBy === 'clicks') return b.clicks - a.clicks
      return b.conversions - a.conversions
    })

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor referral program performance</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          Invite Affiliates
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Referrals</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {metrics.totalReferrals}
              </p>
              <p className="text-xs text-blue-700 mt-1">↑ 12% this month</p>
            </div>
            <Share2 className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Affiliates</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {metrics.activeAffiliates}
              </p>
              <p className="text-xs text-green-700 mt-1">
                {((metrics.activeAffiliates / 62) * 100).toFixed(1)}% of total
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Commissions (Month)</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                ${metrics.thisMonthCommissions.toFixed(2)}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Total: ${metrics.totalCommissions.toFixed(2)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {metrics.conversionRate}%
              </p>
              <p className="text-xs text-orange-700 mt-1">
                AOV: ${metrics.averageOrderValue.toFixed(2)}
              </p>
            </div>
            <Target className="h-8 w-8 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Conversion Funnel</h3>
          </div>

          <div className="p-6 space-y-4">
            {funnel.map((stage, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{stage.stage}</span>
                  <span className="text-sm font-bold text-blue-600">
                    {stage.count.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center px-3 transition-all duration-500"
                    style={{ width: `${stage.percentage}%` }}
                  >
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Drop-off Analysis:</span> 26% signup rate is above industry average (18%). Focus on nurturing the 61 signed-up but non-converting users.
            </p>
          </div>
        </div>

        {/* Top Performer */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h3 className="font-bold text-gray-900">Top Performer</h3>
          </div>

          {affiliates.length > 0 && (
            <div className="p-6 space-y-4">
              {affiliates[0] && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{affiliates[0].name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Clicks</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{affiliates[0].clicks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Conversions</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">{affiliates[0].conversions}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      ${affiliates[0].earnings.toFixed(2)}
                    </p>
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                    Contact Affiliate
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">All Affiliates</h3>
          <div className="flex gap-2">
            {(['earnings', 'clicks', 'conversions'] as const).map(sort => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sortBy === sort
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 p-4 border-b border-gray-200">
          {(['all', 'active', 'pending', 'suspended'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Affiliate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Code</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Conversions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Conv. Rate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedAffiliates.map(affiliate => (
                <tr
                  key={affiliate.id}
                  onClick={() => setSelectedAffiliate(affiliate)}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{affiliate.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{affiliate.referralCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{affiliate.clicks}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{affiliate.conversions}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {((affiliate.conversions / affiliate.clicks) * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    ${affiliate.earnings.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      affiliate.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : affiliate.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Affiliate Details */}
      {selectedAffiliate && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">{selectedAffiliate.name} - Detailed View</h3>
            <button
              onClick={() => setSelectedAffiliate(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Referral Code</p>
              <p className="text-lg font-mono font-bold text-gray-900">{selectedAffiliate.referralCode}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Commission Rate</p>
              <p className="text-lg font-bold text-green-600">{selectedAffiliate.commissionRate}%</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Joined Date</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(selectedAffiliate.joinedDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-lg font-bold text-orange-600">
                {((selectedAffiliate.conversions / selectedAffiliate.clicks) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
