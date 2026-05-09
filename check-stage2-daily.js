#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDaily() {
  console.log('⏰ VERIFICANDO EXECUÇÃO DIÁRIA DE STAGE-2\n');

  const { data: logs } = await supabase
    .from('generation_logs')
    .select('created_at, stage, status')
    .eq('stage', 'generation')
    .order('created_at', { ascending: false });

  const byDate = {};
  for (const log of logs || []) {
    const date = new Date(log.created_at).toISOString().split('T')[0];
    byDate[date] = (byDate[date] || 0) + 1;
  }

  console.log('Data       | Artigos Gerados (Stage-2)');
  console.log('-----------|-------------------------');

  for (const [date, count] of Object.entries(byDate).sort().reverse()) {
    const marker = count > 0 ? '✅' : '❌';
    console.log(`${marker} ${date} | ${count}`);
  }

  console.log('\n\n🔍 CRONOGRAMA ESPERADO:\n');
  console.log('Stage-2 executa diariamente às 02:00 UTC (depois de Stage-0 e Stage-1)');
  console.log('Se houver dias SEM "Artigos Gerados", Stage-2 não correu nesse dia.');

  console.log('\n\n📅 ARTIGOS CRIADOS POR HORA (últimas 48h):\n');

  const { data: recentArticles } = await supabase
    .from('blog_posts')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 48 * 3600000).toISOString())
    .order('created_at', { ascending: false });

  const byHour = {};
  for (const article of recentArticles || []) {
    const hour = new Date(article.created_at).toISOString().substring(0, 13) + ':00';
    byHour[hour] = (byHour[hour] || 0) + 1;
  }

  for (const [hour, count] of Object.entries(byHour).sort().reverse()) {
    console.log(`${hour}: ${count} artigos`);
  }
}

checkDaily();
