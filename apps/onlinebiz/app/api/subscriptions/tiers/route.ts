export async function GET() {
  const tiers = [
    {
      id: 'free',
      name: 'Free',
      description: 'Access to basic articles and news',
      price: 0,
      features: [
        'Access to all free articles',
        'Weekly newsletter',
        'Basic analytics',
        'Community forum access',
      ],
      limits: {
        articleReads: -1,
        maxReadDepth: 5000,
        downloadLimit: 0,
        exclusiveContent: false,
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Unlimited access to premium content',
      price: 9.99,
      billingCycle: 'monthly',
      features: [
        'All free features',
        'Unlimited article reads',
        'Full article access (no paywalls)',
        'Daily premium digest',
        'Advanced analytics',
        'Ad-free experience',
        'Download articles as PDF',
      ],
      limits: {
        articleReads: -1,
        maxReadDepth: -1,
        downloadLimit: 30,
        exclusiveContent: true,
      },
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Premium access with personalized content',
      price: 24.99,
      billingCycle: 'monthly',
      features: [
        'All pro features',
        'Personalized recommendations',
        'Priority support',
        'Custom digest frequency',
        'Exclusive research reports',
        'Early access to new content',
        'Private community channel',
        'Unlimited downloads',
      ],
      limits: {
        articleReads: -1,
        maxReadDepth: -1,
        downloadLimit: -1,
        exclusiveContent: true,
      },
    },
  ]

  return Response.json({ tiers }, { status: 200 })
}
