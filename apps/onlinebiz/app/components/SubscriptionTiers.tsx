'use client'

import { useEffect, useState } from 'react'

interface Tier {
  id: string
  name: string
  description: string
  price: number
  billingCycle?: string
  features: string[]
}

export default function SubscriptionTiers() {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [currentTier, setCurrentTier] = useState<string>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await fetch('/api/subscriptions/tiers')
        const data = await response.json()
        setTiers(data.tiers)

        const email = localStorage.getItem('user_email')
        if (email) {
          const subResponse = await fetch(`/api/subscriptions/user?email=${email}`)
          const subData = await subResponse.json()
          setCurrentTier(subData.subscription.tier)
        }
      } catch (error) {
        console.error('Error fetching tiers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTiers()
  }, [])

  const handleUpgrade = async (tierId: string) => {
    const email = localStorage.getItem('user_email')
    if (!email) {
      alert('Please log in first')
      return
    }

    try {
      const response = await fetch('/api/subscriptions/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tier: tierId }),
      })

      if (response.ok) {
        setCurrentTier(tierId)
        alert('Subscription updated!')
      }
    } catch (error) {
      alert('Error updating subscription')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading subscription tiers...</div>
  }

  return (
    <div className="py-12">
      <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
        Choose Your Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${
              currentTier === tier.id
                ? 'ring-4 ring-green-500 bg-green-50'
                : 'bg-white'
            }`}
          >
            <div className="p-6">
              {currentTier === tier.id && (
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Current Plan
                </span>
              )}

              <h3 className="text-2xl font-bold text-slate-900 mb-2">{tier.name}</h3>
              <p className="text-gray-600 text-sm mb-6">{tier.description}</p>

              <div className="mb-6">
                <div className="text-4xl font-bold text-slate-900">
                  ${tier.price}
                </div>
                {tier.billingCycle && (
                  <p className="text-gray-600 text-sm">{tier.billingCycle}</p>
                )}
              </div>

              <button
                onClick={() => handleUpgrade(tier.id)}
                disabled={currentTier === tier.id}
                className={`w-full py-2 rounded-lg font-semibold transition-colors mb-6 ${
                  currentTier === tier.id
                    ? 'bg-gray-300 text-gray-700 cursor-default'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {currentTier === tier.id ? 'Current Plan' : 'Upgrade'}
              </button>

              <div className="space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
