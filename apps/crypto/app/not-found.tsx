import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <div className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          404
        </div>

        {/* Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          The page you're looking for might have been moved or doesn't exist. But don't worry, there's plenty of crypto knowledge waiting for you!
        </p>

        {/* Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:border-purple-400 transition group"
          >
            <div className="text-2xl mb-2">🏠</div>
            <div className="font-semibold text-white group-hover:text-purple-300">Home</div>
            <div className="text-sm text-gray-400">Back to homepage</div>
          </Link>

          <Link
            href="/blog"
            className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:border-blue-400 transition group"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-white group-hover:text-blue-300">Blog</div>
            <div className="text-sm text-gray-400">Read all articles</div>
          </Link>

          <Link
            href="/search"
            className="p-4 bg-cyan-600/20 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition group"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold text-white group-hover:text-cyan-300">Search</div>
            <div className="text-sm text-gray-400">Find articles</div>
          </Link>
        </div>

        {/* Popular Links */}
        <div>
          <p className="text-gray-400 mb-4">Popular categories:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Bitcoin', 'Ethereum', 'DeFi', 'Wallets', 'NFTs'].map((category) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase()}`}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition text-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400">
            Need help? <Link href="/contact" className="text-purple-400 hover:text-purple-300">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
