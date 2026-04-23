/**
 * Seed initial content topics for all 3 blogs
 * Run: ts-node scripts/seed-content-topics.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const cryptoTopics = [
  { title: 'Bitcoin for Beginners', keywords: ['bitcoin', 'basics', 'how to start'], priority: 5, search_volume: 8500 },
  { title: 'Ethereum DeFi Guide', keywords: ['ethereum', 'defi', 'smart contracts'], priority: 5, search_volume: 6200 },
  { title: 'Crypto Wallets Explained', keywords: ['crypto wallets', 'security', 'storage'], priority: 5, search_volume: 4100 },
  { title: 'NFT Security Tips', keywords: ['nft', 'security', 'scams'], priority: 4, search_volume: 3200 },
  { title: 'How to Buy Cryptocurrency', keywords: ['buy crypto', 'exchanges', 'payment'], priority: 5, search_volume: 7800 },
  { title: 'Staking Crypto Rewards', keywords: ['staking', 'passive income', 'returns'], priority: 4, search_volume: 5100 },
  { title: 'Crypto Tax Guide 2026', keywords: ['crypto taxes', 'reporting', 'compliance'], priority: 4, search_volume: 3800 },
  { title: 'Trading Altcoins Strategy', keywords: ['altcoins', 'trading', 'strategy'], priority: 3, search_volume: 2900 },
  { title: 'Bitcoin vs Ethereum', keywords: ['bitcoin', 'ethereum', 'comparison'], priority: 4, search_volume: 4500 },
  { title: 'Crypto Portfolio Management', keywords: ['portfolio', 'diversification', 'risk'], priority: 4, search_volume: 3200 },
  { title: 'Understanding Blockchain', keywords: ['blockchain', 'technology', 'basics'], priority: 5, search_volume: 6800 },
  { title: 'Crypto Trading Mistakes to Avoid', keywords: ['trading', 'mistakes', 'losses'], priority: 4, search_volume: 3500 },
  { title: 'Layer 2 Solutions Explained', keywords: ['layer 2', 'scaling', 'solutions'], priority: 3, search_volume: 2100 },
  { title: 'DeFi Protocols Review', keywords: ['defi', 'protocols', 'yields'], priority: 3, search_volume: 2600 },
  { title: 'Crypto Regulation Update 2026', keywords: ['regulation', 'compliance', 'laws'], priority: 3, search_volume: 2400 },
  { title: 'Cold Wallet vs Hot Wallet', keywords: ['wallet types', 'security', 'comparison'], priority: 4, search_volume: 3800 },
  { title: 'Cryptocurrency Mining Guide', keywords: ['mining', 'proof of work', 'hardware'], priority: 3, search_volume: 4200 },
  { title: 'Web3 and Crypto Future', keywords: ['web3', 'future', 'trends'], priority: 3, search_volume: 3100 },
  { title: 'Crypto Market Analysis', keywords: ['market analysis', 'trends', 'signals'], priority: 3, search_volume: 2800 },
  { title: 'Understanding Gas Fees', keywords: ['gas fees', 'ethereum', 'optimization'], priority: 4, search_volume: 3600 },
];

const intelligenceTopics = [
  { title: 'Zapier Automation Guide 2026', keywords: ['zapier', 'automation', 'workflow'], priority: 5, search_volume: 5800 },
  { title: 'Claude vs ChatGPT Comparison', keywords: ['claude', 'chatgpt', 'ai comparison'], priority: 5, search_volume: 7200 },
  { title: 'AI Tools for Content Creation', keywords: ['ai tools', 'content', 'writing'], priority: 5, search_volume: 6400 },
  { title: 'Make.com Automation Scenarios', keywords: ['make', 'automation', 'templates'], priority: 4, search_volume: 3100 },
  { title: 'Prompt Engineering Tips', keywords: ['prompting', 'ai', 'techniques'], priority: 5, search_volume: 4800 },
  { title: 'Business Process Automation', keywords: ['automation', 'business', 'efficiency'], priority: 4, search_volume: 5200 },
  { title: 'AI for Email Management', keywords: ['email', 'automation', 'productivity'], priority: 4, search_volume: 2900 },
  { title: 'Data Processing with AI', keywords: ['data', 'processing', 'automation'], priority: 3, search_volume: 2400 },
  { title: 'Webhook Integration Guide', keywords: ['webhooks', 'api', 'integration'], priority: 3, search_volume: 1800 },
  { title: 'AI Writing Assistant Review', keywords: ['writing tools', 'ai', 'productivity'], priority: 4, search_volume: 3600 },
  { title: 'Custom GPT Development', keywords: ['gpt', 'custom', 'development'], priority: 3, search_volume: 2200 },
  { title: 'Automating Customer Support', keywords: ['customer support', 'chatbot', 'automation'], priority: 4, search_volume: 3800 },
  { title: 'AI for Market Research', keywords: ['market research', 'ai', 'analysis'], priority: 3, search_volume: 2100 },
  { title: 'Workflow Optimization Tips', keywords: ['workflow', 'optimization', 'productivity'], priority: 4, search_volume: 3200 },
  { title: 'API Integration Best Practices', keywords: ['api', 'integration', 'development'], priority: 3, search_volume: 1900 },
  { title: 'AI Translation Services', keywords: ['translation', 'ai', 'localization'], priority: 3, search_volume: 2500 },
  { title: 'No-Code Automation Tools', keywords: ['no-code', 'automation', 'tools'], priority: 4, search_volume: 4100 },
  { title: 'AI Image Generation Guide', keywords: ['image generation', 'ai', 'tools'], priority: 4, search_volume: 5600 },
  { title: 'Scheduling and Planning AI', keywords: ['scheduling', 'planning', 'productivity'], priority: 3, search_volume: 2300 },
  { title: 'Enterprise Automation Solutions', keywords: ['enterprise', 'automation', 'solutions'], priority: 2, search_volume: 1600 },
];

const onlinebizTopics = [
  { title: 'Freelancing 101 for Beginners', keywords: ['freelancing', 'start', 'guide'], priority: 5, search_volume: 8200 },
  { title: 'Passive Income Ideas 2026', keywords: ['passive income', 'ideas', 'earning'], priority: 5, search_volume: 9100 },
  { title: 'Digital Products Guide', keywords: ['digital products', 'sell', 'create'], priority: 4, search_volume: 4200 },
  { title: 'Affiliate Marketing Strategy', keywords: ['affiliate marketing', 'income', 'strategy'], priority: 5, search_volume: 5800 },
  { title: 'YouTube Channel Monetization', keywords: ['youtube', 'monetization', 'earnings'], priority: 4, search_volume: 6300 },
  { title: 'Dropshipping Business Setup', keywords: ['dropshipping', 'ecommerce', 'business'], priority: 4, search_volume: 5200 },
  { title: 'Content Monetization Methods', keywords: ['content', 'monetization', 'income'], priority: 4, search_volume: 4100 },
  { title: 'Online Courses Creation', keywords: ['courses', 'teaching', 'income'], priority: 4, search_volume: 4800 },
  { title: 'Side Hustle Ideas List', keywords: ['side hustle', 'extra income', 'ideas'], priority: 5, search_volume: 7400 },
  { title: 'Blogging for Money', keywords: ['blog', 'monetize', 'income'], priority: 4, search_volume: 5100 },
  { title: 'Fiverr Freelancing Tips', keywords: ['fiverr', 'freelancing', 'tips'], priority: 3, search_volume: 2800 },
  { title: 'Upwork Success Strategies', keywords: ['upwork', 'freelance', 'success'], priority: 3, search_volume: 2900 },
  { title: 'Shopify Store Setup Guide', keywords: ['shopify', 'ecommerce', 'setup'], priority: 4, search_volume: 3200 },
  { title: 'Reselling Online Products', keywords: ['reselling', 'arbitrage', 'profits'], priority: 3, search_volume: 2600 },
  { title: 'Virtual Assistant Business', keywords: ['virtual assistant', 'remote', 'business'], priority: 3, search_volume: 3100 },
  { title: 'Email List Building Strategies', keywords: ['email list', 'marketing', 'growth'], priority: 4, search_volume: 3600 },
  { title: 'Sponsored Content Income', keywords: ['sponsorships', 'brand deals', 'income'], priority: 3, search_volume: 2200 },
  { title: 'Cryptocurrency Earning Methods', keywords: ['crypto', 'staking', 'income'], priority: 3, search_volume: 2400 },
  { title: 'Niche Website for Profit', keywords: ['niche', 'website', 'profit'], priority: 3, search_volume: 2100 },
  { title: 'Print on Demand Business', keywords: ['print on demand', 'ecommerce', 'passive'], priority: 3, search_volume: 2500 },
];

async function seedTopics() {
  console.log('\n=== SEEDING CONTENT TOPICS ===');
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    // Insert crypto topics
    console.log('\nSeeding crypto topics...');
    const { error: cryptoError, data: cryptoData } = await supabase
      .from('content_topics')
      .insert(
        cryptoTopics.map((t) => ({
          app_id: 'crypto',
          title: t.title,
          keywords: t.keywords,
          priority: t.priority,
          search_volume: t.search_volume,
          created_at: new Date().toISOString(),
        }))
      );

    if (cryptoError) {
      console.error('Error seeding crypto topics:', cryptoError.message);
    } else {
      console.log(`✓ Seeded ${cryptoTopics.length} crypto topics`);
    }

    // Insert intelligence topics
    console.log('\nSeeding intelligence topics...');
    const { error: intError, data: intData } = await supabase
      .from('content_topics')
      .insert(
        intelligenceTopics.map((t) => ({
          app_id: 'intelligence',
          title: t.title,
          keywords: t.keywords,
          priority: t.priority,
          search_volume: t.search_volume,
          created_at: new Date().toISOString(),
        }))
      );

    if (intError) {
      console.error('Error seeding intelligence topics:', intError.message);
    } else {
      console.log(`✓ Seeded ${intelligenceTopics.length} intelligence topics`);
    }

    // Insert onlinebiz topics
    console.log('\nSeeding onlinebiz topics...');
    const { error: bizError, data: bizData } = await supabase
      .from('content_topics')
      .insert(
        onlinebizTopics.map((t) => ({
          app_id: 'onlinebiz',
          title: t.title,
          keywords: t.keywords,
          priority: t.priority,
          search_volume: t.search_volume,
          created_at: new Date().toISOString(),
        }))
      );

    if (bizError) {
      console.error('Error seeding onlinebiz topics:', bizError.message);
    } else {
      console.log(`✓ Seeded ${onlinebizTopics.length} onlinebiz topics`);
    }

    console.log('\n=== SEED COMPLETE ===');
    console.log(`Total topics seeded: ${cryptoTopics.length + intelligenceTopics.length + onlinebizTopics.length}`);
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
}

seedTopics();
