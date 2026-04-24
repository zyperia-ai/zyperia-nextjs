import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ArticleFilters from "@/components/ArticleFilters";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Playbooks — ZYPERIA Intelligence",
  description: "Todos os playbooks sobre LLMs em produção, automação de workflows, e agentes autónomos.",
};

async function getArticles(
  page: number = 1,
  tag?: string,
  q?: string,
  sort: "newest" | "popular" = "newest"
) {
  const limit = 12;
  const offset = (page - 1) * limit;
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ...(tag && { tag }),
    ...(q && { q }),
    ...(sort && { sort }),
  });

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"}/api/articles?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return { articles: [], total: 0 };
    return res.json();
  } catch {
    return { articles: [], total: 0 };
  }
}

export default async function ArticlesPage(props: {
  searchParams?: Promise<{ page?: string; tag?: string; q?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page ?? "1");
  const tag = searchParams?.tag;
  const q = searchParams?.q;
  const sort = (searchParams?.sort as "newest" | "popular") || "newest";

  const { articles, total } = await getArticles(page, tag, q, sort);
  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  const buildUrl = (newPage: number, updates?: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (tag || updates?.tag) params.set("tag", updates?.tag || tag || "");
    if (q || updates?.q) params.set("q", updates?.q || q || "");
    if (sort !== "newest" || updates?.sort) params.set("sort", updates?.sort || sort);
    const str = params.toString();
    return `/articles${str ? `?${str}` : ""}`;
  };

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Kicker + Title */}
        <span className="kicker mb-4">Playbooks</span>
        <h1 className="h-display text-4xl md:text-5xl mb-3">
          {tag ? (
            <>
              Tema: <span className="text-brand-gradient">{tag}</span>
            </>
          ) : q ? (
            <>
              Resultados para <span className="text-brand-gradient">"{q}"</span>
            </>
          ) : (
            <>Todos os playbooks.</>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-[var(--text-secondary)] mb-8">
          {total > 0
            ? `${total} playbook${total === 1 ? "" : "s"} · página ${page} de ${totalPages}`
            : "Ainda não há artigos. Volta em breve ou subscreve para o lançamento."}
        </p>

        {/* Filters */}
        <ArticleFilters activeTag={tag} activeSort={sort} activeQuery={q} />

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <>
            <div className="grid gap-6 mt-12 mb-12">
              {articles.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/10">
                {page > 1 ? (
                  <Link href={buildUrl(page - 1)} className="btn-ghost text-sm flex items-center gap-2">
                    <ArrowLeft size={14} /> Anterior
                  </Link>
                ) : (
                  <div />
                )}
                <span className="h-mono text-xs text-[var(--text-muted)]">
                  Página {page} de {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={buildUrl(page + 1)} className="btn-ghost text-sm flex items-center gap-2">
                    Seguinte <ArrowRight size={14} />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mt-12 text-center">
            <p className="text-[var(--text-secondary)] mb-6">Nada para mostrar com esses filtros.</p>
            <Link href="/articles" className="btn-ghost">
              Limpar filtros
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
