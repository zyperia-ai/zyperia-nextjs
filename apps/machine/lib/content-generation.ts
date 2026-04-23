/**
 * Stage 2: Multi-Approach Content Generation
 * Original, Transformed, and Aggregated content strategies
 */

export interface GeneratedArticle {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  keywords: string[];
  approach: 'original' | 'transformed' | 'aggregated';
  transformationOf?: string;
  confidenceScore: number;
}

export async function generateOriginal(
  topic: string,
  research: any,
  anthropicKey: string
): Promise<GeneratedArticle> {
  const prompt = `Write an original, detailed article about "${topic}" 
    Angle: ${research.angle}
    Key points: ${research.keyPoints.join(', ')}
    Target audience: Beginners to intermediate
    Length: 2000-2500 words`;

  const content = await callLLM(prompt, anthropicKey);

  return {
    title: generateTitle(topic, 'original'),
    slug: topicToSlug(topic),
    content,
    excerpt: content.substring(0, 200),
    metaDescription: generateMetaDescription(topic),
    keywords: generateKeywords(topic),
    approach: 'original',
    confidenceScore: 88,
  };
}

export async function generateTransformed(
  topic: string,
  research: any,
  competitorArticle: string,
  anthropicKey: string
): Promise<GeneratedArticle> {
  const prompt = `Improve this article with:
    1. 2024 data updates
    2. Better explanations
    3. Original insights
    
    Original article: ${competitorArticle.substring(0, 500)}...
    
    Make it substantially different (>30% new content)`;

  const content = await callLLM(prompt, anthropicKey);

  return {
    title: generateTitle(topic, 'improved'),
    slug: topicToSlug(topic),
    content,
    excerpt: content.substring(0, 200),
    metaDescription: generateMetaDescription(topic),
    keywords: generateKeywords(topic),
    approach: 'transformed',
    transformationOf: 'competitor_url',
    confidenceScore: 82,
  };
}

export async function generateAggregated(
  topic: string,
  sources: string[],
  anthropicKey: string
): Promise<GeneratedArticle> {
  const prompt = `Create a comprehensive synthesis of these sources on "${topic}":
    Sources: ${sources.join(', ')}
    
    Include: consensus points, unique perspectives, and original analysis`;

  const content = await callLLM(prompt, anthropicKey);

  return {
    title: `The Complete Guide to ${topic}`,
    slug: topicToSlug(topic),
    content,
    excerpt: content.substring(0, 200),
    metaDescription: generateMetaDescription(topic),
    keywords: generateKeywords(topic),
    approach: 'aggregated',
    confidenceScore: 79,
  };
}

async function callLLM(prompt: string, apiKey: string): Promise<string> {
  // Placeholder: would call Claude API
  return `Generated content for: ${prompt.substring(0, 50)}...`;
}

function generateTitle(topic: string, type: string): string {
  const titles: Record<string, string[]> = {
    original: [`The Ultimate Guide to ${topic}`, `Complete ${topic} Handbook`],
    improved: [`Why ${topic} is Better Than You Think`, `Advanced ${topic} Strategies`],
    aggregated: [`State of ${topic} in 2024`, `${topic}: Everything You Need to Know`],
  };
  const options = titles[type] || [`${topic}: What You Need to Know`];
  return options[0];
}

function generateMetaDescription(topic: string): string {
  return `Learn everything about ${topic}. Comprehensive guide with examples, tips, and best practices.`;
}

function generateKeywords(topic: string): string[] {
  return [topic, `${topic} guide`, `how to ${topic}`, `${topic} tips`, `${topic} 2024`];
}

function topicToSlug(topic: string): string {
  return topic.toLowerCase().replace(/\s+/g, '-');
}
