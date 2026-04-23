'use client';

import Link from 'next/link';

interface FooterProps {
  blogName: string;
  isDark?: boolean;
  affiliateDisclosure?: string;
}

export default function Footer({ blogName, isDark = false, affiliateDisclosure }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'About', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <footer
      className={`
        border-t transition-colors
        ${isDark ? 'border-gray-700 bg-gray-900 text-gray-300' : 'border-gray-200 bg-white text-gray-600'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {blogName}
            </h3>
            <p className="text-sm">Powered by ZYPERIA</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Site
            </h4>
            <ul className="space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`hover:text-purple-500 transition-colors ${isDark ? 'hover:text-purple-400' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className={`hover:text-purple-500 transition-colors ${isDark ? 'hover:text-purple-400' : ''}`}
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={`hover:text-purple-500 transition-colors ${isDark ? 'hover:text-purple-400' : ''}`}
                >
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className={`hover:text-purple-500 transition-colors ${isDark ? 'hover:text-purple-400' : ''}`}
                >
                  GDPR & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Follow
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className={`hover:text-purple-500 transition-colors ${isDark ? 'hover:text-purple-400' : ''}`}>
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className={`hover:text-purple-500 transition-colors ${isDark ? 'hover:text-purple-400' : ''}`}>
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className={`hover:text-purple-500 transition-colors ${isDark ? 'hover:text-purple-400' : ''}`}>
                  Email
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`border-t pt-8 mb-8 text-xs ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className="mb-4">
            <strong>⚠️ Disclaimer:</strong> This website is for educational purposes only. We are not financial advisors. Always do your own research and consult with professionals before making decisions.
          </p>
          {affiliateDisclosure && <p className="text-gray-500">{affiliateDisclosure}</p>}
        </div>

        {/* Copyright */}
        <div className="border-t pt-8 text-center text-xs">
          <p>
            &copy; {currentYear} ZYPERIA. All rights reserved. | Made with ❤️ by the ZYPERIA Team
          </p>
          <p className="mt-2 text-gray-500">
            We respect your privacy. <Link href="#" className="hover:text-purple-500">Learn more</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
