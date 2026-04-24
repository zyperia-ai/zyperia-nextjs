import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="relative w-full h-48 overflow-hidden rounded-xl mb-8 border-2 border-slate-700">
          <Image
            src="/HeroBanner_OnlineBiz_1920x800.png"
            alt="Online Business Blog"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="relative w-24 h-24">
              <Image
                src="/ZYPERIA ONLINEBIZ LOGO.png"
                alt="Online Business"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Online Business
          </h1>
          <p className="text-base text-slate-300 mb-6">
            Build, scale, and monetize your online business. Master entrepreneurship.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 justify-center mb-10 flex-wrap">
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition text-sm">
            📧 Subscribe
          </button>
          <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition text-sm">
            📚 Read More
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="text-sm font-bold text-white mb-1">Monetization</h3>
            <p className="text-xs text-slate-400">Multiple revenue streams</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="text-sm font-bold text-white mb-1">Growth</h3>
            <p className="text-xs text-slate-400">Scale your business</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-sm font-bold text-white mb-1">Systems</h3>
            <p className="text-xs text-slate-400">Automated workflows</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-slate-400 text-xs mt-12 border-t border-slate-800 pt-6">
        <p>© 2026 Zyperia. All rights reserved.</p>
      </footer>
    </main>
  )
}
