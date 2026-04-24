'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface AdvancedSearchProps {
  onSearch?: (filters: SearchFilters) => void
}

interface SearchFilters {
  q: string
  tag?: string
  author?: string
  from?: string
  to?: string
  sort: string
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    sort: 'published_at',
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(filters)
  }

  const handleChange = (
    field: keyof SearchFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }))
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={filters.q}
            onChange={(e) => handleChange('q', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
        </button>

        {/* Filters (collapsible) */}
        {showFilters && (
          <div className="space-y-3 border-t pt-4">
            {/* Tag filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag
              </label>
              <input
                type="text"
                placeholder="e.g., marketing"
                value={filters.tag || ''}
                onChange={(e) => handleChange('tag', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Author filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Email
              </label>
              <input
                type="email"
                placeholder="author@example.com"
                value={filters.author || ''}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={filters.from || ''}
                  onChange={(e) => handleChange('from', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={filters.to || ''}
                  onChange={(e) => handleChange('to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="published_at">Newest First</option>
                <option value="views">Most Viewed</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        )}

        {/* Search button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Search
        </button>
      </form>
    </div>
  )
}
