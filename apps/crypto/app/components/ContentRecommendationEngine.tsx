'use client'

import { useState } from 'react'
import { Zap, TrendingUp, Eye, BookOpen, Users, Target } from 'lucide-react'

interface RecommendedArticle {
  id: string
  title: string
  category: string
  views: number
  relevanceScore: number
  estimatedRevenue: number
  reason: string
  tags: string[]
}

interface ContentStrategy {
  strategy: string
  description: string
  expectedImpact: string
  implementation: string
  priority: 'high' | 'medium' | 'low'
}

export default function ContentRecommendationEngine() {
  const [recommendations] = useState<RecommendedArticle[]>([
    {
      id: '1',
      title: 'Best Bitcoin Hardware Wallets 2026',
      category: 'Tools & Reviews',
      views: 0,
      relevanceScore: 98,
      estimatedRevenue: 125.50,
      reason: 'High search volume + affiliate potential + similar reader interests',
      tags: ['wallet', 'hardware', 'security', 'review'],
    },
    {
      id: '2',
      title: 'Ethereum Staking Guide: Maximize Returns',
      category: 'Technical',
      views: 0,
      relevanceScore: 94,
      estimatedRevenue: 98.25,
      reason: 'Strong engagement from power users + high conversion potential',
      tags: ['ethereum', 'staking', 'passive-income', 'technical'],
    },
    {
      id: '3',
      title: 'Crypto Tax Reporting Simplified',
      category: 'Regulation',
      views: 0,
      relevanceScore: 89,
      estimatedRevenue: 145.75,
      reason: 'Q2 tax season demand + premium subscriber interest',
      tags: ['tax', 'regulation', 'compliance', 'business'],
    },
    {
      id: '4',
      title: 'DeFi Flash Loans Explained',
      category: 'Technical',
      views: 0,
      relevanceScore: 85,
      estimatedRevenue: 67.50,
      reason: 'Trending technical topic + interested audience segment',
      tags: ['defi', 'advanced', 'technical', 'education'],
    },
    {
      id: '5',
      title: 'NFT Marketplace Comparison 2026',
      category: 'Tools & Reviews',
      views: 0,
      relevanceScore: 82,
      estimatedRevenue: 112.25,
      reason: 'Evergreen content + high ROI on reviews',
      tags: ['nft', 'marketplace', 'comparison', 'review'],
    },
  ])

  const [contentStrategies] = useState<ContentStrategy[]>([
    {
      strategy: 'Pillar Content + Clusters',
      description: 'Create 1 pillar article (5000+ words) per month with 5-7 supporting cluster articles (1500-2000 words)',
      expectedImpact: 'Increase organic traffic by 40%, improve SEO rankings, 3x keyword coverage',
      implementation: 'Pillar: "Complete DeFi Guide" → Clusters: Liquidity, Governance, Risks, Security, Yields',
      priority: 'high',
    },
    {
      strategy: 'Seasonal Content Calendar',
      description: 'Plan content around crypto market events, tax seasons, regulatory announcements',
      expectedImpact: '60% increase in trending article traffic, 25% higher engagement',
      implementation: 'Map regulatory deadlines, market events, holiday seasons 6 months in advance',
      priority: 'high',
    },
    {
      strategy: 'Interactive Content',
      description: 'Add calculators, comparisons, quizzes, and tools within articles',
      expectedImpact: 'Increase session duration by 45%, improve conversion by 18%',
      implementation: 'Add: ROI calculator, portfolio tracker, tax calculator, market comparison tools',
      priority: 'medium',
    },
    {
      strategy: 'User-Generated Content & Community',
      description: 'Encourage readers to share experiences, reviews, and insights',
      expectedImpact: 'Increase engagement by 55%, reduce content production cost by 30%',
      implementation: 'Weekly community spotlight, reader case studies, expert interviews',
      priority: 'medium',
    },
    {
      strategy: 'Multi-Format Content',
      description: 'Repurpose articles into video, infographics, podcasts, social media threads',
      expectedImpact: 'Reach 3x more audience, increase brand authority by 2x',
      implementation: 'Article → Highlights → Video script → Podcast → Social threads',
      priority: 'high',
    },
  ])

  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendedArticle | null>(recommendations[0])
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = ['all', ...new Set(recommendations.map(r => r.category))]
  const totalEstimatedRevenue = recommendations.reduce((sum, r) => sum + r.estimatedRevenue, 0)

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Recommendation Engine</h1>
        <p className="text-gray-600 mt-1">AI-powered content ideas optimized for engagement and revenue</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Recommended Topics</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{recommendations.length}</p>
          <p className="text-xs text-blue-700 mt-1">Ready to create</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Est. Revenue Potential</p>
          <p className="text-3xl font-bold text-green-900 mt-2">${totalEstimatedRevenue.toFixed(0)}</p>
          <p className="text-xs text-green-700 mt-1">If all published</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Avg Relevance Score</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {(recommendations.reduce((sum, r) => sum + r.relevanceScore, 0) / recommendations.length).toFixed(0)}/100
          </p>
          <p className="text-xs text-purple-700 mt-1">Match quality</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Priority Articles</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">
            {recommendations.filter(r => r.relevanceScore > 90).length}
          </p>
          <p className="text-xs text-orange-700 mt-1">90+ relevance score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Recommended Topics to Create</h3>

            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-4 max-h-96 overflow-y-auto">
            {recommendations
              .filter(r => filterCategory === 'all' || r.category === filterCategory)
              .map(rec => (
                <button
                  key={rec.id}
                  onClick={() => setSelectedRecommendation(rec)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedRecommendation?.id === rec.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-2">{rec.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{rec.category}</p>
                    </div>
                    <span className={`text-sm font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                      rec.relevanceScore >= 95
                        ? 'bg-green-100 text-green-700'
                        : rec.relevanceScore >= 85
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {rec.relevanceScore}/100
                    </span>
                  </div>

                  <div className="flex gap-3 text-xs">
                    <span className="text-gray-600">
                      Est Revenue: <span className="font-bold text-green-600">${rec.estimatedRevenue.toFixed(0)}</span>
                    </span>
                    <span className="text-gray-600">
                      Priority: <span className="font-bold">{rec.relevanceScore > 90 ? '🔴 High' : rec.relevanceScore > 80 ? '🟡 Medium' : '⚪ Low'}</span>
                    </span>
                  </div>

                  <div className="flex gap-1 flex-wrap mt-2">
                    {rec.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Recommendation Details */}
        {selectedRecommendation && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="font-bold text-gray-900 line-clamp-2">{selectedRecommendation.title}</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Category</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{selectedRecommendation.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Relevance Score</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{selectedRecommendation.relevanceScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Est. Revenue</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ${selectedRecommendation.estimatedRevenue.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Why This Topic?</p>
                <p className="text-sm text-gray-900">{selectedRecommendation.reason}</p>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Related Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {selectedRecommendation.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
                Create Article
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Strategies */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Content Strategies for Max Revenue
          </h3>
        </div>

        <div className="divide-y">
          {contentStrategies.map((strategy, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{strategy.strategy}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                  strategy.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : strategy.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {strategy.priority.charAt(0).toUpperCase() + strategy.priority.slice(1)} Priority
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{strategy.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Expected Impact</p>
                  <p className="text-gray-900 mt-1">{strategy.expectedImpact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">How to Implement</p>
                  <p className="text-gray-900 mt-1">{strategy.implementation}</p>
                </div>
              </div>

              <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                Learn more →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content Calendar Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-4">📅 Suggested Publishing Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Week 1</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Best Bitcoin Hardware Wallets (Monday)</li>
              <li>• Ethereum Staking Guide (Wednesday)</li>
              <li>• DeFi Flash Loans (Friday)</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">Week 2</p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Crypto Tax Reporting (Monday)</li>
              <li>• NFT Marketplace Comparison (Thursday)</li>
              <li>• Expert Interview (Saturday)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
