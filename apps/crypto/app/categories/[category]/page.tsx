'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Mock article data by category
const articlesByCategory: Record<string, any[]> = {
  bitcoin: [
    {
      id: '1',
      slug: 'bitcoin-beginners-guide',
      title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
      excerpt: 'Learn the fundamentals of Bitcoin, how wallets work, and how to make your first purchase safely.',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 8,
    },
    {
      id: '2',
      slug: 'bitcoin-mining-explained',
      title: 'Bitcoin Mining in 2026: Is It Still Profitable?',
      excerpt: 'Understand how mining works, current profitability factors, and entry costs.',
      publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 11,
    },
  ],
  ethereum: [
    {
      id: '2',
      slug: 'ethereum-smart-contracts',
      title: 'Understanding Ethereum Smart Contracts: A Technical Deep Dive',
      excerpt: 'Explore how smart contracts work, their applications in DeFi, and security best practices.',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 12,
    },
  ],
  defi: [
    {
      id: '3',
      slug: 'defi-risks-explained',
      title: 'DeFi Risks Explained: Protect Your Crypto Investments',
      excerpt: 'A comprehensive guide to understanding impermanent loss, rug pulls, and other DeFi risks.',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 10,
    },
  ],
  wallets: [
    {
      id: '4',
      slug: 'crypto-wallets-comparison',
      title: 'Best Crypto Wallets in 2026: Hardware vs Software vs Exchange',
      excerpt: 'Compare different wallet types and find the right solution for your security needs.',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 9,
    },
  ],
  nft: [
    {
      id: '6',
      slug: 'nft-guide-beyond-hype',
      title: 'NFTs Beyond the Hype: Real Use Cases in 2026',
      excerpt: 'Move past the speculation. Learn about legitimate NFT applications and communities.',
      publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      readingTime: 9,
    },
  ],
};

const categoryInfo: Record<string, { emoji: string; description: string }> = {
  bitcoin: {
    emoji: '₿',
    description: 'Everything about Bitcoin, the original cryptocurrency and digital gold.',
  },
  ethereum: {
    emoji: 'Ξ',
    description: 'Ethereum, smart contracts, and the decentralized web.',
  },
  defi: {
    emoji: '🔄',
    description: 'Decentralized Finance: yield farming, lending, swaps, and more.',
  },
  wallets: {
    emoji: '🔐',
    description: 'Crypto wallets, security best practices, and key management.',
  },
  nft: {
    emoji: '🎨',
    description: 'NFTs, digital collectibles, and on-chain creativity.',
  },
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.category.toLowerCase();
  const articles = articlesByCategory[categorySlug] || [];
  const info = categoryInfo[categorySlug];

  // Capitalize first letter for display
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);

  if (!info) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, we couldn't find the category you're looking for.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="py-12">
      {/* Category Header */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="mb-4 text-5xl">{info.emoji}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{categoryName}</h1>
        <p className="text-xl text-gray-600">{info.description}</p>
      </section>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {articles.length} {articles.length === 1 ? 'Article' : 'Articles'}
            </h2>
            <p className="text-gray-600">All guides in {categoryName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} isDark {...article} />
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-6">No articles found in this category yet.</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            View All Articles
          </a>
        </section>
      )}

      {/* Browse Other Categories */}
      <section className="max-w-4xl mx-auto mt-16 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse All Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(categoryInfo).map(([slug, { emoji }]) => (
            <a
              key={slug}
              href={`/categories/${slug}`}
              className={`p-4 rounded-lg text-center transition ${
                slug === categorySlug
                  ? 'bg-purple-100 border-2 border-purple-500'
                  : 'bg-gray-50 border border-gray-200 hover:border-purple-500'
              }`}
            >
              <div className="text-3xl mb-2">{emoji}</div>
              <div className={`font-semibold ${slug === categorySlug ? 'text-purple-700' : 'text-gray-900'}`}>
                {slug.charAt(0).toUpperCase() + slug.slice(1)}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
