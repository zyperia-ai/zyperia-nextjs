'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
  isDark?: boolean;
}

/**
 * Reading progress bar that shows how far user has scrolled
 * Appears at top of page during reading
 */
export default function ReadingProgress({ isDark = false }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 h-1 z-50 transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-r from-purple-500 to-blue-500'
          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
      }`}
      style={{ width: `${progress}%` }}
    />
  );
}
