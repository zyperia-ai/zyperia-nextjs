/**
 * Stage 1: Research & Topic Selection
 * Web search for each topic, compile research data, select generation strategy
 */

export interface ResearchData {
  topic: string;
  strategy: 'original' | 'transformed' | 'aggregated';
  sources: string[];
  keyPoints: string[];
  angle: string;
  confidenceScore: number;
}

export async function researchTopic(topic: string, serpApiKey: string): Promise<ResearchData> {
  // Fetch web search results
  const response = await fetch(
    `https://serpapi.com/search?q=${encodeURIComponent(topic)}&api_key=${serpApiKey}`
  );
  const data = await response.json();
  const results = data.organic_results || [];

  const sources = results.slice(0, 5).map((r: any) => r.link);
  const keyPoints = extractKeyPoints(results);
  const angle = determineAngle(topic, results);

  return {
    topic,
    strategy: 'transformed',
    sources,
    keyPoints,
    angle,
    confidenceScore: 85,
  };
}

function extractKeyPoints(results: any[]): string[] {
  return results
    .slice(0, 3)
    .map((r: any) => r.snippet)
    .filter(Boolean);
}

function determineAngle(topic: string, results: any[]): string {
  const angles = [
    'Beginner-friendly explanation',
    'Advanced techniques',
    'Latest 2024 trends',
    'Step-by-step guide',
    'Cost-benefit analysis',
  ];
  return angles[Math.floor(Math.random() * angles.length)];
}
