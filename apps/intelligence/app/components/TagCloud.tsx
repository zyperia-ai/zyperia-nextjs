'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Tag {
  id: string
  tag: string
  count: number
}

interface TagCloudProps {
  onTagSelect?: (tag: string) => void
  limit?: number
}

export default function TagCloud({
  onTagSelect,
  limit = 50,
}: TagCloudProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/articles/tags')
        const data = await response.json()

        // Group tags and count occurrences
        const tagMap = new Map<string, number>()
        data.tags?.forEach((tagRecord: any) => {
          const current = tagMap.get(tagRecord.tag) || 0
          tagMap.set(tagRecord.tag, current + 1)
        })

        // Convert to array and sort by count
        const tagArray: Tag[] = Array.from(tagMap).map(([tag, count]) => ({
          id: tag,
          tag,
          count,
        }))

        tagArray.sort((a, b) => b.count - a.count)
        setTags(tagArray.slice(0, limit))
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [limit])

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Loading tags...</div>
  }

  if (tags.length === 0) {
    return null
  }

  // Calculate size scale for tags (bigger = more common)
  const maxCount = Math.max(...tags.map((t) => t.count))
  const minCount = Math.min(...tags.map((t) => t.count))
  const countRange = maxCount - minCount || 1

  const getTagSize = (count: number) => {
    const normalized = (count - minCount) / countRange
    if (normalized > 0.7) return 'text-lg font-bold'
    if (normalized > 0.4) return 'text-base font-semibold'
    return 'text-sm'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Topics</h3>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagSelect?.(tag.tag)}
            className={`px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-200 text-purple-700 hover:text-purple-900 transition-colors ${getTagSize(
              tag.count
            )}`}
            title={`${tag.count} article${tag.count !== 1 ? 's' : ''}`}
          >
            #{tag.tag}
          </button>
        ))}
      </div>
    </div>
  )
}
