export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold mt-8 mb-4">Agreement</h2>
            <p className="text-gray-300 mb-6">By using ZYPERIA Business, you agree to these terms and conditions. These terms apply to all users and the entire website.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Use License</h2>
            <p className="text-gray-300 mb-6">You are granted a limited, non-exclusive, non-transferable license to access and use the content on our website for personal, non-commercial use only.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimer</h2>
            <p className="text-gray-300 mb-6">Materials are provided 'as is'. We make no warranties and disclaim all liabilities related to your use of the website.</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-gray-300">Questions? Email legal@zyperia.ai</p>
          </div>
        </div>
      </section>
    </div>
  )
}
