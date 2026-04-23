'use client';

import Link from 'next/link';

interface EnhancedFooterProps {
  appName: string;
  appIcon: string;
  theme: 'crypto' | 'intelligence' | 'onlinebiz';
  isDark?: boolean;
}

const themeColors = {
  crypto: { light: 'text-amber-600', accent: 'hover:text-amber-500' },
  intelligence: { light: 'text-blue-600', accent: 'hover:text-blue-500' },
  onlinebiz: { light: 'text-emerald-600', accent: 'hover:text-emerald-500' },
};

export default function EnhancedFooter({
  appName,
  appIcon,
  theme,
  isDark = true,
}: EnhancedFooterProps) {
  const currentYear = new Date().getFullYear();
  const colors = themeColors[theme];

  const sections = {
    product: [
      { label: 'Blog', href: '/blog' },
      { label: 'Categories', href: '/categories' },
      { label: 'Newsletter', href: '#newsletter' },
      { label: 'RSS Feed', href: '/feed.xml' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Advertise', href: '/advertise' },
      { label: 'Partners', href: '/partners' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'GDPR & Data', href: '/gdpr' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
    ],
    social: [
      { label: 'Twitter', href: '#', icon: '𝕏' },
      { label: 'LinkedIn', href: '#', icon: 'in' },
      { label: 'YouTube', href: '#', icon: '▶️' },
      { label: 'Email', href: 'mailto:contact@zyperia.ai', icon: '✉️' },
    ],
  };

  return (
    <footer
      className={`
        transition-all border-t
        ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-50 border-gray-200'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{appIcon}</span>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {appName}
              </h3>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Expert insights, analysis & guides. Updated daily.
            </p>
            <div className="flex gap-2 mt-4">
              {sections.social.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  title={link.label}
                  className={`
                    w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold
                    transition-all duration-200
                    ${
                      isDark
                        ? `bg-slate-800 ${colors.accent} text-gray-300`
                        : `bg-gray-200 ${colors.accent} text-gray-700`
                    }
                  `}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className={`font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Product
            </h4>
            <ul className="space-y-3">
              {sections.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`
                      text-sm transition-colors
                      ${
                        isDark
                          ? `text-gray-400 ${colors.accent}`
                          : `text-gray-600 ${colors.accent}`
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Company
            </h4>
            <ul className="space-y-3">
              {sections.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`
                      text-sm transition-colors
                      ${
                        isDark
                          ? `text-gray-400 ${colors.accent}`
                          : `text-gray-600 ${colors.accent}`
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Legal
            </h4>
            <ul className="space-y-3">
              {sections.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`
                      text-sm transition-colors
                      ${
                        isDark
                          ? `text-gray-400 ${colors.accent}`
                          : `text-gray-600 ${colors.accent}`
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`
            border-t pt-8
            ${isDark ? 'border-slate-800' : 'border-gray-200'}
          `}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © {currentYear} ZYPERIA. All rights reserved. Powered by AI.
            </p>
            <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              ⚡ Built with Next.js • Hosted on Vercel • Data by Supabase
            </div>
          </div>

          {/* Affiliate & Disclaimer */}
          <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <strong>Disclosure:</strong> We may earn affiliate commissions from links on this site. This helps us maintain
              free, quality content. We only recommend products and services we genuinely believe in. See our{' '}
              <Link href="/affiliate-disclosure" className={colors.light}>
                full disclosure
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
