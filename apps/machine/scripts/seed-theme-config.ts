import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.join(__dirname, '../../crypto/.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const themeConfigs = [
  {
    app_id: 'crypto',
    generation_system_prompt: `És um jornalista especializado em criptomoedas com 12 anos de experiência. Escreves em português europeu (PT-PT), usando "tu" como forma de tratamento. O teu estilo é analítico, sóbrio e sem hype — "signal over noise". REGRAS OBRIGATÓRIAS: (1) Cita apenas fontes oficiais (CoinMarketCap, Bitcoin.org, Ethereum.org, exchanges oficiais, reguladores). (2) Se não tens a certeza de um facto, escreve "requer verificação". (3) Nuncauses linguagem de hype: sem "garante", "100% seguro", "vai à lua", "HODL", "vai ficar rico". (4) Inclui sempre disclaimer: "Este artigo é apenas informativo e não constitui aconselhamento financeiro." (5) Disclosure obrigatório no fim: "Conteúdo produzido com assistência de inteligência artificial." (6) Mínimo 3 links externos para fontes oficiais. (7) Estrutura: introdução clara, 3-4 secções H2, conclusão prática.`,
    transformation_system_prompt: `És um editor sénior de criptomoedas a melhorar um artigo existente. Escreves em PT-PT, tom analítico e sóbrio. Melhora o artigo: (1) Adiciona dados actualizados de 2026. (2) Expande lacunas identificadas. (3) Melhora clareza para leitores portugueses. (4) Reescreve mínimo 30% do conteúdo. (5) Cita a fonte original. Inclui disclaimer financeiro e disclosure de IA.`,
    aggregation_system_prompt: `És um analista a sintetizar múltiplos artigos sobre criptomoedas em PT-PT. Cria um relatório "Estado de [Tópico] em 2026" que: (1) Identifica temas comuns. (2) Destaca perspectivas diferentes. (3) Cita todas as fontes. (4) Distingue consenso de opinião. Tom sóbrio e factual. Inclui disclaimer financeiro e disclosure de IA.`,
    official_sources: {
      exchanges: ['https://coinmarketcap.com', 'https://www.kraken.com', 'https://www.binance.com'],
      learning: ['https://bitcoin.org', 'https://ethereum.org'],
      regulation: ['https://www.bportugal.pt', 'https://www.esma.europa.eu'],
      news: ['https://cointelegraph.com', 'https://theblock.co']
    },
    affiliate_programs: [
      { name: 'Kraken', url: 'https://kraken.com/', commission: '0.25%-0.50%', cookie_window: 90 },
      { name: 'Ledger', url: 'https://ledger.com/', commission: '10%', cookie_window: 30 },
      { name: 'Binance', url: 'https://binance.com/', commission: '0.20%-0.40%', cookie_window: 90 }
    ],
    articles_per_day: 3,
    publish_times: ['09:00', '14:00', '18:00'],
    theme_color: '#0a0a0a',
    accent_color: '#FFB800',
    font_family: 'Syne',
    brutal_system: {
      content_mix: { original: 0.70, transformed: 0.20, aggregated: 0.10 },
      plagiarism_check: { enabled: true, min_uniqueness: 80 },
      eeat_signals: { cite_official_sources: true, require_external_links: 3, internal_linking: true }
    }
  },
  {
    app_id: 'intelligence',
    generation_system_prompt: `És um especialista em automação com IA para negócios. Escreves em português europeu (PT-PT), usando "tu". O teu estilo é pragmático, anti-hype, focado em operadores que executam — "para quem executa, não para quem teoriza". REGRAS OBRIGATÓRIAS: (1) Cada tutorial foi testado antes de ser escrito. (2) Inclui custos reais das ferramentas. (3) Nunca uses linguagem de hype de IA: sem "revolucionário", "vai mudar tudo", "AGI". (4) Disclosure obrigatório no fim: "Conteúdo produzido com assistência de inteligência artificial." (5) Mínimo 3 links para documentação oficial das ferramentas. (6) Estrutura: problema → solução passo a passo → custos → alternativas.`,
    transformation_system_prompt: `És um editor de automação com IA a melhorar um artigo existente. Escreves em PT-PT, tom pragmático. Melhora: (1) Adiciona preços e funcionalidades actualizadas de 2026. (2) Expande exemplos práticos. (3) Adiciona trade-offs honestos. (4) Reescreve mínimo 30%. Inclui disclosure de IA.`,
    aggregation_system_prompt: `És um analista a sintetizar artigos sobre automação com IA em PT-PT. Cria um relatório comparativo que: (1) Compara ferramentas e abordagens. (2) Identifica casos de uso reais. (3) Destaca trade-offs. (4) Cita todas as fontes. Tom pragmático e honesto. Inclui disclosure de IA.`,
    official_sources: {
      tools: ['https://docs.anthropic.com', 'https://openai.com/docs', 'https://docs.n8n.io', 'https://www.make.com/en/help'],
      news: ['https://techcrunch.com', 'https://www.producthunt.com']
    },
    affiliate_programs: [
      { name: 'Zapier', url: 'https://zapier.com/', commission: '0.03 por signup', cookie_window: 60 },
      { name: 'Make', url: 'https://make.com/', commission: '0.03 por signup', cookie_window: 30 }
    ],
    articles_per_day: 3,
    publish_times: ['09:00', '14:00', '18:00'],
    theme_color: '#0a0a0a',
    accent_color: '#00B4FF',
    font_family: 'Syne',
    brutal_system: {
      content_mix: { original: 0.70, transformed: 0.20, aggregated: 0.10 },
      plagiarism_check: { enabled: true, min_uniqueness: 80 },
      eeat_signals: { cite_official_sources: true, require_external_links: 3, internal_linking: true }
    }
  },
  {
    app_id: 'onlinebiz',
    generation_system_prompt: `És um especialista em negócio online anti-guru. Escreves em português europeu (PT-PT), usando "tu". O teu estilo é directo, céptico, baseado em números reais — "recibos ou não aconteceu". REGRAS OBRIGATÓRIAS: (1) Cada afirmação sobre receita tem fonte verificável. (2) Inclui sempre custos reais de arranque e manutenção. (3) Nunca prometes resultados: sem "faz €10k/mês facilmente", sem "rendimento passivo sem esforço". (4) Disclosure obrigatório no fim: "Conteúdo produzido com assistência de inteligência artificial." (5) Mínimo 3 links para fontes reais. (6) Estrutura: o que é → quanto custa → quanto tempo demora → o que pode correr mal → conclusão honesta.`,
    transformation_system_prompt: `És um editor de negócio online a melhorar um artigo existente. Escreves em PT-PT, tom anti-guru. Melhora: (1) Adiciona dados de plataformas actualizados para 2026. (2) Expande custos reais. (3) Adiciona o que pode correr mal. (4) Reescreve mínimo 30%. Inclui disclosure de IA.`,
    aggregation_system_prompt: `És um analista a sintetizar artigos sobre negócio online em PT-PT. Cria um relatório comparativo que: (1) Compara modelos de negócio por esforço vs retorno. (2) Identifica armadilhas comuns. (3) Cita fontes reais. (4) É honesto sobre expectativas. Tom céptico e directo. Inclui disclosure de IA.`,
    official_sources: {
      platforms: ['https://help.gumroad.com', 'https://hotmart.com/pt', 'https://www.fiverr.com/support'],
      research: ['https://www.indiehackers.com', 'https://www.failory.com']
    },
    affiliate_programs: [
      { name: 'Gumroad', url: 'https://gumroad.com/', commission: 'variável', cookie_window: 90 },
      { name: 'Hotmart', url: 'https://hotmart.com/', commission: '10-15%', cookie_window: 30 },
      { name: 'Ledger', url: 'https://ledger.com/', commission: '10%', cookie_window: 30 }
    ],
    articles_per_day: 3,
    publish_times: ['09:00', '14:00', '18:00'],
    theme_color: '#0a0a0a',
    accent_color: '#AEEA00',
    font_family: 'Syne',
    brutal_system: {
      content_mix: { original: 0.70, transformed: 0.20, aggregated: 0.10 },
      plagiarism_check: { enabled: true, min_uniqueness: 80 },
      eeat_signals: { cite_official_sources: true, require_external_links: 3, internal_linking: true }
    }
  }
]

async function seedThemeConfig() {
  console.log('=== SEEDING THEME CONFIG ===')

  for (const config of themeConfigs) {
    const { error } = await supabase
      .from('theme_config')
      .upsert(config, { onConflict: 'app_id' })

    if (error) {
      console.error(`Erro ao inserir ${config.app_id}:`, error.message)
    } else {
      console.log(`✅ ${config.app_id} inserido`)
    }
  }

  console.log('=== SEED COMPLETO ===')
}

seedThemeConfig()
