import { Metadata } from 'next'

interface ArticleSEOProps {
  title: string
  description: string
  slug: string
  image?: string
  publishedAt: string
  author?: string
  keywords?: string[]
}

/**
 * Generate SEO metadata for article pages
 */
export function generateArticleMetadata(
  props: ArticleSEOProps
): Metadata {
  const url = `https://intelligence.zyperia.ai/articles/${props.slug}`
  const image = props.image || 'https://intelligence.zyperia.ai/og-default.jpg'

  return {
    title: props.title,
    description: props.description,
    keywords: props.keywords || [],
    authors: props.author ? [{ name: props.author }] : [],
    openGraph: {
      title: props.title,
      description: props.description,
      url,
      type: 'article',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: props.title,
        },
      ],
      publishedTime: props.publishedAt,
      authors: props.author ? [props.author] : [],
      siteName: 'ZYPERIA Intelligence',
    },
    twitter: {
      card: 'summary_large_image',
      title: props.title,
      description: props.description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

/**
 * Generate JSON-LD structured data for article
 */
export function generateArticleStructuredData(props: ArticleSEOProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    description: props.description,
    image: props.image,
    datePublished: props.publishedAt,
    author: props.author ? {
      '@type': 'Person',
      name: props.author,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'ZYPERIA Intelligence',
      logo: {
        '@type': 'ImageObject',
        url: 'https://intelligence.zyperia.ai/logo.png',
      },
    },
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  title: string,
  slug: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://intelligence.zyperia.ai',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: 'https://intelligence.zyperia.ai/articles',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `https://intelligence.zyperia.ai/articles/${slug}`,
      },
    ],
  }
}
