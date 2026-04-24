'use client'

import { useState } from 'react'
import { TrendingUp, Eye, Share2, MessageSquare, Heart, Clock } from 'lucide-react'

interface ContentMetric {
  id: string
  title: string
  category: string
  publishedDate: string
  views: number
  uniqueVisitors: number
  avgTimeOnPage: number
  bounceRate: number
  shares: number
  comments: number
  likes: number
  readingTime: number
  earningsGenerated: number
  conversionRate: number
  viewsTrend: number
}

export default function ContentPerformance() {
  const [articles] = useState<ContentMetric[]>([
    {
      id: '1',
      title: 'Bitcoin Market Analysis Q2 2026',
      category: 'Market Analysis',
      publishedDate: '2026-04-20',
      views: 2845,
      uniqueVisitors: 1920,
      avgTimeOnPage: 4.2,
      bounceRate: 32,
      shares: 156,
      comments: 42,
      likes: 342,
      readingTime: 8,
      earningsGenerated: 56.90,
      conversionRate: 3.2,
      viewsTrend: 12.5,
    },
    {
      id: '2',
      title: 'DeFi Protocol Security Deep Dive',
      category: 'Technical',
      publishedDate: '2026-04-18',
      views: 1956,
      uniqueVisitors: 1245,
      avgTimeOnPage: 6.8,
      bounceRate: 28,
      shares: 89,
      comments: 67,
      likes: 234,
      readingTime: 12,
      earningsGenerated: 39.12,
      conversionRate: 2.8,
      viewsTrend: 8.3,
    },
    {
      id: '3',
      title: 'Ethereum Roadmap Updates May',
      category: 'News',
      publishedDate: '2026-04-15',
      views: 3124,
      uniqueVisitors: 2156,
      avgTimeOnPage: 3.5,
      bounceRate: 38,
      shares: 234,
      comments: 89,
      likes: 567,
      readingTime: 5,
      earningsGenerated: 62.48,
      conversionRate: 3.8,
      viewsTrend: 15.2,
    },
    {
      id: '4',
      title: 'Regulatory Changes Impact Analysis',
      category: 'Regulation',
      publishedDate: '2026-04-12',
      views: 1543,
      uniqueVisitors: 1087,
      avgTimeOnPage: 5.1,
      bounceRate: 35,
      shares: 67,
      comments: 34,
      likes: 145,
      readingTime: 10,
      earningsGenerated: 30.86,
      conversionRate: 2.1,
      viewsTrend: 5.2,
    },
    {
      id: '5',
      title: 'Top 10 Crypto Wallets Reviewed',
      category: 'Tools',
      publishedDate: '2026-04-10',
      views: 4230,
      uniqueVisitors: 2894,
      avgTimeOnPage: 4.7,
      bounceRate: 29,
      shares: 456,
      comments: 156,
      likes: 823,
      readingTime: 7,
      earningsGenerated: 84.60,
      conversionRate: 4.2,
      viewsTrend: 22.1,
    },
  ])

  const [sortBy, setSortBy] = useState<'views' | 'earnings' | 'engagement' | 'recent'>('views')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [selectedArticle, setSelectedArticle] = useState<ContentMetric | null>(articles[0])

  const categories = ['all', ...new Set(articles.map(a => a.category))]

  const sortedArticles = articles
    .filter(a => filterCategory === 'all' || a.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views
      if (sortBy === 'earnings') return b.earningsGenerated - a.earningsGenerated
      if (sortBy === 'engagement') return (b.shares + b.comments + b.likes) - (a.shares + a.comments + a.likes)
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    })

  const totalViews = articles.reduce((sum, a) => a.views, 0)
  const totalEarnings = articles.reduce((sum, a) => sum + a.earningsGenerated, 0)
  const avgEngagement = articles.reduce((sum, a) => sum + (a.shares + a.comments + a.likes), 0) / articles.length

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Performance</h1>
        <p className="text-gray-600 mt-1">Track article metrics, engagement, and ROI</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Views</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">{articles.length} articles</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                ${totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-green-700 mt-1">
                ${(totalEarnings / articles.length).toFixed(2)}/article
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Engagement</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {Math.round(avgEngagement)}
              </p>
              <p className="text-xs text-purple-700 mt-1">interactions/article</p>
            </div>
            <Heart className="h-8 w-8 text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Conv. Rate</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {(articles.reduce((sum, a) => sum + a.conversionRate, 0) / articles.length).toFixed(1)}%
              </p>
              <p className="text-xs text-orange-700 mt-1">visitor conversion</p>
            </div>
            <Share2 className="h-8 w-8 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Articles List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">All Articles</h3>
              <div className="flex gap-2">
                {(['views', 'earnings', 'engagement', 'recent'] as const).map(sort => (
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

          <div className="space-y-2 p-4">
            {sortedArticles.map(article => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedArticle?.id === article.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 line-clamp-1">{article.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(article.publishedDate).toLocaleDateString()} • {article.category}
                    </p>
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                    article.viewsTrend > 10
                      ? 'bg-green-100 text-green-700'
                      : article.viewsTrend > 5
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    ↑ {article.viewsTrend.toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div>
                    <p className="text-gray-600">Views</p>
                    <p className="font-bold text-gray-900">{article.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Unique</p>
                    <p className="font-bold text-gray-900">{article.uniqueVisitors.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Earnings</p>
                    <p className="font-bold text-green-600">${article.earningsGenerated.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Engagement</p>
                    <p className="font-bold text-gray-900">{article.shares + article.comments + article.likes}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conv.</p>
                    <p className="font-bold text-gray-900">{article.conversionRate}%</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Article Details */}
        {selectedArticle && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="font-bold text-gray-900 line-clamp-2">{selectedArticle.title}</h3>
              <p className="text-xs text-gray-600 mt-2">
                Published {new Date(selectedArticle.publishedDate).toLocaleDateString()}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Views Section */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">Views</span>
                  <span className="text-sm font-bold text-gray-900">{selectedArticle.views.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(selectedArticle.views / 4230) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Engagement Section */}
              <div className="space-y-2 py-2 border-t border-b border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">Engagement</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <Share2 className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <p className="text-xs text-gray-600">Shares</p>
                    <p className="font-bold text-gray-900">{selectedArticle.shares}</p>
                  </div>
                  <div className="text-center">
                    <MessageSquare className="h-4 w-4 mx-auto text-green-600 mb-1" />
                    <p className="text-xs text-gray-600">Comments</p>
                    <p className="font-bold text-gray-900">{selectedArticle.comments}</p>
                  </div>
                  <div className="text-center">
                    <Heart className="h-4 w-4 mx-auto text-red-600 mb-1" />
                    <p className="text-xs text-gray-600">Likes</p>
                    <p className="font-bold text-gray-900">{selectedArticle.likes}</p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-semibold">Bounce Rate</span>
                    <span className="font-bold text-gray-900">{selectedArticle.bounceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${selectedArticle.bounceRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-semibold">Conversion Rate</span>
                    <span className="font-bold text-gray-900">{selectedArticle.conversionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${selectedArticle.conversionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-semibold">Avg Time on Page</span>
                    <span className="font-bold text-gray-900">{selectedArticle.avgTimeOnPage} min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(selectedArticle.avgTimeOnPage / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Revenue Section */}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-semibold uppercase">Revenue Generated</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ${selectedArticle.earningsGenerated.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  ${(selectedArticle.earningsGenerated / selectedArticle.views * 1000).toFixed(2)} per 1K views
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">📊 Content Insights</h3>
        <ul className="space-y-2 text-sm text-blue-900">
          <li>• Your best performer: "Top 10 Crypto Wallets" with 4,230 views and $84.60 earnings</li>
          <li>• Highest engagement: "Ethereum Roadmap Updates" with 890 total interactions</li>
          <li>• Best conversion rate: "Top 10 Crypto Wallets" at 4.2% visitor conversion</li>
          <li>• Content recommendation: Create more "Tools" category content - highest ROI at 20 cents per view</li>
        </ul>
      </div>
    </div>
  )
}
