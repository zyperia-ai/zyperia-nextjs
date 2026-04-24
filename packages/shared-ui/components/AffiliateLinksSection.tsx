'use client';

import { useEffect, useState } from 'react';

interface AffiliateLink {
  id: string;
  program_id: string;
  program_name: string;
  commission_rate: number;
  url: string;
  clicks?: number;
  conversions?: number;
}

interface AffiliateLinksSectionProps {
  articleId: string;
  category: 'crypto' | 'automation' | 'earning';
  isDark?: boolean;
  title?: string;
  showStats?: boolean;
}

/**
 * Display recommended affiliate links within articles
 * Shows program logos, commission rates, and tracked click links
 */
export default function AffiliateLinksSection({
  articleId,
  category,
  isDark = false,
  title = 'Recommended Tools & Platforms',
  showStats = true,
}: AffiliateLinksSectionProps) {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch affiliate links for this article
    fetch(`/api/affiliate/links?article_id=${articleId}&category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLinks(data.data || []);
        }
      })
      .catch((err) => console.error('Error loading affiliate links:', err))
      .finally(() => setIsLoading(false));
  }, [articleId, category]);

  const handleLinkClick = (linkId: string, programId: string) => {
    // Track the click
    fetch('/api/affiliate/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        link_id: linkId,
        article_id: articleId,
        program_id: programId,
        converted: false,
      }),
    }).catch((err) => console.error('Error tracking click:', err));
  };

  if (isLoading || links.length === 0) {
    return null;
  }

  const bgColor = isDark ? 'bg-gray-800/50' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const badgeBg = isDark ? 'bg-blue-900/30' : 'bg-blue-100';
  const badgeText = isDark ? 'text-blue-300' : 'text-blue-700';

  return (
    <section
      className={`my-12 p-6 rounded-lg border-2 ${bgColor} ${borderColor}`}
    >
      <div className="flex items-center gap-2 mb-6">
        <span className="text-3xl">🔗</span>
        <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
      </div>

      <p
        className={`text-sm mb-6 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        We've tested these platforms and recommend them for the use cases mentioned in
        this article. Using our affiliate links supports our work at no extra cost to you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick(link.id, link.program_id)}
            className={`p-4 rounded-lg border-2 transition ${
              isDark
                ? 'bg-gray-700/50 border-gray-600 hover:border-blue-500 hover:bg-gray-700'
                : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4
                  className={`font-bold text-lg ${textColor}`}
                >
                  {link.program_name}
                </h4>
                {link.commission_rate > 0 && (
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mt-1 ${badgeBg} ${badgeText}`}
                  >
                    {(link.commission_rate * 100).toFixed(0)}% commission
                  </span>
                )}
              </div>
              <span className="text-2xl">→</span>
            </div>

            {showStats && link.clicks !== undefined && (
              <p
                className={`text-xs mt-3 ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                {link.clicks} clicks {link.conversions ? `• ${link.conversions} conversions` : ''}
              </p>
            )}
          </a>
        ))}
      </div>

      <p
        className={`text-xs mt-6 pt-6 border-t ${borderColor} ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}
      >
        ⓘ We earn a small commission when you use these links. This supports our ability
        to publish free, high-quality content.{' '}
        <a
          href="/affiliate-disclosure"
          className={`underline ${isDark ? 'hover:text-gray-400' : 'hover:text-gray-700'}`}
        >
          Full disclosure
        </a>
      </p>
    </section>
  );
}
