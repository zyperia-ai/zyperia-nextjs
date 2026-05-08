const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://echhftptqtznxqpvjgta.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaGhmdHB0cXR6bnhxcHZqZ3RhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk1MzMyNiwiZXhwIjoyMDkyNTI5MzI2fQ.3LpwhyjAz_34Emsr1DVBKQk_4KLIjyY_ScG6OE_VzFA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function validateDB() {
  console.log('🧪 TESTE 3 — Verificar Slugs sem Sufixo na BD\n');

  // Test 3: Check no articles have suffix anymore
  const { data: suffixedArticles, error: suffixError } = await supabase
    .from('blog_posts')
    .select('id, slug, app_id, title')
    .neq('slug', ''); // Just to confirm table is accessible

  if (suffixError) {
    console.error('❌ Erro ao acessar blog_posts:', suffixError);
    return;
  }

  // Filter for articles with suffix pattern (ends with -8chars)
  const withSuffix = (suffixedArticles || []).filter(a => 
    /-[a-z0-9]{8}$/.test(a.slug)
  );

  console.log('Procurando artigos com sufixo aleatório (padrão: -xxxxxxxx)...\n');
  
  if (withSuffix.length === 0) {
    console.log('✅ PASS: Nenhum artigo com sufixo encontrado');
    console.log('   Total de artigos na BD: ' + (suffixedArticles?.length || 0));
  } else {
    console.log('❌ FAIL: ' + withSuffix.length + ' artigos ainda têm sufixo:');
    withSuffix.forEach((a, i) => {
      console.log(`   ${i+1}. ${a.app_id}: ${a.slug}`);
    });
  }

  console.log('\n---\n');
  console.log('🧪 TESTE 4 — Verificar Tabela Redirects\n');

  // Test 4: Check redirects table has 16 entries
  const { data: redirects, error: redirectError } = await supabase
    .from('redirects')
    .select('*', { count: 'exact' });

  if (redirectError) {
    console.error('❌ Erro ao acessar redirects:', redirectError);
    return;
  }

  const totalRedirects = redirects?.length || 0;
  console.log('Contando registos na tabela redirects...\n');

  if (totalRedirects === 16) {
    console.log('✅ PASS: Tabela redirects tem 16 registos');
    
    // Show breakdown by app
    const byCrypto = (redirects || []).filter(r => r.app_id === 'crypto').length;
    const byIntel = (redirects || []).filter(r => r.app_id === 'intelligence').length;
    const byBiz = (redirects || []).filter(r => r.app_id === 'onlinebiz').length;
    
    console.log(`   Crypto:       ${byCrypto}`);
    console.log(`   Intelligence: ${byIntel}`);
    console.log(`   OnlineBiz:    ${byBiz}`);
  } else {
    console.log(`❌ FAIL: Tabela redirects tem ${totalRedirects} registos (esperado: 16)`);
  }

  console.log('\n---\n');
  console.log('📊 SUMÁRIO DA VALIDAÇÃO BD:\n');
  console.log(withSuffix.length === 0 ? '✅ Teste 3 PASS' : '❌ Teste 3 FAIL');
  console.log(totalRedirects === 16 ? '✅ Teste 4 PASS' : '❌ Teste 4 FAIL');
}

validateDB().catch(console.error);
