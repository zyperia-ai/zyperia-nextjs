import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          404
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist. But there are plenty of AI and automation guides waiting for you!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="p-4 bg-blue-100 border border-blue-300 rounded-lg hover:border-blue-500 transition group"
          >
            <div className="text-2xl mb-2">🏠</div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600">Home</div>
            <div className="text-sm text-gray-600">Back to homepage</div>
          </Link>

          <Link
            href="/blog"
            className="p-4 bg-cyan-100 border border-cyan-300 rounded-lg hover:border-cyan-500 transition group"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold text-gray-900 group-hover:text-cyan-600">Guides</div>
            <div className="text-sm text-gray-600">Read all guides</div>
          </Link>

          <Link
            href="/search"
            className="p-4 bg-blue-100 border border-blue-300 rounded-lg hover:border-blue-500 transition group"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600">Search</div>
            <div className="text-sm text-gray-600">Find guides</div>
          </Link>
        </div>

        <div>
          <p className="text-gray-600 mb-4">Popular topics:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Zapier', 'Claude', 'ChatGPT', 'Automation', 'Content'].map((category) => (
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
            Need help? <Link href="/contact" className="text-blue-600 hover:text-blue-700">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
