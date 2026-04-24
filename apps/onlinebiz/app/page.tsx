'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

const mockArticles = [
  {
    id: '1',
    slug: 'freelancing-first-1k',
    title: 'Freelancing 101: Earn Your First $1000 in 30 Days',
    excerpt: 'Step-by-step guide to finding clients, setting rates, and landing your first paid project.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    category: 'Freelancing',
  },
  {
    id: '2',
    slug: 'passive-income-2026',
    title: 'Passive Income Ideas That Actually Work in 2026',
    excerpt: 'Real strategies beyond the hype. Digital products, courses, and affiliate marketing that generate revenue.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    category: 'Passive Income',
  },
  {
    id: '3',
    slug: 'digital-products-guide',
    title: 'Create & Sell Digital Products: No Experience Needed',
    excerpt: 'Templates, courses, presets, ebooks. Learn what sells and how to launch your first product.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    category: 'Digital Products',
  },
  {
    id: '4',
    slug: 'affiliate-marketing-income',
    title: 'Affiliate Marketing: Realistic Income Expectations in 2026',
    excerpt: 'How much can you earn? Real numbers from successful affiliates and strategies that work.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'Affiliate',
  },
  {
    id: '5',
    slug: 'side-hustle-test-ideas',
    title: 'Testing Side Hustle Ideas: Framework to Find Your Winner',
    excerpt: 'How to validate ideas before investing time and money. Strategies from successful entrepreneurs.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    category: 'Side Hustle',
  },
  {
    id: '6',
    slug: 'scaling-to-5-figures',
    title: '5-Figure Income: The Path to $5000/Month',
    excerpt: 'Real case studies and strategies from people earning $5K+/month online.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
    category: 'Scaling',
  },
];

export default function OnlineBizHome() {
  return (
    <div className="space-y-20">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-4 py-2 w-fit">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-700">Real Strategies • Real Income • Verified</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                Make Real Money <span className="bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">Online</span> in 2026
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Proven strategies for freelancing, side hustles, and passive income. Learn from real people earning $1K-$10K+ monthly.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                  View Income Strategies
                </button>
                <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold rounded-lg transition-all">
                  Join Our Community
                </button>
              </div>

              {/* Badge */}
              <p className="text-sm text-slate-600 font-medium">
                ✓ 8K+ Active Members • ✓ Real Income Reports • ✓ 100+ Strategies
              </p>
            </div>

            {/* Right: Growth chart visualization */}
            <div className="hidden lg:flex items-center justify-center h-64">
              <div className="relative w-full h-full flex items-end justify-center gap-2">
                {[20, 35, 50, 65, 75, 85, 90, 88].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-300 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                    style={{
                      height: `${height}%`,
                      animation: `chartGrow 3s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes chartGrow {
            0%, 100% { transform: scaleY(1); opacity: 0.8; }
            50% { transform: scaleY(1.15); opacity: 1; }
          }
        `}</style>
      </section>

      {/* ===================== REAL NUMBERS ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '$50K+', label: 'Total Earnings from Strategies Featured' },
            { number: '100+', label: 'Methods Tested and Reviewed' },
            { number: '2K+', label: 'Active Community Members' },
          ].map((stat, i) => (
            <div key={i} className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-8 text-center">
              <div className="text-4xl sm:text-5xl font-bold text-emerald-600 mb-3">{stat.number}</div>
              <p className="text-slate-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          Real figures from our community members sharing their results
        </p>
      </section>

      {/* ===================== FEATURED ARTICLES ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">All Strategies</h2>
            <p className="text-lg text-slate-600">
              Proven methods to earn money online, from $500 to $5000+ monthly.
            </p>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockArticles.map((article) => (
              <div key={article.id} className="group">
                <div className="bg-white border border-slate-200 hover:border-emerald-400 rounded-lg overflow-hidden transition-all hover:shadow-lg">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-amber-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl opacity-30">💰</div>
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {article.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{article.excerpt}</p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
                      <span>📖 {article.readingTime} min</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>

                    {/* CTA */}
                    <button className="w-full mt-4 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold rounded-lg transition-all text-sm">
                      Read Strategy →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-500 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Join 8K+ Earners
            </h2>
            <p className="text-lg text-emerald-100">
              Get weekly income ideas and strategies. Real people, real results.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 space-y-4 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white/90 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-emerald-100">✓ No spam • ✓ Unsubscribe anytime • ✓ Community verified</p>
          </div>
        </div>
      </section>

      {/* ===================== BOTTOM CTA ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
          Ready to Start Earning?
        </h2>
        <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
          Explore All Strategies
        </button>
      </section>
    </div>
  );
}
