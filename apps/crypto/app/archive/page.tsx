import { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Arquivo — ZYPERIA Crypto",
  description: "Todos os artigos organizados por data de publicação.",
};

async function getArchivedArticles() {
  try {
    const res = await fetch(`/api/articles?limit=999&status=published`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || [];
  } catch {
    return [];
  }
}

interface MonthGroup {
  year: number;
  month: number;
  monthLabel: string;
  count: number;
  articles: any[];
}

export default async function ArchivePage() {
  const articles = await getArchivedArticles();

  // Group articles by month
  const monthMap = new Map<string, MonthGroup>();

  articles.forEach((article: any) => {
    const date = new Date(article.published_at);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!monthMap.has(key)) {
      monthMap.set(key, {
        year,
        month,
        monthLabel: date.toLocaleDateString("pt-PT", { month: "long" }),
        count: 0,
        articles: [],
      });
    }

    const group = monthMap.get(key)!;
    group.count++;
    group.articles.push(article);
  });

  // Sort by date descending
  const months = Array.from(monthMap.values())
    .sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });

  return (
    <main className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <span className="kicker mb-4">Arquivo</span>
        <h1 className="h-display text-4xl md:text-5xl mb-8">Todos os artigos, por data.</h1>

        {/* Content */}
        {months.length === 0 ? (
          <p className="text-[var(--text-secondary)]">Ainda não há artigos.</p>
        ) : (
          <div className="space-y-12">
            {months.map((month) => (
              <div key={`${month.year}-${month.month}`}>
                {/* Month header */}
                <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-3">
                    <span className="h-display text-xl capitalize">{month.monthLabel}</span>
                    <span className="text-lg text-[var(--text-secondary)]">{month.year}</span>
                  </div>
                  <span className="text-xs h-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {month.count} artigo{month.count === 1 ? "" : "s"}
                  </span>
                </div>

                {/* Month articles */}
                <div className="grid gap-6 mb-12">
                  {month.articles.map((article: any) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
