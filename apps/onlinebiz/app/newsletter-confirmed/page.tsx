'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function NewsletterConfirmedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const themes = searchParams.get('themes') || 'subscribed';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Subscription Confirmed!
        </h1>
        <p className="text-gray-600 mb-4">
          You'll now receive updates for:
        </p>
        <p className="text-lg font-semibold text-purple-600 mb-6">
          {themes}
        </p>
        <p className="text-gray-500 mb-6">
          Check {email} for our latest content
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

export default function NewsletterConfirmedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsletterConfirmedContent />
    </Suspense>
  );
}
