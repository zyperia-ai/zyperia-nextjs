export default function Home() {
  return (
    <main className="w-screen h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-purple-800 px-6 py-4 border-b-2 border-purple-600">
        <h2 className="text-purple-300 text-sm font-bold">ZYPERIA</h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-4xl font-black text-white mb-2">
            AI & INTELLIGENCE
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-400 mx-auto mb-6"></div>
          <p className="text-lg text-purple-200 max-w-lg">
            Master machine learning, AI models and intelligent automation
          </p>
        </div>

        <div className="flex gap-4 mb-12">
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition shadow-lg">
            Subscribe
          </button>
          <button className="px-6 py-2 border-2 border-purple-400 text-purple-300 hover:bg-purple-900 font-bold rounded-lg transition">
            Explore
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl">
          <div className="bg-purple-900/50 border-2 border-purple-600 rounded-lg p-4 hover:border-purple-400 transition">
            <div className="text-3xl mb-2">🧠</div>
            <p className="text-purple-200 font-bold text-sm">MODELS</p>
            <p className="text-xs text-purple-300">LLMs & neural nets</p>
          </div>
          <div className="bg-purple-900/50 border-2 border-purple-600 rounded-lg p-4 hover:border-purple-400 transition">
            <div className="text-3xl mb-2">⚙️</div>
            <p className="text-purple-200 font-bold text-sm">AUTOMATION</p>
            <p className="text-xs text-purple-300">Smart workflows</p>
          </div>
          <div className="bg-purple-900/50 border-2 border-purple-600 rounded-lg p-4 hover:border-purple-400 transition">
            <div className="text-3xl mb-2">🚀</div>
            <p className="text-purple-200 font-bold text-sm">DEPLOY</p>
            <p className="text-xs text-purple-300">Production ML</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-purple-950 border-t-2 border-purple-600 px-6 py-3 text-center">
        <p className="text-purple-400 text-xs">© 2026 ZYPERIA • AI INTELLIGENCE</p>
      </div>
    </main>
  )
}
