'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">ZYPERIA</div>
          <div className="flex gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Blog</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-green-50 rounded-full border border-green-200">
            <span className="text-green-600 text-sm font-semibold">Welcome to ZYPERIA Business</span>
          </div>

          <h1 className="text-6xl font-black mb-6 text-gray-900 leading-tight">
            Build & Scale Your <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Online Business</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Master the complete entrepreneurship journey. From SaaS to digital products, learn how to build, scale, and monetize your online business empire.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition shadow-lg">
              Subscribe Now
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-bold rounded-lg transition">
              Explore Articles
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="text-5xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-2">Monetization</h3>
              <p className="text-gray-600 text-sm">Multiple revenue streams and business models</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">📈</div>
              <h3 className="font-bold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-600 text-sm">Scale your business with proven strategies</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-2">Systems</h3>
              <p className="text-gray-600 text-sm">Automation and passive income strategies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-gray-900">Latest Insights</h2>
          <p className="text-gray-600 mb-12">Proven strategies for building and scaling online businesses</p>

          <div className="grid gap-6">
            <article className="bg-white p-8 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-lg transition cursor-pointer">
              <div className="text-green-600 font-bold text-sm mb-2">BUSINESS GUIDE</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">From Zero to $10K MRR: A Complete Roadmap</h3>
              <p className="text-gray-600">Step-by-step guide to building your first profitable online business</p>
            </article>

            <article className="bg-white p-8 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-lg transition cursor-pointer">
              <div className="text-green-600 font-bold text-sm mb-2">MONETIZATION</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Building Multiple Revenue Streams</h3>
              <p className="text-gray-600">Diversify your income with products, services, and affiliate marketing</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-black mb-4">Stay Updated</h2>
          <p className="text-green-100 mb-6">Get business strategies and entrepreneurship insights delivered to your inbox</p>
          <div className="flex gap-3">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500" />
            <button className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2 text-white font-bold">ZYPERIA Online Business</p>
          <p className="text-sm">© 2026 ZYPERIA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
