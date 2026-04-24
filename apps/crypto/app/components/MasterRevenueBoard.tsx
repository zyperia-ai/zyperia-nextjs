'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, BarChart3, PieChart, Activity, Target, Zap } from 'lucide-react'

interface AppMetrics {
  name: string
  thisMonthRevenue: number
  lastMonthRevenue: number
  totalArticles: number
  totalSubscribers: number
  activeAffiliates: number
  revenueGrowth: number
}

interface RevenueBreakdown {
  source: string
  amount: number
  percentage: number
  trend: number
}

export default function MasterRevenueBoard() {
  const [appMetrics] = useState<AppMetrics[]>([
    {
      name: 'Crypto',
      thisMonthRevenue: 3450.75,
      lastMonthRevenue: 3120.50,
      totalArticles: 156,
      totalSubscribers: 12543,
      activeAffiliates: 58,
      revenueGrowth: 10.6,
    },
    {
      name: 'Intelligence',
      thisMonthRevenue: 2890.25,
      lastMonthRevenue: 2540.80,
      totalArticles: 142,
      totalSubscribers: 9876,
      activeAffiliates: 42,
      revenueGrowth: 13.7,
    },
    {
      name: 'Online Business',
      thisMonthRevenue: 2345.50,
      lastMonthRevenue: 2100.20,
      totalArticles: 128,
      totalSubscribers: 8945,
      activeAffiliates: 35,
      revenueGrowth: 11.6,
    },
  ])

  const [revenueBreakdown] = useState<RevenueBreakdown[]>([
    { source: 'Article Views', amount: 4320.50, percentage: 44.2, trend: 8.5 },
    { source: 'Subscriptions', amount: 2850.75, percentage: 29.1, trend: 12.3 },
    { source: 'Affiliate Commissions', amount: 1680.25, percentage: 17.2, trend: 15.8 },
    { source: 'Referral Bonuses', amount: 776.00, percentage: 7.9, trend: 22.1 },
    { source: 'Sponsored Content', amount: 562.50, percentage: 5.8, trend: -3.2 },
  ])

  const [selectedApp, setSelectedApp] = useState<string>('Crypto')

  const totalRevenue = appMetrics.reduce((sum, app) => sum + app.thisMonthRevenue, 0)
  const totalLastMonth = appMetrics.reduce((sum, app) => sum + app.lastMonthRevenue, 0)
  const overallGrowth = ((totalRevenue - totalLastMonth) / totalLastMonth) * 100

  const selectedMetrics = appMetrics.find(app => app.name === selectedApp)

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Master Revenue Dashboard</h1>
        <p className="text-gray-600 mt-2">Executive overview of all ZYPERIA monetization channels</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Monthly Revenue</p>
              <p className="text-4xl font-bold text-green-900 mt-2">
                ${totalRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
              <p className={`text-sm font-semibold mt-2 ${
                overallGrowth > 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {overallGrowth > 0 ? '↑' : '↓'} {Math.abs(overallGrowth).toFixed(1)}% vs last month
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Articles</p>
              <p className="text-4xl font-bold text-blue-900 mt-2">
                {appMetrics.reduce((sum, app) => sum + app.totalArticles, 0)}
              </p>
              <p className="text-xs text-blue-700 mt-2">
                {(appMetrics.reduce((sum, app) => sum + app.totalArticles, 0) / 30).toFixed(1)}/day average
              </p>
            </div>
            <Activity className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Subscribers</p>
              <p className="text-4xl font-bold text-purple-900 mt-2">
                {(appMetrics.reduce((sum, app) => sum + app.totalSubscribers, 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-purple-700 mt-2">
                {appMetrics.reduce((sum, app) => sum + app.totalSubscribers, 0)} accounts
              </p>
            </div>
            <Target className="h-10 w-10 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Affiliates</p>
              <p className="text-4xl font-bold text-orange-900 mt-2">
                {appMetrics.reduce((sum, app) => sum + app.activeAffiliates, 0)}
              </p>
              <p className="text-xs text-orange-700 mt-2">
                ${(appMetrics.reduce((sum, app) => sum + app.activeAffiliates, 0) * 50).toLocaleString()} earning potential
              </p>
            </div>
            <Zap className="h-10 w-10 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue by Source
            </h3>
          </div>

          <div className="p-6 space-y-4">
            {revenueBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{item.source}</span>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${item.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                    <p className={`text-xs font-semibold ${
                      item.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.trend > 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 min-w-12">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Total Revenue:</span> ${revenueBreakdown.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* App Performance */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              App Performance
            </h3>
          </div>

          <div className="divide-y">
            {appMetrics.map(app => (
              <button
                key={app.name}
                onClick={() => setSelectedApp(app.name)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  selectedApp === app.name ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-semibold ${
                    selectedApp === app.name ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {app.name}
                  </h4>
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    app.revenueGrowth > 10 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    ↑ {app.revenueGrowth.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <p>Revenue: <span className="font-bold text-gray-900">${app.thisMonthRevenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span></p>
                  <p>Articles: <span className="font-bold text-gray-900">{app.totalArticles}</span></p>
                  <p>Subscribers: <span className="font-bold text-gray-900">{app.totalSubscribers.toLocaleString()}</span></p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected App Details */}
      {selectedMetrics && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-900 mb-6">{selectedMetrics.name} App - Detailed Breakdown</h3>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-gray-600 font-semibold uppercase">This Month</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${selectedMetrics.thisMonthRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-gray-600 font-semibold uppercase">Last Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${selectedMetrics.lastMonthRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-gray-600 font-semibold uppercase">Growth</p>
              <p className={`text-2xl font-bold mt-1 ${
                selectedMetrics.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedMetrics.revenueGrowth > 0 ? '+' : ''}{selectedMetrics.revenueGrowth.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-gray-600 font-semibold uppercase">Articles</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{selectedMetrics.totalArticles}</p>
              <p className="text-xs text-gray-600 mt-1">
                ${(selectedMetrics.thisMonthRevenue / selectedMetrics.totalArticles).toFixed(2)}/article
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-gray-600 font-semibold uppercase">Subscribers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{(selectedMetrics.totalSubscribers / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-600 mt-1">
                ${(selectedMetrics.thisMonthRevenue / selectedMetrics.totalSubscribers).toFixed(2)}/user
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-xs text-gray-600 font-semibold uppercase">Affiliates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{selectedMetrics.activeAffiliates}</p>
              <p className="text-xs text-gray-600 mt-1">
                ${(selectedMetrics.thisMonthRevenue / selectedMetrics.activeAffiliates).toFixed(2)}/affiliate
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-900 mb-3">✅ Strengths</h3>
          <ul className="space-y-2 text-sm text-green-900">
            <li>• Article views revenue growing steadily at 8.5% MoM</li>
            <li>• Affiliate program highly engaged with 22.1% referral growth</li>
            <li>• Subscription revenue consistently strong at 29% of total</li>
            <li>• Intelligence app leading growth at 13.7% MoM</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">🎯 Opportunities</h3>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Sponsored content declining (-3.2%) - improve advertiser value proposition</li>
            <li>• Online Business app has lowest revenue - consider platform adjustments</li>
            <li>• Average earnings per article: $22.25 - optimize for higher-value content</li>
            <li>• Subscriber value: $0.23/user - upsell opportunities with premium tiers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
