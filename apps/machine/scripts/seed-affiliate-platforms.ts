/**
 * Seed Affiliate Platforms into Supabase
 *
 * Run: npx ts-node apps/machine/scripts/seed-affiliate-platforms.ts
 *
 * Populates affiliate_platforms table with 15 core platforms
 * across 3 categories: crypto, intelligence, onlinebiz
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AffiliatePartner {
  name: string;
  platform_type: string;
  category: string;
  affiliate_url: string;
  commission_type: string;
  commission_value: string;
  cookie_window_days: number;
}

const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  // CRYPTO PLATFORMS (5 core)
  {
    name: 'Kraken',
    platform_type: 'exchange',
    category: 'crypto',
    affiliate_url: 'https://www.kraken.com/signup',
    commission_type: 'percentage',
    commission_value: '0.25-0.5%',
    cookie_window_days: 90,
  },
  {
    name: 'Binance',
    platform_type: 'exchange',
    category: 'crypto',
    affiliate_url: 'https://www.binance.com/en/register',
    commission_type: 'percentage',
    commission_value: '0.2-0.4%',
    cookie_window_days: 90,
  },
  {
    name: 'Coinbase',
    platform_type: 'exchange',
    category: 'crypto',
    affiliate_url: 'https://coinbase.com/',
    commission_type: 'percentage',
    commission_value: '1-5%',
    cookie_window_days: 30,
  },
  {
    name: 'Ledger',
    platform_type: 'hardware_wallet',
    category: 'crypto',
    affiliate_url: 'https://www.ledger.com/',
    commission_type: 'percentage',
    commission_value: '5%',
    cookie_window_days: 90,
  },
  {
    name: 'Trezor',
    platform_type: 'hardware_wallet',
    category: 'crypto',
    affiliate_url: 'https://trezor.io/',
    commission_type: 'percentage',
    commission_value: '5%',
    cookie_window_days: 90,
  },

  // INTELLIGENCE PLATFORMS (5 core)
  {
    name: 'Zapier',
    platform_type: 'automation',
    category: 'intelligence',
    affiliate_url: 'https://zapier.com/',
    commission_type: 'fixed_usd',
    commission_value: '€0.03-0.30/signup',
    cookie_window_days: 60,
  },
  {
    name: 'Make',
    platform_type: 'automation',
    category: 'intelligence',
    affiliate_url: 'https://make.com/',
    commission_type: 'fixed_usd',
    commission_value: '€0.03-0.30/signup',
    cookie_window_days: 30,
  },
  {
    name: 'OpenAI',
    platform_type: 'ai',
    category: 'intelligence',
    affiliate_url: 'https://openai.com/',
    commission_type: 'revenue_share',
    commission_value: 'varies',
    cookie_window_days: 30,
  },
  {
    name: 'Anthropic',
    platform_type: 'ai',
    category: 'intelligence',
    affiliate_url: 'https://www.anthropic.com/',
    commission_type: 'revenue_share',
    commission_value: 'varies',
    cookie_window_days: 30,
  },
  {
    name: 'Notion',
    platform_type: 'productivity',
    category: 'intelligence',
    affiliate_url: 'https://www.notion.so/',
    commission_type: 'percentage',
    commission_value: '10% lifetime',
    cookie_window_days: 90,
  },

  // ONLINEBIZ PLATFORMS (5 core)
  {
    name: 'Gumroad',
    platform_type: 'ecommerce',
    category: 'onlinebiz',
    affiliate_url: 'https://gumroad.com/',
    commission_type: 'percentage',
    commission_value: '30% per sale',
    cookie_window_days: 90,
  },
  {
    name: 'Hotmart',
    platform_type: 'ecommerce',
    category: 'onlinebiz',
    affiliate_url: 'https://hotmart.com/',
    commission_type: 'percentage',
    commission_value: '10-30%',
    cookie_window_days: 30,
  },
  {
    name: 'SendOwl',
    platform_type: 'ecommerce',
    category: 'onlinebiz',
    affiliate_url: 'https://www.sendowl.com/',
    commission_type: 'percentage',
    commission_value: '5-20%',
    cookie_window_days: 90,
  },
  {
    name: 'Fiverr',
    platform_type: 'freelancing',
    category: 'onlinebiz',
    affiliate_url: 'https://www.fiverr.com/',
    commission_type: 'percentage',
    commission_value: '20-30%',
    cookie_window_days: 90,
  },
  {
    name: 'Amazon Associates',
    platform_type: 'ecommerce',
    category: 'onlinebiz',
    affiliate_url: 'https://affiliate-program.amazon.com/',
    commission_type: 'percentage',
    commission_value: '5-8%',
    cookie_window_days: 24, // 24 hours for Amazon
  },
];

async function seedAffiliates() {
  console.log('🌱 Seeding affiliate platforms...\n');

  try {
    // First, check if platforms already exist
    const { data: existing, error: selectError } = await supabase
      .from('affiliate_platforms')
      .select('name');

    if (selectError) {
      console.error('❌ Error checking existing platforms:', selectError);
      return;
    }

    const existingNames = existing?.map((p) => p.name) || [];
    const toInsert = AFFILIATE_PARTNERS.filter((p) => !existingNames.includes(p.name));

    if (toInsert.length === 0) {
      console.log('✅ All platforms already seeded!');
      return;
    }

    console.log(`📝 Inserting ${toInsert.length} new platforms...\n`);

    const { data, error } = await supabase
      .from('affiliate_platforms')
      .insert(toInsert)
      .select();

    if (error) {
      console.error('❌ Error inserting platforms:', error);
      return;
    }

    console.log(`✅ Successfully seeded ${toInsert.length} platforms:\n`);

    // Group by category for display
    const byCat = toInsert.reduce(
      (acc, p) => {
        if (!acc[p.category]) acc[p.category] = [];
        acc[p.category].push(p.name);
        return acc;
      },
      {} as Record<string, string[]>
    );

    Object.entries(byCat).forEach(([category, platforms]) => {
      console.log(`  📚 ${category.toUpperCase()}: ${platforms.join(', ')}`);
    });

    console.log('\n✨ Seed complete!');
    console.log('\nPlatforms are now available for affiliate link creation.');
    console.log('To create links for articles, use AffiliateLink component or /api/affiliate endpoints.\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seedAffiliates().catch(console.error);
