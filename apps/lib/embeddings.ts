export async function generateEmbedding(text: string): Promise<number[]> {
  const voyageKey = process.env.VOYAGE_API_KEY

  if (!voyageKey) {
    throw new Error('VOYAGE_API_KEY não configurada no .env.local')
  }

  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${voyageKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'voyage-4-lite',
      input: text.slice(0, 8000),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Voyage AI error: ${error}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

export function textForEmbedding(article: {
  title: string
  excerpt?: string | null
  content: string
}): string {
  return `${article.title}\n\n${article.excerpt || ''}\n\n${article.content.slice(0, 2000)}`
}
