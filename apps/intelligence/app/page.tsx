export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">IA para Negócios</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Automação, produtividade, workflows. Como usar ChatGPT, Claude e IA para crescer seu negócio.
        </p>
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-6">Guias Práticos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="border rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2">Guia {i + 1}</h3>
              <p className="text-gray-600 text-sm">Conteúdo gerado por IA, editado e publicado...</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
