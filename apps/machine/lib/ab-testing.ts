/**
 * A/B Testing System
 * Test different content variations, headlines, CTAs, layouts
 * Measure impact on engagement, CTR, conversion
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)
}

export interface ABTest {
  id?: string;
  appId: string;
  articleId: string;
  testType: 'headline' | 'intro' | 'cta' | 'layout' | 'structure' | 'visual';
  variationA: string;
  variationB: string;
  variant_a_views: number;
  variant_b_views: number;
  variant_a_engagement: number;
  variant_b_engagement: number;
  variant_a_ctr: number;
  variant_b_ctr: number;
  status: 'active' | 'paused' | 'completed';
  started_at?: string;
  ended_at?: string;
  confidence?: number; // Statistical confidence (0-100)
  winner?: 'a' | 'b' | 'tie';
}

/**
 * Create A/B test for an article
 */
export async function createABTest(
  appId: string,
  articleId: string,
  testType: string,
  variationA: string,
  variationB: string
): Promise<boolean> {
  try {
    const { error } = await getSupabase().from('ab_tests').insert({
      app_id: appId,
      article_id: articleId,
      test_type: testType,
      variation_a: variationA,
      variation_b: variationB,
      status: 'active',
      started_at: new Date().toISOString(),
    });

    return !error;
  } catch (error) {
    console.error('Error creating A/B test:', error);
    return false;
  }
}

/**
 * Track page load and assign variant
 */
export function assignVariant(testId: string): 'a' | 'b' {
  // Simple 50/50 split using hash
  // In production: use consistent hashing based on user ID or session
  const hash = hashString(testId);
  return hash % 2 === 0 ? 'a' : 'b';
}

/**
 * Record impression for variant
 */
export async function recordImpression(testId: string, variant: 'a' | 'b'): Promise<void> {
  try {
    const column = variant === 'a' ? 'variant_a_views' : 'variant_b_views';
    const { data } = await getSupabase()
      .from('ab_tests')
      .select(column)
      .eq('id', testId)
      .single();
    if (!data) return;
    await getSupabase()
      .from('ab_tests')
      .update({ [column]: (data[column] || 0) + 1 })
      .eq('id', testId);
  } catch (error) {
    console.error('Error recording impression:', error);
  }
}

/**
 * Record engagement/conversion
 */
export async function recordEngagement(
  testId: string,
  variant: 'a' | 'b',
  metric: 'engagement' | 'ctr'
): Promise<void> {
  try {
    const column = metric === 'engagement' ? `variant_${variant}_engagement` : `variant_${variant}_ctr`;
    const { data } = await getSupabase()
      .from('ab_tests')
      .select(column)
      .eq('id', testId)
      .single();
    if (!data) return;
    await getSupabase()
      .from('ab_tests')
      .update({ [column]: (data[column] || 0) + 1 })
      .eq('id', testId);
  } catch (error) {
    console.error('Error recording engagement:', error);
  }
}

/**
 * Calculate test results and statistical significance
 */
export async function analyzeTest(testId: string): Promise<any> {
  try {
    const { data: test } = await getSupabase().from('ab_tests').select('*').eq('id', testId).single();

    if (!test) return null;

    const variantA = {
      views: test.variant_a_views || 0,
      engagement: test.variant_a_engagement || 0,
      ctr: test.variant_a_ctr || 0,
    };

    const variantB = {
      views: test.variant_b_views || 0,
      engagement: test.variant_b_engagement || 0,
      ctr: test.variant_b_ctr || 0,
    };

    // Calculate engagement rates
    const engagementRateA = variantA.views > 0 ? (variantA.engagement / variantA.views) * 100 : 0;
    const engagementRateB = variantB.views > 0 ? (variantB.engagement / variantB.views) * 100 : 0;

    // Calculate CTR
    const ctrA = variantA.views > 0 ? (variantA.ctr / variantA.views) * 100 : 0;
    const ctrB = variantB.views > 0 ? (variantB.ctr / variantB.views) * 100 : 0;

    // Statistical significance (Chi-square test simplified)
    const confidence = calculateStatisticalSignificance(
      variantA.views,
      variantA.engagement,
      variantB.views,
      variantB.engagement
    );

    // Determine winner
    let winner = 'tie';
    if (confidence > 80) {
      winner = engagementRateA > engagementRateB ? 'a' : 'b';
    }

    return {
      testId,
      testType: test.test_type,
      status: test.status,
      variantA: {
        views: variantA.views,
        engagementRate: engagementRateA.toFixed(2),
        ctrRate: ctrA.toFixed(2),
      },
      variantB: {
        views: variantB.views,
        engagementRate: engagementRateB.toFixed(2),
        ctrRate: ctrB.toFixed(2),
      },
      improvement:
        engagementRateA > 0
          ? (((engagementRateB - engagementRateA) / engagementRateA) * 100).toFixed(1)
          : '0',
      confidence: confidence.toFixed(0),
      winner: confidence > 80 ? winner : 'insufficient_data',
      recommendation:
        confidence > 80
          ? `Variant ${winner.toUpperCase()} is ${Math.abs(parseFloat(confidence.toString()) - 50).toFixed(0)}% better`
          : 'Not enough data for conclusive results',
    };
  } catch (error) {
    console.error('Error analyzing test:', error);
    return null;
  }
}

/**
 * Get recommended variations based on performance data
 */
export async function getHeadlineVariations(
  appId: string,
  topic: string
): Promise<Array<{ headline: string; predictedEngagement: number }>> {
  try {
    // Get top performing articles on similar topics
    const { data: topArticles } = await getSupabase()
      .from('blog_posts')
      .select('title, engagement_score, keywords')
      .eq('app_id', appId)
      .eq('status', 'published')
      .order('engagement_score', { ascending: false })
      .limit(20);

    if (!topArticles || topArticles.length === 0) {
      return generateDefaultVariations(topic);
    }

    // Analyze headline patterns
    const patterns = analyzeHeadlinePatterns(topArticles, topic);

    // Generate variations based on patterns
    return patterns.map((pattern) => ({
      headline: generateHeadline(topic, pattern),
      predictedEngagement: pattern.avgEngagement,
    }));
  } catch (error) {
    console.error('Error getting headline variations:', error);
    return generateDefaultVariations(topic);
  }
}

/**
 * Simple hash function for variant assignment
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Calculate statistical significance using Chi-square test
 */
function calculateStatisticalSignificance(
  group1Size: number,
  group1Conversions: number,
  group2Size: number,
  group2Conversions: number
): number {
  if (group1Size === 0 || group2Size === 0) return 0;

  const p1 = group1Conversions / group1Size;
  const p2 = group2Conversions / group2Size;
  const p = (group1Conversions + group2Conversions) / (group1Size + group2Size);

  const se = Math.sqrt((p * (1 - p)) / group1Size + (p * (1 - p)) / group2Size);
  if (se === 0) return 0;

  const z = (p1 - p2) / se;
  const confidence = Math.min(100, (Math.abs(z) / 1.96) * 50); // Simplified normalization

  return confidence;
}

/**
 * Analyze headline patterns from top articles
 */
function analyzeHeadlinePatterns(
  articles: any[],
  topic: string
): Array<{ pattern: string; avgEngagement: number }> {
  const patterns: Record<string, { count: number; totalEngagement: number }> = {
    how_to: { count: 0, totalEngagement: 0 },
    list: { count: 0, totalEngagement: 0 },
    question: { count: 0, totalEngagement: 0 },
    ultimate_guide: { count: 0, totalEngagement: 0 },
    mistake: { count: 0, totalEngagement: 0 },
  };

  articles.forEach((a) => {
    const title = a.title.toLowerCase();

    if (title.includes('how to')) patterns.how_to.count++;
    if (title.match(/^\d+/)) patterns.list.count++;
    if (title.includes('?')) patterns.question.count++;
    if (title.includes('ultimate') || title.includes('complete')) patterns.ultimate_guide.count++;
    if (title.includes('avoid') || title.includes('mistake')) patterns.mistake.count++;

    const engagement = a.engagement_score || 0;
    if (title.includes('how to')) patterns.how_to.totalEngagement += engagement;
    if (title.match(/^\d+/)) patterns.list.totalEngagement += engagement;
    if (title.includes('?')) patterns.question.totalEngagement += engagement;
    if (title.includes('ultimate') || title.includes('complete')) patterns.ultimate_guide.totalEngagement += engagement;
    if (title.includes('avoid') || title.includes('mistake')) patterns.mistake.totalEngagement += engagement;
  });

  return Object.entries(patterns)
    .map(([pattern, stats]) => ({
      pattern,
      avgEngagement: stats.count > 0 ? stats.totalEngagement / stats.count : 0,
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement);
}

/**
 * Generate headline based on pattern
 */
function generateHeadline(topic: string, pattern: any): string {
  const templates: Record<string, string[]> = {
    how_to: [
      `How to ${topic}: Complete Guide`,
      `How to Master ${topic} in 2026`,
      `Step-by-Step: How to ${topic}`,
    ],
    list: [
      `7 Best ${topic} Tips for Success`,
      `10 ${topic} Strategies That Actually Work`,
      `5 Essential ${topic} Techniques`,
    ],
    question: [`What You Need to Know About ${topic}`, `Is ${topic} Right for You?`],
    ultimate_guide: [
      `The Ultimate Guide to ${topic}`,
      `Complete ${topic} Handbook`,
      `Everything You Need to Know About ${topic}`,
    ],
    mistake: [`5 ${topic} Mistakes to Avoid`, `Common ${topic} Pitfalls and How to Fix Them`],
  };

  const options = templates[pattern.pattern] || templates.how_to;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Default variations if no data available
 */
function generateDefaultVariations(
  topic: string
): Array<{ headline: string; predictedEngagement: number }> {
  return [
    { headline: `How to ${topic}: Complete Guide`, predictedEngagement: 0.65 },
    { headline: `The Ultimate Guide to ${topic}`, predictedEngagement: 0.68 },
    { headline: `7 ${topic} Tips for Success`, predictedEngagement: 0.62 },
    { headline: `Everything About ${topic} You Need to Know`, predictedEngagement: 0.60 },
  ];
}

