export default function Home() {
  return (
    <main className="w-screen h-screen bg-slate-900 flex flex-col">
      {/* Banner - tiny */}
      <div className="h-24 bg-purple-900 border-b-2 border-purple-600 overflow-hidden">
        <img
          src="/HeroBanner_Intelligence_1920x800.png"
          alt="Intelligence"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content - centered, scrollable if needed */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-auto">
        {/* Logo - small */}
        <img
          src="/ZYPERIA INTELLIGENCE LOGO.png"
          alt="Intelligence Logo"
          className="h-16 mb-2"
        />

        {/* Title */}
        <h1 className="text-2xl font-bold text-white text-center mb-1">
          AI & Intelligence
        </h1>

        {/* Description */}
        <p className="text-xs text-slate-300 text-center mb-3 max-w-sm">
          Machine learning, AI models & automation
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mb-3">
          <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded font-semibold hover:bg-purple-700">
            Subscribe
          </button>
          <button className="px-3 py-1 bg-slate-700 text-white text-xs rounded font-semibold hover:bg-slate-600">
            Read
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-lg">🤖</div>
            <p className="text-xs text-slate-300">AI Models</p>
          </div>
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-lg">⚙️</div>
            <p className="text-xs text-slate-300">Automation</p>
          </div>
          <div className="bg-slate-800 p-2 rounded border border-slate-700">
            <div className="text-lg">🧠</div>
            <p className="text-xs text-slate-300">ML Eng</p>
          </div>
        </div>
      </div>

      {/* Footer - minimal */}
      <footer className="h-8 border-t border-slate-800 flex items-center justify-center">
        <p className="text-slate-500 text-xs">© 2026 Zyperia</p>
      </footer>
    </main>
  )
}
