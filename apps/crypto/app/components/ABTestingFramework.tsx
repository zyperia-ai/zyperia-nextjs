'use client'

import { useState } from 'react'
import { Zap, TrendingUp, Eye, Clock, Target, CheckCircle2 } from 'lucide-react'

interface ABTest {
  id: string
  name: string
  element: string
  controlVersion: string
  treatmentVersion: string
  startDate: string
  endDate?: string
  controlViews: number
  controlConversions: number
  treatmentViews: number
  treatmentConversions: number
  status: 'running' | 'completed' | 'paused'
  confidence: number
  winner?: 'control' | 'treatment' | 'tie'
}

interface TestRecommendation {
  test: string
  element: string
  expected_uplift: string
  priority: 'high' | 'medium' | 'low'
  effort: string
  implementation: string
}

export default function ABTestingFramework() {
  const [tests] = useState<ABTest[]>([
    {
      id: '1',
      name: 'Article Headline Variant A/B',
      element: 'Article Headline',
      controlVersion: 'Bitcoin Market Analysis Q2 2026',
      treatmentVersion: 'How to Profit from Bitcoin: Q2 2026 Market Analysis',
      startDate: '2026-04-18',
      controlViews: 2456,
      controlConversions: 98,
      treatmentViews: 2834,
      treatmentConversions: 142,
      status: 'completed',
      confidence: 95,
      winner: 'treatment',
    },
    {
      id: '2',
      name: 'CTA Button Color Test',
      element: 'Subscribe Button',
      controlVersion: 'Blue (#0066ff)',
      treatmentVersion: 'Orange (#ff8c00)',
      startDate: '2026-04-15',
      endDate: '2026-04-22',
      controlViews: 3456,
      controlConversions: 156,
      treatmentViews: 3521,
      treatmentConversions: 189,
      status: 'completed',
      confidence: 92,
      winner: 'treatment',
    },
    {
      id: '3',
      name: 'Email Subject Line Test',
      element: 'Newsletter Subject',
      controlVersion: 'Weekly Crypto Digest - April 24',
      treatmentVersion: '3 Altcoins Set to Explode (Apr 24)',
      startDate: '2026-04-22',
      controlViews: 12543,
      controlConversions: 512,
      treatmentViews: 12645,
      treatmentConversions: 742,
      status: 'running',
      confidence: 88,
    },
    {
      id: '4',
      name: 'Paywall Trigger Test',
      element: 'Paywall Position',
      controlVersion: '50% of article',
      treatmentVersion: '70% of article',
      startDate: '2026-04-20',
      controlViews: 4321,
      controlConversions: 189,
      treatmentViews: 4456,
      treatmentConversions: 156,
      status: 'running',
      confidence: 72,
    },
    {
      id: '5',
      name: 'Content Format Test',
      element: 'Article Format',
      controlVersion: 'Long-form (5000+ words)',
      treatmentVersion: 'Medium-form with video (2500 words + 5min video)',
      startDate: '2026-04-12',
      endDate: '2026-04-22',
      controlViews: 5678,
      controlConversions: 178,
      treatmentViews: 5823,
      treatmentConversions: 234,
      status: 'completed',
      confidence: 94,
      winner: 'treatment',
    },
  ])

  const [recommendations] = useState<TestRecommendation[]>([
    {
      test: 'Newsletter Frequency Test',
      element: 'Email Schedule',
      expected_uplift: '12-18% increase in engagement',
      priority: 'high',
      effort: '1 week to implement',
      implementation: 'Test daily vs 3x/week vs weekly sends',
    },
    {
      test: 'Premium Tier Pricing Test',
      element: 'Subscription Price',
      expected_uplift: '15-25% revenue increase',
      priority: 'high',
      effort: '2 weeks for statistical significance',
      implementation: 'Test $7.99 vs $9.99 vs $11.99 for Basic tier',
    },
    {
      test: 'Content Length Optimization',
      element: 'Article Word Count',
      expected_uplift: '8-12% higher session duration',
      priority: 'medium',
      effort: '3 weeks data collection',
      implementation: 'Test 1500, 2500, 3500, 5000 word targets',
    },
    {
      test: 'Recommendation Algorithm Test',
      element: 'Recommended Articles',
      expected_uplift: '20-35% more clicks on recommendations',
      priority: 'high',
      effort: '2 weeks implementation',
      implementation: 'Test content-based vs collaborative filtering',
    },
    {
      test: 'Notification Frequency',
      element: 'Re-engagement Triggers',
      expected_uplift: '10-15% conversion lift',
      priority: 'medium',
      effort: '1 week setup',
      implementation: 'Test 1x daily vs 3x weekly trigger frequency',
    },
  ])

  const [selectedTest, setSelectedTest] = useState<ABTest | null>(tests[0])

  const calculateLift = (test: ABTest) => {
    const controlRate = test.controlConversions / test.controlViews
    const treatmentRate = test.treatmentConversions / test.treatmentViews
    return ((treatmentRate - controlRate) / controlRate) * 100
  }

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 95) return { label: '95%+ Confident', color: 'text-green-600', bg: 'bg-green-100' }
    if (confidence >= 90) return { label: '90%+ Confident', color: 'text-green-600', bg: 'bg-green-100' }
    if (confidence >= 80) return { label: '80%+ Confident', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { label: 'Not Significant', color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const completedTests = tests.filter(t => t.status === 'completed')
  const runningTests = tests.filter(t => t.status === 'running')
  const totalLift = completedTests.reduce((sum, t) => sum + calculateLift(t), 0)

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">A/B Testing Framework</h1>
          <p className="text-gray-600 mt-1">Optimize content, pricing, and UX through data-driven testing</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Create New Test
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Tests Completed</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{completedTests.length}</p>
          <p className="text-xs text-blue-700 mt-1">
            {completedTests.filter(t => t.winner).length} with significant results
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Active Tests</p>
          <p className="text-3xl font-bold text-green-900 mt-2">{runningTests.length}</p>
          <p className="text-xs text-green-700 mt-1">Running now</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Cumulative Lift</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {totalLift.toFixed(1)}%
          </p>
          <p className="text-xs text-purple-700 mt-1">From winning variations</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <p className="text-gray-600 text-sm font-medium">Est. Revenue Impact</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">$18.5K</p>
          <p className="text-xs text-orange-700 mt-1">Monthly from optimizations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tests List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">All Tests</h3>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto">
            {tests.map(test => {
              const lift = calculateLift(test)
              const confidence = getConfidenceLevel(test.confidence)

              return (
                <button
                  key={test.id}
                  onClick={() => setSelectedTest(test)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                    selectedTest?.id === test.id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{test.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{test.element}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                      test.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : test.status === 'running'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex gap-4 text-xs">
                    <span className="text-gray-600">
                      Lift: <span className={`font-bold ${lift > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {lift > 0 ? '+' : ''}{lift.toFixed(1)}%
                      </span>
                    </span>
                    <span className={`font-bold ${confidence.color}`}>
                      {confidence.label}
                    </span>
                    {test.winner && (
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {test.winner === 'treatment' ? 'Treatment wins' : 'Control wins'}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Test Details */}
        {selectedTest && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h3 className="font-bold text-gray-900">{selectedTest.name}</h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Element Tested</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{selectedTest.element}</p>
              </div>

              <div className="space-y-2 py-4 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">Control (Original)</p>
                  <p className="text-sm text-gray-900">{selectedTest.controlVersion}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">Treatment (New)</p>
                  <p className="text-sm text-gray-900">{selectedTest.treatmentVersion}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-3">Results</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">Control Conversion</span>
                      <span className="font-bold text-gray-900">
                        {((selectedTest.controlConversions / selectedTest.controlViews) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-600 h-2 rounded-full"
                        style={{ width: `${(selectedTest.controlConversions / selectedTest.controlViews) * 100 * 3}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">Treatment Conversion</span>
                      <span className="font-bold text-green-600">
                        {((selectedTest.treatmentConversions / selectedTest.treatmentViews) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(selectedTest.treatmentConversions / selectedTest.treatmentViews) * 100 * 3}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Lift</p>
                    <p className={`text-2xl font-bold mt-1 ${
                      calculateLift(selectedTest) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {calculateLift(selectedTest) > 0 ? '+' : ''}{calculateLift(selectedTest).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">Confidence</p>
                    <p className={`text-2xl font-bold mt-1 ${getConfidenceLevel(selectedTest.confidence).color}`}>
                      {selectedTest.confidence}%
                    </p>
                  </div>
                </div>
              </div>

              {selectedTest.status === 'completed' && (
                <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors">
                  ✓ Implement Winner
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Tests */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommended Tests to Run
          </h3>
        </div>

        <div className="divide-y">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{rec.test}</h4>
                <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                  rec.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : rec.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{rec.implementation}</p>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Expected Uplift</p>
                  <p className="text-gray-900 mt-1">{rec.expected_uplift}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Element</p>
                  <p className="text-gray-900 mt-1">{rec.element}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Timeline</p>
                  <p className="text-gray-900 mt-1">{rec.effort}</p>
                </div>
              </div>

              <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold mt-3">
                Start test →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">🧪 A/B Testing Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Statistical Rigor:</p>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Always aim for 95%+ confidence before declaring winner</li>
              <li>• Run minimum 1-2 weeks per test to account for weekly patterns</li>
              <li>• Need ~50 conversions minimum per variation (statistical power)</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-2">Test Strategy:</p>
            <ul className="space-y-1 text-sm text-blue-900">
              <li>• Test ONE variable per test (headline OR button color, not both)</li>
              <li>• Prioritize high-traffic pages for faster results</li>
              <li>• Document all hypotheses before running tests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
