/**
 * ZYPERIA BRUTAL SYSTEM — Mock Data Generator
 * Generates test data for local pipeline testing without requiring Supabase
 * Run: `ts-node scripts/mock-data-generator.ts`
 */

import * as fs from 'fs';
import * as path from 'path';

interface MockDatabase {
  theme_config: any[];
  content_research: any[];
  content_topics: any[];
  blog_posts: any[];
  generation_logs: any[];
  blog_performance: any[];
}

const mockDb: MockDatabase = {
  theme_config: [
    {
      app_id: 'crypto',
      generation_system_prompt: 'You are a crypto expert...',
      transformation_system_prompt: 'You are analyzing a top-performing crypto article...',
      aggregation_system_prompt: 'You are synthesizing information from 3-5 top crypto articles...',
      verification_sources: {
        exchanges: ['https://coinmarketcap.com'],
        learning: ['https://bitcoin.org'],
      },
      affiliate_programs: [
        { name: 'Kraken', commission: '0.25%-0.50%' },
      ],
      articles_per_day: 2,
      publish_times: ['09:00', '15:00'],
      brutal_system: {
        content_mix: { original: 0.4, transformed: 0.5, aggregated: 0.1 },
        competitive_analysis: {
          enabled: true,
          serp_api_keywords: ['bitcoin', 'ethereum'],
          max_competitors_to_analyze: 20,
        },
        visual_enrichment: {
          hero_images: { enabled: true },
          data_visualizations: { enabled: true },
        },
        plagiarism_check: { enabled: true, min_uniqueness: 70 },
      },
    },
    {
      app_id: 'intelligence',
      generation_system_prompt: 'You are a business automation expert...',
      transformation_system_prompt: 'You are analyzing a top-performing AI article...',
      aggregation_system_prompt: 'You are synthesizing information from 3-5 top AI articles...',
      verification_sources: {
        tools: ['https://openai.com/docs'],
      },
      affiliate_programs: [
        { name: 'Zapier', commission: '0.03 per signup' },
      ],
      articles_per_day: 2,
      publish_times: ['09:00', '18:00'],
      brutal_system: {
        content_mix: { original: 0.4, transformed: 0.5, aggregated: 0.1 },
        competitive_analysis: {
          enabled: true,
          serp_api_keywords: ['zapier', 'make automation'],
          max_competitors_to_analyze: 20,
        },
        visual_enrichment: {
          hero_images: { enabled: true },
          data_visualizations: { enabled: true },
        },
        plagiarism_check: { enabled: true, min_uniqueness: 70 },
      },
    },
    {
      app_id: 'onlinebiz',
      generation_system_prompt: 'You are a side-hustle expert...',
      transformation_system_prompt: 'You are analyzing a top-performing earn-online article...',
      aggregation_system_prompt: 'You are synthesizing information from 3-5 top earn-online articles...',
      verification_sources: {
        case_studies: ['https://www.failory.com'],
      },
      affiliate_programs: [
        { name: 'Gumroad', commission: 'varies' },
      ],
      articles_per_day: 2,
      publish_times: ['09:00', '14:00'],
      brutal_system: {
        content_mix: { original: 0.4, transformed: 0.5, aggregated: 0.1 },
        competitive_analysis: {
          enabled: true,
          serp_api_keywords: ['freelancing', 'passive income'],
          max_competitors_to_analyze: 20,
        },
        visual_enrichment: {
          hero_images: { enabled: true },
          data_visualizations: { enabled: true },
        },
        plagiarism_check: { enabled: true, min_uniqueness: 70 },
      },
    },
  ],

  content_topics: [
    // CRYPTO TOPICS
    { id: 'topic-1', app_id: 'crypto', title: 'Bitcoin for Beginners', keywords: ['bitcoin', 'basics'], priority: 1 },
    { id: 'topic-2', app_id: 'crypto', title: 'Ethereum DeFi Guide', keywords: ['ethereum', 'defi'], priority: 2 },
    { id: 'topic-3', app_id: 'crypto', title: 'NFT Security Tips', keywords: ['nft', 'security'], priority: 2 },
    { id: 'topic-4', app_id: 'crypto', title: 'Crypto Wallets Explained', keywords: ['wallets', 'security'], priority: 1 },

    // INTELLIGENCE TOPICS
    { id: 'topic-5', app_id: 'intelligence', title: 'Zapier Automation Guide', keywords: ['zapier', 'automation'], priority: 1 },
    { id: 'topic-6', app_id: 'intelligence', title: 'Claude vs ChatGPT', keywords: ['ai', 'comparison'], priority: 1 },
    { id: 'topic-7', app_id: 'intelligence', title: 'AI Content Workflow', keywords: ['ai', 'content'], priority: 2 },
    { id: 'topic-8', app_id: 'intelligence', title: 'Make.com Advanced Scenarios', keywords: ['make', 'automation'], priority: 2 },

    // ONLINEBIZ TOPICS
    { id: 'topic-9', app_id: 'onlinebiz', title: 'Freelancing 101', keywords: ['freelancing', 'income'], priority: 1 },
    { id: 'topic-10', app_id: 'onlinebiz', title: 'Passive Income Ideas', keywords: ['passive', 'income'], priority: 1 },
    { id: 'topic-11', app_id: 'onlinebiz', title: 'Digital Products Guide', keywords: ['products', 'sell'], priority: 2 },
    { id: 'topic-12', app_id: 'onlinebiz', title: 'Affiliate Marketing 2026', keywords: ['affiliate', 'marketing'], priority: 2 },
  ],

  content_research: [
    {
      id: 'research-1',
      app_id: 'crypto',
      topic: 'Bitcoin for Beginners',
      research_type: 'original',
      research_data: {
        sources: ['Bitcoin.org', 'CoinMarketCap'],
        facts: ['Bitcoin is a decentralized digital currency', 'First block mined in 2009'],
        context: 'Fresh research on Bitcoin fundamentals',
      },
      competitive_analysis: {
        top_performing_articles: [
          {
            url: 'https://example.com/bitcoin-guide',
            title: 'Bitcoin Complete Guide',
            domain: 'example.com',
            position: 1,
          },
        ],
        content_gaps: ['visual tutorials', 'latest data', 'beginner-friendly'],
        improvement_opportunities: ['add 2026 updates', 'include step-by-step screenshots'],
        common_sources: ['bitcoin.org', 'coinmarketcap.com'],
        average_article_length: 2500,
        common_sections: ['Introduction', 'How Bitcoin Works', 'Getting Started', 'Security', 'Conclusion'],
        recommended_approach: 'transformed',
      },
      confidence_score: 85,
      created_at: new Date().toISOString(),
    },
    {
      id: 'research-2',
      app_id: 'intelligence',
      topic: 'Zapier Automation Guide',
      research_type: 'original',
      research_data: {
        sources: ['Zapier.com', 'ProductHunt'],
        facts: ['Zapier connects 7000+ apps', 'No coding required'],
        context: 'Fresh research on Zapier automation',
      },
      competitive_analysis: {
        top_performing_articles: [
          {
            url: 'https://example.com/zapier-guide',
            title: 'Zapier Tutorial for Beginners',
            domain: 'example.com',
            position: 1,
          },
        ],
        content_gaps: ['real use cases', 'automation templates', '2026 updates'],
        improvement_opportunities: ['add video tutorials', 'include case studies'],
        common_sources: ['zapier.com', 'producthunt.com'],
        average_article_length: 2200,
        common_sections: ['Getting Started', 'Basic Workflows', 'Advanced Automation', 'Templates'],
        recommended_approach: 'transformed',
      },
      confidence_score: 85,
      created_at: new Date().toISOString(),
    },
    {
      id: 'research-3',
      app_id: 'onlinebiz',
      topic: 'Freelancing 101',
      research_type: 'original',
      research_data: {
        sources: ['Fiverr', 'Upwork', 'Indie Hackers'],
        facts: ['50M+ freelancers worldwide', 'Average earnings vary by skill'],
        context: 'Fresh research on freelancing landscape',
      },
      competitive_analysis: {
        top_performing_articles: [
          {
            url: 'https://example.com/freelancing-guide',
            title: 'Complete Freelancing Guide',
            domain: 'example.com',
            position: 1,
          },
        ],
        content_gaps: ['realistic income expectations', 'platform comparisons', 'tax implications'],
        improvement_opportunities: ['add 2026 rates', 'include success stories'],
        common_sources: ['upwork.com', 'fiverr.com', 'indiehackers.com'],
        average_article_length: 2800,
        common_sections: ['Getting Started', 'Finding Clients', 'Setting Rates', 'Growing Income'],
        recommended_approach: 'transformed',
      },
      confidence_score: 85,
      created_at: new Date().toISOString(),
    },
  ],

  blog_posts: [
    {
      id: 'post-1',
      app_id: 'crypto',
      title: 'Bitcoin for Beginners: Everything You Need to Know',
      slug: 'bitcoin-beginners-guide',
      content: '# Bitcoin for Beginners\n\nBitcoin is a decentralized digital currency...',
      excerpt: 'Learn Bitcoin basics, how wallets work, and how to get started safely.',
      status: 'draft',
      generation_approach: 'original',
      is_original_generated: true,
      created_at: new Date().toISOString(),
    },
  ],

  generation_logs: [],

  blog_performance: [],
};

/**
 * Save mock database to JSON file for testing
 */
function saveMockDatabase(outputPath: string = '.mock-db.json') {
  const fullPath = path.resolve(outputPath);
  fs.writeFileSync(fullPath, JSON.stringify(mockDb, null, 2));
  console.log(`✓ Mock database saved to: ${fullPath}`);
  console.log(`  - ${mockDb.theme_config.length} apps configured`);
  console.log(`  - ${mockDb.content_topics.length} topics loaded`);
  console.log(`  - ${mockDb.content_research.length} research items`);
  console.log(`  - ${mockDb.blog_posts.length} articles seeded`);
}

/**
 * Load mock database from JSON file
 */
function loadMockDatabase(inputPath: string = '.mock-db.json'): MockDatabase {
  const fullPath = path.resolve(inputPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Mock database not found at ${fullPath}. Creating new one...`);
    saveMockDatabase(inputPath);
    return mockDb;
  }
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
}

/**
 * Add generated article to mock database
 */
function addGeneratedArticle(
  db: MockDatabase,
  article: any
) {
  const id = `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const post = {
    id,
    ...article,
    created_at: new Date().toISOString(),
  };
  db.blog_posts.push(post);
  return post;
}

/**
 * Add generation log
 */
function addGenerationLog(db: MockDatabase, log: any) {
  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...log,
    created_at: new Date().toISOString(),
  };
  db.generation_logs.push(entry);
  return entry;
}

/**
 * Get mock database stats
 */
function getStats(db: MockDatabase) {
  return {
    apps: db.theme_config.length,
    topics: db.content_topics.length,
    research_items: db.content_research.length,
    articles: db.blog_posts.length,
    logs: db.generation_logs.length,
    articles_by_app: db.blog_posts.reduce((acc, post) => {
      acc[post.app_id] = (acc[post.app_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

// Export functions for use in tests
export { mockDb, saveMockDatabase, loadMockDatabase, addGeneratedArticle, addGenerationLog, getStats, MockDatabase };

// If run directly, generate and save mock data
if (require.main === module) {
  console.log('\n=== ZYPERIA MOCK DATA GENERATOR ===\n');
  saveMockDatabase();
  console.log('\n✓ Mock data generation complete!');
  console.log(`\nStats:\n${JSON.stringify(getStats(mockDb), null, 2)}`);
}
