/**
 * SEO Analysis & Ranking Tracker
 * Analyzes SEO performance, tracks keyword rankings, and identifies opportunities
 *
 * Usage:
 * npx ts-node scripts/seo-analysis.ts crypto
 * npx ts-node scripts/seo-analysis.ts crypto track-rankings
 * npx ts-node scripts/seo-analysis.ts crypto keyword-analysis
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface SEOMetrics {
  appId: string;
  totalArticles: number;
  indexedArticles: number;
  averageRank: number;
  topRankingKeywords: Array<{ keyword: string; rank: number; views: number }>;
  improvingKeywords: Array<{ keyword: string; previousRank: number; newRank: number; improvement: number }>;
  decayingKeywords: Array<{ keyword: string; previousRank: number; newRank: number; decay: number }>;
  totalVisibility: number;
  ctr: number;
  backlinks: number;
  topPages: Array<{ title: string; clicks: number; impressions: number; ctr: number; avgRank: number }>;
}

async function main() {
  const appId = process.argv[2] || 'crypto';
  const command = process.argv[3] || 'overview';

  console.log(`\n🔍 SEO Analysis & Ranking Tracker (${appId})`);
  console.log(`Command: ${command}\n`);

  try {
    switch (command) {
      case 'overview':
        await seoOverview(appId);
        break;
      case 'track-rankings':
        await trackRankings(appId);
        break;
      case 'keyword-analysis':
        await keywordAnalysis(appId);
        break;
      case 'opportunity-finder':
        await findOpportunities(appId);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('SEO Analysis error:', error);
    process.exit(1);
  }
}

/**
 * SEO Overview - Summary of all metrics
 */
async function seoOverview(appId: string) {
  console.log('📊 SEO Overview\n');

  try {
    // Get articles and their performance
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, title, views, engagement_score, plagiarism_score')
      .eq('app_id', appId)
      .eq('status', 'published')
      .order('views', { ascending: false });

    if (!articles || articles.length === 0) {
      console.log('❌ No published articles found');
      return;
    }

    // Get performance data
    const { data: perfData } = await supabase
      .from('blog_performance')
      .select('*')
      .eq('app_id', appId)
      .order('date', { ascending: false })
      .limit(90); // Last 90 days

    console.log('📈 Traffic Overview:');
    if (perfData && perfData.length > 0) {
      const totalViews = perfData.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
      const totalImpressions = perfData.reduce((sum: number, p: any) => sum + (p.impressions || 0), 0);
      const avgCTR = totalImpressions > 0 ? ((totalViews / totalImpressions) * 100).toFixed(2) : '0.00';
      const avgDailyViews = (totalViews / perfData.length).toFixed(0);

      console.log(`   Total organic views (90d): ${totalViews.toLocaleString()}`);
      console.log(`   Total impressions (90d): ${totalImpressions.toLocaleString()}`);
      console.log(`   Average CTR: ${avgCTR}%`);
      console.log(`   Average daily views: ${avgDailyViews}\n`);
    }

    // Content analysis
    console.log('📄 Content Analysis:');
    console.log(`   Total published articles: ${articles.length}`);
    console.log(`   Avg views per article: ${(articles.reduce((sum: number, a: any) => sum + a.views, 0) / articles.length).toFixed(0)}`);
    console.log(`   Avg engagement score: ${(articles.reduce((sum: number, a: any) => sum + (a.engagement_score || 0), 0) / articles.length).toFixed(2)}`);
    console.log(`   Avg plagiarism/uniqueness: ${(articles.reduce((sum: number, a: any) => sum + (a.plagiarism_score || 0), 0) / articles.length).toFixed(1)}%\n`);

    // Top performers
    console.log('🏆 Top Performing Articles:');
    articles
      .slice(0, 5)
      .forEach((a: any, i: number) => {
        console.log(`   ${i + 1}. "${a.title.substring(0, 50)}"`);
        console.log(`      Views: ${a.views} | Engagement: ${(a.engagement_score || 0).toFixed(2)}`);
      });

    console.log('\n✅ Overview complete');
  } catch (error) {
    console.error('SEO overview failed:', error);
  }
}

/**
 * Track keyword rankings
 */
async function trackRankings(appId: string) {
  console.log('📍 Tracking keyword rankings...\n');

  try {
    // Get ranking history
    const { data: rankings } = await supabase
      .from('ranking_history')
      .select('keyword, rank, views, impressions, ctr')
      .eq('app_id', appId)
      .order('tracked_at', { ascending: false })
      .limit(100);

    if (!rankings || rankings.length === 0) {
      console.log('❌ No ranking data found');
      console.log('ℹ️ Set up Google Search Console integration to track rankings\n');
      return;
    }

    // Analyze rankings
    const keywordStats: Record<string, any> = {};

    rankings.forEach((r: any) => {
      if (!keywordStats[r.keyword]) {
        keywordStats[r.keyword] = {
          ranks: [],
          views: r.views,
          impressions: r.impressions,
        };
      }
      keywordStats[r.keyword].ranks.push(r.rank);
    });

    // Find top ranking keywords
    const topKeywords = Object.entries(keywordStats)
      .map(([keyword, stats]: [string, any]) => ({
        keyword,
        currentRank: stats.ranks[0],
        views: stats.views,
        impressions: stats.impressions,
        ctr: stats.impressions > 0 ? ((stats.views / stats.impressions) * 100).toFixed(2) : '0',
      }))
      .sort((a: any, b: any) => a.currentRank - b.currentRank)
      .slice(0, 20);

    console.log('🎯 Top Ranking Keywords:');
    topKeywords.forEach((k: any) => {
      const icon = k.currentRank <= 10 ? '🥇' : k.currentRank <= 50 ? '🥈' : '🥉';
      console.log(`   ${icon} "${k.keyword}" - Rank #${k.currentRank}`);
      console.log(`      Views: ${k.views} | Impressions: ${k.impressions} | CTR: ${k.ctr}%`);
    });

    // Find improving keywords
    console.log('\n📈 Improving Keywords (Last 7 days):');
    const improvingKeywords = Object.entries(keywordStats)
      .filter(([, stats]: [string, any]) => stats.ranks.length >= 2)
      .map(([keyword, stats]: [string, any]) => ({
        keyword,
        previousRank: stats.ranks[stats.ranks.length - 1],
        currentRank: stats.ranks[0],
        improvement: stats.ranks[stats.ranks.length - 1] - stats.ranks[0],
      }))
      .filter((k: any) => k.improvement > 0)
      .sort((a: any, b: any) => b.improvement - a.improvement)
      .slice(0, 5);

    if (improvingKeywords.length > 0) {
      improvingKeywords.forEach((k: any) => {
        console.log(`   ⬆️ "${k.keyword}" (+${k.improvement} positions)`);
        console.log(`      #${k.previousRank} → #${k.currentRank}`);
      });
    } else {
      console.log('   No improving keywords this period');
    }

    console.log('\n✅ Ranking analysis complete');
  } catch (error) {
    console.error('Ranking tracking failed:', error);
  }
}

/**
 * Keyword analysis and opportunities
 */
async function keywordAnalysis(appId: string) {
  console.log('🔑 Keyword Analysis\n');

  try {
    // Analyze keywords from articles
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, title, keywords, views, engagement_score')
      .eq('app_id', appId)
      .eq('status', 'published')
      .order('views', { ascending: false });

    if (!articles || articles.length === 0) {
      console.log('❌ No articles found');
      return;
    }

    const keywordStats: Record<string, any> = {};
    const keywordArticles: Record<string, string[]> = {};

    articles.forEach((a: any) => {
      const keywords = a.keywords || [];
      keywords.forEach((k: string) => {
        if (!keywordStats[k]) {
          keywordStats[k] = {
            count: 0,
            totalViews: 0,
            totalEngagement: 0,
          };
          keywordArticles[k] = [];
        }
        keywordStats[k].count++;
        keywordStats[k].totalViews += a.views || 0;
        keywordStats[k].totalEngagement += a.engagement_score || 0;
        keywordArticles[k].push(a.title);
      });
    });

    // Analyze keyword effectiveness
    const keywordEffectiveness = Object.entries(keywordStats)
      .map(([keyword, stats]: [string, any]) => ({
        keyword,
        articles: stats.count,
        totalViews: stats.totalViews,
        avgViewsPerArticle: (stats.totalViews / stats.count).toFixed(0),
        avgEngagement: (stats.totalEngagement / stats.count).toFixed(2),
        effectiveness: Math.round((stats.totalViews / stats.count) * (stats.totalEngagement / stats.count)),
      }))
      .sort((a: any, b: any) => b.effectiveness - a.effectiveness);

    console.log('🎯 Most Effective Keywords:');
    keywordEffectiveness
      .slice(0, 10)
      .forEach((k: any, i: number) => {
        console.log(`   ${i + 1}. "${k.keyword}"`);
        console.log(`      Used in ${k.articles} articles | Total views: ${k.totalViews}`);
        console.log(`      Avg engagement: ${k.avgEngagement} | Effectiveness score: ${k.effectiveness}`);
      });

    // Find underutilized high-potential keywords
    console.log('\n💎 Underutilized Keywords (in 1 article, high engagement):');
    const underutilized = keywordEffectiveness
      .filter((k: any) => k.articles === 1 && k.effectiveness > 50)
      .slice(0, 5);

    if (underutilized.length > 0) {
      underutilized.forEach((k: any) => {
        console.log(`   💡 "${k.keyword}"`);
        console.log(`      Appears in: ${keywordArticles[k.keyword]?.[0] || 'unknown'}`);
        console.log(`      Potential: High - consider creating related articles`);
      });
    } else {
      console.log('   No underutilized keywords found');
    }

    console.log('\n✅ Keyword analysis complete');
  } catch (error) {
    console.error('Keyword analysis failed:', error);
  }
}

/**
 * Find SEO opportunities
 */
async function findOpportunities(appId: string) {
  console.log('🚀 Finding SEO Opportunities\n');

  try {
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('id, title, views, engagement_score, plagiarism_score, created_at')
      .eq('app_id', appId)
      .eq('status', 'published');

    if (!articles || articles.length === 0) {
      console.log('❌ No articles to analyze');
      return;
    }

    const opportunities: any[] = [];

    // 1. Low-engagement articles (rewrite candidates)
    const lowEngagement = articles
      .filter((a: any) => (a.engagement_score || 0) < 0.5)
      .sort((a: any, b: any) => (a.engagement_score || 0) - (b.engagement_score || 0))
      .slice(0, 5);

    if (lowEngagement.length > 0) {
      console.log('⚠️ Articles with Low Engagement (Rewrite Candidates):');
      lowEngagement.forEach((a: any) => {
        const daysOld = Math.floor(
          (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        console.log(`   • "${a.title.substring(0, 50)}"`);
        console.log(`     Engagement: ${(a.engagement_score || 0).toFixed(2)} | Age: ${daysOld} days`);
        console.log(`     Action: Rewrite for better clarity and engagement\n`);
      });
    }

    // 2. High-potential expansion topics
    const highViews = articles
      .filter((a: any) => (a.views || 0) > 100)
      .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    if (highViews.length > 0) {
      console.log('⭐ High-Performing Articles (Expansion Opportunities):');
      highViews.forEach((a: any) => {
        console.log(`   • "${a.title.substring(0, 50)}"`);
        console.log(`     Views: ${a.views} | Engagement: ${(a.engagement_score || 0).toFixed(2)}`);
        console.log(`     Action: Create follow-up articles or deep-dives\n`);
      });
    }

    // 3. Quality issues
    const qualityIssues = articles
      .filter((a: any) => (a.plagiarism_score || 0) < 75)
      .slice(0, 3);

    if (qualityIssues.length > 0) {
      console.log('🔧 Quality Issues (Uniqueness Below 75%):');
      qualityIssues.forEach((a: any) => {
        console.log(`   • "${a.title.substring(0, 50)}"`);
        console.log(`     Uniqueness: ${(a.plagiarism_score || 0).toFixed(1)}%`);
        console.log(`     Action: Improve original content and differentiation\n`);
      });
    }

    console.log('✅ Opportunity analysis complete');
  } catch (error) {
    console.error('Opportunity finder failed:', error);
  }
}

main();
