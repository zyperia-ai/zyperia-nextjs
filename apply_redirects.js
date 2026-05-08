const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://echhftptqtznxqpvjgta.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaGhmdHB0cXR6bnhxcHZqZ3RhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk1MzMyNiwiZXhwIjoyMDkyNTI5MzI2fQ.3LpwhyjAz_34Emsr1DVBKQk_4KLIjyY_ScG6OE_VzFA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

// 16 redirects to populate
const redirects = [
  // Crypto (8)
  { app_id: 'crypto', from_path: '/articles/gestao-de-risco-em-sistemas-algoritmicos-o-guia-que-ninguem-escreveu-mowi9om3', to_path: '/articles/gestao-de-risco-em-sistemas-algoritmicos-o-guia-que-ninguem-escreveu' },
  { app_id: 'crypto', from_path: '/articles/os-7-erros-que-destroem-sistemas-de-trading-com-ia-mowi2tc2', to_path: '/articles/os-7-erros-que-destroem-sistemas-de-trading-com-ia' },
  { app_id: 'crypto', from_path: '/articles/como-escolher-uma-plataforma-de-trading-automatizado-sem-ser-enganado-mowhsr0c', to_path: '/articles/como-escolher-uma-plataforma-de-trading-automatizado-sem-ser-enganado' },
  { app_id: 'crypto', from_path: '/articles/a-camada-invisivel-que-move-o-mercado-cripto-o-guia-definitivo-sobre-inteligencia-artificial-no-trad-mowh6ocr', to_path: '/articles/a-camada-invisivel-que-move-o-mercado-cripto-o-guia-definitivo-sobre-inteligencia-artificial-no-trad' },
  { app_id: 'crypto', from_path: '/articles/quando-a-ia-comecar-a-sonhar-o-que-muda-para-o-mercado-cripto-mowdoacf', to_path: '/articles/quando-a-ia-comecar-a-sonhar-o-que-muda-para-o-mercado-cripto' },
  { app_id: 'crypto', from_path: '/articles/quando-a-inteligencia-artificial-comeca-a-debater-o-futuro-do-dinheiro-moug50yk', to_path: '/articles/quando-a-inteligencia-artificial-comeca-a-debater-o-futuro-do-dinheiro' },
  { app_id: 'crypto', from_path: '/articles/guia-sobre-taxas-de-gas-do-ethereum', to_path: '/articles/guia-sobre-taxas-de-gas-do' },
  { app_id: 'crypto', from_path: '/articles/o-que-e-slippage', to_path: '/articles/o-que-e' },
  // Intelligence (4)
  { app_id: 'intelligence', from_path: '/articles/o-fim-dos-chatbots-a-ia-que-dorme-aprende-sozinha-e-evolui-sem-ti-mowdkt9p', to_path: '/articles/o-fim-dos-chatbots-a-ia-que-dorme-aprende-sozinha-e-evolui-sem-ti' },
  { app_id: 'intelligence', from_path: '/articles/o-debate-que-a-inteligencia-artificial-ainda-nao-teve-moug092i', to_path: '/articles/o-debate-que-a-inteligencia-artificial-ainda-nao-teve' },
  { app_id: 'intelligence', from_path: '/articles/o-que-e-um-agente-de-ia-e-como-pode-automatizar-o-teu-trabalho', to_path: '/articles/o-que-e-um-agente-de-ia-e-como-pode-automatizar-o-teu' },
  { app_id: 'intelligence', from_path: '/articles/a-corrida-quantica-a-tecnologia-que-pode-redefinir-tudo-mori5y3p', to_path: '/articles/a-corrida-quantica-a-tecnologia-que-pode-redefinir-tudo' },
  // OnlineBiz (4)
  { app_id: 'onlinebiz', from_path: '/articles/ia-autonoma-cripto-as-oportunidades-de-negocio-online-que-ainda-estao-no-inicio-mowevddn', to_path: '/articles/ia-autonoma-cripto-as-oportunidades-de-negocio-online-que-ainda-estao-no-inicio' },
  { app_id: 'onlinebiz', from_path: '/articles/a-ferramenta-que-vai-mudar-a-forma-como-tomas-decisoes-de-negocio-moug31f4', to_path: '/articles/a-ferramenta-que-vai-mudar-a-forma-como-tomas-decisoes-de-negocio' },
  { app_id: 'onlinebiz', from_path: '/articles/como-criar-um-negocio-com-youtube-shorts-em-2026-automatizado-escalavel-e-lucrativo-morlyo4q', to_path: '/articles/como-criar-um-negocio-com-youtube-shorts-em-2026-automatizado-escalavel-e-lucrativo' },
  { app_id: 'onlinebiz', from_path: '/articles/email-marketing-fundamentos-e-praticas-eficazes', to_path: '/articles/email-marketing-fundamentos-e-praticas' },
];

async function applyRedirects() {
  console.log('📋 Populando tabela de redirects no Supabase...\n');

  for (const redirect of redirects) {
    redirect.status_code = 301;
    redirect.reason = 'slug-suffix-cleanup';
    redirect.created_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('redirects')
    .insert(redirects);

  if (error) {
    console.error('❌ Erro ao inserir redirects:', error);
    process.exit(1);
  }

  console.log('✅ Todos os 16 redirects foram inseridos com sucesso!');
  console.log('\nSumário:');
  console.log('- Crypto: 8 redirects');
  console.log('- Intelligence: 4 redirects');
  console.log('- OnlineBiz: 4 redirects');
  console.log('- Total: 16 redirects');
}

applyRedirects().catch(console.error);
