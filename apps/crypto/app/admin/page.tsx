'use client';

import { useState } from 'react';

interface AdminStats {
  articlesPublished: number;
  articlesInDraft: number;
  totalViews: number;
  totalEngagement: number;
  subscribersThisMonth: number;
  affiliateClicksThisMonth: number;
}

interface RecentArticle {
  id: string;
  title: string;
  status: 'draft' | 'published';
  views: number;
  publishedAt: string;
  engagement: number;
}

/**
 * Admin Dashboard for managing articles, analytics, and subscribers
 * TODO: Add authentication gate before May 1st
 */
export default function AdminDashboard() {
  // Mock data - will be replaced with real Supabase queries on May 1st
  const [stats] = useState<AdminStats>({
    articlesPublished: 6,
    articlesInDraft: 2,
    totalViews: 8500,
    totalEngagement: 0.78,
    subscribersThisMonth: 234,
    affiliateClicksThisMonth: 145,
  });

  const [recentArticles] = useState<RecentArticle[]>([
    {
      id: '1',
      title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
      status: 'published',
      views: 1250,
      publishedAt: '2024-04-22',
      engagement: 0.75,
    },
    {
      id: '2',
      title: 'Ethereum Smart Contracts Deep Dive',
      status: 'published',
      views: 890,
      publishedAt: '2024-04-21',
      engagement: 0.82,
    },
    {
      id: '3',
      title: 'DeFi Risks Explained',
      status: 'draft',
      views: 0,
      publishedAt: '2024-04-20',
      engagement: 0,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage articles, analytics, and subscribers</p>
          <div className="mt-4 text-yellow-500 text-sm bg-yellow-500/10 border border-yellow-500/20 p-3 rounded">
            ⚠️ Note: This is a mock dashboard. Real features will be connected on May 1st.
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            label="Articles Published"
            value={stats.articlesPublished}
            subtext={`${stats.articlesInDraft} in draft`}
          />
          <StatCard
            label="Total Views"
            value={stats.totalViews.toLocaleString()}
            subtext="This month"
          />
          <StatCard
            label="Avg Engagement"
            value={(stats.totalEngagement * 100).toFixed(0) + '%'}
            subtext="Average score"
          />
          <StatCard
            label="New Subscribers"
            value={stats.subscribersThisMonth}
            subtext="This month"
          />
          <StatCard
            label="Affiliate Clicks"
            value={stats.affiliateClicksThisMonth}
            subtext="This month"
          />
          <StatCard
            label="Estimated Revenue"
            value="$" + (stats.affiliateClicksThisMonth * 2).toLocaleString()}
            subtext="Based on clicks"
          />
        </div>

        {/* Recent Articles */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Views</th>
                  <th className="text-right py-3 px-4">Engagement</th>
                  <th className="text-left py-3 px-4">Published</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-3 px-4 font-medium">{article.title}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          article.status === 'published'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{article.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      {(article.engagement * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-400 hover:text-blue-300 text-xs mr-2">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition">
            ✎ Create New Article
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
            📊 View Analytics
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition">
            👥 Manage Subscribers
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition">
            💰 Revenue Report
          </button>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtext: string;
}

function StatCard({ label, value, subtext }: StatCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-gray-500 text-xs">{subtext}</p>
    </div>
  );
}
