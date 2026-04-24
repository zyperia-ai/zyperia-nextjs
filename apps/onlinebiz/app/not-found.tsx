import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="text-9xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          404
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          The page doesn't exist, but there are plenty of money-making strategies waiting for you!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="p-4 bg-green-100 border border-green-300 rounded-lg hover:border-green-500 transition group"
          >
            <div className="text-2xl mb-2">🏠</div>
            <div className="font-semibold text-gray-900 group-hover:text-green-600">Home</div>
            <div className="text-sm text-gray-600">Back to homepage</div>
          </Link>

          <Link
            href="/blog"
            className="p-4 bg-emerald-100 border border-emerald-300 rounded-lg hover:border-emerald-500 transition group"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-gray-900 group-hover:text-emerald-600">Strategies</div>
            <div className="text-sm text-gray-600">Read all strategies</div>
          </Link>

          <Link
            href="/search"
            className="p-4 bg-green-100 border border-green-300 rounded-lg hover:border-green-500 transition group"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold text-gray-900 group-hover:text-green-600">Search</div>
            <div className="text-sm text-gray-600">Find strategies</div>
          </Link>
        </div>

        <div>
          <p className="text-gray-600 mb-4">Popular income streams:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Freelancing', 'Passive Income', 'Digital Products', 'Affiliate', 'Side Hustles'].map((category) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full transition text-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600">
            Need help? <Link href="/contact" className="text-green-600 hover:text-green-700">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
