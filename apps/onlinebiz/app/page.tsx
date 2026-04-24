import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src="/HeroBanner_OnlineBiz_1920x800.png"
          alt="Online Business Blog"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="relative w-32 h-32">
              <Image
                src="/ZYPERIA ONLINEBIZ LOGO.png"
                alt="Online Business"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Online Business
          </h1>
          <p className="text-lg text-slate-300 mb-6">
            Build, scale, and monetize your online business. From SaaS to digital
            products, master entrepreneurship.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition text-sm">
            📧 Subscribe
          </button>
          <button className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition text-sm">
            📚 Read More
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="text-base font-bold text-white mb-1">Monetization</h3>
            <p className="text-sm text-slate-400">Multiple revenue streams</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="text-base font-bold text-white mb-1">Growth</h3>
            <p className="text-sm text-slate-400">Scale your business</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-base font-bold text-white mb-1">Systems</h3>
            <p className="text-sm text-slate-400">Build systems that scale</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-400 text-sm">
        <p>© 2026 Zyperia. All rights reserved.</p>
      </footer>
    </main>
  )
}
