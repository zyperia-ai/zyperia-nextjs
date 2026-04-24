'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

const mockArticles: Record<string, any> = {
  'freelancing-first-1k': {
    title: 'Freelancing 101: Earn Your First $1000 in 30 Days',
    slug: 'freelancing-first-1k',
    author: 'Freelance Strategist',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readingTime: 8,
    category: 'Freelancing',
    heroImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    excerpt: 'Step-by-step guide to finding clients, setting rates, and landing your first paid project.',
    content: `
      <h2>Why Freelancing?</h2>
      <p>Freelancing is one of the fastest ways to start earning money online. You can start today, set your own rates, and work with clients worldwide. This guide will show you how to earn your first $1000 in 30 days.</p>

      <h2>Step 1: Choose Your Skill (Days 1-3)</h2>
      <p>First, identify what you're good at. Popular freelance skills include:</p>
      <ul>
        <li>Writing (blog posts, copywriting, technical writing)</li>
        <li>Design (logo design, graphic design, UI/UX)</li>
        <li>Development (web development, app development)</li>
        <li>Virtual assistance (administrative tasks, customer service)</li>
        <li>Marketing (social media, SEO, email marketing)</li>
        <li>Consulting (business advice, strategy, coaching)</li>
      </ul>

      <h2>Step 2: Set Up Your Profile (Days 4-7)</h2>
      <p>Create profiles on freelance platforms:</p>
      <ul>
        <li>Upwork - Largest platform, best for beginners</li>
        <li>Fiverr - Good for selling services starting at $5</li>
        <li>Toptal - High-paying projects, more selective</li>
        <li>Freelancer.com - Global marketplace</li>
      </ul>

      <h2>Step 3: Land Your First Clients (Days 8-25)</h2>
      <p>Start applying to projects. To maximize your chances:</p>
      <ul>
        <li>Write custom proposals (not templates)</li>
        <li>Start with lower rates to build reviews</li>
        <li>Under-promise and over-deliver</li>
        <li>Respond quickly to client messages</li>
      </ul>

      <h2>Step 4: Deliver Excellent Work (Ongoing)</h2>
      <p>Quality leads to reviews, which lead to higher-paying clients. Always deliver on time or early, communicate clearly, and go above expectations.</p>

      <h2>Reaching $1000</h2>
      <p>Here's a realistic path to $1000 in 30 days:</p>
      <ul>
        <li>5 projects at $200 each = $1000</li>
        <li>10 projects at $100 each = $1000</li>
        <li>20 projects at $50 each = $1000</li>
      </ul>

      <h2>Beyond $1000</h2>
      <p>After landing clients and building reviews, you can:</p>
      <ul>
        <li>Increase your rates</li>
        <li>Take on retainer clients (recurring revenue)</li>
        <li>Build your own website/brand</li>
        <li>Move to higher-paying platforms</li>
      </ul>
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
        <a href="/" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
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
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
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
        >
          {copied ? '✓ Copied' : '🔗 Copy Link'}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${typeof window !== 'undefined' ? window.location.href : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition"
        >
          𝕏 Share
        </a>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12 text-gray-700">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Income Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <p className="text-sm text-yellow-900">
          <strong>💡 Income Disclaimer:</strong> Results vary based on your effort and circumstances. This guide represents
          realistic potential, not guaranteed results. Your income depends on skill, market conditions, and work ethic.
        </p>
      </div>

      {/* Newsletter CTA */}
      <section className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Get More Money-Making Strategies</h2>
        <p className="mb-4 text-gray-100">
          Join our community getting real strategies for earning money online.
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
            className="px-6 py-2 bg-green-700 hover:bg-green-800 font-semibold rounded-lg transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </article>
  );
}
