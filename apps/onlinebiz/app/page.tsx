export default function Home() {
  return (
    <main className="w-screen h-screen bg-slate-900 flex flex-col">
      {/* Banner - confined box 400x96px */}
      <div className="w-full h-24 bg-green-900 border-b-2 border-green-600">
        <div className="w-full h-24 overflow-hidden flex items-center justify-center">
          <img
            src="/HeroBanner_OnlineBiz_1920x800.png"
            alt="Online Business"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* Content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo - confined 80x80px box */}
        <div className="w-20 h-20 mb-2 flex items-center justify-center">
          <img
            src="/ZYPERIA ONLINEBIZ LOGO.png"
            alt="Online Business Logo"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white text-center mb-1">
          Online Business
        </h1>

        {/* Description */}
        <p className="text-xs text-slate-300 text-center mb-3 max-w-sm">
          Build, scale & monetize your business
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mb-3">
          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded font-semibold hover:bg-green-700">
            Subscribe
          </button>
          <button className="px-3 py-1 bg-slate-700 text-white text-xs rounded font-semibold hover:bg-slate-600">
            Read
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-lg">💰</div>
            <p className="text-slate-300">Monetization</p>
          </div>
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-lg">📈</div>
            <p className="text-slate-300">Growth</p>
          </div>
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-lg">🎯</div>
            <p className="text-slate-300">Systems</p>
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
