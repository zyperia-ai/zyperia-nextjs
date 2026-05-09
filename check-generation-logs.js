#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
  console.log('📋 VERIFICANDO LOGS DE GERAÇÃO (2026-05-04 a 2026-05-09)\n');

  // Logs de geração para o período crítico
  const { data: logs, error } = await supabase
    .from('generation_logs')
    .select('*')
    .gte('created_at', '2026-05-04T00:00:00Z')
    .lte('created_at', '2026-05-09T23:59:59Z')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro ao buscar logs:', error.message);
    return;
  }

  if (!logs || logs.length === 0) {
    console.log('❌ Nenhum log encontrado para o período 2026-05-04 a 2026-05-09');
    return;
  }

  console.log(`📊 Total de logs: ${logs.length}\n`);

  // Agrupar por data e status
  const byDate = {};
  for (const log of logs) {
    const date = new Date(log.created_at).toISOString().split('T')[0];
    if (!byDate[date]) {
      byDate[date] = { success: 0, failed: 0, logs: [] };
    }
    byDate[date][log.status]++;
    byDate[date].logs.push(log);
  }

  for (const [date, data] of Object.entries(byDate).sort().reverse()) {
    console.log(`📅 ${date}:`);
    console.log(`   ✅ Success: ${data.success}`);
    console.log(`   ❌ Failed: ${data.failed}`);

    // Mostrar alguns logs falhados para investigação
    const failedLogs = data.logs.filter(l => l.status === 'failed');
    if (failedLogs.length > 0) {
      for (const log of failedLogs.slice(0, 2)) {
        console.log(`   └─ ${log.stage}: ${log.error_message?.substring(0, 80) || 'N/A'}`);
      }
    }
  }

  // Verificar especificamente logs entre 2026-05-05 e 2026-05-08 (período de corte)
  console.log('\n\n🔍 ANÁLISE DO PERÍODO DE CORTE (2026-05-05 a 2026-05-08):\n');

  const { data: cutoffLogs } = await supabase
    .from('generation_logs')
    .select('stage, status, error_message, created_at')
    .gte('created_at', '2026-05-05T00:00:00Z')
    .lte('created_at', '2026-05-08T23:59:59Z')
    .order('created_at', { ascending: false });

  if (cutoffLogs && cutoffLogs.length > 0) {
    const failedDuringCutoff = cutoffLogs.filter(l => l.status === 'failed');
    console.log(`Total de logs: ${cutoffLogs.length}`);
    console.log(`Falhados: ${failedDuringCutoff.length}`);

    if (failedDuringCutoff.length > 0) {
      console.log('\nErros encontrados:');
      for (const log of failedDuringCutoff.slice(0, 5)) {
        const stage = log.stage;
        const msg = log.error_message?.substring(0, 100) || 'N/A';
        console.log(`   - ${stage}: ${msg}`);
      }
    }
  } else {
    console.log('⚠️ Nenhum log encontrado para 2026-05-05 a 2026-05-08');
  }
}

checkLogs();
