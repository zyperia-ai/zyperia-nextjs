'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  isDark?: boolean;
}

/**
 * Dynamically generate table of contents from article headings
 * Automatically detects h2 and h3 tags from the DOM
 */
export default function TableOfContents({ isDark = false }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from article content
    const article = document.querySelector('article');
    if (!article) return;

    const headingElements = Array.from(article.querySelectorAll('h2, h3')) as HTMLElement[];
    const extractedHeadings: Heading[] = headingElements
      .map((element, index) => {
        // Generate ID if not present
        if (!element.id) {
          element.id = `heading-${index}`;
        }
        return {
          id: element.id,
          text: element.textContent || '',
          level: parseInt(element.tagName[1]),
        };
      })
      .filter((h) => h.text.trim().length > 0);

    setHeadings(extractedHeadings);

    // Track active heading on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const heading of extractedHeadings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;

        if (element.offsetTop <= scrollPosition) {
          setActiveId(heading.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (headings.length === 0) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`sticky top-20 p-4 rounded-lg ${
        isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <h3 className={`font-bold mb-3 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
        📑 On This Page
      </h3>

      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 12}px` }}>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`text-sm transition-colors hover:underline text-left ${
                activeId === heading.id
                  ? isDark
                    ? 'text-purple-400 font-semibold'
                    : 'text-blue-600 font-semibold'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
