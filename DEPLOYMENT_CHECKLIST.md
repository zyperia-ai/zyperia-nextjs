# 🚀 ZYPERIA Deployment Checklist

## Status: QUASE PRONTO
- ✅ CJ (Commission Junction): 3 properties ativas
- ✅ Local builds: Passam (crypto, intelligence, onlinebiz)
- ✅ Monorepo: Configurado (pnpm + Turborepo)
- ⏳ **PRÓXIMO: Supabase + Vercel Deploy**

---

## 1️⃣ SUPABASE MIGRATIONS (2 minutos)

**Ficheiro pronto:** `SUPABASE_MIGRATIONS_COPY_PASTE.sql` (354 linhas)

**Passos:**
1. Abre: https://app.supabase.com/project/echhftptqtznxqpvjgta/sql/new
2. Abre o ficheiro `SUPABASE_MIGRATIONS_COPY_PASTE.sql` neste directório
3. Copia TODO o conteúdo
4. Cola no editor SQL do Supabase
5. Clica **"RUN"**

**Resultado esperado:**
```
✅ 354 lines executed
- 6 CREATE TABLE
- 20+ ALTER TABLE
- 10+ CREATE INDEX
- 4+ CREATE POLICY
```

**Tabelas criadas:**
- blog_posts (multi-app com brutal system)
- content_research (competitive analysis)
- affiliate_platforms, affiliate_links, affiliate_clicks, affiliate_stats, affiliate_revenue
- theme_config, generation_logs, content_topics, blog_performance

---

## 2️⃣ VERCEL DEPLOYMENT (10-15 minutos)

### Opção A: Via Vercel Dashboard (Mais Fácil)

**Para cada projeto (3 total):**

1. Vai a: https://vercel.com/new
2. Seleciona repositório: `zyperya-ais-projects/zyperia-nextjs`
3. Preenche:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/crypto` (ou `apps/intelligence`, `apps/onlinebiz`)
   - **Project Name:** `zyperia-crypto` (ou `zyperia-intelligence`, `zyperia-onlinebiz`)
   - **Build & Development Settings:** Default (automático)
4. Clica **"Deploy"**
5. Espera ~3-5 min até terminar o build

**Depois de Deploy (para CADA projecto):**
- Va para **Settings → Environment Variables**
- Adiciona estas variáveis (valores em `.env.local`):

```
SUPABASE_URL
SUPABASE_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
RESEND_API_KEY
ANTHROPIC_API_KEY
```

- Clica **"Save"**
- Vai para **Settings → Domains** e adiciona:
  - `crypto.zyperia.ai` → Crypto project
  - `intelligence.zyperia.ai` → Intelligence project
  - `onlinebiz.zyperia.ai` → OnlineBiz project

---

## 3️⃣ CONFIGURAR DOMÍNIOS (5 minutos)

**Após adicionar domínios em Vercel:**

Vai a: https://namecheap.com (ou teu registar)
- `crypto.zyperia.ai` → CNAME apontando para Vercel
- `intelligence.zyperia.ai` → CNAME apontando para Vercel
- `onlinebiz.zyperia.ai` → CNAME apontando para Vercel

**Cada Vercel project fornece o CNAME exact após adicionar domínio.**

---

## 4️⃣ VERIFICAÇÃO FINAL

Quando tudo estiver pronto:

```bash
# Testa cada site
curl https://crypto.zyperia.ai
curl https://intelligence.zyperia.ai
curl https://onlinebiz.zyperia.ai

# Deve retornar 200 OK + HTML
```

---

## 📊 Timeline Total: ~30 minutos

| Tarefa | Tempo | Dependências |
|--------|-------|--------------|
| Supabase migrations | 2 min | ✅ Ready |
| Vercel deploy (3 projects) | 15 min | ✅ Ready |
| Environment variables | 3 min | ✅ Ready |
| Domínios | 5 min | ✅ Vercel projects live |
| Verificação | 5 min | ✅ Tudo acima |

---

## ⚡ Depois de Deploy Completo

### Imediatamente:
- [ ] Aplicar Google Search Console (GSC) em cada domínio
- [ ] Setup GA4 para tracking
- [ ] Verificar Core Web Vitals (Lighthouse >90)

### Dentro de 2-4 semanas:
- [ ] Aplicar Google AdSense
- [ ] Configurar afiliados em CJ
- [ ] Começar content machine (Stages 0-6)

### Métricas a Acompanhar:
- Traffic (esperado: 1-5k visitors/mês na FASE 1)
- Affiliate CTR (esperado: >1%)
- Core Web Vitals (alvo: >90 score)

---

## 🆘 Se houver erros:

**Vercel build error:**
- Verifica se SUPABASE_URL e chaves estão correctas
- Tenta redeploy

**Domínio não resolve:**
- Aguarda 24-48h (DNS propagation)
- Verifica CNAME em DNS provider

**Supabase error:**
- Verifica se service role key é válida
- Tenta executar migrations novamente

---

## ✅ Deployment COMPLETO quando:

- [ ] 3 sites live em Vercel (zyperia-crypto, zyperia-intelligence, zyperia-onlinebiz)
- [ ] Domínios apontam correctamente (crypto.zyperia.ai, etc.)
- [ ] Environment variables configuradas
- [ ] Supabase schema criada (6 tabelas + indexes + RLS)
- [ ] Cada site carrega em <3 segundos
- [ ] Sem erros de build ou deployment

---

**Status:** PRONTO PARA DEPLOY 🚀

Toma os passos acima em qualquer ordem. Supabase é independente de Vercel.
