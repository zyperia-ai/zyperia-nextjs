'use client';

import Link from 'next/link';

interface HeaderProps {
  blogName: string;
  blogIcon: string;
  isDark?: boolean;
}

export default function Header({ blogName, blogIcon, isDark = false }: HeaderProps) {
  return (
    <header
      className={`
        border-b transition-colors sticky top-0 z-50
        ${isDark ? 'border-gray-700 bg-gray-900/95 backdrop-blur' : 'border-gray-200 bg-white/95 backdrop-blur'}
      `}
    >
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`
            text-2xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}
        >
          <span className="text-3xl">{blogIcon}</span>
          <span>{blogName}</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="#"
            className={`
              text-sm font-medium hover:text-purple-500 transition-colors
              ${isDark ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600'}
            `}
          >
            Articles
          </Link>
          <Link
            href="#"
            className={`
              text-sm font-medium hover:text-purple-500 transition-colors
              ${isDark ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600'}
            `}
          >
            Categories
          </Link>
          <Link
            href="#"
            className={`
              text-sm font-medium hover:text-purple-500 transition-colors
              ${isDark ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600'}
            `}
          >
            About
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`
            md:hidden p-2 rounded-lg transition-colors
            ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
          `}
          aria-label="Menu"
        >
          <svg
            className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
