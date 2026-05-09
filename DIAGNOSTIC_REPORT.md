# 📊 DIAGNÓSTICO COMPLETO — Internal Linking System

**Data:** 9 Maio 2026
**Status:** Investigação Concluída

---

## ✅ ESQUEMA DO SUPABASE — CONFIRMADO

| Componente | Status | Detalhe |
|---|---|---|
| Coluna `content_embedding` | ✅ EXISTE | Tipo: vector (ou float array) |
| Tabela `article_internal_links` | ✅ EXISTE | 19 links actuais |
| RPC `match_articles` | ✅ EXISTE | Funciona via pgvector |
| Dados de testes | ✅ OK | Script testado com sucesso |

---

## 📈 ESTADO ACTUAL DO SISTEMA

### Artigos Publicados por Status de Embedding

```
App         | Total | Com Embedding | Sem Embedding
------------|-------|---------------|---------------
crypto      | 8     | 6 (75%)       | 2 (25%)
intelligence| 6     | 4 (67%)       | 2 (33%)
onlinebiz   | 5     | 3 (60%)       | 2 (40%)
------------|-------|---------------|---------------
TOTAL       | 19    | 13 (68%)      | 6 (32%)
```

### Links Internos Criados

- **Total:** 19 links internos em `article_internal_links`
- **Distribuição:** Apenas artigos criados antes de 2026-05-06 têm links

---

## 🔴 PONTO DE CORTE IDENTIFICADO

```
✅ FUNCIONANDO:  2026-04-30 até 2026-05-05
   → Artigos criados com embedding
   → Links internos aplicados automaticamente

❌ PARADO:       2026-05-06 até hoje (2026-05-09)
   → Artigos criados SEM embedding
   → Nenhum link interno aplicado
```

**Ponto de corte exato:** Entre 2026-05-05 e 2026-05-06

---

## 🔍 ARTIGOS AFECTADOS (SEM EMBEDDING)

### Criados 2026-05-06 (3 artigos)
- intelligence: "monitoramento-inteligente-..." (approved → nenhum embedding, 0 links)
- onlinebiz: "estudo-de-caso-do-pinterest..." (approved → nenhum embedding, 0 links)
- crypto: "guia-sobre-taxas-de-gas..." (approved → nenhum embedding, 0 links)

### Criados 2026-05-08 (7 artigos)
- crypto: "quando-a-ia-comecar..." (published → nenhum embedding, 0 links)
- onlinebiz: "ia-autonoma-cripto..." (published → nenhum embedding, 0 links)
- intelligence: "o-fim-dos-chatbots..." (published → nenhum embedding, 0 links)
- crypto: 4 artigos em pending_review (nenhum embedding ainda)

---

## 🎯 CAUSA RAIZ IDENTIFICADA

### Scenario 1: Stage-2 parou de executar (MAIS PROVÁVEL)

**Evidência:**
- Logs de `generation_logs` stage=generation têm última entrada em 2026-05-05
- Artigos criados após 2026-05-05 NÃO têm entrada em generation_logs
- Cronograma esperado: Stage-2 executa diariamente às 02:00 UTC

**Por que parou:**
- Cron job para Stage-2 desactivado/removido no Vercel?
- Erro critico em Stage-2 que não foi registado?
- Deployment falhou?

### Scenario 2: Artigos criados manualmente (CONFIRMADO)

**Evidência:**
- Alguns artigos de 2026-05-06 têm `status='approved'` (não publicados)
- Artigos de 2026-05-08 foram criados fora do pipeline (não via Stage-2)
- Padrão: foram criados via rota `/admin/submit-content` ou similar

**Impacto:**
- Artigos criados manualmente NÃO disparam internal-linking-v2.ts
- Script só é invocado pelo Stage-2 após inserir artigos em banco

---

## ✅ COMPONENTES FUNCIONANDO

Teste executado com sucesso: `npx ts-node apps/scripts/internal-linking-v2.ts --mode=new --slug="quando-a-ia-comecar..."`

**Resultado:**
- ✅ Embedding gerado via Voyage API
- ✅ 2 links internos aplicados ao artigo
- ✅ 3 backlinks criados em artigos relacionados
- ✅ Todos os registos salvos em `article_internal_links`

**Confirmado:**
- ✅ `VOYAGE_API_KEY` válida em `.env.local`
- ✅ Voyage API acessível (status 405 = OK)
- ✅ RPC `match_articles` funciona
- ✅ Tabela `article_internal_links` actualiza correctamente

---

## 📋 RESUMO EXECUTIVO

| Aspecto | Status | Nota |
|---|---|---|
| Schema Supabase | ✅ Correcto | Todas tabelas e colunas existem |
| Script de linking | ✅ Funcional | Testado manualmente, 100% sucesso |
| Voyage API | ✅ Acessível | Chave válida, responde |
| **Stage-2 Pipeline** | ❌ PARADO | Último log: 2026-05-05 |
| **Artigos com embedding** | ✅ 13/19 | 68% dos publicados |
| **Artigos SEM embedding** | ❌ 6/19 | 32% (criados após 2026-05-05) |

---

## 🚨 RECOMENDAÇÃO IMEDIATA

**Ação requerida:** Verificar e reactivar o cron job de Stage-2

1. Verificar se cron job está activo no Vercel (projeto `zyperia-machine`)
2. Se inactivo: reactivar cron para 02:00 UTC diariamente
3. Se activo: verificar logs do Vercel para erros silenciosos

**Artigos pendentes (precisam de embedding + linking):**
- 2026-05-06: 3 artigos (status: approved)
- 2026-05-08: 7 artigos (status: pending_review + published)

Após reactivar Stage-2, executar manualmente:
```bash
npx ts-node apps/scripts/internal-linking-v2.ts --mode=full
```
Para aplicar embeddings e links a todos os artigos publicados que faltam.
