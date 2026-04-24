'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingDown, Heart, MessageSquare, Target, UserX } from 'lucide-react'

interface AtRiskUser {
  id: string
  email: string
  name: string
  tier: string
  joinDate: string
  lastActive: string
  mrr: number
  ltv: number
  churnRisk: number
  riskFactors: string[]
  recommendedAction: string
}

interface RetentionMetric {
  metric: string
  current: number
  target: number
  gap: number
  leverage: number
}

export default function ChurnPrevention() {
  const [atRiskUsers] = useState<AtRiskUser[]>([
    {
      id: '1',
      email: 'john.crypto@example.com',
      name: 'John Crypto',
      tier: 'Premium',
      joinDate: '2025-12-15',
      lastActive: '2026-04-10',
      mrr: 9.99,
      ltv: 89.91,
      churnRisk: 92,
      riskFactors: ['14 days since last login', 'No article opens in 7 days', 'Trending down engagement'],
      recommendedAction: 'Send re-engagement email + exclusive content offer',
    },
    {
      id: '2',
      email: 'sarah.trader@example.com',
      name: 'Sarah Trader',
      tier: 'Enterprise',
      joinDate: '2025-08-22',
      lastActive: '2026-04-02',
      mrr: 49.99,
      ltv: 599.88,
      churnRisk: 87,
      riskFactors: ['API usage declined 60%', 'API errors increased', '3 support tickets unresolved'],
      recommendedAction: 'Schedule 1:1 support call + API troubleshooting',
    },
    {
      id: '3',
      email: 'alex.investor@example.com',
      name: 'Alex Investor',
      tier: 'Basic',
      joinDate: '2026-01-05',
      lastActive: '2026-04-18',
      mrr: 4.99,
      ltv: 29.94,
      churnRisk: 75,
      riskFactors: ['Converted to Basic from Premium (downgrade)', 'Reading time 50% lower', 'No comment activity'],
      recommendedAction: 'Offer personalized content + upgrade discount',
    },
    {
      id: '4',
      email: 'mike.analyst@example.com',
      name: 'Mike Analyst',
      tier: 'Premium',
      joinDate: '2025-11-10',
      lastActive: '2026-04-15',
      mrr: 9.99,
      ltv: 79.92,
      churnRisk: 68,
      riskFactors: ['Engagement declining 12% weekly', 'Opened 1 of last 5 emails', 'No recent shares'],
      recommendedAction: 'Pause emails for 2 weeks, then send curated digest',
    },
    {
      id: '5',
      email: 'lisa.wealth@example.com',
      name: 'Lisa Wealth',
      tier: 'Enterprise',
      joinDate: '2025-09-08',
      lastActive: '2026-04-22',
      mrr: 49.99,
      ltv: 649.87,
      churnRisk: 52,
      riskFactors: ['Usage stable but stagnant', 'Feature request pending 30 days', 'Team expanded but no upsell'],
      recommendedAction: 'Feature prioritization + cross-sell additional reports',
    },
  ])

  const [retentionMetrics] = useState<RetentionMetric[]>([
    { metric: '12-Month Retention', current: 76, target: 85, gap: 9, leverage: 180000 },
    { metric: 'Monthly Churn Rate', current: 5.2, target: 2.8, gap: 2.4, leverage: 42000 },
    { metric: 'Downgrades (M/M)', current: 3.2, target: 1.5, gap: 1.7, leverage: 28000 },
    { metric: 'Net Revenue Churn', current: 2.8, target: -0.5, gap: 3.3, leverage: 95000 },
  ])

  const [selectedUser, setSelectedUser] = useState<AtRiskUser | null>(atRiskUsers[0])
  const [filterRisk, setFilterRisk] = useState<'all' | 'critical' | 'high' | 'medium'>('all')

  const criticalUsers = atRiskUsers.filter(u => u.churnRisk >= 85).length
  const potentialRevenueLoss = atRiskUsers.reduce((sum, u) => sum + u.mrr, 0)
  const potentialLtvLoss = atRiskUsers.reduce((sum, u) => sum + u.ltv, 0)

  const filteredUsers = atRiskUsers.filter(u => {
    if (filterRisk === 'all') return true
    if (filterRisk === 'critical') return u.churnRisk >= 85
    if (filterRisk === 'high') return u.churnRisk >= 75 && u.churnRisk < 85
    if (filterRisk === 'medium') return u.churnRisk >= 60 && u.churnRisk < 75
    return false
  })

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Churn Prevention & Retention</h1>
        <p className="text-gray-600 mt-1">Identify at-risk users and reduce churn with targeted interventions</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">At-Risk Users</p>
          <p className="text-3xl font-bold text-red-900 mt-2">{atRiskUsers.length}</p>
          <p className="text-xs text-red-700 mt-1">
            {criticalUsers} critical (80%+ risk)
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Monthly MRR at Risk</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">
            ${potentialRevenueLoss.toFixed(0)}
          </p>
          <p className="text-xs text-orange-700 mt-1">
            {(potentialRevenueLoss / 10200 * 100).toFixed(1)}% of current MRR
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Potential LTV Loss</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            ${potentialLtvLoss.toFixed(0)}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            If all churn within 12 months
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Avg Churn Prevention Value</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            ${(potentialLtvLoss / atRiskUsers.length).toFixed(0)}
          </p>
          <p className="text-xs text-green-700 mt-1">Per user saved</p>
        </div>
      </div>

      {/* Retention Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Key Retention Metrics vs. Targets</h3>
        </div>

        <div className="divide-y">
          {retentionMetrics.map((metric, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Current: {metric.current}
                    {metric.metric.includes('Revenue') ? '%' : metric.metric.includes('Rate') ? '%' : '%'} → Target: {metric.target}
                    {metric.metric.includes('Revenue') ? '%' : metric.metric.includes('Rate') ? '%' : '%'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">+{metric.gap}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    ${metric.leverage.toLocaleString()} annual value
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
                  style={{ width: `${(metric.current / Math.max(metric.current, metric.target + 10)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Users List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              At-Risk Users
            </h3>

            <div className="flex gap-2 flex-wrap">
              {(['all', 'critical', 'high', 'medium'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => setFilterRisk(risk)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    filterRisk === risk
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">
            {filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                  selectedUser?.id === user.id ? 'border-red-500 bg-red-50' : 'border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{user.email} • {user.tier}</p>
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                    user.churnRisk >= 85
                      ? 'bg-red-100 text-red-700'
                      : user.churnRisk >= 75
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.churnRisk}% risk
                  </span>
                </div>

                <div className="flex gap-4 text-xs">
                  <span className="text-gray-600">
                    MRR: <span className="font-bold text-gray-900">${user.mrr.toFixed(2)}</span>
                  </span>
                  <span className="text-gray-600">
                    LTV: <span className="font-bold text-gray-900">${user.ltv.toFixed(2)}</span>
                  </span>
                  <span className="text-gray-600">
                    <span className="font-bold text-red-600">{Math.ceil((new Date().getTime() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24))} days</span> inactive
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Details & Action Plan */}
        {selectedUser && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
              <h3 className="font-bold text-gray-900">{selectedUser.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedUser.email}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Risk Assessment */}
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-gray-600 font-semibold uppercase">Churn Risk</p>
                  <p className="text-sm font-bold text-red-600">{selectedUser.churnRisk}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full"
                    style={{ width: `${selectedUser.churnRisk}%` }}
                  ></div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="py-4 border-y border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Risk Factors</p>
                <ul className="space-y-1 text-sm text-gray-900">
                  {selectedUser.riskFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Financial Impact */}
              <div className="space-y-2">
                <div className="bg-orange-50 rounded p-3">
                  <p className="text-xs text-orange-700 font-semibold">Monthly MRR if Churn</p>
                  <p className="text-lg font-bold text-orange-700">${selectedUser.mrr.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 rounded p-3">
                  <p className="text-xs text-red-700 font-semibold">LTV if Churn</p>
                  <p className="text-lg font-bold text-red-700">${selectedUser.ltv.toFixed(2)}</p>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Recommended Action</p>
                <p className="text-sm bg-blue-50 text-blue-900 p-3 rounded">
                  {selectedUser.recommendedAction}
                </p>
              </div>

              <button className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors">
                Execute Intervention
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Intervention Strategies */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Proven Retention Interventions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {[
            {
              name: 'Win-Back Email Sequence',
              description: '3-email sequence for inactive users (14+ days)',
              retention_improvement: '18-24%',
              cost: '$0.50/user',
              timeline: '7 days',
            },
            {
              name: 'Premium Feature Demo',
              description: 'Schedule demo call for basic/premium tier users',
              retention_improvement: '22-28%',
              cost: '$5/user',
              timeline: '2-3 days',
            },
            {
              name: 'Personalized Content Recommendations',
              description: 'AI-powered content matching user interests',
              retention_improvement: '15-20%',
              cost: '$0/user',
              timeline: 'Immediate',
            },
            {
              name: 'Loyalty Discount Program',
              description: '10% discount for annual commitment',
              retention_improvement: '25-32%',
              cost: 'Revenue reduction',
              timeline: '1 day',
            },
            {
              name: '1:1 Success Call',
              description: 'Dedicated account manager for enterprise users',
              retention_improvement: '35-45%',
              cost: '$20/user',
              timeline: '5 days',
            },
            {
              name: 'Exclusive Content/Features',
              description: 'Early access to beta features, expert interviews',
              retention_improvement: '20-28%',
              cost: '$0/user',
              timeline: 'Ongoing',
            },
          ].map((strategy, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-2">{strategy.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-600 font-semibold">Improvement</p>
                  <p className="text-green-600 font-bold">{strategy.retention_improvement}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Cost</p>
                  <p className="text-gray-900 font-bold">{strategy.cost}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Timeline: {strategy.timeline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-bold text-green-900 mb-4">✅ 30-Day Churn Prevention Plan</h3>
        <div className="space-y-3 text-sm text-green-900">
          <p>
            <span className="font-semibold">Week 1:</span> Identify all at-risk users (85%+ churn risk) and execute win-back email sequence
          </p>
          <p>
            <span className="font-semibold">Week 2:</span> Schedule 1:1 calls for critical enterprise users (50+ LTV)
          </p>
          <p>
            <span className="font-semibold">Week 3:</span> Launch personalized content recommendation system
          </p>
          <p>
            <span className="font-semibold">Week 4:</span> Measure results - track re-engagement, retention improvement, revenue impact
          </p>
        </div>
      </div>
    </div>
  )
}
