'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ScheduledArticle {
  id: string;
  title: string;
  slug: string;
  scheduled_for: string;
  category: string;
  author_id: string;
  status: string;
}

export default function SchedulerPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [scheduledArticles, setScheduledArticles] = useState<ScheduledArticle[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    fetch(`/api/publishing/schedule?start_date=${startDate}&end_date=${endDate}`)
      .then((res) => res.json())
      .then((data) => setScheduledArticles(data.data || []))
      .catch((err) => console.error('Error:', err));
  }, [currentMonth]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getArticlesForDate = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return scheduledArticles.filter(
      (a) => a.scheduled_for.substring(0, 10) === dateStr
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📅 Publishing Calendar</h1>
        <p className="text-gray-600">Schedule and manage article publication dates</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                )
              }
              className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Today
            </button>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                )
              }
              className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const articlesOnDay = day ? getArticlesForDate(day) : [];
            return (
              <div
                key={idx}
                onClick={() => {
                  if (day) {
                    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                  }
                }}
                className={`p-3 rounded-lg border-2 min-h-28 cursor-pointer transition ${
                  day
                    ? selectedDate?.getDate() === day &&
                      selectedDate?.getMonth() === currentMonth.getMonth()
                      ? 'bg-cyan-50 border-cyan-500'
                      : 'bg-white border-gray-200 hover:border-cyan-300'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                {day && (
                  <>
                    <div className="font-bold text-gray-900 mb-2">{day}</div>
                    <div className="space-y-1">
                      {articlesOnDay.map((article) => (
                        <div
                          key={article.id}
                          className="text-xs bg-cyan-500 text-white p-1 rounded truncate"
                          title={article.title}
                        >
                          {article.title.substring(0, 15)}...
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>

          {getArticlesForDate(selectedDate.getDate()).length > 0 ? (
            <div className="space-y-3">
              {getArticlesForDate(selectedDate.getDate()).map((article) => (
                <div
                  key={article.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{article.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(article.scheduled_for).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No articles scheduled</p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">⏳ Upcoming (Next 7 Days)</h3>

        {scheduledArticles.length > 0 ? (
          <div className="space-y-3">
            {scheduledArticles.slice(0, 5).map((article) => (
              <div
                key={article.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{article.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(article.scheduled_for).toLocaleString('en-US')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm font-medium">
                    Publish Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No articles scheduled</p>
        )}
      </div>
    </div>
  );
}
