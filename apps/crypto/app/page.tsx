export default function Home() {
  return (
    <main className="w-screen h-screen bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4 border-b-2 border-blue-600">
        <h2 className="text-blue-300 text-sm font-bold">ZYPERIA</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-4xl font-black text-white mb-2">
            CRYPTOCURRENCY
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-400 mx-auto mb-6"></div>
          <p className="text-lg text-blue-200 max-w-lg">
            Master blockchain, Bitcoin, altcoins and DeFi strategies
          </p>
        </div>

        <div className="flex gap-4 mb-12">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-lg">
            Subscribe
          </button>
          <button className="px-6 py-2 border-2 border-blue-400 text-blue-300 hover:bg-blue-900 font-bold rounded-lg transition">
            Explore
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl">
          <div className="bg-blue-900/50 border-2 border-blue-600 rounded-lg p-4 hover:border-blue-400 transition">
            <div className="text-3xl mb-2">🛡️</div>
            <p className="text-blue-200 font-bold text-sm">SECURITY</p>
            <p className="text-xs text-blue-300">Protect assets</p>
          </div>
          <div className="bg-blue-900/50 border-2 border-blue-600 rounded-lg p-4 hover:border-blue-400 transition">
            <div className="text-3xl mb-2">📈</div>
            <p className="text-blue-200 font-bold text-sm">ANALYSIS</p>
            <p className="text-xs text-blue-300">Market trends</p>
          </div>
          <div className="bg-blue-900/50 border-2 border-blue-600 rounded-lg p-4 hover:border-blue-400 transition">
            <div className="text-3xl mb-2">⚡</div>
            <p className="text-blue-200 font-bold text-sm">DEFI</p>
            <p className="text-xs text-blue-300">Yield farming</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-950 border-t-2 border-blue-600 px-6 py-3 text-center">
        <p className="text-blue-400 text-xs">© 2026 ZYPERIA • CRYPTO INTELLIGENCE</p>
      </div>
    </main>
  )
}
