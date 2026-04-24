import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <Image
          src="/HeroBanner_Crypto_1920x800.png"
          alt="Crypto Blog"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="mb-6">
            <Image
              src="/ZYPERIA CRYPTO LOGO.png"
              alt="Crypto"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Cryptocurrency Insights
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Deep dives into blockchain, Bitcoin, altcoins, and DeFi strategies.
            Expert analysis for crypto investors.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
            📧 Subscribe Newsletter
          </button>
          <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">
            📚 Read Articles
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-bold text-white mb-2">Security First</h3>
            <p className="text-slate-400">Learn best practices for protecting your crypto assets</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-white mb-2">Market Analysis</h3>
            <p className="text-slate-400">Understand trends and technical analysis for trading</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-bold text-white mb-2">DeFi Strategies</h3>
            <p className="text-slate-400">Master decentralized finance opportunities and risks</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-slate-400">
        <p>© 2026 Zyperia. All rights reserved.</p>
      </footer>
    </main>
  )
}
