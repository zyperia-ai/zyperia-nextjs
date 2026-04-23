'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';
import NewsletterSignup from '@zyperia/shared-ui/components/NewsletterSignup';

const mockArticles = [
  {
    id: '1',
    slug: 'freelancing-first-1k',
    title: 'Freelancing 101: Earn Your First $1000 in 30 Days',
    excerpt: 'Step-by-step guide to finding clients, setting rates, and landing your first paid project.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
  },
  {
    id: '2',
    slug: 'passive-income-2026',
    title: 'Passive Income Ideas That Actually Work in 2026',
    excerpt: 'Real strategies beyond the hype. Digital products, courses, and affiliate marketing that generate revenue.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
  },
  {
    id: '3',
    slug: 'digital-products-guide',
    title: 'Create & Sell Digital Products: No Experience Needed',
    excerpt: 'Templates, courses, presets, ebooks. Learn what sells and how to launch your first product.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
  },
  {
    id: '4',
    slug: 'affiliate-marketing-income',
    title: 'Affiliate Marketing: Realistic Income Expectations in 2026',
    excerpt: 'How much can you earn? Real numbers from successful affiliates and strategies that work.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
  },
  {
    id: '5',
    slug: 'side-hustle-test-ideas',
    title: 'Testing Side Hustle Ideas: Framework to Find Your Winner',
    excerpt: 'How to validate ideas before investing time and money. Strategies from successful entrepreneurs.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
  },
  {
    id: '6',
    slug: 'scaling-to-5-figures',
    title: '5-Figure Income: The Path to $5000/Month',
    excerpt: 'Real case studies and step-by-step frameworks to scale your online income.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
  },
];

export default function OnlineBizPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-50 to-emerald-50 -mx-4 px-4 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-300 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            <span className="text-sm text-green-700">Real Money • Proven Methods</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900">
            Earn Money Online
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-700 mb-8">
            Real strategies for making money from home. Freelancing, digital products, passive income, and side hustles that actually work.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all transform hover:scale-105">
              Start Now
            </button>
            <button className="px-8 py-4 border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold rounded-lg transition-all">
              Join Community
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-green-200">
            <div>
              <div className="text-3xl font-bold text-green-600">$1M+</div>
              <div className="text-sm text-gray-600">Earned by Readers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">100K+</div>
              <div className="text-sm text-gray-600">Active Community</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">2026</div>
              <div className="text-sm text-gray-600">Strategies Updated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section>
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Strategies & Methods</h2>
          <p className="text-gray-600">Learn proven ways to earn money online. New income streams every week.</p>
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
          <h3 className="text-2xl font-bold mb-6">Why This Content Works</h3>

          <div className="space-y-4 text-gray-700">
            <p>
              <strong className="text-green-600">Expertise:</strong> Written by people who've earned money online. We share real case studies and verified income reports.
            </p>

            <p>
              <strong className="text-green-600">Authority:</strong> Backed by real data. Every claim is tested and verified with case studies from our community.
            </p>

            <p>
              <strong className="text-green-600">Trustworthiness:</strong> Honest about what works and what doesn't. We include realistic timelines and income expectations.
            </p>

            <p className="text-sm text-gray-600 border-t border-gray-300 pt-4">
              ⚠️ <strong>Income Disclaimer:</strong> Results vary. No guarantee of specific earnings. We're sharing what we and our community have achieved. Your results depend on your effort and market conditions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
