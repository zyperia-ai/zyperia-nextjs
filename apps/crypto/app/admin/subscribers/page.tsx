'use client';

import { useState, useEffect } from 'react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  subscribed_at?: string;
  confirmed_at?: string;
  crypto: boolean;
  intelligence: boolean;
  onlinebiz: boolean;
  email_opens?: number;
  email_clicks?: number;
  last_engagement?: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'unsubscribed'>(
    'confirmed'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  useEffect(() => {
    // TODO: On May 1st, fetch from /api/subscribers
    // For now, mock data
    const mockSubscribers: Subscriber[] = [
      {
        id: '1',
        email: 'alice@example.com',
        name: 'Alice',
        status: 'confirmed',
        subscribed_at: '2026-04-20',
        confirmed_at: '2026-04-21',
        crypto: true,
        intelligence: false,
        onlinebiz: false,
        email_opens: 12,
        email_clicks: 3,
        last_engagement: '2026-04-24',
      },
      {
        id: '2',
        email: 'bob@example.com',
        name: 'Bob',
        status: 'confirmed',
        subscribed_at: '2026-04-18',
        confirmed_at: '2026-04-19',
        crypto: true,
        intelligence: true,
        onlinebiz: false,
        email_opens: 8,
        email_clicks: 2,
        last_engagement: '2026-04-23',
      },
      {
        id: '3',
        email: 'charlie@example.com',
        status: 'pending',
        subscribed_at: '2026-04-24',
        crypto: true,
        intelligence: false,
        onlinebiz: false,
      },
    ];

    setSubscribers(mockSubscribers);
    setIsLoading(false);
  }, []);

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesFilter = filter === 'all' || sub.status === filter;
    const matchesSearch =
      searchQuery === '' ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: subscribers.length,
    confirmed: subscribers.filter((s) => s.status === 'confirmed').length,
    pending: subscribers.filter((s) => s.status === 'pending').length,
    unsubscribed: subscribers.filter((s) => s.status === 'unsubscribed').length,
    crypto: subscribers.filter((s) => s.crypto).length,
    intelligence: subscribers.filter((s) => s.intelligence).length,
    onlinebiz: subscribers.filter((s) => s.onlinebiz).length,
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 Subscriber Management</h1>
        <p className="text-gray-600">Manage your email list and subscriber engagement</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Subscribers</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Unsubscribed</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.unsubscribed}</p>
        </div>
      </div>

      {/* Interest Breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Crypto Subscribers</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">{stats.crypto}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Intelligence Subscribers</p>
          <p className="text-2xl font-bold text-cyan-600 mt-2">{stats.intelligence}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">OnlineBiz Subscribers</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{stats.onlinebiz}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            {(['all', 'confirmed', 'pending', 'unsubscribed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                <input
                  type="checkbox"
                  checked={
                    selectedSubscribers.length === filteredSubscribers.length &&
                    filteredSubscribers.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSubscribers(filteredSubscribers.map((s) => s.id));
                    } else {
                      setSelectedSubscribers([]);
                    }
                  }}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Interests
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.includes(subscriber.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubscribers([...selectedSubscribers, subscriber.id]);
                      } else {
                        setSelectedSubscribers(
                          selectedSubscribers.filter((id) => id !== subscriber.id)
                        );
                      }
                    }}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{subscriber.email}</p>
                    {subscriber.name && (
                      <p className="text-sm text-gray-500">{subscriber.name}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      subscriber.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : subscriber.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {subscriber.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {subscriber.crypto && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        Crypto
                      </span>
                    )}
                    {subscriber.intelligence && (
                      <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                        Intelligence
                      </span>
                    )}
                    {subscriber.onlinebiz && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        OnlineBiz
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {subscriber.email_opens !== undefined && (
                    <p className="text-gray-600">
                      {subscriber.email_opens} opens • {subscriber.email_clicks} clicks
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubscribers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-600">No subscribers found</p>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <p className="font-semibold text-gray-900 mb-4">
            {selectedSubscribers.length} selected
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Send Email Campaign
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
              Segment
            </button>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium">
              Unsubscribe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
