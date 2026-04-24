import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

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

export default function ArticleCard({ article }: { article: ArticleCardData }) {
  const dateStr = new Date(article.published_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="card overflow-hidden group flex flex-col no-underline"
    >
      <div className="relative aspect-[16/9] bg-[var(--surface-2)] overflow-hidden">
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]">
            <div className="h-display text-3xl opacity-20">Z</div>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[10px] h-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
          <time dateTime={article.published_at}>{dateStr}</time>
          {article.reading_time_minutes && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock size={10} /> {article.reading_time_minutes} min
              </span>
            </>
          )}
        </div>
        <h3 className="h-display text-lg md:text-xl mb-2 text-white group-hover:text-[var(--brand-highlight)] transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-1">
            {article.excerpt}
          </p>
        )}
        {article.author_byline && (
          <div className="text-[10px] h-mono uppercase tracking-wider text-[var(--text-muted)] mt-4">
            By {article.author_byline}
          </div>
        )}
      </div>
    </Link>
  );
}
