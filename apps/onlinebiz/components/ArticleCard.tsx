import Link from "next/link";
import { Clock, Eye } from "lucide-react";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  author_byline: string | null;
  published_at: string;
  views?: number;
  reading_time_minutes?: number;
};

const CATEGORY_LABEL = "CASO DE ESTUDO";

export default function ArticleCard({ article }: { article: ArticleCardData }) {
  const dateStr = new Date(article.published_at).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group relative block no-underline border-l-2 border-[var(--brand-primary)]/40 hover:border-[var(--brand-primary)] hover:border-l-4 transition-all duration-200 pl-6 md:pl-8 py-6 md:py-7"
    >
      {/* Top row: category badge + date + meta */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] h-mono uppercase tracking-wider mb-4">
        <span className="text-[var(--brand-primary)]">{CATEGORY_LABEL}</span>
        <span className="text-[var(--text-muted)]">·</span>
        <time dateTime={article.published_at} className="text-[var(--text-muted)]">
          {dateStr}
        </time>
        {article.reading_time_minutes && (
          <>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="flex items-center gap-1 text-[var(--text-muted)]">
              <Clock size={10} /> {article.reading_time_minutes} min
            </span>
          </>
        )}
        {typeof article.views === "number" && article.views > 0 && (
          <>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="flex items-center gap-1 text-[var(--text-muted)]">
              <Eye size={10} /> {article.views.toLocaleString("pt-PT")}
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="h-display text-2xl md:text-3xl mb-3 text-white group-hover:text-[var(--brand-highlight)] transition-colors leading-tight">
        {article.title}
      </h3>

      {/* Excerpt (only if present) */}
      {article.excerpt && (
        <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-3">
          {article.excerpt}
        </p>
      )}

      {/* Author byline (only if present) */}
      {article.author_byline && (
        <div className="text-[10px] h-mono uppercase tracking-wider text-[var(--text-muted)] mt-3">
          Por <span className="text-[var(--text-secondary)]">{article.author_byline}</span>
        </div>
      )}
    </Link>
  );
}
