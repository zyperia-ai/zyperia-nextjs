"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

const TOP_CATEGORIAS = [
  'OPENAI', 'ANTHROPIC', 'GOOGLE-AI', 'XAI', 'META-AI', 'DEEPSEEK',
  'LLM', 'AGENTS', 'RAG', 'MCP', 'MULTIMODAL',
  'PRODUTIVIDADE', 'AUTOMACAO',
  'ETICA-IA', 'REGULACAO-IA',
] as const;

export default function ArticleFilters({
  activeCategoria,
  activeTag,
  activeSort,
  activeQuery,
}: {
  activeCategoria?: string;
  activeTag?: string;
  activeSort: string;
  activeQuery?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(activeQuery ?? "");

  useEffect(() => setQ(activeQuery ?? ""), [activeQuery]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q); else params.delete("q");
    params.delete("page");
    router.push(`/articles?${params.toString()}`);
  };

  const setSort = (sort: "newest" | "popular") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    router.push(`/articles?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Search + sort row */}
      <div className="flex flex-col md:flex-row gap-3">
        <form onSubmit={submitSearch} className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar artigos…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--surface-1)] border border-white/10 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
          />
        </form>
        <div className="flex gap-2">
          {(["newest", "popular"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-4 py-2.5 rounded-lg text-sm border transition-colors ${
                activeSort === s
                  ? "bg-[var(--brand-soft)] border-[var(--brand-primary)] text-[var(--brand-highlight)]"
                  : "border-white/10 text-[var(--text-secondary)] hover:border-white/20"
              }`}
            >
              {s === "newest" ? "Mais recentes" : "Mais lidos"}
            </button>
          ))}
        </div>
      </div>

      {/* Categoria pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/articles"
          className={`px-3 py-1 rounded-full text-xs h-mono uppercase tracking-wider border transition-colors ${
            !activeCategoria
              ? "bg-[var(--brand-soft)] border-[var(--brand-primary)] text-[var(--brand-highlight)]"
              : "border-white/10 text-[var(--text-secondary)] hover:border-white/20"
          }`}
        >
          Todos
        </Link>
        {TOP_CATEGORIAS.map((categoria) => (
          <Link
            key={categoria}
            href={`/articles?categoria=${categoria}`}
            className={`px-3 py-1 rounded-full text-xs h-mono uppercase tracking-wider border transition-colors ${
              activeCategoria === categoria
                ? "bg-[var(--brand-soft)] border-[var(--brand-primary)] text-[var(--brand-highlight)]"
                : "border-white/10 text-[var(--text-secondary)] hover:border-white/20"
            }`}
          >
            {categoria}
          </Link>
        ))}
      </div>
    </div>
  );
}
