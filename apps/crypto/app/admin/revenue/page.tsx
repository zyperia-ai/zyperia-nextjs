'use client';

import { useState, useMemo } from 'react';

interface RevenueData {
  date: string;
  adsense_revenue: number;
  affiliate_revenue: number;
  total_revenue: number;
  affiliate_clicks: number;
  conversions: number;
  conversion_rate: number;
}

interface ArticleRevenue {
  article_id: string;
  title: string;
  views: number;
  affiliate_clicks: number;
  conversions: number;
  adsense_revenue: number;
  affiliate_revenue: number;
  total_revenue: number;
}

interface ProgramRevenue {
  program_id: string;
  program_name: string;
  commission_rate: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export default function RevenuePage() {
  // Mock data
  const dailyData: RevenueData[] = [
    {
      date: '2026-04-24',
      adsense_revenue: 45.23,
      affiliate_revenue: 120.5,
      total_revenue: 165.73,
      affiliate_clicks: 52,
      conversions: 8,
      conversion_rate: 0.154,
    },
    {
      date: '2026-04-23',
      adsense_revenue: 38.1,
      affiliate_revenue: 95.75,
      total_revenue: 133.85,
      affiliate_clicks: 38,
      conversions: 5,
      conversion_rate: 0.131,
    },
    {
      date: '2026-04-22',
      adsense_revenue: 52.34,
      affiliate_revenue: 145.2,
      total_revenue: 197.54,
      affiliate_clicks: 65,
      conversions: 10,
      conversion_rate: 0.154,
    },
  ];

  const topArticles: ArticleRevenue[] = [
    {
      article_id: '1',
      title: 'Bitcoin Trading Strategies',
      views: 2450,
      affiliate_clicks: 125,
      conversions: 18,
      adsense_revenue: 85.32,
      affiliate_revenue: 450.75,
      total_revenue: 536.07,
    },
    {
      article_id: '2',
      title: 'DeFi Yield Farming',
      views: 1820,
      affiliate_clicks: 98,
      conversions: 12,
      adsense_revenue: 64.12,
      affiliate_revenue: 320.4,
      total_revenue: 384.52,
    },
  ];

  const programRevenue: ProgramRevenue[] = [
    {
      program_id: 'kraken',
      program_name: 'Kraken',
      commission_rate: 0.25,
      clicks: 180,
      conversions: 28,
      revenue: 580.5,
    },
    {
      program_id: 'binance',
      program_name: 'Binance',
      commission_rate: 0.2,
      clicks: 145,
      conversions: 18,
      revenue: 360.2,
    },
  ];

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  const totals = useMemo(() => {
    return {
      adsense: dailyData.reduce((sum, d) => sum + d.adsense_revenue, 0),
      affiliate: dailyData.reduce((sum, d) => sum + d.affiliate_revenue, 0),
      total: dailyData.reduce((sum, d) => sum + d.total_revenue, 0),
      clicks: dailyData.reduce((sum, d) => sum + d.affiliate_clicks, 0),
      conversions: dailyData.reduce((sum, d) => sum + d.conversions, 0),
    };
  }, []);

  const avgConversionRate = (totals.conversions / totals.clicks) * 100;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">💰 Revenue Analytics</h1>
        <p className="text-gray-600">Track AdSense and affiliate revenue performance</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-8">
        {(['7d', '30d', '90d'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tf === '7d' ? 'Last 7 days' : tf === '30d' ? 'Last 30 days' : 'Last 90 days'}
          </button>
        ))}
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-green-600">€{totals.total.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">
            AdSense: €{totals.adsense.toFixed(2)} • Affiliate: €{totals.affiliate.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Affiliate Performance</p>
          <p className="text-4xl font-bold text-blue-600">{totals.conversions}</p>
          <p className="text-xs text-gray-500 mt-2">
            {totals.clicks} clicks • {avgConversionRate.toFixed(1)}% conversion rate
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-2">Revenue Mix</p>
          <div className="flex items-end gap-2 mt-2">
            <div
              className="bg-green-500 rounded"
              style={{
                width: `${(totals.adsense / totals.total) * 100}%`,
                height: '30px',
              }}
            />
            <div
              className="bg-blue-500 rounded"
              style={{
                width: `${(totals.affiliate / totals.total) * 100}%`,
                height: '30px',
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((totals.adsense / totals.total) * 100).toFixed(0)}% AdSense,{' '}
            {((totals.affiliate / totals.total) * 100).toFixed(0)}% Affiliate
          </p>
        </div>
      </div>

      {/* Top Articles */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">📈 Top Performing Articles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Affiliate Clicks
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  AdSense
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Affiliate
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topArticles.map((article) => (
                <tr key={article.article_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{article.title}</td>
                  <td className="px-6 py-4 text-gray-600">{article.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{article.affiliate_clicks}</td>
                  <td className="px-6 py-4 text-gray-600">{article.conversions}</td>
                  <td className="px-6 py-4 font-medium">€{article.adsense_revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 font-medium">€{article.affiliate_revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    €{article.total_revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Affiliate Programs Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">🔗 Affiliate Program Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Conv. Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {programRevenue.map((program) => (
                <tr key={program.program_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{program.program_name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {(program.commission_rate * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-gray-600">{program.clicks}</td>
                  <td className="px-6 py-4 text-gray-600">{program.conversions}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">€{program.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {((program.conversions / program.clicks) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
