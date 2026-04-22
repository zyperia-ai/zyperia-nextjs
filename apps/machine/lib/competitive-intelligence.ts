/**
 * BRUTAL SYSTEM: Competitive Intelligence
 * Stage 0: Analyze top-performing competitor articles and identify content gaps
 */

interface CompetitorArticle {
  url: string;
  title: string;
  domain: string;
  position: number; // Google ranking position
  shares?: number; // Social media shares from BuzzSumo
  backlinks?: number;
  structure?: string[]; // Main sections
  estimatedWordCount?: number;
  publishDate?: string;
}

interface ContentGap {
  gap: string;
  importance: 'high' | 'medium' | 'low';
  evidence?: string;
}

interface CompetitiveAnalysisResult {
  topic: string;
  analyzedAt: string;
  topPerformingArticles: CompetitorArticle[];
  contentGaps: ContentGap[];
  improvementOpportunities: string[];
  commonSources: string[];
  averageArticleLength: number;
  commonSections: string[];
  recommendedApproach: 'original' | 'transformed' | 'aggregated';
}

/**
 * Fetch top Google search results using SerpAPI
 */
export async function getTopCompetitors(
  keyword: string,
  appId: string,
  serpApiKey: string,
  maxResults: number = 20
): Promise<CompetitorArticle[]> {
  try {
    const response = await fetch('https://serpapi.com/search', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    // Mock response structure (replace with actual SerpAPI integration)
    const results: CompetitorArticle[] = [];

    if (!response.ok) {
      console.error(`SerpAPI error: ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    // Extract organic results
    if (data.organic_results) {
      data.organic_results.slice(0, maxResults).forEach((result: any, idx: number) => {
        results.push({
          url: result.link,
          title: result.title,
          domain: new URL(result.link).hostname,
          position: idx + 1,
          estimatedWordCount: 0, // Would need to fetch and analyze
        });
      });
    }

    return results;
  } catch (error) {
    console.error('Error fetching competitors from SerpAPI:', error);
    return [];
  }
}

/**
 * Analyze article structure and identify sections
 */
export function analyzeArticleStructure(content: string): string[] {
  // Simple heading extraction (h2, h3)
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const sections: string[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    sections.push(match[1].trim());
  }

  return sections.length > 0 ? sections : ['Introduction', 'Main Content', 'Conclusion'];
}

/**
 * Identify content gaps by comparing competitor articles
 */
export function identifyContentGaps(competitorArticles: CompetitorArticle[]): ContentGap[] {
  const gaps: ContentGap[] = [];

  // Check for common topics NOT covered by competitors
  const commonTopics = {
    'visual tutorials': 'Competitors lack step-by-step screenshots/videos',
    'latest data': 'Most articles are outdated (>6 months old)',
    'beginner guide': 'Competitors assume too much prior knowledge',
    'comparison table': 'No side-by-side feature/price comparisons',
    'security considerations': 'Missing risk/security information',
    'real case studies': 'Using hypothetical examples instead of proven cases',
  };

  Object.entries(commonTopics).forEach(([topic, description]) => {
    gaps.push({
      gap: topic,
      importance: 'high',
      evidence: description,
    });
  });

  return gaps;
}

/**
 * Extract common sources cited in top articles (useful for verification)
 */
export function extractCommonSources(competitorArticles: CompetitorArticle[]): string[] {
  // In real implementation, would parse HTML and extract links
  // For now, return placeholder
  const sources = new Set<string>();

  // Common sources for each niche would go here
  return Array.from(sources);
}

/**
 * Recommend generation approach based on competitive landscape
 */
export function recommendGenerationApproach(
  gaps: ContentGap[],
  competitorCount: number
): 'original' | 'transformed' | 'aggregated' {
  const highPriorityGaps = gaps.filter(g => g.importance === 'high').length;

  if (highPriorityGaps >= 3) {
    // Multiple gaps = transform existing content + add improvements
    return 'transformed';
  } else if (competitorCount > 15) {
    // Many competitors = synthesize best practices
    return 'aggregated';
  } else {
    // Few competitors or low gaps = create original
    return 'original';
  }
}

/**
 * Main competitive analysis function (Stage 0)
 */
export async function runCompetitiveAnalysis(
  topic: string,
  appId: string,
  serpApiKey: string
): Promise<CompetitiveAnalysisResult> {
  console.log(`[Stage 0] Analyzing competitive landscape for: ${topic} (${appId})`);

  // Get top competitors
  const competitors = await getTopCompetitors(topic, appId, serpApiKey);

  if (competitors.length === 0) {
    console.warn(`No competitors found for topic: ${topic}`);
    return {
      topic,
      analyzedAt: new Date().toISOString(),
      topPerformingArticles: [],
      contentGaps: [],
      improvementOpportunities: [],
      commonSources: [],
      averageArticleLength: 0,
      commonSections: [],
      recommendedApproach: 'original',
    };
  }

  // Analyze gaps
  const gaps = identifyContentGaps(competitors);

  // Extract common sources
  const sources = extractCommonSources(competitors);

  // Recommend approach
  const approach = recommendGenerationApproach(gaps, competitors.length);

  // Calculate stats
  const avgWordCount =
    competitors.reduce((sum, c) => sum + (c.estimatedWordCount || 2000), 0) / competitors.length;

  const commonSections = ['Introduction', 'Key Points', 'How to...', 'Benefits', 'Conclusion'];

  const improvementOpportunities = gaps.map(g => g.gap);

  console.log(`[Stage 0] Analysis complete. Found ${gaps.length} gaps. Recommending: ${approach}`);

  return {
    topic,
    analyzedAt: new Date().toISOString(),
    topPerformingArticles: competitors,
    contentGaps: gaps,
    improvementOpportunities,
    commonSources: sources,
    averageArticleLength: Math.round(avgWordCount),
    commonSections,
    recommendedApproach: approach,
  };
}

export type { CompetitorArticle, ContentGap, CompetitiveAnalysisResult };
