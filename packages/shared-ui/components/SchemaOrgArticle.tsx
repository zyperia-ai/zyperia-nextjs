export interface SchemaOrgArticleProps {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  canonicalUrl: string;
}

/**
 * Renders Schema.org Article markup for SEO
 * Add to your <head> section
 */
export default function SchemaOrgArticle({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  canonicalUrl,
}: SchemaOrgArticleProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: image ? [image] : undefined,
    datePublished: new Date(datePublished).toISOString(),
    dateModified: dateModified ? new Date(dateModified).toISOString() : new Date(datePublished).toISOString(),
    author: {
      '@type': 'Person',
      name: author,
    },
    url: canonicalUrl,
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
