import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://crypto.zyperia.ai';
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/affiliate-disclosure`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // TODO: On May 1st, fetch from Supabase and generate dynamically
  // For now, return mock article URLs
  const mockArticles = [
    { slug: 'bitcoin-beginners-guide', publishedAt: '2024-04-22' },
    { slug: 'ethereum-smart-contracts', publishedAt: '2024-04-21' },
    { slug: 'defi-risks-explained', publishedAt: '2024-04-19' },
    { slug: 'crypto-wallets-comparison', publishedAt: '2024-04-17' },
    { slug: 'bitcoin-mining-explained', publishedAt: '2024-04-15' },
    { slug: 'nft-guide-beyond-hype', publishedAt: '2024-04-13' },
  ];

  const articlePages: MetadataRoute.Sitemap = mockArticles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Category pages
  const categories = ['bitcoin', 'ethereum', 'defi', 'wallets', 'nft'];
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...categoryPages];
}
