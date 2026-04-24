'use client'

import { useState } from 'react'
import { Bell, Settings, TrendingUp, Mail, MessageSquare, Zap } from 'lucide-react'

interface NotificationTrigger {
  id: string
  name: string
  description: string
  trigger: string
  channel: string
  expectedLift: number
  conversionRate: number
  status: 'active' | 'paused' | 'testing'
  sentThisMonth: number
}

interface ReEngagementSequence {
  sequence: string
  step: number
  delay: string
  message: string
  conversionRate: number
}

export default function NotificationStrategy() {
  const [triggers] = useState<NotificationTrigger[]>([
    {
      id: '1',
      name: 'Abandoned Cart Recovery',
      description: 'Send email when user views article but doesn\'t subscribe',
      trigger: 'Article view > 3 min + No subscription',
      channel: 'Email',
      expectedLift: 28,
      conversionRate: 5.2,
      status: 'active',
      sentThisMonth: 2341,
    },
    {
      id: '2',
      name: 'Win-Back Campaign',
      description: 'Re-engage inactive users who haven\'t visited in 14+ days',
      trigger: 'No activity for 14 days',
      channel: 'Email',
      expectedLift: 15,
      conversionRate: 2.8,
      status: 'active',
      sentThisMonth: 1856,
    },
    {
      id: '3',
      name: 'Premium Upsell',
      description: 'Offer upgrade when free user views premium content',
      trigger: 'Free user clicks premium article',
      channel: 'In-app + Email',
      expectedLift: 35,
      conversionRate: 8.5,
      status: 'active',
      sentThisMonth: 892,
    },
    {
      id: '4',
      name: 'Article Series Follow-up',
      description: 'Notify about part 2 when user reads part 1',
      trigger: 'Article completion + Related series exists',
      channel: 'Email + Push',
      expectedLift: 42,
      conversionRate: 12.3,
      status: 'testing',
      sentThisMonth: 456,
    },
    {
      id: '5',
      name: 'Trending Content Alert',
      description: 'Notify subscribers about trending articles in their category',
      trigger: 'Article hits 1000 views in 24h + subscriber category match',
      channel: 'Email + Push',
      expectedLift: 22,
      conversionRate: 4.7,
      status: 'active',
      sentThisMonth: 3201,
    },
    {
      id: '6',
      name: 'Referral Incentive',
      description: 'Promote affiliate program when user high-value reading completed',
      trigger: 'Session > 10 min + Engagement score > 70',
      channel: 'In-app modal + Email',
      expectedLift: 18,
      conversionRate: 3.2,
      status: 'paused',
      sentThisMonth: 0,
    },
  ])

  const [sequences] = useState<ReEngagementSequence[]>([
    {
      sequence: 'Standard Re-engagement',
      step: 1,
      delay: 'Day 0 (Immediate)',
      message: 'Personalized article recommendation based on reading history',
      conversionRate: 4.2,
    },
    {
      sequence: 'Standard Re-engagement',
      step: 2,
      delay: 'Day 3',
      message: 'Weekly digest summary + trending content alert',
      conversionRate: 3.8,
    },
    {
      sequence: 'Standard Re-engagement',
      step: 3,
      delay: 'Day 7',
      message: 'Premium exclusive offer - 50% off annual subscription',
      conversionRate: 6.5,
    },
    {
      sequence: 'Premium Onboarding',
      step: 1,
      delay: 'Day 0',
      message: 'Welcome to premium + quick start guide',
      conversionRate: 8.1,
    },
    {
      sequence: 'Premium Onboarding',
      step: 2,
      delay: 'Day 2',
      message: 'Top premium content recommendations',
      conversionRate: 7.3,
    },
    {
      sequence: 'Premium Onboarding',
      step: 3,
      delay: 'Day 5',
      message: 'Advanced features tutorial + affiliate opportunity',
      conversionRate: 5.9,
    },
  ])

  const [selectedTrigger, setSelectedTrigger] = useState<NotificationTrigger | null>(triggers[0])
  const [showSequences, setShowSequences] = useState(false)

  const activeTriggers = triggers.filter(t => t.status === 'active').length
  const totalSentThisMonth = triggers.reduce((sum, t) => sum + t.sentThisMonth, 0)
  const avgConversionRate = (triggers.reduce((sum, t) => sum + t.conversionRate, 0) / triggers.length).toFixed(1)

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Strategy</h1>
          <p className="text-gray-600 mt-1">Automated triggers to re-engage users and increase lifetime value</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Create New Trigger
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Active Triggers</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{activeTriggers}</p>
          <p className="text-xs text-blue-700 mt-1">Out of {triggers.length} configured</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Sent This Month</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {(totalSentThisMonth / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-green-700 mt-1">{totalSentThisMonth.toLocaleString()} notifications</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Avg Conversion</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">{avgConversionRate}%</p>
          <p className="text-xs text-purple-700 mt-1">Industry avg: 2.5%</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Est. Monthly Revenue</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">$24,500</p>
          <p className="text-xs text-orange-700 mt-1">From triggered actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Triggers List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Triggers
            </h3>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">
            {triggers.map(trigger => (
              <button
                key={trigger.id}
                onClick={() => setSelectedTrigger(trigger)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                  selectedTrigger?.id === trigger.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-transparent'
                } ${
                  trigger.status === 'active'
                    ? 'border-l-green-500'
                    : trigger.status === 'testing'
                      ? 'border-l-yellow-500'
                      : 'border-l-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{trigger.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{trigger.description}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                    trigger.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : trigger.status === 'testing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {trigger.status.charAt(0).toUpperCase() + trigger.status.slice(1)}
                  </span>
                </div>

                <div className="flex gap-4 text-xs">
                  <span className="text-gray-600">
                    Sent: <span className="font-bold text-gray-900">{trigger.sentThisMonth.toLocaleString()}</span>
                  </span>
                  <span className="text-gray-600">
                    Conv.: <span className="font-bold text-green-600">{trigger.conversionRate}%</span>
                  </span>
                  <span className="text-gray-600">
                    Lift: <span className="font-bold text-blue-600">{trigger.expectedLift}%</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Details */}
        {selectedTrigger && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="font-bold text-gray-900">{selectedTrigger.name}</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Trigger Condition</p>
                <p className="text-sm text-gray-900 mt-1">{selectedTrigger.trigger}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Delivery Channel</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedTrigger.channel}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Conversion Rate</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{selectedTrigger.conversionRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Expected Lift</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">+{selectedTrigger.expectedLift}%</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Performance</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">Sent This Month</span>
                      <span className="text-gray-900 font-bold">{selectedTrigger.sentThisMonth}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(selectedTrigger.sentThisMonth / 3500) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">Conversion Rate</span>
                      <span className="text-gray-900 font-bold">{selectedTrigger.conversionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${selectedTrigger.conversionRate * 2}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedTrigger.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}>
                  {selectedTrigger.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Re-engagement Sequences */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowSequences(!showSequences)}
          className="w-full p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-between"
        >
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Re-engagement Sequences
          </h3>
          <span className={`transform transition-transform ${showSequences ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showSequences && (
          <div className="divide-y">
            {sequences.map((seq, idx) => (
              <div key={idx} className={`p-4 ${seq.step === 1 ? 'bg-gray-50 border-t-4 border-blue-500' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {seq.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{seq.sequence}</p>
                        <p className="text-xs text-gray-600 mt-1">{seq.message}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 font-semibold">{seq.delay}</p>
                        <p className="text-sm font-bold text-green-600 mt-1">{seq.conversionRate}% CVR</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-900 mb-3">✅ Best Performing Triggers</h3>
          <ul className="space-y-2 text-sm text-green-900">
            <li>• Article Series Follow-up: 42% engagement lift + 12.3% conversion</li>
            <li>• Premium Upsell: 35% lift + 8.5% conversion rate</li>
            <li>• Abandoned Cart: 28% lift + 5.2% conversion rate</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">🎯 Optimization Opportunities</h3>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• A/B test email subject lines - 5-15% CTR improvement typical</li>
            <li>• Pause "Referral Incentive" - only 3.2% conversion, redeploy budget</li>
            <li>• Expand "Article Series" to all content - test on 20% audience first</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
