'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NewsletterConfirmedPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const themes = searchParams.get('themes') || 'your newsletters';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <span className="text-4xl">✓</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">You're In! 🎉</h1>

        <p className="text-gray-600 mb-6">
          Confirmation successful! A welcome email is on the way to:
        </p>

        <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg mb-6">
          {email}
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
          <p className="text-sm text-blue-900">
            <strong>You're subscribed to:</strong>
            <br />
            {themes}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-8">
          Check your inbox (and spam folder, just in case!) for insights and exclusive content.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105"
          >
            Explore Blog
          </Link>

          <Link
            href="/about"
            className="block w-full px-6 py-3 border-2 border-green-600 text-green-600 font-bold rounded-lg hover:bg-green-50 transition-all"
          >
            Learn More
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          You can unsubscribe anytime from any email we send you.
        </p>
      </div>
    </div>
  );
}
