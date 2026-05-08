/**
 * Populate redirects table with slug cleanup redirects
 * Run after migration 037_redirects_schema.sql is applied
 *
 * Usage: npx ts-node apps/machine/scripts/populate-redirects.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://echhftptqtznxqpvjgta.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 16 redirects to populate (old slug with suffix → new slug without suffix)
const redirects = [
  // Crypto (8)
  {
    app_id: 'crypto',
    from_path: '/articles/gestao-de-risco-em-sistemas-algoritmicos-o-guia-que-ninguem-escreveu-mowi9om3',
    to_path: '/articles/gestao-de-risco-em-sistemas-algoritmicos-o-guia-que-ninguem-escreveu',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'crypto',
    from_path: '/articles/os-7-erros-que-destroem-sistemas-de-trading-com-ia-mowi2tc2',
    to_path: '/articles/os-7-erros-que-destroem-sistemas-de-trading-com-ia',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'crypto',
    from_path: '/articles/como-escolher-uma-plataforma-de-trading-automatizado-sem-ser-enganado-mowhsr0c',
    to_path: '/articles/como-escolher-uma-plataforma-de-trading-automatizado-sem-ser-enganado',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'crypto',
    from_path: '/articles/a-camada-invisivel-que-move-o-mercado-cripto-o-guia-definitivo-sobre-inteligencia-artificial-no-trad-mowh6ocr',
    to_path: '/articles/a-camada-invisivel-que-move-o-mercado-cripto-o-guia-definitivo-sobre-inteligencia-artificial-no-trad',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'crypto',
    from_path: '/articles/quando-a-ia-comecar-a-sonhar-o-que-muda-para-o-mercado-cripto-mowdoacf',
    to_path: '/articles/quando-a-ia-comecar-a-sonhar-o-que-muda-para-o-mercado-cripto',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'crypto',
    from_path: '/articles/quando-a-inteligencia-artificial-comeca-a-debater-o-futuro-do-dinheiro-moug50yk',
    to_path: '/articles/quando-a-inteligencia-artificial-comeca-a-debater-o-futuro-do-dinheiro',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'crypto',
    from_path: '/articles/guia-sobre-taxas-de-gas-do-ethereum',
    to_path: '/articles/guia-sobre-taxas-de-gas-do',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'crypto',
    from_path: '/articles/o-que-e-slippage',
    to_path: '/articles/o-que-e',
    reason: 'slug-suffix-cleanup',
  },
  // Intelligence (4)
  {
    app_id: 'intelligence',
    from_path: '/articles/o-fim-dos-chatbots-a-ia-que-dorme-aprende-sozinha-e-evolui-sem-ti-mowdkt9p',
    to_path: '/articles/o-fim-dos-chatbots-a-ia-que-dorme-aprende-sozinha-e-evolui-sem-ti',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'intelligence',
    from_path: '/articles/o-debate-que-a-inteligencia-artificial-ainda-nao-teve-moug092i',
    to_path: '/articles/o-debate-que-a-inteligencia-artificial-ainda-nao-teve',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'intelligence',
    from_path: '/articles/o-que-e-um-agente-de-ia-e-como-pode-automatizar-o-teu-trabalho',
    to_path: '/articles/o-que-e-um-agente-de-ia-e-como-pode-automatizar-o-teu',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'intelligence',
    from_path: '/articles/a-corrida-quantica-a-tecnologia-que-pode-redefinir-tudo-mori5y3p',
    to_path: '/articles/a-corrida-quantica-a-tecnologia-que-pode-redefinir-tudo',
    reason: 'slug-suffix-cleanup',
  },
  // OnlineBiz (4)
  {
    app_id: 'onlinebiz',
    from_path: '/articles/ia-autonoma-cripto-as-oportunidades-de-negocio-online-que-ainda-estao-no-inicio-mowevddn',
    to_path: '/articles/ia-autonoma-cripto-as-oportunidades-de-negocio-online-que-ainda-estao-no-inicio',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'onlinebiz',
    from_path: '/articles/a-ferramenta-que-vai-mudar-a-forma-como-tomas-decisoes-de-negocio-moug31f4',
    to_path: '/articles/a-ferramenta-que-vai-mudar-a-forma-como-tomas-decisoes-de-negocio',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'onlinebiz',
    from_path: '/articles/como-criar-um-negocio-com-youtube-shorts-em-2026-automatizado-escalavel-e-lucrativo-morlyo4q',
    to_path: '/articles/como-criar-um-negocio-com-youtube-shorts-em-2026-automatizado-escalavel-e-lucrativo',
    reason: 'slug-suffix-cleanup',
  },
  {
    app_id: 'onlinebiz',
    from_path: '/articles/email-marketing-fundamentos-e-praticas-eficazes',
    to_path: '/articles/email-marketing-fundamentos-e-praticas',
    reason: 'slug-suffix-cleanup',
  },
]

async function main() {
  console.log('📋 Populando tabela redirects...\n')

  const { data, error } = await supabase.from('redirects').insert(redirects)

  if (error) {
    console.error('❌ Erro ao inserir redirects:', error)
    process.exit(1)
  }

  console.log('✅ Todos os 16 redirects foram inseridos com sucesso!\n')

  // Verify
  const { data: verify } = await supabase.from('redirects').select('app_id, COUNT(*)')

  const byCrypto = redirects.filter((r) => r.app_id === 'crypto').length
  const byIntel = redirects.filter((r) => r.app_id === 'intelligence').length
  const byBiz = redirects.filter((r) => r.app_id === 'onlinebiz').length

  console.log('📊 Sumário:')
  console.log(`   Crypto:       ${byCrypto}`)
  console.log(`   Intelligence: ${byIntel}`)
  console.log(`   OnlineBiz:    ${byBiz}`)
  console.log(`   Total:        ${redirects.length}`)
}

main().catch((err) => {
  console.error('Erro:', err)
  process.exit(1)
})
