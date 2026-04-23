import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-purple-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold text-purple-900">
            🎯 ZYPERIA
          </h1>
          <p className="text-purple-600">Expert Content in Your Domain</p>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-5xl font-bold text-gray-900">
            The Best Content<br />
            <span className="text-purple-600">In Your Field</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Three expert blogs delivering actionable insights on Cryptocurrency,
            AI & Business Automation, and How to Earn Online.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {/* Crypto */}
          <Link href="/crypto">
            <div className="group cursor-pointer rounded-2xl border-2 border-blue-200 bg-white p-8 transition-all hover:border-blue-500 hover:shadow-lg">
              <div className="mb-4 text-5xl">🔐</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Crypto & Blockchain
              </h3>
              <p className="mb-6 text-gray-600">
                Expert insights on cryptocurrency trading, security, wallets,
                DeFi, and blockchain technology.
              </p>
              <div className="inline-block rounded-lg bg-blue-100 px-4 py-2 text-blue-700 font-semibold group-hover:bg-blue-200">
                Explore Blog →
              </div>
            </div>
          </Link>

          {/* Intelligence */}
          <Link href="/intelligence">
            <div className="group cursor-pointer rounded-2xl border-2 border-purple-200 bg-white p-8 transition-all hover:border-purple-500 hover:shadow-lg">
              <div className="mb-4 text-5xl">🤖</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                AI & Business Automation
              </h3>
              <p className="mb-6 text-gray-600">
                Practical guides on using AI tools to automate business
                processes and boost productivity.
              </p>
              <div className="inline-block rounded-lg bg-purple-100 px-4 py-2 text-purple-700 font-semibold group-hover:bg-purple-200">
                Explore Blog →
              </div>
            </div>
          </Link>

          {/* Onlinebiz */}
          <Link href="/onlinebiz">
            <div className="group cursor-pointer rounded-2xl border-2 border-green-200 bg-white p-8 transition-all hover:border-green-500 hover:shadow-lg">
              <div className="mb-4 text-5xl">💰</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                How to Earn Online
              </h3>
              <p className="mb-6 text-gray-600">
                Real strategies for earning money online through side hustles,
                passive income, and digital products.
              </p>
              <div className="inline-block rounded-lg bg-green-100 px-4 py-2 text-green-700 font-semibold group-hover:bg-green-200">
                Explore Blog →
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <section className="mb-16 rounded-2xl bg-white p-12">
          <h3 className="mb-8 text-center text-3xl font-bold text-gray-900">
            What You'll Get
          </h3>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="text-3xl">📧</div>
              <div>
                <h4 className="mb-2 font-bold text-gray-900">
                  Weekly Newsletters
                </h4>
                <p className="text-gray-600">
                  Curated insights delivered to your inbox every week.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">✍️</div>
              <div>
                <h4 className="mb-2 font-bold text-gray-900">
                  Expert Articles
                </h4>
                <p className="text-gray-600">
                  In-depth guides written by industry experts.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🎓</div>
              <div>
                <h4 className="mb-2 font-bold text-gray-900">
                  Actionable Tips
                </h4>
                <p className="text-gray-600">
                  Real strategies you can implement today.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🚀</div>
              <div>
                <h4 className="mb-2 font-bold text-gray-900">
                  Exclusive Access
                </h4>
                <p className="text-gray-600">
                  Early access to new content and resources.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-12 text-center text-white">
          <h3 className="mb-4 text-3xl font-bold">
            Choose Your Topic & Start Learning
          </h3>
          <p className="mb-8 text-lg opacity-90">
            Pick the blog that interests you most and dive into expert content.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/crypto"
              className="rounded-lg bg-white px-8 py-3 font-bold text-purple-600 transition-all hover:scale-105"
            >
              Crypto Blog
            </Link>
            <Link
              href="/intelligence"
              className="rounded-lg bg-white px-8 py-3 font-bold text-purple-600 transition-all hover:scale-105"
            >
              AI Blog
            </Link>
            <Link
              href="/onlinebiz"
              className="rounded-lg bg-white px-8 py-3 font-bold text-purple-600 transition-all hover:scale-105"
            >
              Earn Online Blog
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="mb-4 font-bold text-gray-900">ZYPERIA</h4>
              <p className="text-sm text-gray-600">
                Expert content on cryptocurrency, AI, and earning online.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-gray-900">Blogs</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/crypto"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Crypto & Blockchain
                  </Link>
                </li>
                <li>
                  <Link
                    href="/intelligence"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    AI & Automation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/onlinebiz"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    Earn Online
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-gray-900">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Newsletter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold text-gray-900">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:hello@zyperia.ai"
                    className="text-gray-600 hover:text-purple-600"
                  >
                    hello@zyperia.ai
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2026 ZYPERIA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
