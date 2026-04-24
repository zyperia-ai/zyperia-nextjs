'use client'

import { useState } from 'react'
import { Mail, Eye, Share2, Users, TrendingUp, Calendar } from 'lucide-react'

interface NewsletterCampaign {
  id: string
  subject: string
  sentDate: string
  recipients: number
  opens: number
  clicks: number
  unsubscribes: number
  bounceRate: number
  conversionValue: number
  status: 'sent' | 'scheduled' | 'draft'
}

interface EngagementMetric {
  metric: string
  value: string
  change: number
  trend: 'up' | 'down' | 'neutral'
}

export default function NewsletterPerformance() {
  const [campaigns] = useState<NewsletterCampaign[]>([
    {
      id: '1',
      subject: 'Weekly Crypto Market Digest - April 24',
      sentDate: '2026-04-24',
      recipients: 3245,
      opens: 1368,
      clicks: 215,
      unsubscribes: 12,
      bounceRate: 0.8,
      conversionValue: 428.50,
      status: 'sent',
    },
    {
      id: '2',
      subject: 'Bitcoin ETF Approval - What You Need to Know',
      sentDate: '2026-04-22',
      recipients: 3198,
      opens: 1659,
      clicks: 289,
      unsubscribes: 8,
      bounceRate: 0.6,
      conversionValue: 612.75,
      status: 'sent',
    },
    {
      id: '3',
      subject: 'DeFi Security Update: Protecting Your Assets',
      sentDate: '2026-04-20',
      recipients: 3124,
      opens: 1405,
      clicks: 178,
      unsubscribes: 15,
      bounceRate: 1.1,
      conversionValue: 356.25,
      status: 'sent',
    },
    {
      id: '4',
      subject: 'Ethereum Roadmap Deep Dive - Shanghai Edition',
      sentDate: '2026-04-18',
      recipients: 3089,
      opens: 1545,
      clicks: 267,
      unsubscribes: 9,
      bounceRate: 0.9,
      conversionValue: 534.50,
      status: 'sent',
    },
  ])

  const [metrics] = useState<EngagementMetric[]>([
    {
      metric: 'Avg Open Rate',
      value: '42.1%',
      change: 3.2,
      trend: 'up',
    },
    {
      metric: 'Avg Click Rate',
      value: '6.8%',
      change: 1.5,
      trend: 'up',
    },
    {
      metric: 'Unsubscribe Rate',
      value: '0.35%',
      change: -0.05,
      trend: 'down',
    },
    {
      metric: 'Bounce Rate',
      value: '0.85%',
      change: 0.1,
      trend: 'up',
    },
  ])

  const [selectedCampaign, setSelectedCampaign] = useState<NewsletterCampaign | null>(campaigns[0])
  const [sortBy, setSortBy] = useState<'date' | 'opens' | 'clicks' | 'revenue'>('date')

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
    if (sortBy === 'opens') return b.opens - a.opens
    if (sortBy === 'clicks') return b.clicks - a.clicks
    return b.conversionValue - a.conversionValue
  })

  const totalOpens = campaigns.reduce((sum, c) => sum + c.opens, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.conversionValue, 0)
  const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0)
  const avgOpenRate = ((totalOpens / totalRecipients) * 100).toFixed(1)

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Performance</h1>
          <p className="text-gray-600 mt-1">Track email campaign engagement and ROI</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
          Create Campaign
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Sent</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {totalRecipients.toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">{campaigns.length} campaigns</p>
            </div>
            <Mail className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Opens</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {totalOpens.toLocaleString()}
              </p>
              <p className="text-xs text-green-700 mt-1">{avgOpenRate}% avg rate</p>
            </div>
            <Eye className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {totalClicks.toLocaleString()}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                {((totalClicks / totalOpens) * 100).toFixed(1)}% of opens
              </p>
            </div>
            <Share2 className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Revenue Generated</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                ${totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-orange-700 mt-1">
                ${(totalRevenue / campaigns.length).toFixed(2)}/campaign
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-600 text-sm font-medium">{metric.metric}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
            <p className={`text-xs mt-2 flex items-center gap-1 ${
              metric.trend === 'up'
                ? 'text-red-600'
                : metric.trend === 'down'
                  ? 'text-green-600'
                  : 'text-gray-600'
            }`}>
              {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
              {Math.abs(metric.change)}% vs last period
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Campaign History</h3>
            <div className="flex gap-2">
              {(['date', 'opens', 'clicks', 'revenue'] as const).map(sort => (
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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Sent</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Opens</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sortedCampaigns.map(campaign => (
                  <tr
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign)}
                    className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedCampaign?.id === campaign.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900 truncate">{campaign.subject}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(campaign.sentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {campaign.opens.toLocaleString()}
                      <span className="text-xs text-gray-600 font-normal ml-1">
                        ({((campaign.opens / campaign.recipients) * 100).toFixed(1)}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                      {campaign.clicks.toLocaleString()}
                      <span className="text-xs text-gray-600 font-normal ml-1">
                        ({((campaign.clicks / campaign.opens) * 100).toFixed(1)}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      ${campaign.conversionValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Details */}
        {selectedCampaign && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="font-bold text-gray-900 truncate">{selectedCampaign.subject}</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Sent Date</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {new Date(selectedCampaign.sentDate).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Recipients</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {selectedCampaign.recipients.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Open Rate</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {((selectedCampaign.opens / selectedCampaign.recipients) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Engagement</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">Opens</span>
                      <span className="text-gray-900 font-bold">{selectedCampaign.opens}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(selectedCampaign.opens / selectedCampaign.recipients) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">Clicks</span>
                      <span className="text-gray-900 font-bold">{selectedCampaign.clicks}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(selectedCampaign.clicks / selectedCampaign.opens) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">Unsubscribes</span>
                      <span className="text-gray-900 font-bold">{selectedCampaign.unsubscribes}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{
                          width: `${(selectedCampaign.unsubscribes / selectedCampaign.recipients) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">Revenue Generated</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  ${selectedCampaign.conversionValue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  ${(selectedCampaign.conversionValue / selectedCampaign.clicks).toFixed(2)} per click
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">📧 Tips to Improve Performance</h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li>• Test subject lines: Your best performer had 45.7% open rate with "Bitcoin ETF Approval"</li>
          <li>• Optimal send time: Campaigns sent at 9 AM show 8% higher open rates</li>
          <li>• Segment your list: Premium subscribers click 3.2x more than free subscribers</li>
          <li>• Keep it short: Emails under 500 words generate 45% more clicks</li>
        </ul>
      </div>
    </div>
  )
}
