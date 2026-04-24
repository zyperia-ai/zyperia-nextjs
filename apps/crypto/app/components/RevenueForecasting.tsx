'use client'

import { useState } from 'react'
import { TrendingUp, Calendar, Target, AlertCircle, BarChart3 } from 'lucide-react'

interface ForecastData {
  month: string
  actual?: number
  forecast: number
  low: number
  high: number
  confidence: number
}

interface RevenueBreakdown {
  source: string
  current: number
  forecast: number
  trend: number
}

export default function RevenueForecasting() {
  const [forecastData] = useState<ForecastData[]>([
    { month: 'Feb 2026', actual: 8450, forecast: 8450, low: 8200, high: 8700, confidence: 100 },
    { month: 'Mar 2026', actual: 9230, forecast: 9230, low: 8950, high: 9500, confidence: 100 },
    { month: 'Apr 2026', actual: 10200, forecast: 10200, low: 9900, high: 10500, confidence: 100 },
    { month: 'May 2026', forecast: 11450, low: 10800, high: 12100, confidence: 92 },
    { month: 'Jun 2026', forecast: 12890, low: 11950, high: 13830, confidence: 88 },
    { month: 'Jul 2026', forecast: 14560, low: 13200, high: 15920, confidence: 84 },
    { month: 'Aug 2026', forecast: 16340, low: 14650, high: 18030, confidence: 80 },
    { month: 'Sep 2026', forecast: 18560, low: 16420, high: 20700, confidence: 78 },
    { month: 'Oct 2026', forecast: 21230, low: 18650, high: 23810, confidence: 75 },
    { month: 'Nov 2026', forecast: 24560, low: 21320, high: 27800, confidence: 72 },
    { month: 'Dec 2026', forecast: 28920, low: 24980, high: 32860, confidence: 70 },
  ])

  const [breakdown] = useState<RevenueBreakdown[]>([
    { source: 'Article Views', current: 4320, forecast: 5890, trend: 36.2 },
    { source: 'Subscriptions', current: 12450, forecast: 16780, trend: 34.8 },
    { source: 'Affiliates', current: 2850, forecast: 4120, trend: 44.6 },
    { source: 'Referrals', current: 980, forecast: 1560, trend: 59.2 },
  ])

  const [selectedSource, setSelectedSource] = useState<string>('Subscriptions')
  const [timeHorizon, setTimeHorizon] = useState<'6m' | '12m' | '24m'>('12m')

  const currentMRR = 10200
  const projectedYear = 28920
  const cagr = (Math.pow(projectedYear / currentMRR, 1 / 10) - 1) * 100

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Forecasting</h1>
          <p className="text-gray-600 mt-1">AI-powered revenue projections for business planning</p>
        </div>
        <div className="flex gap-2">
          {(['6m', '12m', '24m'] as const).map(horizon => (
            <button
              key={horizon}
              onClick={() => setTimeHorizon(horizon)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeHorizon === horizon
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {horizon === '6m' ? '6 Mo' : horizon === '12m' ? '12 Mo' : '24 Mo'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Projections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Current MRR</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            ${currentMRR.toLocaleString()}
          </p>
          <p className="text-xs text-blue-700 mt-1">April 2026</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">12-Month Projection</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            ${projectedYear.toLocaleString()}
          </p>
          <p className="text-xs text-green-700 mt-1">
            ↑ {((projectedYear - currentMRR) / currentMRR * 100).toFixed(0)}% growth
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Annual Runrate</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            ${(projectedYear * 12 / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-purple-700 mt-1">ARR at 12-month forecast</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Projected CAGR</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">
            {cagr.toFixed(1)}%
          </p>
          <p className="text-xs text-orange-700 mt-1">Compound annual growth</p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Revenue Forecast (MRR)
          </h3>
        </div>

        <div className="p-6">
          <div className="flex items-end justify-between h-64 gap-1 mb-4">
            {forecastData.map((point, idx) => {
              const maxValue = Math.max(...forecastData.map(p => p.high))
              const forecastHeight = (point.forecast / maxValue) * 100
              const actualHeight = point.actual ? (point.actual / maxValue) * 100 : 0

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative w-full flex items-end justify-center" style={{ height: '200px' }}>
                    {/* Confidence range background */}
                    <div
                      className="absolute w-3/4 bg-gray-100 rounded opacity-50"
                      style={{
                        bottom: `${(point.low / maxValue) * 100}%`,
                        height: `${((point.high - point.low) / maxValue) * 100}%`,
                      }}
                    ></div>

                    {/* Forecast bar */}
                    <div
                      className="w-3/4 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                      style={{ height: `${forecastHeight}%` }}
                    ></div>

                    {/* Actual bar (if exists) */}
                    {actualHeight > 0 && (
                      <div
                        className="absolute w-3/4 bg-green-600 rounded-t"
                        style={{
                          height: `${actualHeight}%`,
                          bottom: 0,
                        }}
                      ></div>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 text-center mt-2 truncate">
                    {point.month.split(' ')[0]}
                  </p>
                  <p className="text-xs font-bold text-gray-900">
                    ${(point.forecast / 1000).toFixed(1)}K
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex gap-4 text-sm justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-gray-700">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></div>
              <span className="text-gray-700">Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-gray-700">Confidence Range</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown Forecast */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Revenue Source Forecast</h3>
        </div>

        <div className="divide-y">
          {breakdown.map(source => (
            <button
              key={source.source}
              onClick={() => setSelectedSource(source.source)}
              className={`w-full text-left p-6 hover:bg-gray-50 transition-colors border-l-4 ${
                selectedSource === source.source ? 'border-blue-500 bg-blue-50' : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{source.source}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Current: ${source.current.toLocaleString()} → Projected: ${source.forecast.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">+{source.trend.toFixed(1)}%</p>
                  <p className="text-xs text-gray-600">12-month growth</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Growth Rate</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(source.trend / 100 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right min-w-24">
                  <p className="text-xs text-gray-600 font-semibold">Market Share</p>
                  <p className="text-sm font-bold text-gray-900">
                    {((source.forecast / (breakdown.reduce((sum, s) => sum + s.forecast, 0))) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Total 12-Month Forecast:</span> ${(breakdown.reduce((sum, s) => sum + s.forecast, 0) * 12).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Scenario Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-bold text-green-900 mb-3">🚀 Optimistic Scenario</h4>
          <p className="text-sm text-green-900 mb-3">All tests succeed, acquisition accelerates</p>
          <p className="text-2xl font-bold text-green-600 mb-2">$35.2K</p>
          <p className="text-xs text-green-700">12-month MRR (48% vs forecast)</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-bold text-blue-900 mb-3">📊 Base Case (Forecast)</h4>
          <p className="text-sm text-blue-900 mb-3">Current growth rate continues</p>
          <p className="text-2xl font-bold text-blue-600 mb-2">$28.9K</p>
          <p className="text-xs text-blue-700">12-month MRR (184% growth)</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h4 className="font-bold text-orange-900 mb-3">⚠️ Conservative Scenario</h4>
          <p className="text-sm text-orange-900 mb-3">Growth slows, market headwinds</p>
          <p className="text-2xl font-bold text-orange-600 mb-2">$18.5K</p>
          <p className="text-xs text-orange-700">12-month MRR (81% vs forecast)</p>
        </div>
      </div>

      {/* Key Drivers & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth Drivers
          </h3>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Subscriber base growing 8.3% MoM (1,000+ new subscribers/month)</li>
            <li>• Premium content engagement +15% YoY lift</li>
            <li>• Affiliate program expanding with top performers (22% conversion)</li>
            <li>• Newsletter open rates increasing (42.1% vs industry 21%)</li>
            <li>• Content recommendation conversion +28% from A/B tests</li>
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Risk Factors
          </h3>
          <ul className="space-y-2 text-sm text-orange-900">
            <li>• Churn risk if content quality declines (5.2% current churn)</li>
            <li>• Market saturation in crypto niche - diversification needed</li>
            <li>• Email deliverability issues could impact newsletter revenue</li>
            <li>• Competitive pressure from established platforms</li>
            <li>• Regulatory changes affecting crypto content monetization</li>
          </ul>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-4">✅ To Hit $35K+ Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Priority 1 (Q2 2026):</p>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Launch Premium tier upgrade campaign</li>
              <li>• Publish 2 pillar articles + 10 cluster articles/month</li>
              <li>• Run 3 A/B tests on high-traffic pages</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Priority 2 (Q3 2026):</p>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Launch second content vertical (not crypto)</li>
              <li>• Expand affiliate program (target 100+ active affiliates)</li>
              <li>• Implement dynamic content pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
