'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Mock article data (will be replaced with real DB queries on May 1)
const mockArticles: Record<string, any> = {
  'bitcoin-beginners-guide': {
    title: 'Bitcoin for Beginners: Complete Guide to Getting Started',
    slug: 'bitcoin-beginners-guide',
    author: 'Crypto Expert',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readingTime: 8,
    category: 'Bitcoin',
    heroImageUrl: 'https://images.unsplash.com/photo-1521697474560-cbf461f5e0e1?w=1200&h=600&fit=crop',
    excerpt:
      'Learn the fundamentals of Bitcoin, how wallets work, and how to make your first purchase safely.',
    content: `
      <h2>What is Bitcoin?</h2>
      <p>Bitcoin is the world's first decentralized digital currency, created in 2009 by an unknown person using the pseudonym Satoshi Nakamoto. Unlike traditional currencies issued by governments, Bitcoin operates on a peer-to-peer network using blockchain technology.</p>

      <h3>Key Characteristics</h3>
      <ul>
        <li><strong>Decentralized:</strong> No central bank or government controls it</li>
        <li><strong>Limited Supply:</strong> Only 21 million bitcoins will ever exist</li>
        <li><strong>Secure:</strong> Uses advanced cryptography to protect transactions</li>
        <li><strong>Transparent:</strong> All transactions are recorded on the blockchain</li>
        <li><strong>Fast:</strong> Transactions settle relatively quickly compared to traditional banking</li>
      </ul>

      <h2>How Bitcoin Works</h2>
      <p>Bitcoin operates on a distributed ledger called the blockchain. When you send Bitcoin to someone, the transaction is recorded on this blockchain and verified by thousands of computers (called nodes) around the world.</p>

      <h3>The Blockchain</h3>
      <p>Imagine a spreadsheet that records every Bitcoin transaction ever made. This spreadsheet is copied across thousands of computers worldwide. Each new page (block) in this ledger contains about 10 minutes worth of transactions and is verified by the network.</p>

      <h2>Getting Your First Bitcoin</h2>
      <p>Here are the main ways to acquire Bitcoin:</p>

      <ol>
        <li><strong>Buy on an Exchange:</strong> Use platforms like Kraken, Coinbase, or Binance</li>
        <li><strong>Mine Bitcoin:</strong> Use powerful computers to solve mathematical puzzles</li>
        <li><strong>Receive as Payment:</strong> Get paid in Bitcoin for goods or services</li>
        <li><strong>P2P Transactions:</strong> Buy directly from individuals</li>
      </ol>

      <h2>Wallets: Storing Your Bitcoin</h2>
      <p>A Bitcoin wallet is software that stores your Bitcoin and allows you to send and receive it. There are several types:</p>

      <h3>Hardware Wallets (Most Secure)</h3>
      <p>Physical devices like Ledger or Trezor that store your Bitcoin offline. Best for long-term holding.</p>

      <h3>Software Wallets (Good for Active Use)</h3>
      <p>Apps like Trust Wallet or Exodus that you install on your phone or computer. Convenient but slightly less secure than hardware.</p>

      <h3>Exchange Wallets (Easiest for Beginners)</h3>
      <p>Wallets provided by exchanges like Coinbase. Great for starting out but not recommended for long-term storage.</p>

      <h2>Security Best Practices</h2>
      <ul>
        <li>Use a hardware wallet for amounts over $1000</li>
        <li>Enable two-factor authentication on all accounts</li>
        <li>Never share your private keys or seed phrases</li>
        <li>Use strong, unique passwords</li>
        <li>Backup your wallet recovery phrase</li>
        <li>Be cautious of phishing scams</li>
      </ul>

      <h2>Understanding Bitcoin Volatility</h2>
      <p>Bitcoin's price can fluctuate dramatically. In a single day, Bitcoin might swing 10-20%. This is normal. Don't panic sell during dips or FOMO buy at peaks.</p>

      <h3>Long-Term Perspective</h3>
      <p>Bitcoin has been around since 2009. While it's volatile short-term, many investors believe in its long-term potential as "digital gold" and a hedge against inflation.</p>

      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li>Investing more than you can afford to lose</li>
        <li>Panic selling during market downturns</li>
        <li>Leaving Bitcoin on exchanges long-term</li>
        <li>Sharing your seed phrase or private keys</li>
        <li>Falling for get-rich-quick schemes</li>
        <li>Trading with leverage as a beginner</li>
      </ul>

      <h2>Next Steps</h2>
      <p>Ready to get started?</p>
      <ol>
        <li>Choose a reputable exchange (Kraken, Coinbase)</li>
        <li>Complete identity verification</li>
        <li>Link your bank account</li>
        <li>Buy a small amount to start ($10-100)</li>
        <li>Move it to a secure wallet (hardware wallet recommended)</li>
        <li>Learn about wallet security and best practices</li>
      </ol>

      <h2>Conclusion</h2>
      <p>Bitcoin is revolutionary technology that's changing how we think about money. While it can be intimidating at first, the basics are straightforward: Bitcoin is digital money, wallets store it, and exchanges let you buy/sell it. Start small, learn constantly, and never invest more than you can afford to lose.</p>
    `,
  },
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = mockArticles[params.slug];
  const [copied, setCopied] = useState(false);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">Sorry, we couldn't find the article you're looking for.</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Back to Home
        </a>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="max-w-3xl mx-auto py-12">
      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
            {article.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{article.title}</h1>

        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <span>{article.author}</span>
          <span>•</span>
          <span>{article.publishedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          <span>•</span>
          <span>{article.readingTime} min read</span>
        </div>

        {article.heroImageUrl && (
          <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={article.heroImageUrl}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </header>

      {/* Sharing Buttons */}
      <div className="flex gap-3 mb-8 pb-8 border-b border-gray-200">
        <button
          onClick={copyLink}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
          title="Copy link"
        >
          {copied ? '✓ Copied' : '🔗 Copy Link'}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${typeof window !== 'undefined' ? window.location.href : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition"
          title="Share on Twitter"
        >
          𝕏 Share
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
          title="Share on LinkedIn"
        >
          in Share
        </a>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12 text-gray-700">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Author Bio */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            👤
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">About {article.author}</h3>
            <p className="text-gray-600 text-sm">
              Expert cryptocurrency educator with 10+ years of experience in blockchain and digital finance.
              Dedicated to making crypto accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <p className="text-sm text-amber-900">
          <strong>⚠️ Disclaimer:</strong> This content is for educational purposes only. Cryptocurrency is highly volatile
          and risky. Always do your own research and never invest more than you can afford to lose.
        </p>
      </div>

      {/* Related Articles */}
      <section className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['ethereum-smart-contracts', 'defi-risks-explained'].map((slug) => {
            const relatedArticle = Object.values(mockArticles).find((a) => a.slug === slug);
            return relatedArticle ? (
              <a
                key={slug}
                href={`/articles/${slug}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition group"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition mb-1">
                  {relatedArticle.title}
                </h3>
                <p className="text-sm text-gray-600">{relatedArticle.readingTime} min read</p>
              </a>
            ) : null;
          })}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mt-12 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Get More Crypto Insights</h2>
        <p className="mb-4 text-gray-200">
          Subscribe to our newsletter for weekly guides, market analysis, and expert reviews.
        </p>
        <form className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 font-semibold rounded-lg transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </article>
  );
}
