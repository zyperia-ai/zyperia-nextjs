export default function Home() {
  return (
    <main className="w-screen h-screen bg-gradient-to-br from-green-950 via-slate-900 to-green-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 px-6 py-4 border-b-2 border-green-600">
        <h2 className="text-green-300 text-sm font-bold">ZYPERIA</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">💰</div>
          <h1 className="text-4xl font-black text-white mb-2">
            ONLINE BUSINESS
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-400 mx-auto mb-6"></div>
          <p className="text-lg text-green-200 max-w-lg">
            Build, scale and monetize your online empire
          </p>
        </div>

        <div className="flex gap-4 mb-12">
          <button className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition shadow-lg">
            Subscribe
          </button>
          <button className="px-6 py-2 border-2 border-green-400 text-green-300 hover:bg-green-900 font-bold rounded-lg transition">
            Explore
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl">
          <div className="bg-green-900/50 border-2 border-green-600 rounded-lg p-4 hover:border-green-400 transition">
            <div className="text-3xl mb-2">💎</div>
            <p className="text-green-200 font-bold text-sm">MONETIZE</p>
            <p className="text-xs text-green-300">Multiple streams</p>
          </div>
          <div className="bg-green-900/50 border-2 border-green-600 rounded-lg p-4 hover:border-green-400 transition">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-green-200 font-bold text-sm">GROWTH</p>
            <p className="text-xs text-green-300">Scale systems</p>
          </div>
          <div className="bg-green-900/50 border-2 border-green-600 rounded-lg p-4 hover:border-green-400 transition">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-green-200 font-bold text-sm">SYSTEMS</p>
            <p className="text-xs text-green-300">Automation</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-green-950 border-t-2 border-green-600 px-6 py-3 text-center">
        <p className="text-green-400 text-xs">© 2026 ZYPERIA • ONLINE BUSINESS</p>
      </div>
    </main>
  )
}
