import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container-narrow max-w-md text-center">
        <span className="kicker mb-6 mx-auto">Erro 404</span>
        <h1 className="h-display text-6xl md:text-8xl mb-6">
          <span className="text-brand-gradient">Página não encontrada.</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto mb-10">
          A página que procuravas ou nunca existiu, ou mudou-se para uma
          vizinhança melhor.
        </p>
        <Link href="/" className="btn-primary">
          <ArrowLeft size={18} /> Voltar ao início
        </Link>
      </div>
    </div>
  );
}
