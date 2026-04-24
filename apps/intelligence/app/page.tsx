'use client';

import ArticleCard from '@zyperia/shared-ui/components/ArticleCard';

const mockArticles = [
  {
    id: '1',
    slug: 'claude-prompt-engineering',
    title: 'Master Claude: Prompt Engineering for Maximum Results',
    excerpt: 'Learn the secrets to writing prompts that get exactly what you need from Claude AI.',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    category: 'Claude',
  },
  {
    id: '2',
    slug: 'zapier-automation-guide',
    title: 'Zapier Automation: Connect 1000+ Apps Without Coding',
    excerpt: 'Step-by-step guide to automating your business with Zapier. Save 10+ hours per week.',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 12,
    category: 'Zapier',
  },
  {
    id: '3',
    slug: 'make-com-workflows',
    title: 'Make (Integromat): Advanced Automation Workflows',
    excerpt: 'Build complex automation scenarios with Make. Perfect for growing teams.',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    category: 'Make',
  },
  {
    id: '4',
    slug: 'chatgpt-for-business',
    title: 'ChatGPT for Business: 10 Practical Use Cases',
    excerpt: 'Real examples of how to use ChatGPT to save time and increase productivity.',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'ChatGPT',
  },
  {
    id: '5',
    slug: 'notion-database-guide',
    title: 'Notion Databases: Build Your Personal Operating System',
    excerpt: 'Master Notion to organize projects, clients, and your entire business.',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 11,
    category: 'Notion',
  },
  {
    id: '6',
    slug: 'ai-tools-comparison',
    title: 'AI Tools Comparison 2026: Which One Should You Use?',
    excerpt: 'Side-by-side comparison of Claude, ChatGPT, Gemini, and Mistral.',
    publishedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    category: 'Tools',
  },
];

export default function IntelligencePage() {
  return (
    <div className="space-y-20">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-300 rounded-full px-4 py-2 w-fit">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm text-blue-700">Practical • Step-by-Step • Free</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                AI & Business <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Automation</span> Made Simple
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Learn Claude, ChatGPT, Zapier, Make, and automation tools step-by-step. Save 10+ hours per week without coding.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Browse Tutorials
                </button>
                <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-lg transition-all">
                  Subscribe for Tips
                </button>
              </div>

              {/* Badge */}
              <p className="text-sm text-slate-600 font-medium">
                ✓ Trusted by 3K+ professionals • ✓ Updated weekly • ✓ All free
              </p>
            </div>

            {/* Right side: Code visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full h-64 bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800">
                {/* Fake code editor */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-slate-500"># Automate with AI</div>
                  <div className="text-emerald-400">prompt = "Analyze this..."</div>
                  <div className="text-cyan-400">result = claude.ask(prompt)</div>
                  <div className="text-blue-400">zapier.send(result)</div>
                  <div className="text-emerald-400">notify("Done in 2 sec ✓")</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURED ARTICLES ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">All Articles</h2>
            <p className="text-lg text-slate-600">
              Comprehensive guides to every AI tool and automation platform.
            </p>
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockArticles.map((article) => (
              <div key={article.id} className="group">
                <div className="bg-white border border-slate-200 hover:border-blue-400 rounded-lg overflow-hidden transition-all hover:shadow-lg">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl opacity-30">⚙️</div>
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {article.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{article.excerpt}</p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
                      <span>📖 {article.readingTime} min</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>

                    {/* CTA */}
                    <button className="w-full mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold rounded-lg transition-all text-sm">
                      Read Article →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Get Weekly Automation Tips
            </h2>
            <p className="text-lg text-blue-100">
              Join 3K+ professionals. One email per week. Free forever.
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
              <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-blue-100">✓ No spam • ✓ Unsubscribe anytime</p>
          </div>
        </div>
      </section>

      {/* ===================== BOTTOM CTA ===================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
          Ready to Save 10+ Hours Per Week?
        </h2>
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
          Start Learning Now
        </button>
      </section>
    </div>
  );
}
