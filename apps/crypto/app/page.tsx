'use client'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/95 backdrop-blur border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">ZYPERIA</div>
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
          <div className="inline-block mb-6 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-blue-600 text-sm font-semibold">Welcome to ZYPERIA Crypto</span>
          </div>

          <h1 className="text-6xl font-black mb-6 text-gray-900 leading-tight">
            Master <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Cryptocurrency</span> Intelligence
          </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Deep dives into blockchain technology, Bitcoin strategies, altcoin analysis, and DeFi opportunities. Expert insights for crypto investors.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg">
              Subscribe Now
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-bold rounded-lg transition">
              Explore Articles
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="text-5xl mb-3">🔐</div>
              <h3 className="font-bold text-gray-900 mb-2">Security First</h3>
              <p className="text-gray-600 text-sm">Best practices for protecting your crypto assets</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Market Analysis</h3>
              <p className="text-gray-600 text-sm">In-depth technical and fundamental analysis</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">DeFi Strategies</h3>
              <p className="text-gray-600 text-sm">Master decentralized finance opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-gray-900">Latest Insights</h2>
          <p className="text-gray-600 mb-12">Cutting-edge analysis on crypto markets and blockchain technology</p>

          <div className="grid gap-6">
            <article className="bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition cursor-pointer">
              <div className="text-blue-600 font-bold text-sm mb-2">BITCOIN ANALYSIS</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Understanding Bitcoin's Role in Modern Finance</h3>
              <p className="text-gray-600">Explore how Bitcoin is reshaping the financial landscape and what it means for investors</p>
            </article>

            <article className="bg-white p-8 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition cursor-pointer">
              <div className="text-blue-600 font-bold text-sm mb-2">DEFI GUIDE</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Getting Started with Decentralized Finance</h3>
              <p className="text-gray-600">A beginner's guide to DeFi platforms, yields, and risk management strategies</p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-black mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-6">Get the latest crypto analysis and market insights delivered to your inbox</p>
          <div className="flex gap-3">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500" />
            <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2 text-white font-bold">ZYPERIA Crypto Intelligence</p>
          <p className="text-sm">© 2026 ZYPERIA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
