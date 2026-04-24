'use client'

import { Clock } from 'lucide-react'
import { calculateReadingTime, countWords } from '@/app/lib/readingTime'

interface ReadingTimeProps {
  content: string
  publishedAt: string
  variant?: 'compact' | 'detailed'
}

export default function ReadingTime({
  content,
  publishedAt,
  variant = 'compact',
}: ReadingTimeProps) {
  const readingTime = calculateReadingTime(content)
  const wordCount = countWords(content)
  const publishDate = new Date(publishedAt)
  const dateStr = publishDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {readingTime.displayText}
        </span>
        <span>•</span>
        <span>{dateStr}</span>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm font-medium text-gray-600">Reading Time</div>
          <div className="text-lg font-semibold text-purple-600 mt-1">
            {readingTime.minutes} min
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">Word Count</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {wordCount.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">Published</div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {dateStr}
          </div>
        </div>
      </div>
    </div>
  )
}
