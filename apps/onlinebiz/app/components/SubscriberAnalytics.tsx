'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, Mail, Heart, BarChart3, Activity } from 'lucide-react'

interface SubscriberMetrics {
  totalSubscribers: number
  activeSubscribers: number
  newThisMonth: number
  churnRate: number
  engagementRate: number
  openRate: number
  clickRate: number
  listGrowthRate: number
}

interface SubscriberSegment {
  name: string
  count: number
  percentage: number
  engagementRate: number
}

export default function SubscriberAnalytics() {
  const [metrics, setMetrics] = useState<SubscriberMetrics>({
    totalSubscribers: 12543,
    activeSubscribers: 10234,
    newThisMonth: 892,
    churnRate: 2.3,
    engagementRate: 68.5,
    openRate: 42.1,
    clickRate: 15.8,
    listGrowthRate: 7.1,
  })

  const [segments] = useState<SubscriberSegment[]>([
    { name: 'Premium', count: 2341, percentage: 18.6, engagementRate: 85.2 },
    { name: 'Active Free', count: 5892, percentage: 46.9, engagementRate: 72.1 },
    { name: 'Inactive Free', count: 3210, percentage: 25.6, engagementRate: 18.3 },
    { name: 'Trial', count: 1100, percentage: 8.8, engagementRate: 54.2 },
  ])

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  const getGrowthTrend = () => {
    // Mock data for demonstration
    return [
      { date: 'Apr 1', subscribers: 11200 },
      { date: 'Apr 8', subscribers: 11456 },
      { date: 'Apr 15', subscribers: 11890 },
      { date: 'Apr 22', subscribers: 12365 },
      { date: 'Apr 24', subscribers: 12543 },
    ]
  }

  const trend = getGrowthTrend()

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscriber Analytics</h1>
          <p className="text-gray-600 mt-1">Track audience growth and engagement</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Subscribers</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {metrics.totalSubscribers.toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                ↑ {metrics.listGrowthRate}% growth
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Subscribers</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {metrics.activeSubscribers.toLocaleString()}
              </p>
              <p className="text-xs text-green-700 mt-1">
                {((metrics.activeSubscribers / metrics.totalSubscribers) * 100).toFixed(1)}% engaged
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">New This Month</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {metrics.newThisMonth.toLocaleString()}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                {metrics.churnRate}% churn rate
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Engagement Rate</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {metrics.engagementRate}%
              </p>
              <p className="text-xs text-orange-700 mt-1">
                {metrics.openRate}% opens, {metrics.clickRate}% clicks
              </p>
            </div>
            <Heart className="h-8 w-8 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Subscriber Growth Trend</h3>
          </div>

          <div className="p-6">
            <div className="flex items-end justify-between h-48 gap-2">
              {trend.map((point, idx) => {
                const maxValue = Math.max(...trend.map(t => t.subscribers))
                const height = (point.subscribers / maxValue) * 100

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: `${height}%` }}></div>
                    <p className="text-xs text-gray-600 mt-2">{point.date}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex justify-between text-xs text-gray-600">
              <span>Low: 11,200</span>
              <span>High: 12,543</span>
            </div>
          </div>
        </div>

        {/* Email Metrics */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Email Performance</h3>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Open Rate</span>
                <span className="text-sm font-bold text-blue-600">{metrics.openRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${metrics.openRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Click Rate</span>
                <span className="text-sm font-bold text-green-600">{metrics.clickRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${metrics.clickRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Engagement</span>
                <span className="text-sm font-bold text-purple-600">{metrics.engagementRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${metrics.engagementRate}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Industry Average:</span> 21% opens, 2.5% clicks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segments */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Subscriber Segments</h3>
        </div>

        <div className="divide-y">
          {segments.map(segment => (
            <button
              key={segment.name}
              onClick={() => setSelectedSegment(selectedSegment === segment.name ? null : segment.name)}
              className={`w-full text-left p-6 hover:bg-gray-50 transition-colors ${
                selectedSegment === segment.name ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                <span className="text-sm text-gray-600">{segment.count.toLocaleString()} users</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right min-w-32">
                  <p className="text-sm font-semibold text-gray-900">{segment.percentage}%</p>
                  <p className="text-xs text-gray-600">{segment.engagementRate}% engaged</p>
                </div>
              </div>

              {selectedSegment === segment.name && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-1">
                  <p>✓ {segment.count} active members</p>
                  <p>✓ {segment.engagementRate}% average engagement</p>
                  <p>✓ 12% higher open rate than average</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">📊 Insights & Recommendations</h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li>• Your inactive free segment (25.6%) could be reengaged with targeted campaigns</li>
          <li>• Premium subscribers show 85.2% engagement - maintain high-quality content</li>
          <li>• Email open rates (42.1%) exceed industry average by 100% - strategy is working</li>
          <li>• Monthly growth rate of 7.1% is strong - continue current content strategy</li>
        </ul>
      </div>
    </div>
  )
}
