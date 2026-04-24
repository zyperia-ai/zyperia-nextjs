import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <Image
          src="/HeroBanner_Intelligence_1920x800.png"
          alt="Intelligence Blog"
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
              src="/ZYPERIA INTELLIGENCE LOGO.png"
              alt="Intelligence"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            AI & Intelligence
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Explore artificial intelligence, machine learning, and automation.
            Build smarter systems and stay ahead of the curve.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">
            📧 Subscribe Newsletter
          </button>
          <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition">
            📚 Read Articles
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-bold text-white mb-2">AI Models</h3>
            <p className="text-slate-400">Understanding LLMs, transformers, and neural networks</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-bold text-white mb-2">Automation</h3>
            <p className="text-slate-400">Automate workflows and increase productivity with AI</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-bold text-white mb-2">ML Engineering</h3>
            <p className="text-slate-400">Build and deploy machine learning systems in production</p>
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
