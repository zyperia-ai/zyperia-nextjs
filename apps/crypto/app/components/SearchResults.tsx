'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import AdvancedSearch from './AdvancedSearch'

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string
  views: number
  published_at: string
  author_email: string
}

interface SearchResultsProps {
  initialQuery?: string
}

export default function SearchResults({ initialQuery = '' }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [filters, setFilters] = useState({
    q: initialQuery,
    sort: 'published_at',
  })

  const limit = 20
  const offset = currentPage * limit

  const handleSearch = async (newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(0)
    performSearch(newFilters, 0)
  }

  const performSearch = async (searchFilters: any, page: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchFilters.q || '',
        ...(searchFilters.tag && { tag: searchFilters.tag }),
        ...(searchFilters.author && { author: searchFilters.author }),
        ...(searchFilters.from && { from: searchFilters.from }),
        ...(searchFilters.to && { to: searchFilters.to }),
        sort: searchFilters.sort || 'published_at',
        limit: limit.toString(),
        offset: (page * limit).toString(),
      })

      const response = await fetch(`/api/articles/search-advanced?${params}`)
      const data = await response.json()
      setResults(data.articles || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      performSearch(filters, 0)
    }
  }, [])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Articles</h1>
        <p className="text-gray-600 mb-6">
          Found {total} article{total !== 1 ? 's' : ''} {total > 0 && `(page ${currentPage + 1} of ${totalPages})`}
        </p>
        <AdvancedSearch onSearch={handleSearch} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <article
              key={result.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <Link href={`/articles/${result.slug}`} className="group">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-2">
                  {result.title}
                </h2>
              </Link>

              <p className="text-gray-600 text-sm mb-4">{result.excerpt}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{result.views.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{new Date(result.published_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{result.author_email}</span>
                </div>

                <Link
                  href={`/articles/${result.slug}`}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  Read →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && total === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No articles found</p>
          <p className="text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && results.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-10 h-10 rounded-lg font-medium ${
                  i === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
