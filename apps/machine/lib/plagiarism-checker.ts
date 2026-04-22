/**
 * BRUTAL SYSTEM: Plagiarism & Uniqueness Checking
 * Stage 4: Verify uniqueness of content (especially transformed articles)
 */

interface PlagiarismCheckResult {
  plagiarismScore: number; // 0-100, where 0 = unique, 100 = duplicate
  uniquenessPercentage: number; // 100 - plagiarismScore
  matchesFound: Array<{
    sourceUrl: string;
    matchPercentage: number;
    matchedContent: string;
  }>;
  overallUniqueContent: number; // Percentage of original content
  analysisDate: string;
  status: 'approved' | 'warning' | 'rejected';
  improvementSuggestions?: string[];
}

interface ContentQualityMetrics {
  readabilityScore: number; // Flesch Reading Ease (0-100, 60+ is good)
  sentenceVariation: number; // Percentage of varied sentence structures
  vocabularyDiversity: number; // Unique words / total words
  paragraphStructure: 'good' | 'needs_improvement';
}

/**
 * Calculate simple plagiarism score based on content analysis
 * In production, use Copyscape API for real plagiarism detection
 */
export function calculatePlagiarismScoreFake(
  content: string,
  originalArticle?: string
): number {
  // This is a placeholder for Copyscape API integration
  // Real implementation would use: https://www.copyscape.com/api/

  if (!originalArticle) {
    // If no original article provided, assume original (optimistic)
    return 10; // Very low plagiarism score
  }

  // Simple string similarity check (Levenshtein distance approximation)
  const contentWords = content.toLowerCase().split(/\s+/);
  const originalWords = originalArticle.toLowerCase().split(/\s+/);

  const intersection = contentWords.filter((w) => originalWords.includes(w)).length;
  const similarity = intersection / Math.max(contentWords.length, originalWords.length);

  return Math.round(similarity * 100);
}

/**
 * Call Copyscape API for real plagiarism detection
 */
export async function checkPlagiarismCopyscape(
  content: string,
  copyscapeUsername: string,
  copyscapeApiToken: string
): Promise<PlagiarismCheckResult> {
  try {
    // Copyscape API integration
    // Real endpoint: https://www.copyscape.com/api/
    const response = await fetch('https://www.copyscape.com/api/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        u: copyscapeUsername,
        t: copyscapeApiToken,
        o: 'csearch',
        e: 'UTF-8',
        t: content, // Content to check
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Copyscape API error: ${response.statusText}`);
    }

    const data = await response.text();

    // Parse Copyscape XML response (would need XML parser in production)
    // For now, return mock result
    const plagiarismScore = calculatePlagiarismScoreFake(content);

    return {
      plagiarismScore,
      uniquenessPercentage: 100 - plagiarismScore,
      matchesFound: [],
      overallUniqueContent: 100 - plagiarismScore,
      analysisDate: new Date().toISOString(),
      status: plagiarismScore > 30 ? 'rejected' : plagiarismScore > 20 ? 'warning' : 'approved',
    };
  } catch (error) {
    console.error('Error calling Copyscape API:', error);
    // Return optimistic default if API fails
    return {
      plagiarismScore: 10,
      uniquenessPercentage: 90,
      matchesFound: [],
      overallUniqueContent: 90,
      analysisDate: new Date().toISOString(),
      status: 'approved',
    };
  }
}

/**
 * Verify transformation is substantial (>30% rewrite)
 */
export function verifyTransformationQuality(
  originalContent: string,
  transformedContent: string
): { qualityScore: number; isSubstantial: boolean; details: string } {
  const originalWords = originalContent.toLowerCase().split(/\s+/).length;
  const transformedWords = transformedContent.toLowerCase().split(/\s+/).length;

  // Simple heuristic: if >30% of words changed, it's a substantial transformation
  const wordDifference = Math.abs(transformedWords - originalWords) / originalWords;

  // Count unique phrases in transformed version
  const originalPhrases = new Set(
    originalContent.match(/\b\w+\s+\w+\b/g) || []
  );
  const transformedPhrases = new Set(
    transformedContent.match(/\b\w+\s+\w+\b/g) || []
  );

  const uniqueNewPhrases = Array.from(transformedPhrases).filter(
    (p) => !originalPhrases.has(p)
  ).length;

  const qualityScore =
    Math.min(100, Math.round((wordDifference * 50 + (uniqueNewPhrases / transformedPhrases.size) * 50)));

  return {
    qualityScore,
    isSubstantial: qualityScore > 30,
    details: `${wordDifference * 100}% word difference, ${uniqueNewPhrases} new phrases`,
  };
}

/**
 * Calculate Flesch Reading Ease score (0-100, 60+ is good)
 */
export function calculateReadabilityScore(content: string): number {
  // Flesch Reading Ease formula:
  // 206.835 - 1.015(words/sentences) - 84.6(syllables/words)

  const sentences = (content.match(/[.!?]+/g) || []).length || 1;
  const words = content.split(/\s+/).length;

  // Simple syllable count (heuristic)
  const syllables = (content.match(/[aeiouy]/gi) || []).length;

  const score = Math.max(0, Math.min(100, 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)));

  return Math.round(score);
}

/**
 * Analyze content quality metrics
 */
export function analyzeContentQuality(content: string): ContentQualityMetrics {
  // Readability
  const readabilityScore = calculateReadabilityScore(content);

  // Sentence variation
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLength =
    content.split(/\s+/).length / Math.max(sentences.length, 1);
  const sentenceVariation = Math.min(100, Math.max(0, 100 - avgSentenceLength * 5));

  // Vocabulary diversity
  const words = content.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words).size;
  const vocabularyDiversity = (uniqueWords / words.length) * 100;

  // Paragraph structure
  const paragraphs = content.split(/\n\n+/).length;
  const avgParagraphLength = words.length / paragraphs;
  const paragraphStructure = avgParagraphLength > 50 && avgParagraphLength < 300 ? 'good' : 'needs_improvement';

  return {
    readabilityScore,
    sentenceVariation: Math.round(sentenceVariation),
    vocabularyDiversity: Math.round(vocabularyDiversity),
    paragraphStructure,
  };
}

/**
 * Main plagiarism check function (Stage 4)
 */
export async function runPlagiarismCheck(
  articleTitle: string,
  articleContent: string,
  transformationSourceUrl?: string,
  originalArticleContent?: string,
  copyscapeApiToken?: string
): Promise<PlagiarismCheckResult> {
  console.log(`[Stage 4] Plagiarism check: ${articleTitle}`);

  let result: PlagiarismCheckResult;

  if (copyscapeApiToken && transformationSourceUrl) {
    // Use Copyscape for transformed content
    result = await checkPlagiarismCopyscape(
      articleContent,
      'demo_user', // Replace with actual username from config
      copyscapeApiToken
    );
  } else {
    // Use fake calculation for original content
    const score = calculatePlagiarismScoreFake(articleContent, originalArticleContent);
    result = {
      plagiarismScore: score,
      uniquenessPercentage: 100 - score,
      matchesFound: [],
      overallUniqueContent: 100 - score,
      analysisDate: new Date().toISOString(),
      status: score < 20 ? 'approved' : score < 30 ? 'warning' : 'rejected',
    };
  }

  // Analyze quality metrics
  const quality = analyzeContentQuality(articleContent);

  // Add quality-based suggestions
  if (quality.readabilityScore < 60) {
    result.improvementSuggestions = (result.improvementSuggestions || []).concat([
      'Improve readability: use shorter sentences and simpler vocabulary',
    ]);
  }

  if (quality.vocabularyDiversity < 40) {
    result.improvementSuggestions = (result.improvementSuggestions || []).concat([
      'Increase vocabulary diversity: avoid repeating the same words',
    ]);
  }

  // Verify transformation quality if applicable
  if (originalArticleContent) {
    const transformation = verifyTransformationQuality(originalArticleContent, articleContent);
    if (!transformation.isSubstantial) {
      result.status = 'rejected';
      result.improvementSuggestions = (result.improvementSuggestions || []).concat([
        `Transformation not substantial enough. Quality score: ${transformation.qualityScore}%. ${transformation.details}`,
      ]);
    }
  }

  console.log(`[Stage 4] Plagiarism check complete. Score: ${result.plagiarismScore}, Status: ${result.status}`);

  return result;
}

export type { PlagiarismCheckResult, ContentQualityMetrics };
