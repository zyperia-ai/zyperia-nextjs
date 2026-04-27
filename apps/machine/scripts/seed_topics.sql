-- Seed content_topics — 90 tópicos iniciais
-- Sessão 8.5.2A — 27 Abril 2026
-- Executar no Supabase Dashboard → SQL Editor APÓS nexus_schema.sql

-- CRYPTO (30 tópicos)
INSERT INTO content_topics (title, category, blog, audience_level, priority, status, angle) VALUES

-- How-to iniciante (8)
('Como criar a tua primeira carteira de criptomoedas (passo a passo)', 'BITCOIN', 'crypto', 'iniciante', 1, 'available', 'Sem pressupor conhecimento prévio. MetaMask + carteira mobile + hardware. Seed phrase com clareza. Segurança real, não FUD.'),
('Como comprar Bitcoin pela primeira vez em Portugal (2026)', 'BITCOIN', 'crypto', 'iniciante', 1, 'available', 'Passos práticos com banco PT, KYC, primeira compra. Fees a evitar. Comparação rápida 2-3 exchanges.'),
('Como guardar criptomoedas em segurança: hot wallet vs cold wallet', 'BITCOIN', 'crypto', 'iniciante', 1, 'available', 'Quando usar cada tipo. Backup da seed phrase. Erros comuns que custam fortunas.'),
('Como verificar se um endereço de cripto é seguro antes de enviar', 'BITCOIN', 'crypto', 'iniciante', 2, 'available', 'Anti-scam. Confirmar endereço, test send, reconhecer phishing.'),
('Como ler uma transação no blockchain explorer', 'BITCOIN', 'crypto', 'iniciante', 2, 'available', 'Tutorial técnico desmistificado. blockchain.com, Etherscan. Confirmar tx processada.'),
('Como configurar autenticação de dois factores na tua exchange', 'BITCOIN', 'crypto', 'iniciante', 1, 'available', 'Google Authenticator + Yubikey. Por que SMS 2FA é insuficiente. Recovery codes.'),
('Como recuperar acesso à tua carteira se perderes o telemóvel', 'BITCOIN', 'crypto', 'iniciante', 2, 'available', 'Cenários: perdes seed phrase, perdes hardware wallet, perdes acesso à exchange.'),
('Como fazer a tua primeira transação em Ethereum sem perder em gas fees', 'ETHEREUM', 'crypto', 'iniciante', 2, 'available', 'Gas explicado. Quando enviar, ajustar gas limit, quando usar Layer 2.'),

-- How-to intermédio (8)
('Como fazer staking de Ethereum: opções em 2026 e qual escolher', 'ETHEREUM', 'crypto', 'intermédio', 1, 'available', 'Solo staking vs pool (Lido, Rocket Pool) vs CEX (Kraken). Trade-offs: liquidez, controlo, fiscalidade PT.'),
('Como configurar uma wallet hardware Ledger passo a passo', 'BITCOIN', 'crypto', 'intermédio', 1, 'available', 'Unboxing → setup → primeira transação. Erros comuns. Seed phrase em metal.'),
('Como usar Uniswap pela primeira vez (sem perderes dinheiro em slippage)', 'DEFI', 'crypto', 'intermédio', 2, 'available', 'Slippage, MEV, sandwich attacks, settings. Quando NÃO usar Uniswap.'),
('Como detectar tokens scam antes de comprar (checklist 7 pontos)', 'DEFI', 'crypto', 'intermédio', 1, 'available', 'Token tracker, contrato audit, liquidity locked, dev wallet, social signals.'),
('Como migrar criptomoedas de exchange para self-custody', 'BITCOIN', 'crypto', 'intermédio', 2, 'available', 'Quando vale a pena, withdrawal limits, fees, test transactions.'),
('Como usar uma stablecoin sem riscos: USDC, USDT, DAI em 2026', 'STABLECOINS', 'crypto', 'intermédio', 2, 'available', 'Diferenças regulatórias 2026. De-pegging risks. Verificar reservas.'),
('Como participar em yield farming sem perder dinheiro (guia segurança)', 'DEFI', 'crypto', 'intermédio', 3, 'available', 'APY irreal, impermanent loss, smart contract risk. Começar com €50, não €5000.'),
('Como fazer bridge de Ethereum para uma Layer 2 (Arbitrum, Optimism, Base)', 'LAYER2', 'crypto', 'intermédio', 2, 'available', 'Bridges oficiais vs third-party. Custos reais. Riscos após hacks.'),

-- How-to avançado (5)
('Como configurar um nó Bitcoin Lightning em casa', 'BITCOIN', 'crypto', 'avançado', 3, 'available', 'Hardware (Umbrel, Raspberry Pi), abrir channels, routing. Realista sobre tempo + custo.'),
('Como auditar um smart contract antes de interagires', 'DEFI', 'crypto', 'avançado', 3, 'available', 'Etherscan verified, mint functions, owner privileges, common red flags.'),
('Como declarar criptomoedas no IRS português (passo a passo 2026)', 'REGULATION', 'crypto', 'intermédio', 1, 'available', 'PT-específico. Quadro fiscal post-2023, mais-valias, staking taxation. Disclaimer: consultar contabilista.'),
('Como configurar alertas de preço e on-chain sem ficar viciado', 'BITCOIN', 'crypto', 'intermédio', 3, 'available', 'CoinGecko alerts, on-chain via Glassnode. Boundaries para evitar trading emocional.'),
('Como usar DeFi com carteira hardware (Ledger + MetaMask)', 'DEFI', 'crypto', 'intermédio', 2, 'available', 'Segurança máxima em DeFi. Setup, blind signing risks, alternativas.'),

-- Comparação (6)
('Kraken vs Binance vs Bitvavo: qual exchange para portugueses em 2026?', 'BITCOIN', 'crypto', 'iniciante', 1, 'available', 'Fees reais, KYC PT, IBAN suporte, regulação MICA. Comparação honesta.'),
('Ledger vs Trezor vs Coldcard: qual hardware wallet escolher?', 'BITCOIN', 'crypto', 'intermédio', 1, 'available', 'Open source vs closed, supply chain, Ledger Recover controversy. Para quem é cada uma.'),
('MetaMask vs Rabby vs Frame: qual carteira browser usar?', 'ETHEREUM', 'crypto', 'intermédio', 2, 'available', 'Security features, multi-chain, hardware wallet integration, UX.'),
('Lido vs Rocket Pool vs solo staking: melhor forma de fazer staking ETH', 'ETHEREUM', 'crypto', 'intermédio', 2, 'available', 'Centralização, riscos, retornos reais 2026, fiscalidade PT.'),
('Arbitrum vs Optimism vs Base vs zkSync: qual Layer 2 usar?', 'LAYER2', 'crypto', 'intermédio', 3, 'available', 'Custos médios, ecossistema dApps, tempo finality, rollup type.'),
('Carteiras mobile vs hardware vs web: qual é a melhor para ti?', 'BITCOIN', 'crypto', 'iniciante', 1, 'available', 'Comparação por perfil. Decision tree claro.'),

-- Análise (3)
('MICA: o que muda para criptos em Portugal a partir de 2026', 'REGULATION', 'crypto', 'intermédio', 1, 'available', 'Análise factual. CASP licensing, stablecoins permitidas, impacto em exchanges PT.'),
('Bitcoin halving 2028: o que esperar (e o que NÃO esperar)', 'BITCOIN', 'crypto', 'intermédio', 2, 'available', 'Análise histórica de halvings. Padrões reais de preço. Disclaimer forte sobre não ser previsão.'),
('ETF Bitcoin spot na Europa: como funciona e onde comprar', 'BITCOIN', 'crypto', 'intermédio', 1, 'available', 'ETFs disponíveis para europeus. Comparação com BTC self-custody. Vantagens fiscais PT.');

-- INTELLIGENCE (30 tópicos)
INSERT INTO content_topics (title, category, blog, audience_level, priority, status, angle) VALUES

-- How-to iniciante (3)
('O que é um AI agent e como pode automatizar o teu trabalho', 'LLM', 'intelligence', 'iniciante', 2, 'available', 'Explicação prática, não teórica. Exemplos reais de tarefas automatizadas.'),
('Como começar com automação de tarefas usando Claude (sem código)', 'LLM', 'intelligence', 'iniciante', 1, 'available', 'Primeiro workflow prático em 30 minutos. Sem pressupor conhecimento técnico.'),
('Como usar prompts para poupar 2 horas por dia (guia prático)', 'LLM', 'intelligence', 'iniciante', 1, 'available', '5 tipos de prompts que toda a gente devia usar. Exemplos copy-paste.'),

-- How-to intermédio (12)
('Como construir um agente de email com Claude + n8n', 'AGENTS', 'intelligence', 'intermédio', 1, 'available', 'Workflow completo: triagem, resposta, arquivo. Deploy local. Custo real.'),
('Como automatizar relatórios semanais com Make + Claude', 'AUTOMATION', 'intelligence', 'intermédio', 1, 'available', 'Template prático. Google Sheets → Make → Claude → email. Passo a passo.'),
('Como criar um chatbot de suporte para o teu negócio (sem código)', 'AGENTS', 'intelligence', 'intermédio', 2, 'available', 'Voiceflow ou Chatbase + base de conhecimento. Deploy em 1 tarde.'),
('Como usar RAG para fazer o Claude responder sobre os teus documentos', 'LLM', 'intelligence', 'intermédio', 2, 'available', 'Conceito + implementação simples. Supabase Vector ou Pinecone. Custo.'),
('Como construir um workflow de content creation com IA (end-to-end)', 'WORKFLOW', 'intelligence', 'intermédio', 1, 'available', 'Research → outline → draft → review → publish. Ferramentas e custos reais.'),
('Como automatizar a tua presença nas redes sociais com n8n', 'AUTOMATION', 'intelligence', 'intermédio', 2, 'available', 'Repurposing de conteúdo. 1 artigo → 5 posts. Workflow sem touch.'),
('Como usar Claude API para construir a tua primeira app de IA', 'LLM', 'intelligence', 'intermédio', 2, 'available', 'Tutorial prático. Node.js + Claude API + deploy Vercel. App simples mas funcional.'),
('Como criar um sistema de monitoring com alertas automáticos por IA', 'AUTOMATION', 'intelligence', 'intermédio', 3, 'available', 'Monitorizar métricas, detectar anomalias, enviar alertas contextuais.'),
('Como integrar Claude com Google Sheets para análise automática', 'INTEGRATION', 'intelligence', 'intermédio', 2, 'available', 'Apps Script + Claude API. Análise de dados, classificação, summarização.'),
('Como construir um pipeline de processamento de PDFs com IA', 'WORKFLOW', 'intelligence', 'intermédio', 2, 'available', 'Extracção, classificação, sumarização. Ferramentas: LlamaParse, Claude.'),
('Como usar IA para melhorar o teu processo de vendas', 'AUTOMATION', 'intelligence', 'intermédio', 2, 'available', 'Qualificação de leads, follow-up, personalização. Ferramentas práticas.'),
('Como usar modelos open source localmente (Ollama + Mistral)', 'OPENSOURCE', 'intelligence', 'intermédio', 2, 'available', 'Setup em Mac/Windows/Linux. Casos de uso vs Claude API. Custos zero.'),

-- How-to avançado (6)
('Como construir um sistema multi-agent com CrewAI', 'AGENTS', 'intelligence', 'avançado', 3, 'available', 'Arquitectura, casos de uso, limitações actuais. Quando usar vs agent simples.'),
('Como implementar avaliação automática de qualidade em pipelines de IA', 'WORKFLOW', 'intelligence', 'avançado', 3, 'available', 'LLM-as-judge, métricas, logging. Garantir consistência sem revisão manual.'),
('Como construir um knowledge graph com dados da tua empresa', 'LLM', 'intelligence', 'avançado', 3, 'available', 'Extracção de entidades, relações, query. Tools open source.'),
('Como integrar MCP servers com Claude para automação avançada', 'INTEGRATION', 'intelligence', 'avançado', 3, 'available', 'O que é MCP, servers disponíveis, build do teu próprio. Exemplos práticos.'),
('Como fazer deploy de um modelo de IA em produção (guia completo)', 'LLM', 'intelligence', 'avançado', 3, 'available', 'Containerização, scaling, monitoring, custos. Sem cloud vendor lock-in.'),
('Como fazer fine-tuning de um modelo para o teu nicho (guia 2026)', 'LLM', 'intelligence', 'avançado', 3, 'available', 'Quando vale a pena, dados necessários, custo, alternativas mais simples.'),

-- Comparação (6)
('Claude vs ChatGPT vs Gemini: qual usar para cada tarefa?', 'LLM', 'intelligence', 'intermédio', 1, 'available', 'Comparação honesta por caso de uso. Tabela de strengths/weaknesses 2026.'),
('n8n vs Make vs Zapier: qual plataforma de automação escolher?', 'AUTOMATION', 'intelligence', 'intermédio', 1, 'available', 'Custo, curva de aprendizagem, limitações, self-hosted vs cloud.'),
('Cursor vs GitHub Copilot vs Cline: qual AI coding assistant usar?', 'LLM', 'intelligence', 'intermédio', 2, 'available', 'Comparação real para developers. Preço, qualidade, integração.'),
('LangChain vs LlamaIndex vs Haystack: qual framework para RAG?', 'LLM', 'intelligence', 'avançado', 3, 'available', 'Comparação técnica. Quando usar cada um. Complexidade vs valor.'),
('Voiceflow vs Botpress vs Chatbase: qual para criar chatbots?', 'AGENTS', 'intelligence', 'intermédio', 2, 'available', 'Comparação por caso de uso. No-code vs low-code. Custos reais.'),
('Replicate vs Hugging Face vs Together AI: qual para modelos open source?', 'OPENSOURCE', 'intelligence', 'avançado', 3, 'available', 'Custo por token, modelos disponíveis, latência, limites.'),

-- Conceptual (3)
('O que são AI agents em 2026: guia completo sem hype', 'AGENTS', 'intelligence', 'intermédio', 2, 'available', 'Definição honesta, estado actual, limitações reais, casos de uso válidos.'),
('Como funciona o contexto nos LLMs (e porque importa para a tua app)', 'LLM', 'intelligence', 'intermédio', 2, 'available', 'Context window, chunking, embeddings. Explicado para não-investigadores.'),
('Prompt engineering em 2026: o que ainda funciona e o que mudou', 'LLM', 'intelligence', 'intermédio', 1, 'available', 'Técnicas validadas (CoT, few-shot, etc.) vs hype. Prático e directo.');

-- ONLINEBIZ (30 tópicos)
INSERT INTO content_topics (title, category, blog, audience_level, priority, status, angle) VALUES

-- How-to setup (6)
('Como criar um site de afiliados em 2026 (guia técnico do zero)', 'AFFILIATES', 'onlinebiz', 'iniciante', 1, 'available', 'Stack real: Webflow ou WordPress, hosting, domínio, analytics. Custo real.'),
('Como escolher um nicho rentável para afiliados (metodologia 2026)', 'AFFILIATES', 'onlinebiz', 'iniciante', 1, 'available', 'Critérios: volume, concorrência, intent comercial, comissões. Ferramentas: Ahrefs lite, Google Trends.'),
('Como montar uma stack para solopreneur (ferramentas essenciais)', 'SAAS', 'onlinebiz', 'iniciante', 1, 'available', 'O mínimo para começar. Email, site, pagamentos, gestão. Custo < €50/mês.'),
('Como criar uma landing page que converte (sem designer)', 'CONTENT', 'onlinebiz', 'intermédio', 2, 'available', 'Estrutura, copy, CTA, social proof. Webflow ou Carrd. A/B testing básico.'),
('Como configurar email marketing do zero (stack completo 2026)', 'CONTENT', 'onlinebiz', 'iniciante', 1, 'available', 'ConvertKit ou Beehiiv. Double opt-in, primeiro automático, GDPR.'),
('Como montar um sistema de pagamentos simples (sem Stripe developer)', 'SAAS', 'onlinebiz', 'iniciante', 2, 'available', 'Gumroad vs Hotmart vs Lemon Squeezy. Para quem não quer código.'),

-- How-to crescimento (7)
('Como escrever conteúdo que ranqueia no Google (SEO prático 2026)', 'CONTENT', 'onlinebiz', 'intermédio', 1, 'available', 'Keyword research simples, estrutura de artigo, internal linking. Sem ferramentas caras.'),
('Como fazer link building sem spam (estratégias éticas 2026)', 'CONTENT', 'onlinebiz', 'intermédio', 2, 'available', 'Digital PR, guest posts, resource pages. O que o Google penaliza em 2026.'),
('Como crescer uma newsletter de 0 a 1000 subscritores (playbook)', 'CONTENT', 'onlinebiz', 'intermédio', 1, 'available', 'Canais de aquisição, lead magnets, frequência, churn. Métricas reais.'),
('Como usar YouTube para tráfego orgânico (sem ser influencer)', 'CONTENT', 'onlinebiz', 'intermédio', 2, 'available', 'SEO no YouTube, formatos que convertem, repurposing para blog.'),
('Como fazer parcerias estratégicas para crescer mais rápido', 'SERVICES', 'onlinebiz', 'intermédio', 2, 'available', 'Identificar parceiros, proposta de valor, estruturas de acordo.'),
('Como usar Pinterest para tráfego de afiliados (nicho específico)', 'AFFILIATES', 'onlinebiz', 'intermédio', 3, 'available', 'Nichos onde Pinterest converte. Setup conta business.'),
('Como escalar um site de afiliados de €0 a €1000/mês', 'AFFILIATES', 'onlinebiz', 'intermédio', 2, 'available', 'Fases de crescimento, quando contratar, quando automatizar.'),

-- How-to monetização (7)
('Como criar e vender um infoproduto em 30 dias (guia completo)', 'DIGITAL-PRODUCTS', 'onlinebiz', 'intermédio', 1, 'available', 'Escolher formato (ebook, curso, template), criar, validar, lançar. Sem audiência prévia.'),
('Como criar templates que se vendem passivamente', 'DIGITAL-PRODUCTS', 'onlinebiz', 'intermédio', 2, 'available', 'Notion, Figma, Canva, Excel. Mercados: Gumroad, Etsy, próprio site. Pricing.'),
('Como oferecer serviços de IA para PMEs sem ser programador', 'SERVICES', 'onlinebiz', 'intermédio', 2, 'available', 'Pacotes de automação, n8n workflows, valor entregue, pricing.'),
('Como ganhar dinheiro com newsletters (modelos de monetização)', 'CONTENT', 'onlinebiz', 'intermédio', 2, 'available', 'Sponsorships, paid tier, affiliate, produtos próprios. Quando cada um faz sentido.'),
('Como criar um programa de afiliados para o teu próprio produto', 'AFFILIATES', 'onlinebiz', 'intermédio', 3, 'available', 'Software (Rewardful, FirstPromoter), comissões, recrutamento de afiliados.'),
('Como aumentar o ticket médio com upsell e cross-sell', 'DIGITAL-PRODUCTS', 'onlinebiz', 'intermédio', 3, 'available', 'Momentos certos, formatos, copy. Sem ser pushy.'),
('Como viver de rendimentos passivos digitais: roadmap honesto', 'AFFILIATES', 'onlinebiz', 'iniciante', 1, 'available', 'Realista sobre timelines e esforço. Fases: €0→€500→€2k→€5k/mês.'),

-- Case study (6)
('Análise: site de afiliados crypto que faz €2k/mês (stack + tráfego)', 'AFFILIATES', 'onlinebiz', 'intermédio', 2, 'available', 'Breakdown detalhado. Tráfego, conversão, programas, custos. Modelo replicável.'),
('Como um solopreneur fez €15k com um ebook (do zero ao lançamento)', 'DIGITAL-PRODUCTS', 'onlinebiz', 'intermédio', 2, 'available', 'Audiência, produto, lançamento, pós-lançamento. Erros e acertos.'),
('Análise: newsletter B2B que faz €5k/mês com 3000 subscritores', 'CONTENT', 'onlinebiz', 'avançado', 3, 'available', 'Modelo de sponsorships, niche premium, taxas de abertura, monetização.'),
('Como uma agência de 1 pessoa fatura €8k/mês com automações de IA', 'SERVICES', 'onlinebiz', 'intermédio', 2, 'available', 'Pacotes de serviço, aquisição de clientes, delivery com n8n + Claude.'),
('Análise: loja de templates Notion com €1k/mês passivos', 'DIGITAL-PRODUCTS', 'onlinebiz', 'iniciante', 2, 'available', 'Criação, marketplace vs própria loja, promoção, manutenção.'),
('Como eu testei 5 ideias de negócio em 90 dias (o que funcionou)', 'SAAS', 'onlinebiz', 'intermédio', 3, 'available', 'Metodologia de validação rápida, critérios de kill/continue, resultados reais.'),

-- Comparação (4)
('Webflow vs WordPress vs Framer: qual para site de afiliados?', 'AFFILIATES', 'onlinebiz', 'iniciante', 1, 'available', 'Custo, curva de aprendizagem, SEO, manutenção. Decision tree por perfil.'),
('ConvertKit vs Beehiiv vs Substack: qual para newsletter?', 'CONTENT', 'onlinebiz', 'iniciante', 1, 'available', 'Comparação por caso de uso. Monetização, design, analytics, preço.'),
('Gumroad vs Hotmart vs Lemon Squeezy: onde vender produtos digitais?', 'DIGITAL-PRODUCTS', 'onlinebiz', 'iniciante', 2, 'available', 'Taxas, mercados, checkout, afiliados, suporte PT/BR.'),
('Ahrefs vs Semrush vs Ubersuggest: qual ferramenta SEO para iniciantes?', 'CONTENT', 'onlinebiz', 'iniciante', 2, 'available', 'Custo vs valor. O que cada um faz melhor. Alternativas gratuitas.');
