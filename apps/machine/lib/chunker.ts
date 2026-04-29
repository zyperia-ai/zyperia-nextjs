export function splitIntoChunks(text: string): string[] {
  const MIN_CHUNK = 1500
  const MAX_CHUNK = 3500

  if (text.length <= MAX_CHUNK) {
    return [text.trim()]
  }

  const chunks: string[] = []
  let remaining = text.trim()

  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHUNK) {
      chunks.push(remaining.trim())
      break
    }

    const slice = remaining.slice(0, MAX_CHUNK)
    const lastDoubleNewline = slice.lastIndexOf('\n\n')
    const lastNewline = slice.lastIndexOf('\n')
    const lastPeriod = slice.lastIndexOf('. ')

    let cutPoint: number
    if (lastDoubleNewline > MIN_CHUNK) {
      cutPoint = lastDoubleNewline + 2
    } else if (lastNewline > MIN_CHUNK) {
      cutPoint = lastNewline + 1
    } else if (lastPeriod > MIN_CHUNK) {
      cutPoint = lastPeriod + 2
    } else {
      cutPoint = MAX_CHUNK
    }

    chunks.push(remaining.slice(0, cutPoint).trim())
    remaining = remaining.slice(cutPoint).trim()
  }

  return chunks.filter(c => c.length > 0)
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length
}
