/**
 * Stage 0: Competitive Intelligence
 * Analyze top 20 Google results for competitive insights
 */

interface CompetitorAnalysis {
  topic: string;
  topArticles: any[];
  contentGaps: string[];
  recommendedApproach: 'original' | 'transformed' | 'aggregated';
}

export async function analyzeCompetitors(
  topic: string,
  serpApiKey: string
): Promise<CompetitorAnalysis> {
  const response = await fetch(
    `https://serpapi.com/search?q=${encodeURIComponent(topic)}&api_key=${serpApiKey}`
  );
  const data = await response.json();
  const results = data.organic_results?.slice(0, 20) || [];

  const contentGaps = identifyContentGaps(topic, results);
  const approach = determineApproach(results.length, contentGaps.length);

  return {
    topic,
    topArticles: results.map((r: any) => ({
      url: r.link,
      title: r.title,
      domain: new URL(r.link).hostname,
    })),
    contentGaps,
    recommendedApproach: approach,
  };
}

function identifyContentGaps(topic: string, results: any[]): string[] {
  const gaps = [
    'Opportunity for unique angle',
    'Updated 2024+ data',
    'Better visual content',
    'Step-by-step guide format',
  ];
  return gaps;
}

function determineApproach(
  count: number,
  gapCount: number
): 'original' | 'transformed' | 'aggregated' {
  if (count < 5) return 'original';
  if (count > 15) return 'aggregated';
  return 'transformed';
}
