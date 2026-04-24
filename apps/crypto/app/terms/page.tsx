export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-gray-300 mb-6">
              By accessing and using the ZYPERIA website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Use License</h2>
            <p className="text-gray-300 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on ZYPERIA for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose</li>
              <li>Attempting to decompile or reverse engineer any software contained on ZYPERIA</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimer</h2>
            <p className="text-gray-300 mb-6">
              The materials on ZYPERIA are provided on an 'as is' basis. ZYPERIA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Limitations</h2>
            <p className="text-gray-300 mb-6">
              In no event shall ZYPERIA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ZYPERIA.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Accuracy of Materials</h2>
            <p className="text-gray-300 mb-6">
              The materials appearing on ZYPERIA could include technical, typographical, or photographic errors. ZYPERIA does not warrant that any of the materials on the website are accurate, complete, or current. ZYPERIA may make changes to the materials contained on the website at any time without notice.
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
