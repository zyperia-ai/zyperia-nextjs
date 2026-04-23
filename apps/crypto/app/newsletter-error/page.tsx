'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function NewsletterErrorPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown';

  const errorMessages: Record<string, { title: string; description: string }> = {
    invalid_token: {
      title: 'Confirmation Link Expired',
      description:
        'The confirmation link you clicked is no longer valid. This usually happens if you wait too long (>24 hours) or the link was used already.',
    },
    update_failed: {
      title: 'Something Went Wrong',
      description:
        'We encountered an error confirming your subscription. Please try subscribing again, or contact support if the problem persists.',
    },
    server_error: {
      title: 'Server Error',
      description:
        'Our servers are having trouble right now. Please try again in a few moments.',
    },
    unknown: {
      title: 'Confirmation Failed',
      description:
        'We couldn\'t confirm your subscription. Please try subscribing again.',
    },
  };

  const error = errorMessages[reason] || errorMessages.unknown;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{error.title}</h1>

        <p className="text-gray-600 mb-8">{error.description}</p>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => window.location.href = '/'}
            className="block w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all transform hover:scale-105"
          >
            Back to Home
          </button>

          <Link
            href="/#newsletter-signup"
            className="block w-full px-6 py-3 border-2 border-red-600 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-all"
          >
            Try Again
          </Link>
        </div>

        <p className="text-sm text-gray-600">
          Need help?{' '}
          <a href="mailto:support@zyperia.ai" className="text-red-600 font-bold hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
