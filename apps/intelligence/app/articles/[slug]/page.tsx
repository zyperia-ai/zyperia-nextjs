'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

// Mock article data
const mockArticles: Record<string, any> = {
  'zapier-automation-guide': {
    title: 'Zapier for Beginners: Automate Your Workflow in 5 Minutes',
    slug: 'zapier-automation-guide',
    author: 'Automation Expert',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readingTime: 7,
    category: 'Automation',
    heroImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop',
    excerpt: 'Connect your favorite apps without coding. Step-by-step guide to eliminating repetitive tasks.',
    content: `
      <h2>What is Zapier?</h2>
      <p>Zapier is an automation platform that connects your favorite apps and automates repetitive tasks without coding. Think of it as a digital assistant that watches for triggers (like new emails) and automatically takes actions (like creating spreadsheet entries).</p>

      <h2>Getting Started</h2>
      <p>Creating your first automation (called a "Zap") takes just 5 minutes:</p>
      <ol>
        <li>Sign up at zapier.com (free plan available)</li>
        <li>Click "Create Zap"</li>
        <li>Choose your trigger app (e.g., Gmail)</li>
        <li>Choose your action app (e.g., Google Sheets)</li>
        <li>Test and activate</li>
      </ol>

      <h2>Popular Zap Ideas</h2>
      <ul>
        <li>Save email attachments to cloud storage automatically</li>
        <li>Create database entries from form submissions</li>
        <li>Send Slack notifications for new leads</li>
        <li>Log hours in spreadsheets from time tracking apps</li>
        <li>Backup important data daily</li>
      </ul>

      <h2>Advanced Features</h2>
      <p>Once you're comfortable with basic Zaps, explore Paths (conditional logic), Filters, and Formatting to create more intelligent automations.</p>
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
        <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
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

      {/* Newsletter CTA */}
      <section className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Learn More Automation Tricks</h2>
        <p className="mb-4 text-gray-100">
          Get weekly guides on AI tools, automation, and workflow optimization.
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
            className="px-6 py-2 bg-blue-700 hover:bg-blue-800 font-semibold rounded-lg transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </article>
  );
}
