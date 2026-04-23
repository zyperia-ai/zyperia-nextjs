'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  isDark?: boolean;
  beehiivFormUrl?: string;
}

export default function NewsletterSignup({ isDark = false, beehiivFormUrl }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Placeholder: would integrate with Beehiiv API or form
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section
      className={`
        py-12 px-4 rounded-lg
        ${
          isDark
            ? 'bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700'
            : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'
        }
      `}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Title */}
        <h2
          className={`
            text-3xl font-bold mb-2
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}
        >
          Stay Updated
        </h2>

        {/* Description */}
        <p
          className={`
            text-lg mb-6
            ${isDark ? 'text-gray-300' : 'text-gray-600'}
          `}
        >
          Get the latest articles delivered to your inbox every week.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className={`
              flex-1 px-4 py-3 rounded-lg font-medium
              border border-gray-300 outline-none transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isDark
                  ? 'bg-gray-800 text-white placeholder-gray-500 focus:border-purple-400'
                  : 'bg-white text-gray-900 placeholder-gray-500 focus:border-purple-500'
              }
            `}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`
              px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }
            `}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {/* Status Messages */}
        {status === 'success' && (
          <p className="text-green-600 text-sm mt-3">✓ Check your email to confirm!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-sm mt-3">✗ Something went wrong. Try again.</p>
        )}

        {/* Footer Note */}
        <p
          className={`
            text-xs mt-4
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `}
        >
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
