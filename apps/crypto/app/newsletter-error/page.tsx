'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function NewsletterErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown_error';

  const messages: Record<string, string> = {
    invalid_token: 'The confirmation link has expired or is invalid.',
    update_failed: 'Failed to confirm your subscription. Please try again.',
    server_error: 'A server error occurred. Please try again later.',
    unknown_error: 'An unknown error occurred. Please try again.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">✕</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Subscription Error
        </h1>
        <p className="text-gray-600 mb-6">
          {messages[reason] || messages.unknown_error}
        </p>
        <a
          href="/"
          className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function NewsletterErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsletterErrorContent />
    </Suspense>
  );
}
