'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Profile {
  email: string
  display_name: string
  bio?: string
  avatar_url?: string
  twitter_url?: string
  linkedin_url?: string
  website_url?: string
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  published_at: string
  views: number
}

interface UserProfileProps {
  email: string
}

export default function UserProfile({ email }: UserProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [followerCount, setFollowerCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `/api/users/profile-public?email=${encodeURIComponent(email)}`
        )
        const data = await response.json()

        if (response.ok) {
          setProfile(data.profile)
          setArticles(data.articles || [])
          setFollowerCount(data.followerCount || 0)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (email) {
      fetchProfile()
    }
  }, [email])

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>
  }

  if (!profile) {
    return (
      <div className="text-center py-12 text-gray-500">
        Profile not found
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-8 mb-8">
        <div className="flex items-start gap-6">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {profile.display_name}
            </h1>
            {profile.bio && (
              <p className="text-gray-700 mb-4">{profile.bio}</p>
            )}
            <div className="flex gap-4 mb-4">
              {profile.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Twitter
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  LinkedIn
                </a>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Website
                </a>
              )}
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold text-slate-900">
                  {articles.length}
                </span>
                <span className="text-gray-600"> Articles</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">
                  {followerCount}
                </span>
                <span className="text-gray-600"> Followers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Latest Articles
          </h2>
          <div className="space-y-4">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 hover:text-green-600">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                    <span>{article.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
