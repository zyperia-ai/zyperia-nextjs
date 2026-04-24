import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Banner - 120px height max */}
        <div className="mb-6 border-2 border-blue-600 rounded-lg overflow-hidden bg-slate-800 h-32">
          <img
            src="/HeroBanner_Crypto_1920x800.png"
            alt="Crypto"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logo - 80px */}
        <div className="flex justify-center mb-4">
          <img
            src="/ZYPERIA CRYPTO LOGO.png"
            alt="Crypto Logo"
            className="h-20 w-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Cryptocurrency Insights
        </h1>

        {/* Description */}
        <p className="text-center text-slate-300 text-sm mb-4">
          Deep dives into blockchain, Bitcoin, and DeFi strategies
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center mb-6">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded font-semibold hover:bg-blue-700">
            📧 Subscribe
          </button>
          <button className="px-4 py-2 bg-slate-700 text-white text-sm rounded font-semibold hover:bg-slate-600">
            📚 Read
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800 p-3 rounded border border-slate-700 text-center">
            <div className="text-xl mb-1">🔐</div>
            <p className="text-xs text-slate-300">Security</p>
          </div>
          <div className="bg-slate-800 p-3 rounded border border-slate-700 text-center">
            <div className="text-xl mb-1">📊</div>
            <p className="text-xs text-slate-300">Analysis</p>
          </div>
          <div className="bg-slate-800 p-3 rounded border border-slate-700 text-center">
            <div className="text-xl mb-1">🚀</div>
            <p className="text-xs text-slate-300">DeFi</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-500 text-xs py-4 border-t border-slate-800 mt-8">
        © 2026 Zyperia
      </footer>
    </main>
  )
}
