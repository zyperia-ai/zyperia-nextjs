'use client'

import { useState } from 'react'
import { Lock, Eye, TrendingUp, Users, DollarSign, Settings } from 'lucide-react'

interface PremiumArticle {
  id: string
  title: string
  tier: 'free' | 'basic' | 'premium' | 'enterprise'
  views: number
  uniqueReaders: number
  earnings: number
  conversionRate: number
  status: 'published' | 'scheduled' | 'draft'
}

interface PaywallStrategy {
  name: string
  description: string
  freeContent: string
  premiumContent: string
  conversionRate: number
  revenue: number
}

interface SubscriptionTier {
  name: string
  price: number
  features: string[]
  subscribers: number
  mrr: number
  churn: number
}

export default function PremiumContentManager() {
  const [articles] = useState<PremiumArticle[]>([
    {
      id: '1',
      title: 'Advanced DeFi Strategies for 2026',
      tier: 'premium',
      views: 3245,
      uniqueReaders: 1856,
      earnings: 285.50,
      conversionRate: 12.3,
      status: 'published',
    },
    {
      id: '2',
      title: 'Institutional Bitcoin Trading Guide',
      tier: 'enterprise',
      views: 1890,
      uniqueReaders: 945,
      earnings: 425.75,
      conversionRate: 18.5,
      status: 'published',
    },
    {
      id: '3',
      title: 'Crypto Tax Optimization Masterclass',
      tier: 'premium',
      views: 2156,
      uniqueReaders: 1234,
      earnings: 198.25,
      conversionRate: 14.2,
      status: 'published',
    },
    {
      id: '4',
      title: 'Layer 2 Protocol Deep Analysis',
      tier: 'basic',
      views: 4567,
      uniqueReaders: 2890,
      earnings: 89.50,
      conversionRate: 4.5,
      status: 'published',
    },
    {
      id: '5',
      title: 'Market Manipulation Detection',
      tier: 'enterprise',
      views: 1234,
      uniqueReaders: 567,
      earnings: 567.80,
      conversionRate: 22.1,
      status: 'scheduled',
    },
  ])

  const [strategies] = useState<PaywallStrategy[]>([
    {
      name: 'Freemium',
      description: 'First 3 articles free per month, then paywall',
      freeContent: 'Article headline, intro paragraph, key insights',
      premiumContent: 'Full article, advanced strategies, code examples, downloads',
      conversionRate: 8.5,
      revenue: 45200,
    },
    {
      name: 'Metered',
      description: '5 free articles per month, unlimited with subscription',
      freeContent: 'Full article with non-intrusive banner',
      premiumContent: 'Full access without limits, early access, exclusive content',
      conversionRate: 12.3,
      revenue: 67450,
    },
    {
      name: 'Hard Paywall Premium Content',
      description: 'Top 20% content behind paywall, rest free',
      freeContent: 'Standard articles, news, tutorials',
      premiumContent: 'Advanced guides, strategies, expert interviews, data analysis',
      conversionRate: 15.8,
      revenue: 89300,
    },
    {
      name: 'Tier-Based Access',
      description: 'Different content for different subscription levels',
      freeContent: 'Summaries, recent news',
      premiumContent: 'Pro: Full articles, Basic: Summaries only, Enterprise: Full + research',
      conversionRate: 18.5,
      revenue: 125600,
    },
  ])

  const [tiers] = useState<SubscriptionTier[]>([
    {
      name: 'Free',
      price: 0,
      features: ['10 articles/month', 'Email digest (weekly)', 'Newsletter access'],
      subscribers: 28945,
      mrr: 0,
      churn: 0,
    },
    {
      name: 'Basic',
      price: 4.99,
      features: ['Unlimited articles', 'Email digest (daily)', 'Ad-free reading', 'Offline access'],
      subscribers: 3245,
      mrr: 16158.55,
      churn: 5.2,
    },
    {
      name: 'Premium',
      price: 9.99,
      features: ['All Basic features', 'Early access to articles', 'Expert interviews', 'Research reports'],
      subscribers: 1856,
      mrr: 18546.44,
      churn: 3.8,
    },
    {
      name: 'Enterprise',
      price: 49.99,
      features: ['All Premium features', 'API access', 'Custom reports', 'Priority support', 'Team accounts (5)'],
      subscribers: 234,
      mrr: 11697.66,
      churn: 1.2,
    },
  ])

  const [selectedTier, setSelectedTier] = useState<string>('Premium')
  const [selectedStrategy, setSelectedStrategy] = useState<string>('Tier-Based Access')

  const totalMRR = tiers.reduce((sum, t) => sum + t.mrr, 0)
  const totalSubscribers = tiers.reduce((sum, t) => sum + t.subscribers, 0)

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Premium Content Manager</h1>
          <p className="text-gray-600 mt-1">Manage paywall, content tiers, and subscription monetization</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Paywall Settings
        </button>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Monthly Recurring</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            ${totalMRR.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-blue-700 mt-1">From subscriptions</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Total Subscribers</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {totalSubscribers.toLocaleString()}
          </p>
          <p className="text-xs text-green-700 mt-1">
            {((totalSubscribers - tiers[0].subscribers) / totalSubscribers * 100).toFixed(1)}% paid
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Premium Articles</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {articles.filter(a => a.tier !== 'free').length}
          </p>
          <p className="text-xs text-purple-700 mt-1">
            {(articles.filter(a => a.tier !== 'free').length / articles.length * 100).toFixed(0)}% of library
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Avg Conversion</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">
            {(articles.reduce((sum, a) => sum + a.conversionRate, 0) / articles.length).toFixed(1)}%
          </p>
          <p className="text-xs text-orange-700 mt-1">Free → Premium conversion</p>
        </div>
      </div>

      {/* Subscription Tiers Performance */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Subscription Tier Performance
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Subscribers</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">MRR</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Churn</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">LTV</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map(tier => (
                <tr
                  key={tier.name}
                  onClick={() => setSelectedTier(tier.name)}
                  className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedTier === tier.name ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">{tier.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">${tier.price}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {tier.subscribers.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    ${tier.mrr.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-bold ${
                      tier.churn < 3 ? 'text-green-600' : tier.churn < 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {tier.churn}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ${(tier.price * 12 / (tier.churn / 100 || 0.01)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Articles */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Premium Content Performance
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Views</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Unique</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Conv. Rate</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate">
                    {article.title}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      article.tier === 'enterprise'
                        ? 'bg-purple-100 text-purple-700'
                        : article.tier === 'premium'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {article.tier.charAt(0).toUpperCase() + article.tier.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.uniqueReaders.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">{article.conversionRate}%</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    ${article.earnings.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paywall Strategies */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Paywall Strategies Comparison</h3>
        </div>

        <div className="divide-y">
          {strategies.map((strategy, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedStrategy(strategy.name)}
              className={`w-full text-left p-6 hover:bg-gray-50 transition-colors ${
                selectedStrategy === strategy.name ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{strategy.conversionRate}% CVR</p>
                  <p className="text-xs text-gray-600 mt-1">
                    ${strategy.revenue.toLocaleString()}/month est.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 rounded p-3">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Free Content</p>
                  <p className="text-sm text-gray-900">{strategy.freeContent}</p>
                </div>
                <div className="bg-purple-50 rounded p-3">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Premium Content</p>
                  <p className="text-sm text-gray-900">{strategy.premiumContent}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-4">🎯 Monetization Optimization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Immediate Actions:</p>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Increase Enterprise content (avg 20.3% conversion vs 9.4% overall)</li>
              <li>• Reduce free article limit to 3/month (current: 10)</li>
              <li>• Promote 18.5% MRR tier (Enterprise) more aggressively</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Strategic Changes:</p>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Implement Tier-Based Access strategy (projected 18.5% CVR)</li>
              <li>• Lower churn in Basic tier (5.2% → 3% target) with content improvements</li>
              <li>• Test paywall on article #4 (4567 views, 4.5% CVR)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
