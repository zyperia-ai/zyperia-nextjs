export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-gray-300 mb-6">
              By accessing and using the ZYPERIA Intelligence website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Use License</h2>
            <p className="text-gray-300 mb-4">
              Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimer</h2>
            <p className="text-gray-300 mb-6">
              The materials on ZYPERIA Intelligence are provided on an 'as is' basis. ZYPERIA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Limitations</h2>
            <p className="text-gray-300 mb-6">
              In no event shall ZYPERIA or its suppliers be liable for any damages arising out of the use or inability to use the materials on the website.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms, please contact us at legal@zyperia.ai
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
