'use client';

interface SocialProofProps {
  subscribers?: number;
  totalReaders?: number;
  articlesPublished?: number;
  isDark?: boolean;
}

/**
 * Display social proof metrics to build trust
 */
export default function SocialProof({
  subscribers = 10000,
  totalReaders = 50000,
  articlesPublished = 500,
  isDark = false,
}: SocialProofProps) {
  const metrics = [
    {
      label: 'Active Subscribers',
      value: subscribers.toLocaleString(),
      icon: '👥',
    },
    {
      label: 'Monthly Readers',
      value: totalReaders.toLocaleString(),
      icon: '📖',
    },
    {
      label: 'Articles Published',
      value: articlesPublished.toLocaleString(),
      icon: '📝',
    },
  ];

  return (
    <div className={`grid grid-cols-3 gap-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg p-6`}>
      {metrics.map((metric) => (
        <div key={metric.label} className="text-center">
          <div className="text-3xl mb-2">{metric.icon}</div>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {metric.value}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  );
}
