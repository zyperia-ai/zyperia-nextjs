'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ArticleContentProps {
  content: string
}

export default function ArticleContent({ content }: ArticleContentProps) {
  if (!content) return null

  // Remove the leading H1 if present (the page already shows the title separately)
  const stripped = content.replace(/^\s*#\s+.+?(\r?\n|$)/, '').trimStart()

  return (
    <div className="prose-zyperia">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="h-display text-3xl md:text-4xl mt-12 mb-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="h-display text-2xl md:text-3xl mt-10 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="h-display text-xl md:text-2xl mt-8 mb-3">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="h-display text-lg md:text-xl mt-6 mb-2">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-base leading-relaxed mb-5 text-[var(--text-secondary)]">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-5 space-y-2 text-[var(--text-secondary)]">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-5 space-y-2 text-[var(--text-secondary)]">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline text-[var(--brand-primary)] hover:opacity-80 transition-opacity"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[var(--brand-primary)] pl-4 my-6 italic text-[var(--text-secondary)]">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return <code className="px-1.5 py-0.5 rounded bg-white/10 text-sm font-mono">{children}</code>
            }
            return (
              <code className="block p-4 rounded bg-white/5 text-sm font-mono overflow-x-auto">{children}</code>
            )
          },
          pre: ({ children }) => <pre className="my-5">{children}</pre>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="border-b border-white/20">{children}</thead>,
          th: ({ children }) => (
            <th className="text-left py-2 px-3 text-xs h-mono uppercase tracking-wider text-[var(--text-muted)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-2 px-3 border-b border-white/5 text-sm text-[var(--text-secondary)]">{children}</td>
          ),
          hr: () => <hr className="my-10 border-white/10" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="max-w-full h-auto rounded-lg my-6 border border-white/10"
            />
          ),
        }}
      >
        {stripped}
      </ReactMarkdown>
    </div>
  )
}
