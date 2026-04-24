export default function Home() {
  return (
    <main className="w-screen h-screen bg-slate-900 flex flex-col">
      {/* Banner - super tiny 64px */}
      <div className="w-full h-16 bg-blue-900 border-b border-blue-600">
        <div className="w-full h-16 overflow-hidden">
          <img
            src="/HeroBanner_Crypto_1920x800.png"
            alt="Crypto"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* Content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo - tiny 48x48px */}
        <div className="w-12 h-12 mb-1 flex items-center justify-center">
          <img
            src="/ZYPERIA CRYPTO LOGO.png"
            alt="Crypto Logo"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-white text-center mb-1">
          Crypto
        </h1>

        {/* Description */}
        <p className="text-xs text-slate-300 text-center mb-2 max-w-xs">
          Blockchain & DeFi
        </p>

        {/* Buttons */}
        <div className="flex gap-1 mb-2">
          <button className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded font-semibold hover:bg-blue-700">
            Subscribe
          </button>
          <button className="px-2 py-0.5 bg-slate-700 text-white text-xs rounded font-semibold hover:bg-slate-600">
            Read
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-1 text-center text-xs">
          <div className="bg-slate-800 p-1 rounded border border-slate-700">
            <div className="text-base">🔐</div>
          </div>
          <div className="bg-slate-800 p-1 rounded border border-slate-700">
            <div className="text-base">📊</div>
          </div>
          <div className="bg-slate-800 p-1 rounded border border-slate-700">
            <div className="text-base">🚀</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-6 border-t border-slate-800 flex items-center justify-center">
        <p className="text-slate-500 text-xs">© 2026 Zyperia</p>
      </footer>
    </main>
  )
}
