'use client'

import { useState } from 'react'
import { Activity, Users, Clock, BarChart3, TrendingUp, Target } from 'lucide-react'

interface EngagementMetrics {
  totalSessions: number
  uniqueUsers: number
  avgSessionDuration: number
  bounceRate: number
  returnVisitorRate: number
  engagementScore: number
}

interface UserSegment {
  name: string
  userCount: number
  avgSessionTime: number
  engagementScore: number
  lifetimeValue: number
  retention: number
}

interface BehaviorPattern {
  pattern: string
  count: number
  trend: number
  avgRevenue: number
}

export default function UserEngagementAnalytics() {
  const [metrics] = useState<EngagementMetrics>({
    totalSessions: 24563,
    uniqueUsers: 12543,
    avgSessionDuration: 4.2,
    bounceRate: 28,
    returnVisitorRate: 68,
    engagementScore: 78.5,
  })

  const [segments] = useState<UserSegment[]>([
    {
      name: 'Power Users',
      userCount: 1254,
      avgSessionTime: 12.5,
      engagementScore: 95,
      lifetimeValue: 485.25,
      retention: 92,
    },
    {
      name: 'Regular Readers',
      userCount: 5687,
      avgSessionTime: 5.8,
      engagementScore: 72,
      lifetimeValue: 145.50,
      retention: 76,
    },
    {
      name: 'Casual Visitors',
      userCount: 4102,
      avgSessionTime: 2.1,
      engagementScore: 35,
      lifetimeValue: 28.75,
      retention: 42,
    },
    {
      name: 'One-Time Visitors',
      userCount: 1500,
      avgSessionTime: 0.8,
      engagementScore: 10,
      lifetimeValue: 2.50,
      retention: 5,
    },
  ])

  const [patterns] = useState<BehaviorPattern[]>([
    { pattern: 'Read → Share → Subscribe', count: 3245, trend: 15.2, avgRevenue: 45.25 },
    { pattern: 'Article → Related → Newsletter', count: 2156, trend: 8.7, avgRevenue: 12.50 },
    { pattern: 'Browse Category → Read → Comment', count: 1987, trend: 12.3, avgRevenue: 8.75 },
    { pattern: 'Search → Multiple Articles → Exit', count: 1543, trend: -3.2, avgRevenue: 3.25 },
    { pattern: 'Email → Article → Conversion', count: 892, trend: 22.1, avgRevenue: 67.50 },
  ])

  const [selectedSegment, setSelectedSegment] = useState<string>('Power Users')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Engagement Analytics</h1>
          <p className="text-gray-600 mt-1">Understand user behavior and optimize for retention</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range === '7d' ? 'Week' : range === '30d' ? 'Month' : 'Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Sessions</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {metrics.totalSessions.toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                {(metrics.totalSessions / 30).toFixed(0)} per day
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Return Visitor Rate</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {metrics.returnVisitorRate}%
              </p>
              <p className="text-xs text-green-700 mt-1">
                ↑ 5.2% vs last period
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Engagement Score</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {metrics.engagementScore}/100
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Industry avg: 65/100
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Unique Users</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.uniqueUsers.toLocaleString()}</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">Avg Sessions: {(metrics.totalSessions / metrics.uniqueUsers).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Avg Session Duration</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.avgSessionDuration} min</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">Target: 5+ min • Current: {metrics.avgSessionDuration > 5 ? '✓ Good' : '✗ Below target'}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Bounce Rate</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.bounceRate}%</p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600">Industry avg: 45% • Status: {metrics.bounceRate < 45 ? '✓ Better' : '✗ Worse'}</p>
          </div>
        </div>
      </div>

      {/* User Segments */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Segments
          </h3>
        </div>

        <div className="divide-y">
          {segments.map(segment => (
            <button
              key={segment.name}
              onClick={() => setSelectedSegment(segment.name)}
              className={`w-full text-left p-6 hover:bg-gray-50 transition-colors ${
                selectedSegment === segment.name ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{segment.userCount.toLocaleString()} users</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">LTV: ${segment.lifetimeValue.toFixed(2)}</p>
                  <p className="text-xs text-gray-600">Retention: {segment.retention}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-gray-600 mb-1">Avg Session</p>
                  <p className="font-bold text-gray-900">{segment.avgSessionTime} min</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Engagement</p>
                  <p className="font-bold text-gray-900">{segment.engagementScore}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Size</p>
                  <p className="font-bold text-gray-900">
                    {((segment.userCount / metrics.uniqueUsers) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(segment.engagementScore)}%` }}
                ></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Behavior Patterns */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            High-Value User Patterns
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Pattern</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Occurrences</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Trend</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Avg Revenue</th>
              </tr>
            </thead>
            <tbody>
              {patterns.map((p, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.pattern}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.count.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-bold ${
                      p.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {p.trend > 0 ? '↑' : '↓'} {Math.abs(p.trend)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    ${p.avgRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-4">🎯 Engagement Optimization Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Quick Wins:</p>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Focus on "Read → Share → Subscribe" pattern (highest revenue: $45.25)</li>
              <li>• Improve session duration: avg 4.2min vs target 5+min</li>
              <li>• Increase return visitor rate from 68% to 75%+</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Long-term Strategy:</p>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Convert Casual Visitors to Regular Readers (42% → 60% retention)</li>
              <li>• Increase Power Users segment (9.9% → 15% of users)</li>
              <li>• Reduce bounce rate by content improvements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
