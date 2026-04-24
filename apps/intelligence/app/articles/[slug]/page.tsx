import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ArticleCard from '@/components/ArticleCard'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  published_at: string
  author_byline?: string
  views: number
  reading_time_minutes?: number
  tags?: string[]
  featured_image_url?: string
}

async function fetchArticle(slug: string): Promise<Article> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/articles/${slug}`, {
      cache: 'no-store'
    })

    if (!response.ok || response.status === 404) {
      notFound()
    }

    const data = await response.json()

    if (!data.article || data.article === null || data.article === undefined) {
      notFound()
    }

    return data.article
  } catch (err) {
    notFound()
  }
}

async function fetchRelatedArticles(slug: string): Promise<Article[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/articles/related/${slug}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.articles || []
  } catch {
    return []
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const article = await fetchArticle(slug)
  const relatedArticles = await fetchRelatedArticles(slug)

  const dateStr = new Date(article.published_at).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back link */}
        <Link href="/articles" className="btn-ghost text-sm mb-8 inline-flex items-center gap-2">
          <ArrowLeft size={14} /> Voltar aos playbooks
        </Link>

        {/* Article header */}
        <article>
          <h1 className="h-display text-4xl md:text-5xl mb-4">{article.title}</h1>

          {/* Meta info */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 py-6 border-b border-white/10 mb-8">
            {article.published_at && (
              <span className="text-sm text-[var(--text-secondary)]">{dateStr}</span>
            )}
            {article.reading_time_minutes && (
              <>
                <span className="hidden md:inline text-[var(--text-muted)]">·</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {article.reading_time_minutes} min de leitura
                </span>
              </>
            )}
            {article.views !== undefined && (
              <>
                <span className="hidden md:inline text-[var(--text-muted)]">·</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {article.views.toLocaleString('pt-PT')} visualizações
                </span>
              </>
            )}
          </div>

          {/* Author */}
          {article.author_byline && (
            <div className="mb-8">
              <span className="text-sm text-[var(--text-secondary)]">
                Por <span className="text-white font-medium">{article.author_byline}</span>
              </span>
            </div>
          )}

          {/* Disclosure box */}
          <div className="card p-4 mb-8 text-xs text-[var(--text-secondary)] border-l-2 border-[var(--brand-primary)]">
            <strong className="text-white">Divulgação:</strong> este artigo pode conter links de afiliado.
            Podemos receber uma comissão sem qualquer custo adicional para ti.{' '}
            <Link href="/disclosure" className="underline hover:text-white">
              Lê a nossa política de afiliados
            </Link>.
          </div>

          {/* Content */}
          <div className="prose-zyperia mb-12 leading-relaxed">
            {/* TODO: render article.content as markdown */}
            <p>{article.excerpt}</p>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-12 py-8 border-t border-white/10">
              <div className="text-[10px] h-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Temas
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/articles?tag=${tag}`}
                    className="px-3 py-1.5 rounded-full text-xs h-mono uppercase tracking-wider border border-white/10 text-[var(--text-secondary)] hover:border-white/20 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/10">
            <h2 className="h-display text-2xl md:text-3xl mb-8">Continuar a ler.</h2>
            <div className="grid gap-6">
              {relatedArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article as any} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
