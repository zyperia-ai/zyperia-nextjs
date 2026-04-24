'use client';

import { useState } from 'react';

interface ArticleFeedbackProps {
  articleId: string;
  articleTitle: string;
  isDark?: boolean;
}

type FeedbackType = 'helpful' | 'not_helpful' | null;

/**
 * Simple feedback system (helpful/not helpful)
 * Helps improve content based on reader feedback
 */
export default function ArticleFeedback({
  articleId,
  articleTitle,
  isDark = false,
}: ArticleFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = async (type: FeedbackType) => {
    setFeedback(type);

    // TODO: On May 1st, POST to /api/feedback endpoint
    console.log('Feedback:', {
      articleId,
      type,
      timestamp: new Date().toISOString(),
    });

    // Send feedback to analytics
    void fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'article_feedback',
        appId: 'crypto',
        data: {
          article_id: articleId,
          feedback: type,
        },
      }),
    }).catch(() => {
      // Silently fail
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback(null);
    }, 3000);
  };

  return (
    <div
      className={`p-6 rounded-lg border-2 ${
        isDark
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="max-w-sm">
        <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Was this article helpful?
        </h3>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Your feedback helps us improve our content
        </p>

        {!submitted ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleFeedback('helpful')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                feedback === 'helpful'
                  ? isDark
                    ? 'bg-green-600 text-white'
                    : 'bg-green-500 text-white'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
              }`}
            >
              👍 Yes
            </button>
            <button
              onClick={() => handleFeedback('not_helpful')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                feedback === 'not_helpful'
                  ? isDark
                    ? 'bg-red-600 text-white'
                    : 'bg-red-500 text-white'
                  : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
              }`}
            >
              👎 No
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-green-600 text-sm font-medium">
              ✓ Thank you for your feedback!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
