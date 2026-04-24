'use client';

import { useEffect, useState } from 'react';

interface ArticleStatsProps {
  articleId: string;
  isDark?: boolean;
}

interface Stats {
  views: number;
  engagementScore: number;
  estimatedReadTime: number;
  shares: number;
}

/**
 * Display article statistics (views, engagement, etc)
 */
export default function ArticleStats({ articleId, isDark = false }: ArticleStatsProps) {
  const [stats, setStats] = useState<Stats>({
    views: 1250,
    engagementScore: 0.78,
    estimatedReadTime: 8,
    shares: 45,
  });

  useEffect(() => {
    // TODO: On May 1st, fetch real stats from database
    // For now, use mock data
    const mockStats = {
      views: Math.floor(Math.random() * 10000) + 100,
      engagementScore: Math.random() * 0.5 + 0.5,
      estimatedReadTime: Math.floor(Math.random() * 15) + 5,
      shares: Math.floor(Math.random() * 200),
    };
    setStats(mockStats);
  }, [articleId]);

  return (
    <div
      className={`flex flex-wrap gap-6 py-4 px-6 rounded-lg ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">👁️</span>
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Views</p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {stats.views.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xl">⚡</span>
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Engagement</p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {(stats.engagementScore * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xl">⏱️</span>
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Read Time</p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {stats.estimatedReadTime} min
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xl">🔗</span>
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Shares</p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {stats.shares}
          </p>
        </div>
      </div>
    </div>
  );
}
