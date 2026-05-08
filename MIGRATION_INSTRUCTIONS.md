# 📋 Instruções para Aplicar Migração e Redirects

## PASSO 1: Executar Migration no Supabase

A migration cria a tabela `redirects` necessária para os redirects 301.

### Opção A: Via Supabase Dashboard (Recomendado)

1. Abra https://app.supabase.com
2. Navegue para o projeto ZYPERIA (echhftptqtznxqpvjgta)
3. Vá para **SQL Editor** → **New Query**
4. Cole o conteúdo de `packages/supabase/migrations/037_redirects_schema.sql`
5. Clique em **RUN**

### Opção B: Via psql CLI

```bash
psql -h echhftptqtznxqpvjgta.supabase.co -U postgres -d postgres \
  -f packages/supabase/migrations/037_redirects_schema.sql
```

(Precisa de senha do Postgres — disponível em Supabase Dashboard > Settings > Database)

---

## PASSO 2: Popular Tabela de Redirects

Após a migration estar aplicada, execute o script de populate:

```bash
node apps/machine/scripts/populate-redirects.js
```

Este script insere os 16 redirects (8 Crypto, 4 Intelligence, 4 OnlineBiz) na tabela.

---

## Verificação

Para confirmar que a migration foi bem-sucedida:

1. Abra Supabase Dashboard > SQL Editor
2. Execute:
   ```sql
   SELECT COUNT(*) as total FROM redirects;
   ```
3. Resultado esperado: 16 registos

---

## Próximas Etapas

Após PARTE 2 estar completa (migration + middleware + população):

1. Deploy dos middlewares (PARTE 2 commit)
2. Corrigir slugs na BD (PARTE 3)
3. Validar redirects (PARTE 4)

