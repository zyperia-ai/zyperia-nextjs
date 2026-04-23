'use client';

import Link from 'next/link';
import { useState } from 'react';

interface EnhancedHeaderProps {
  appName: string;
  appIcon: string;
  theme: 'crypto' | 'intelligence' | 'onlinebiz';
  isDark?: boolean;
}

const themeColors = {
  crypto: {
    accent: 'text-amber-500 hover:text-amber-400',
    accentBg: 'bg-amber-500/10 border-amber-500/20',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
    light: 'text-amber-600',
  },
  intelligence: {
    accent: 'text-blue-500 hover:text-blue-400',
    accentBg: 'bg-blue-500/10 border-blue-500/20',
    button: 'bg-blue-500 hover:bg-blue-600 text-white',
    light: 'text-blue-600',
  },
  onlinebiz: {
    accent: 'text-emerald-500 hover:text-emerald-400',
    accentBg: 'bg-emerald-500/10 border-emerald-500/20',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    light: 'text-emerald-600',
  },
};

export default function EnhancedHeader({
  appName,
  appIcon,
  theme,
  isDark = true,
}: EnhancedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const colors = themeColors[theme];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Categories', href: '/categories' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`
        sticky top-0 z-50 border-b transition-all duration-300
        ${
          isDark
            ? 'bg-slate-900/80 border-slate-800 backdrop-blur-xl'
            : 'bg-white/80 border-gray-200 backdrop-blur-xl'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className={`text-3xl group-hover:scale-110 transition-transform ${colors.accentBg} p-2 rounded-lg border`}>
              {appIcon}
            </div>
            <div>
              <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {appName}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Expert Insights
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isDark
                      ? `text-gray-300 hover:${colors.accent} hover:bg-gray-800/50`
                      : `text-gray-700 hover:${colors.light} hover:bg-gray-100`
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Newsletter CTA */}
            <Link
              href="#newsletter"
              className={`
                hidden sm:block px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${colors.button} shadow-lg hover:shadow-xl
              `}
            >
              Subscribe
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`
                md:hidden p-2 rounded-lg transition-colors
                ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}
              `}
              aria-label="Menu"
            >
              <svg
                className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-800 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  block px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isDark
                      ? `text-gray-300 hover:${colors.accent} hover:bg-slate-800`
                      : `text-gray-700 hover:${colors.light} hover:bg-gray-100`
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#newsletter"
              className={`
                block px-4 py-2 rounded-lg font-medium text-sm transition-all text-center
                ${colors.button}
              `}
              onClick={() => setMobileMenuOpen(false)}
            >
              Subscribe to Newsletter
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
