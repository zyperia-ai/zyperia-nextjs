import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const articlesData = [
  {
    app_id: 'crypto',
    title: 'Getting Started with Bitcoin',
    slug: 'getting-started-with-bitcoin',
    content: 'Learn the basics of Bitcoin and how to start investing in cryptocurrency.',
    excerpt: 'A beginner\'s guide to understanding Bitcoin.',
    published_at: new Date('2026-04-20').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'crypto',
    title: 'Ethereum Smart Contracts Explained',
    slug: 'ethereum-smart-contracts-explained',
    content: 'Understanding smart contracts and how they work on the Ethereum blockchain.',
    excerpt: 'Deep dive into Ethereum smart contracts.',
    published_at: new Date('2026-04-19').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'crypto',
    title: 'DeFi Opportunities in 2026',
    slug: 'defi-opportunities-2026',
    content: 'Exploring the latest decentralized finance opportunities and risks.',
    excerpt: 'DeFi landscape analysis for 2026.',
    published_at: new Date('2026-04-18').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'crypto',
    title: 'How to Secure Your Crypto',
    slug: 'secure-your-crypto',
    content: 'Best practices for keeping your cryptocurrency safe and secure.',
    excerpt: 'Essential security practices for crypto holders.',
    published_at: new Date('2026-04-17').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'crypto',
    title: 'NFT Market Trends',
    slug: 'nft-market-trends',
    content: 'Current trends and future outlook for the NFT market.',
    excerpt: 'Analyzing NFT market dynamics.',
    published_at: new Date('2026-04-16').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'intelligence',
    title: 'AI and Machine Learning Basics',
    slug: 'ai-machine-learning-basics',
    content: 'Introduction to artificial intelligence and machine learning concepts.',
    excerpt: 'Understanding AI and ML fundamentals.',
    published_at: new Date('2026-04-20').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'intelligence',
    title: 'Large Language Models Explained',
    slug: 'large-language-models-explained',
    content: 'How large language models work and their applications.',
    excerpt: 'Demystifying LLMs.',
    published_at: new Date('2026-04-19').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'intelligence',
    title: 'The Future of AI',
    slug: 'future-of-ai',
    content: 'Exploring the trajectory of artificial intelligence development.',
    excerpt: 'AI trends and predictions.',
    published_at: new Date('2026-04-18').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'intelligence',
    title: 'Data Privacy in AI',
    slug: 'data-privacy-ai',
    content: 'Balancing innovation with privacy in AI applications.',
    excerpt: 'Privacy considerations in AI systems.',
    published_at: new Date('2026-04-17').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'intelligence',
    title: 'AI Ethics and Governance',
    slug: 'ai-ethics-governance',
    content: 'Understanding ethical frameworks for responsible AI development.',
    excerpt: 'Ethics in artificial intelligence.',
    published_at: new Date('2026-04-16').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'onlinebiz',
    title: 'Starting an Online Business',
    slug: 'starting-online-business',
    content: 'Step-by-step guide to launching your first online business.',
    excerpt: 'Your guide to online business success.',
    published_at: new Date('2026-04-20').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'onlinebiz',
    title: 'E-commerce Strategies for 2026',
    slug: 'ecommerce-strategies-2026',
    content: 'Modern e-commerce strategies to boost your sales.',
    excerpt: 'E-commerce trends and tactics.',
    published_at: new Date('2026-04-19').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'onlinebiz',
    title: 'Social Media Marketing Essentials',
    slug: 'social-media-marketing',
    content: 'Master the fundamentals of social media marketing.',
    excerpt: 'Social media marketing guide.',
    published_at: new Date('2026-04-18').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'onlinebiz',
    title: 'Building Your Brand Online',
    slug: 'building-brand-online',
    content: 'Create a strong online presence and build your brand.',
    excerpt: 'Brand building strategies.',
    published_at: new Date('2026-04-17').toISOString(),
    status: 'published',
    views: 0,
  },
  {
    app_id: 'onlinebiz',
    title: 'SEO Tips for Online Visibility',
    slug: 'seo-tips-online-visibility',
    content: 'Improve your search engine rankings with these SEO tips.',
    excerpt: 'SEO best practices.',
    published_at: new Date('2026-04-16').toISOString(),
    status: 'published',
    views: 0,
  },
]

async function seedArticles() {
  try {
    console.log('Starting article seed...')

    // Check if articles already exist
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1)

    if (existing && existing.length > 0) {
      console.log('Articles already exist in database. Skipping seed.')
      return
    }

    // Insert all articles
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(articlesData)

    if (error) {
      console.error('Error seeding articles:', error)
      process.exit(1)
    }

    console.log(`Successfully seeded ${data?.length || 0} articles`)
  } catch (error) {
    console.error('Unexpected error:', error)
    process.exit(1)
  }
}

seedArticles()
