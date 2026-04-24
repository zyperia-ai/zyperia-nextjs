/**
 * Calculate estimated reading time for article content
 * Based on average reading speed of 200 words per minute
 */

export function calculateReadingTime(content: string): {
  minutes: number
  seconds: number
  displayText: string
} {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  const seconds = Math.round(((words % wordsPerMinute) / wordsPerMinute) * 60)

  let displayText: string
  if (minutes === 0) {
    displayText = `${seconds}s read`
  } else if (minutes === 1) {
    displayText = '1 min read'
  } else {
    displayText = `${minutes} min read`
  }

  return {
    minutes,
    seconds,
    displayText,
  }
}

/**
 * Estimate words in content (for word count display)
 */
export function countWords(content: string): number {
  return content.trim().split(/\s+/).length
}

/**
 * Extract reading time from article and return with metadata
 */
export function getArticleReadingMetadata(article: {
  content: string
  published_at: string
}) {
  const readingTime = calculateReadingTime(article.content)
  const wordCount = countWords(article.content)
  const publishDate = new Date(article.published_at)

  return {
    readingTime: readingTime.displayText,
    minutes: readingTime.minutes,
    wordCount,
    publishDate: publishDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  }
}
