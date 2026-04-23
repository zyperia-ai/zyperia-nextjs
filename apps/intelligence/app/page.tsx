'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';
import NewsletterSignup from '@zyperia/shared-ui/components/NewsletterSignup';

const mockArticles = [
  {
    id: '1',
    slug: 'zapier-automation-guide',
    title: 'Zapier for Beginners: Automate Your Workflow in 5 Minutes',
    excerpt: 'Connect your favorite apps without coding. Step-by-step guide to eliminating repetitive tasks.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 7,
  },
  {
    id: '2',
    slug: 'claude-vs-chatgpt',
    title: 'Claude vs ChatGPT: Which AI Tool Should You Use?',
    excerpt: 'Detailed comparison of features, pricing, and real-world use cases for each platform.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
  },
  {
    id: '3',
    slug: 'ai-content-workflow',
    title: 'Building an AI Content Workflow: 10x Your Output',
    excerpt: 'Learn how to use AI tools to write better, faster, and more consistently.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
  },
  {
    id: '4',
    slug: 'make-automation-advanced',
    title: 'Make.com Advanced Scenarios: Beyond Simple Automations',
    excerpt: 'Deep dive into complex workflows, data transformations, and multi-step automation.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
  },
  {
    id: '5',
    slug: 'ai-customer-service',
    title: 'AI-Powered Customer Service: Save 20 Hours Per Week',
    excerpt: 'Implement AI chatbots and automated responses without losing the human touch.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
  },
  {
    id: '6',
    slug: 'business-intelligence-tools',
    title: 'Best Business Intelligence Tools for SMBs in 2026',
    excerpt: 'Data analysis platforms that are actually affordable and easy to use.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
  },
];

export default function IntelligencePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-300 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></span>
            <span className="text-sm text-purple-700">Practical • No Coding Required</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900">
            Automate Everything
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8">
            Master AI tools, business automation, and workflow optimization. Practical guides for makers, entrepreneurs, and teams.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-105">
              Browse Guides
            </button>
            <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold rounded-lg transition-all">
              Get Newsletter
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-purple-600">300+</div>
              <div className="text-sm text-gray-600">Tutorials</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">50K+</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">Free</div>
              <div className="text-sm text-gray-600">Always</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section>
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Latest Guides</h2>
          <p className="text-gray-600">New automation strategies and AI tools every week.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockArticles.map((article) => (
            <ArticleCard key={article.id} isDark={false} {...article} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <NewsletterSignup isDark={false} />
      </section>

      {/* E-E-A-T */}
      <section className="py-12 bg-gray-50 rounded-lg px-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Why Trust This Content</h3>

          <div className="space-y-4 text-gray-700">
            <p>
              <strong className="text-purple-600">Expertise:</strong> Written by developers and automation specialists with real experience building workflows.
            </p>

            <p>
              <strong className="text-purple-600">Authority:</strong> All recommendations are tested personally. We link to official documentation and proven case studies.
            </p>

            <p>
              <strong className="text-purple-600">Trustworthiness:</strong> Transparent about affiliate partnerships. We only recommend tools we actually use.
            </p>

            <p className="text-sm text-gray-600 border-t border-gray-300 pt-4">
              ⚠️ <strong>Disclosure:</strong> We earn affiliate commissions from some recommendations. This doesn't affect our opinions—we only recommend what genuinely works.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
