export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">Guia Completo de Crypto</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Aprenda sobre Bitcoin, Ethereum, DeFi, segurança e trading. Conteúdo atualizado diariamente.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Artigos Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2">Artigo {i + 1}</h3>
              <p className="text-gray-600 text-sm">Em breve: conteúdo gerado automaticamente por IA...</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
