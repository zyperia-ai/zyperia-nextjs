#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStage2() {
  console.log('📊 ANÁLISE — Stage 2 Execution Pattern\n');

  // Artigos gerados por data
  const { data: articles } = await supabase
    .from('blog_posts')
    .select('app_id, created_at, status, content_embedding, internal_link_count')
    .order('created_at', { ascending: false });

  const byDate = {};
  for (const article of articles || []) {
    const date = new Date(article.created_at).toISOString().split('T')[0];
    if (!byDate[date]) {
      byDate[date] = { total: 0, withEmbed: 0, withLinks: 0, statuses: {} };
    }
    byDate[date].total++;
    if (article.content_embedding !== null) byDate[date].withEmbed++;
    if (article.internal_link_count > 0) byDate[date].withLinks++;
    byDate[date].statuses[article.status] = (byDate[date].statuses[article.status] || 0) + 1;
  }

  console.log('Data         | Total | Com Embed | Com Links | Statuses');
  console.log('-------------|-------|-----------|-----------|----------------------------------');

  for (const [date, data] of Object.entries(byDate).sort().reverse()) {
    const statuses = Object.entries(data.statuses)
      .map(([s, c]) => `${s}(${c})`)
      .join(', ');
    console.log(
      `${date} | ${String(data.total).padEnd(5)} | ${String(data.withEmbed).padEnd(9)} | ${String(data.withLinks).padEnd(9)} | ${statuses}`
    );
  }

  console.log('\n\n🔴 DIAGNÓSTICO DO CORTE (2026-05-05 vs 2026-05-08):\n');

  // Artigos com embedding (funcionando)
  const { data: withEmbed } = await supabase
    .from('blog_posts')
    .select('created_at, status')
    .not('content_embedding', 'is', null);

  const lastEmbedDate = withEmbed?.[0]?.created_at
    ? new Date(withEmbed[0].created_at).toISOString().split('T')[0]
    : 'N/A';

  console.log(`✅ Último artigo COM embedding: ${lastEmbedDate}`);
  console.log(`❌ Artigos SEM embedding após 2026-05-05:\n`);

  const { data: noEmbed } = await supabase
    .from('blog_posts')
    .select('app_id, slug, created_at, status, generation_approach')
    .is('content_embedding', null)
    .gte('created_at', '2026-05-06T00:00:00Z')
    .order('created_at');

  for (const article of noEmbed || []) {
    const date = new Date(article.created_at).toISOString().split('T')[0];
    const approach = article.generation_approach || 'N/A';
    console.log(
      `   ${date} | ${article.app_id.padEnd(15)} | ${article.status.padEnd(12)} | approach: ${approach}`
    );
  }

  console.log('\n\n📋 HIPÓTESE:\n');
  console.log('Stage-2 foi executado em 2026-05-05 (34 artigos gerados com sucesso).');
  console.log('Artigos criados 2026-05-06+ estão SEM embedding.');
  console.log('');
  console.log('Possibilidades:');
  console.log('1. Stage-2 deixou de executar após 2026-05-05');
  console.log('2. Stage-2 executou mas internal-linking-v2.ts não foi invocado');
  console.log('3. Artigos foram publicados manualmente após serem criados em draft');
}

checkStage2();
