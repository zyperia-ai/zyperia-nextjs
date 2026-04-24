'use client'

import { useEffect, useState } from 'react'

interface ArticlePaywallProps {
  articleId: string
  requiredTier: 'free' | 'pro' | 'elite'
  onUpgrade?: () => void
}

export default function ArticlePaywall({
  articleId,
  requiredTier,
  onUpgrade,
}: ArticlePaywallProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [userTier, setUserTier] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      const email = localStorage.getItem('user_email')
      if (!email) {
        setHasAccess(false)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `/api/articles/access?email=${email}&article_id=${articleId}`
        )
        const data = await response.json()
        setHasAccess(data.hasAccess)
        setUserTier(data.userTier)
      } catch (error) {
        setHasAccess(false)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [articleId])

  if (loading) {
    return <div className="text-center py-8">Checking access...</div>
  }

  if (hasAccess) {
    return null
  }

  const tierNames = {
    free: 'Free',
    pro: 'Pro ($9.99/mo)',
    elite: 'Elite ($24.99/mo)',
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-8 text-center my-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-3">Premium Content</h3>
      <p className="text-gray-700 mb-6">
        This article requires a {tierNames[requiredTier]} subscription to read in full.
      </p>

      <div className="bg-white rounded-lg p-6 mb-6 inline-block">
        <p className="text-sm text-gray-600 mb-4">Your current tier: <span className="font-semibold">{tierNames[userTier as keyof typeof tierNames] || 'None'}</span></p>
        <div className="grid grid-cols-3 gap-4">
          {(['free', 'pro', 'elite'] as const).map((tier) => (
            <button
              key={tier}
              onClick={onUpgrade}
              className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                tier === requiredTier
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tierNames[tier]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Upgrade to read this article and access premium content
      </p>
    </div>
  )
}
