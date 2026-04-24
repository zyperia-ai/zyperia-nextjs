'use client'

import { useEffect, useState } from 'react'
import { Calendar, Clock, Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

interface ScheduledArticle {
  id: string
  title: string
  scheduledDate: string
  status: 'scheduled' | 'published' | 'draft'
  category: string
  estimatedReadTime: number
}

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 24))
  const [articles, setArticles] = useState<ScheduledArticle[]>([
    {
      id: '1',
      title: 'Bitcoin Market Analysis Q2',
      scheduledDate: '2026-04-25',
      status: 'scheduled',
      category: 'Market Analysis',
      estimatedReadTime: 8,
    },
    {
      id: '2',
      title: 'DeFi Protocol Security Deep Dive',
      scheduledDate: '2026-04-26',
      status: 'draft',
      category: 'Technical',
      estimatedReadTime: 12,
    },
    {
      id: '3',
      title: 'Ethereum Roadmap Updates',
      scheduledDate: '2026-04-28',
      status: 'scheduled',
      category: 'News',
      estimatedReadTime: 5,
    },
    {
      id: '4',
      title: 'Regulatory Changes May 2026',
      scheduledDate: '2026-04-30',
      status: 'draft',
      category: 'Regulation',
      estimatedReadTime: 10,
    },
  ])
  const [selectedArticle, setSelectedArticle] = useState<ScheduledArticle | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getArticlesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return articles.filter(a => a.scheduledDate === dateStr)
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handlePublish = (article: ScheduledArticle) => {
    setArticles(articles.map(a =>
      a.id === article.id ? { ...a, status: 'published' as const } : a
    ))
  }

  const handleDelete = (article: ScheduledArticle) => {
    setArticles(articles.filter(a => a.id !== article.id))
    setSelectedArticle(null)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const calendarDays = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
          <p className="text-gray-600 mt-1">Plan and schedule your articles</p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          Schedule Article
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Month Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{monthName}</h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 p-px">
            {calendarDays.map((day, idx) => {
              const dayArticles = day ? getArticlesForDate(day) : []
              const isToday = day === 24 && currentDate.getMonth() === 3 && currentDate.getFullYear() === 2026

              return (
                <div
                  key={idx}
                  className={`min-h-24 p-2 ${
                    day
                      ? `bg-white ${isToday ? 'ring-2 ring-inset ring-blue-500' : ''}`
                      : 'bg-gray-100'
                  }`}
                >
                  {day && (
                    <>
                      <p className={`text-sm font-semibold mb-1 ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {day}
                      </p>
                      <div className="space-y-1">
                        {dayArticles.map(article => (
                          <button
                            key={article.id}
                            onClick={() => setSelectedArticle(article)}
                            className={`block w-full text-left text-xs p-1 rounded truncate font-medium transition-colors ${
                              article.status === 'published'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : article.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            {article.title.substring(0, 15)}...
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 p-4 bg-gray-50 border-t border-gray-200 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-gray-700">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-gray-700">Draft</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-gray-700">Published</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Article Details */}
          {selectedArticle && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-900">{selectedArticle.title}</h3>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Status</p>
                  <p className={`text-sm font-semibold mt-1 ${
                    selectedArticle.status === 'published'
                      ? 'text-green-600'
                      : selectedArticle.status === 'scheduled'
                        ? 'text-blue-600'
                        : 'text-yellow-600'
                  }`}>
                    {selectedArticle.status.charAt(0).toUpperCase() + selectedArticle.status.slice(1)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Scheduled Date</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {new Date(selectedArticle.scheduledDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Category</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedArticle.category}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase">Reading Time</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedArticle.estimatedReadTime} min read
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {selectedArticle.status !== 'published' && (
                    <button
                      onClick={() => handlePublish(selectedArticle)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors"
                    >
                      Publish Now
                    </button>
                  )}
                  <button
                    onClick={() => alert('Edit functionality coming soon')}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(selectedArticle)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors border border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Upcoming Articles */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900">Upcoming (Next 7 days)</h3>
            </div>

            <div className="divide-y">
              {articles
                .filter(a => {
                  const articleDate = new Date(a.scheduledDate)
                  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                  return articleDate >= new Date() && articleDate <= sevenDaysFromNow
                })
                .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                .map(article => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedArticle?.id === article.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900 truncate">{article.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(article.scheduledDate).toLocaleDateString()}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
