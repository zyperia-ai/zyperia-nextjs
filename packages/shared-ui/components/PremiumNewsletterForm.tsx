'use client';

import { useState, FormEvent } from 'react';

interface PremiumNewsletterFormProps {
  appName: string;
  appTheme: 'crypto' | 'intelligence' | 'onlinebiz';
  isDark?: boolean;
  variant?: 'inline' | 'card' | 'full';
}

const themeConfig = {
  crypto: {
    accentColor: 'from-amber-500 to-orange-500',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
    placeholderBg: 'placeholder-amber-200/50',
    focusRing: 'focus:ring-amber-500 focus:border-amber-500',
  },
  intelligence: {
    accentColor: 'from-blue-500 to-cyan-500',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
    placeholderBg: 'placeholder-blue-200/50',
    focusRing: 'focus:ring-blue-500 focus:border-blue-500',
  },
  onlinebiz: {
    accentColor: 'from-emerald-500 to-teal-500',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
    placeholderBg: 'placeholder-emerald-200/50',
    focusRing: 'focus:ring-emerald-500 focus:border-emerald-500',
  },
};

export default function PremiumNewsletterForm({
  appName,
  appTheme,
  isDark = true,
  variant = 'card',
}: PremiumNewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const config = themeConfig[appTheme];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, app: appTheme }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Check your email to confirm!');
        setEmail('');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
          className={`
            flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white
            transition-all duration-200 ${config.placeholderBg} ${config.focusRing}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`
            px-6 py-2 font-medium rounded-lg text-white
            ${config.buttonColor} transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
          `}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    );
  }

  if (variant === 'full') {
    return (
      <section id="newsletter" className={`py-16 lg:py-20 ${isDark ? 'bg-slate-900' : 'bg-gray-100'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Gradient Text */}
          <h2 className={`
            text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r ${config.accentColor}
            bg-clip-text text-transparent
          `}>
            Subscribe to {appName} Newsletter
          </h2>

          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Get expert insights, analysis, and guides delivered to your inbox. New content every week.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading' || status === 'success'}
                className={`
                  flex-1 px-4 py-3 rounded-lg
                  ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}
                  border ${isDark ? 'border-slate-700' : 'border-gray-300'}
                  transition-all duration-200 ${config.focusRing}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`
                  px-8 py-3 font-medium rounded-lg text-white
                  ${config.buttonColor} transition-all duration-200 shadow-lg hover:shadow-xl
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {status === 'loading' ? '...' : status === 'success' ? '✓ Subscribed' : 'Subscribe'}
              </button>
            </div>
          </form>

          {/* Status Message */}
          {message && (
            <p
              className={`text-sm ${
                status === 'success'
                  ? 'text-emerald-500'
                  : status === 'error'
                    ? 'text-red-500'
                    : 'text-gray-400'
              }`}
            >
              {message}
            </p>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
            {[
              { icon: '📧', label: 'Weekly Digest' },
              { icon: '🎯', label: 'Curated Content' },
              { icon: '🔓', label: 'Early Access' },
            ].map((benefit) => (
              <div key={benefit.label} className="text-center">
                <div className="text-3xl mb-2">{benefit.icon}</div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {benefit.label}
                </p>
              </div>
            ))}
          </div>

          {/* Privacy Note */}
          <p className={`text-xs mt-8 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            We respect your privacy. Unsubscribe anytime. See our{' '}
            <a href="/privacy" className="underline hover:no-underline">
              privacy policy
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  // Default: Card variant
  return (
    <div
      className={`
        rounded-xl p-6 sm:p-8 backdrop-blur-sm border
        ${
          isDark
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50'
            : 'bg-gradient-to-br from-gray-100/50 to-gray-50/50 border-gray-200'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className={`text-lg font-bold mb-1 bg-gradient-to-r ${config.accentColor}
            bg-clip-text text-transparent`}
          >
            Stay Updated
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Subscribe for weekly insights
          </p>
        </div>
        <div className="text-2xl">📬</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading' || status === 'success'}
          className={`
            w-full px-4 py-2 rounded-lg text-sm
            ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-gray-900'}
            border ${isDark ? 'border-slate-600' : 'border-gray-300'}
            transition-all duration-200 ${config.focusRing}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`
            w-full py-2 font-medium rounded-lg text-white text-sm
            ${config.buttonColor} transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? '✓ Confirmed!' : 'Subscribe'}
        </button>
      </form>

      {message && (
        <p
          className={`text-xs mt-2 ${
            status === 'success' ? 'text-emerald-500' : status === 'error' ? 'text-red-500' : ''
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
