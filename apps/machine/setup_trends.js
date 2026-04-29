require('dotenv').config({ path: '../crypto/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const trendsData = [
  {
    app_id: 'crypto',
    month_year: 'Abril 2026',
    trends: ['RWA tokenização','Bitcoin ETFs institucional','Liquid staking EigenLayer','Perp DEXs Hyperliquid','Stablecoins pagamentos','ZK-Proofs privacidade','Layer 2 Arbitrum Base','Bitcoin Layer 2 Stacks','DeFi TradFi convergência','AI agents blockchain','Yield engineering Pendle','Crypto ETFs SEC','Quantum resistance Bitcoin'],
    updated_at: new Date().toISOString(),
  },
  {
    app_id: 'intelligence',
    month_year: 'Abril 2026',
    trends: ['Agentic AI autónomos','Multi-agent systems','Coding agents Cursor 3','Physical AI robótica','Claude GPT Gemini 2026','Perplexity Comet free','Stanford AI Index 2026','AI medicina drug discovery','AI governance regulação','SEO AI search visibilidade','Anthropic IPO','LLMWiki knowledge bases','Fine-tuning vs prompting'],
    updated_at: new Date().toISOString(),
  },
  {
    app_id: 'onlinebiz',
    month_year: 'Abril 2026',
    trends: ['Micro-SaaS solo founder','Newsletter B2B monetização','AI coding no-code founder','Content repurposing auto','Bootstrapped SaaS nicho','Fractional services COO','SEO programático AI','Creator economy 100B','Recurring commissions SaaS','Community-led growth','B2B SaaS AI autonomous','RGPD LGPD compliance','Solopreneur 10K-30K MRR'],
    updated_at: new Date().toISOString(),
  },
];

(async () => {
  try {
    const { error } = await supabase
      .from('trend_config')
      .upsert(trendsData, { onConflict: 'app_id' });
    
    console.log(`✓ trend_config: ${error ? 'ERRO - ' + error.message : 'OK — 3 registos'}`);

    const { data } = await supabase.from('trend_config').select('app_id, month_year, trends');
    data?.forEach(d => console.log(`  ${d.app_id} (${d.month_year}): ${d.trends?.length} trends`));

  } catch (err) {
    console.error('Erro:', err.message);
  }
})();
