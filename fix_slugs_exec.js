const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://echhftptqtznxqpvjgta.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaGhmdHB0cXR6bnhxcHZqZ3RhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk1MzMyNiwiZXhwIjoyMDkyNTI5MzI2fQ.3LpwhyjAz_34Emsr1DVBKQk_4KLIjyY_ScG6OE_VzFA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const updates = [
  // Crypto (8)
  { app_id: 'crypto', oldSlug: 'gestao-de-risco-em-sistemas-algoritmicos-o-guia-que-ninguem-escreveu-mowi9om3', newSlug: 'gestao-de-risco-em-sistemas-algoritmicos-o-guia-que-ninguem-escreveu' },
  { app_id: 'crypto', oldSlug: 'os-7-erros-que-destroem-sistemas-de-trading-com-ia-mowi2tc2', newSlug: 'os-7-erros-que-destroem-sistemas-de-trading-com-ia' },
  { app_id: 'crypto', oldSlug: 'como-escolher-uma-plataforma-de-trading-automatizado-sem-ser-enganado-mowhsr0c', newSlug: 'como-escolher-uma-plataforma-de-trading-automatizado-sem-ser-enganado' },
  { app_id: 'crypto', oldSlug: 'a-camada-invisivel-que-move-o-mercado-cripto-o-guia-definitivo-sobre-inteligencia-artificial-no-trad-mowh6ocr', newSlug: 'a-camada-invisivel-que-move-o-mercado-cripto-o-guia-definitivo-sobre-inteligencia-artificial-no-trad' },
  { app_id: 'crypto', oldSlug: 'quando-a-ia-comecar-a-sonhar-o-que-muda-para-o-mercado-cripto-mowdoacf', newSlug: 'quando-a-ia-comecar-a-sonhar-o-que-muda-para-o-mercado-cripto' },
  { app_id: 'crypto', oldSlug: 'quando-a-inteligencia-artificial-comeca-a-debater-o-futuro-do-dinheiro-moug50yk', newSlug: 'quando-a-inteligencia-artificial-comeca-a-debater-o-futuro-do-dinheiro' },
  { app_id: 'crypto', oldSlug: 'guia-sobre-taxas-de-gas-do-ethereum', newSlug: 'guia-sobre-taxas-de-gas-do' },
  { app_id: 'crypto', oldSlug: 'o-que-e-slippage', newSlug: 'o-que-e' },
  // Intelligence (4)
  { app_id: 'intelligence', oldSlug: 'o-fim-dos-chatbots-a-ia-que-dorme-aprende-sozinha-e-evolui-sem-ti-mowdkt9p', newSlug: 'o-fim-dos-chatbots-a-ia-que-dorme-aprende-sozinha-e-evolui-sem-ti' },
  { app_id: 'intelligence', oldSlug: 'o-debate-que-a-inteligencia-artificial-ainda-nao-teve-moug092i', newSlug: 'o-debate-que-a-inteligencia-artificial-ainda-nao-teve' },
  { app_id: 'intelligence', oldSlug: 'o-que-e-um-agente-de-ia-e-como-pode-automatizar-o-teu-trabalho', newSlug: 'o-que-e-um-agente-de-ia-e-como-pode-automatizar-o-teu' },
  { app_id: 'intelligence', oldSlug: 'a-corrida-quantica-a-tecnologia-que-pode-redefinir-tudo-mori5y3p', newSlug: 'a-corrida-quantica-a-tecnologia-que-pode-redefinir-tudo' },
  // OnlineBiz (4)
  { app_id: 'onlinebiz', oldSlug: 'ia-autonoma-cripto-as-oportunidades-de-negocio-online-que-ainda-estao-no-inicio-mowevddn', newSlug: 'ia-autonoma-cripto-as-oportunidades-de-negocio-online-que-ainda-estao-no-inicio' },
  { app_id: 'onlinebiz', oldSlug: 'a-ferramenta-que-vai-mudar-a-forma-como-tomas-decisoes-de-negocio-moug31f4', newSlug: 'a-ferramenta-que-vai-mudar-a-forma-como-tomas-decisoes-de-negocio' },
  { app_id: 'onlinebiz', oldSlug: 'como-criar-um-negocio-com-youtube-shorts-em-2026-automatizado-escalavel-e-lucrativo-morlyo4q', newSlug: 'como-criar-um-negocio-com-youtube-shorts-em-2026-automatizado-escalavel-e-lucrativo' },
  { app_id: 'onlinebiz', oldSlug: 'email-marketing-fundamentos-e-praticas-eficazes', newSlug: 'email-marketing-fundamentos-e-praticas' },
];

async function fixSlugs() {
  console.log('🔧 Corrigindo slugs na tabela blog_posts...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from('blog_posts')
      .update({ slug: update.newSlug })
      .eq('app_id', update.app_id)
      .eq('slug', update.oldSlug);

    if (error) {
      console.log(`❌ ${update.app_id}: ${update.oldSlug}`);
      console.log(`   Erro: ${error.message}`);
      errorCount++;
    } else {
      console.log(`✅ ${update.app_id}: ${update.oldSlug} → ${update.newSlug}`);
      successCount++;
    }
  }

  console.log('\n📊 Resultado:');
  console.log(`   ✅ Sucesso: ${successCount}/16`);
  console.log(`   ❌ Erros: ${errorCount}/16`);

  if (errorCount === 0) {
    console.log('\n🎉 Todos os 16 slugs foram corrigidos com sucesso!');
  }
}

fixSlugs().catch(console.error);
