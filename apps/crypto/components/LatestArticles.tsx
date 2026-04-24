import ArticleCard, { type ArticleCardData } from "./ArticleCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function fetchLatest(): Promise<ArticleCardData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
    const res = await fetch(`${baseUrl}/api/articles?limit=6&status=published`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 min
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return [];
  }
}

export default async function LatestArticles() {
  const articles = await fetchLatest();

  // Empty state — happens before content machine seeds
  if (articles.length === 0) {
    return (
      <section className="relative py-16 md:py-24 border-t border-white/5">
        <div className="container-narrow text-center">
          <span className="kicker mb-4 mx-auto">Recentes</span>
          <h2 className="h-display text-3xl md:text-4xl mb-4">
            As primeiras análises estão a caminho.
          </h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto mb-8">
            A mesa de pesquisa está a aquecer. Subscreve e recebe os primeiros números
            no teu email no dia em que saírem.
          </p>
          <Link href="#newsletter" className="btn-primary">
            Subscrever para o lançamento <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-24 border-t border-white/5">
      <div className="container-narrow">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <span className="kicker mb-3">Recentes</span>
            <h2 className="h-display text-3xl md:text-4xl mt-2">
              Análise fresca.
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-highlight)] transition-colors flex items-center gap-1"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
