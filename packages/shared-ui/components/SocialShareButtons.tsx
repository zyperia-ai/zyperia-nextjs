'use client';

import { useState } from 'react';

interface SocialShareButtonsProps {
  title: string;
  url: string;
  excerpt?: string;
  isDark?: boolean;
}

/**
 * Social sharing buttons for articles
 * Supports: Twitter, LinkedIn, Facebook, Telegram, WhatsApp, Copy Link
 */
export default function SocialShareButtons({
  title,
  url,
  excerpt,
  isDark = false,
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttons = [
    {
      key: 'copy',
      label: copied ? '✓ Copied' : 'Copy Link',
      action: copyLink,
      icon: '🔗',
    },
    {
      key: 'twitter',
      label: 'Twitter',
      url: shareLinks.twitter,
      icon: '𝕏',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      url: shareLinks.linkedin,
      icon: 'in',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      url: shareLinks.facebook,
      icon: 'f',
    },
    {
      key: 'telegram',
      label: 'Telegram',
      url: shareLinks.telegram,
      icon: '✈️',
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      url: shareLinks.whatsapp,
      icon: '💬',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => {
        const baseClasses = `px-4 py-2 rounded-lg text-sm font-medium transition ${
          isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }`;

        if (btn.action) {
          return (
            <button
              key={btn.key}
              onClick={btn.action}
              className={baseClasses}
              title={btn.label}
            >
              {btn.icon} {btn.label}
            </button>
          );
        }

        return (
          <a
            key={btn.key}
            href={btn.url}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
            title={btn.label}
          >
            {btn.icon} {btn.label}
          </a>
        );
      })}
    </div>
  );
}
