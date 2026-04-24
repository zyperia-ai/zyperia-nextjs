import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = 'https://crypto.zyperia.ai';

  // TODO: On May 1st, fetch from Supabase
  // For now, return mock feed
  const mockArticles = [
    {
      id: '1',
      slug: 'bitcoin-beginners-guide',
      title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
      excerpt: 'Learn the fundamentals of Bitcoin, how wallets work, and how to make your first purchase safely.',
      author: 'Crypto Expert',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      slug: 'ethereum-smart-contracts',
      title: 'Understanding Ethereum Smart Contracts: A Technical Deep Dive',
      excerpt: 'Explore how smart contracts work, their applications in DeFi, and security best practices.',
      author: 'Crypto Expert',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const feedItems = mockArticles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${baseUrl}/articles/${article.slug}</link>
      <guid>${baseUrl}/articles/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(article.excerpt)}</description>
      <author>${escapeXml(article.author)}</author>
      <category>Cryptocurrency</category>
    </item>
  `
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>CryptoZYPERIA - Bitcoin, Ethereum &amp; DeFi Education</title>
    <link>${baseUrl}</link>
    <description>Expert cryptocurrency education updated daily</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>CryptoZYPERIA</title>
      <link>${baseUrl}</link>
    </image>
    ${feedItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
