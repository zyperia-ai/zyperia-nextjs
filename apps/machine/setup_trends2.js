require('dotenv').config({ path: '../crypto/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

const trendsData = [
  {
    app_id: 'crypto',
    month_year: 'Abril 2026',
    trends: ['RWA tokenização','Bitcoin ETFs','Liquid staking EigenLayer','Perp DEXs Hyperliquid','Stablecoins','ZK-Proofs','Layer 2 Arbitrum','Bitcoin Layer 2 Stacks','DeFi TradFi','AI agents blockchain','Yield engineering Pendle','Crypto ETFs SEC','Quantum resistance Bitcoin'],
    updated_at: new Date().toISOString(),
  },
  {
    app_id: 'intelligence',
    month_year: 'Abril 2026',
    trends: ['Agentic AI','Multi-agent systems','Coding agents Cursor','Physical AI robótica','Claude GPT Gemini','Perplexity Comet','Stanford AI Index 2026','AI medicina','AI governance','SEO AI search','Anthropic IPO','LLMWiki','Fine-tuning vs prompting'],
    updated_at: new Date().toISOString(),
  },
  {
    app_id: 'onlinebiz',
    month_year: 'Abril 2026',
    trends: ['Micro-SaaS solo founder','Newsletter B2B','AI coding no-code','Content repurposing','Bootstrapped SaaS','Fractional services','SEO programático AI','Creator economy','Recurring commissions','Community-led growth','B2B SaaS AI','RGPD LGPD','Solopreneur 10K-30K MRR'],
    updated_at: new Date().toISOString(),
  },
];

(async () => {
  try {
    const { error } = await supabase
      .from('trend_config')
      .upsert(trendsData, { onConflict: 'app_id' });
    
    if (error) {
      console.log(`❌ trend_config: ${error.message}`);
    } else {
      console.log(`✓ trend_config: OK — 3 registos`);
      const { data } = await supabase.from('trend_config').select('app_id, trends');
      data?.forEach(d => console.log(`  ${d.app_id}: ${d.trends?.length} trends`));
    }
  } catch (err) {
    console.error('Erro:', err.message);
  }
})();
