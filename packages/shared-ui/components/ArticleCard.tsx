'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ArticleCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  heroImageUrl?: string;
  publishedAt?: string;
  readingTime?: number;
  isDark?: boolean;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  heroImageUrl,
  publishedAt,
  readingTime = 5,
  isDark = false,
}: ArticleCardProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Link href={`/articles/${slug}`}>
      <article
        className={`
          group rounded-lg overflow-hidden transition-all duration-300
          ${
            isDark
              ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-purple-500'
              : 'bg-white hover:shadow-xl border border-gray-200'
          }
          cursor-pointer h-full flex flex-col
        `}
      >
        {/* Hero Image */}
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden">
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className={`
                w-full h-full flex items-center justify-center
                ${isDark ? 'bg-gradient-to-br from-purple-900 to-blue-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'}
              `}
            >
              <span className="text-gray-400 text-4xl">📰</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Meta Info */}
          <div className={`flex items-center gap-2 text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {formattedDate && <span>{formattedDate}</span>}
            {formattedDate && readingTime && <span>•</span>}
            {readingTime && <span>{readingTime} min read</span>}
          </div>

          {/* Title */}
          <h3
            className={`
              text-lg font-semibold mb-2 line-clamp-2 group-hover:text-purple-500 transition-colors
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
          >
            {title}
          </h3>

          {/* Excerpt */}
          <p
            className={`
              text-sm line-clamp-2 flex-grow
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}
          >
            {excerpt}
          </p>

          {/* CTA */}
          <div className="mt-4 pt-4 border-t border-gray-700 group-hover:border-purple-500 transition-colors">
            <span
              className={`
                text-xs font-semibold uppercase tracking-widest
                ${isDark ? 'text-purple-400 group-hover:text-purple-300' : 'text-purple-600 group-hover:text-purple-700'}
              `}
            >
              Read Article →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
