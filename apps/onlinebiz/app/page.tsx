export default function Home() {
  return (
    <main className="w-screen h-screen bg-slate-900 flex flex-col">
      {/* Banner - tiny image in header 80x40px */}
      <div className="w-32 h-10 bg-green-900 border border-green-600 m-1 overflow-hidden rounded">
        <img
          src="/HeroBanner_OnlineBiz_1920x800.png"
          alt="Online Business"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Title */}
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Online Business
        </h1>

        {/* Description */}
        <p className="text-sm text-slate-300 text-center mb-4 max-w-sm">
          Build, scale & monetize your business
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mb-4">
          <button className="px-4 py-1.5 bg-green-600 text-white text-sm rounded font-semibold hover:bg-green-700">
            Subscribe
          </button>
          <button className="px-4 py-1.5 bg-slate-700 text-white text-sm rounded font-semibold hover:bg-slate-600">
            Read
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-2xl">💰</div>
            <p className="text-xs text-slate-300">Monetization</p>
          </div>
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-2xl">📈</div>
            <p className="text-xs text-slate-300">Growth</p>
          </div>
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-2xl">🎯</div>
            <p className="text-xs text-slate-300">Systems</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-8 border-t border-slate-800 flex items-center justify-center">
        <p className="text-slate-500 text-xs">© 2026 Zyperia</p>
      </footer>
    </main>
  )
}
