const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://echhftptqtznxqpvjgta.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaGhmdHB0cXR6bnhxcHZqZ3RhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk1MzMyNiwiZXhwIjoyMDkyNTI5MzI2fQ.3LpwhyjAz_34Emsr1DVBKQk_4KLIjyY_ScG6OE_VzFA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const migrationSQL = `
-- Redirects table for managing 301 permanent redirects
CREATE TABLE IF NOT EXISTS redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT NOT NULL,
  to_path TEXT NOT NULL,
  status_code INTEGER DEFAULT 301 CHECK (status_code IN (301, 302, 307, 308)),
  app_id TEXT NOT NULL CHECK (app_id IN ('crypto', 'intelligence', 'onlinebiz')),
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  UNIQUE(app_id, from_path)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_redirects_app_from_path
  ON redirects(app_id, from_path) WHERE active = TRUE;

-- Enable RLS
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Enable public read on active redirects" ON redirects
  FOR SELECT USING (active = TRUE);
`;

async function executeMigration() {
  console.log('🔄 Executando migration para criar tabela redirects...\n');

  try {
    // Execute the migration using rpc or raw SQL
    // Since Supabase doesn't allow raw SQL via JS client directly,
    // we'll use the administrative API
    
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: migrationSQL })
    });

    if (!response.ok) {
      console.log('⚠️ Nota: SQL direto não suportado via REST API.');
      console.log('\n📋 Para executar a migration, faça o seguinte:');
      console.log('1. Abra o Supabase Dashboard: https://app.supabase.com');
      console.log('2. Vá para SQL Editor > New Query');
      console.log('3. Cole o conteúdo de: packages/supabase/migrations/037_redirects_schema.sql');
      console.log('4. Execute');
      process.exit(0);
    }

    console.log('✅ Migration executada com sucesso!');
  } catch (error) {
    console.log('⚠️ Nota: SQL não pode ser executado via API. Instruções manuais abaixo:\n');
    console.log('Para criar a tabela redirects no Supabase:');
    console.log('1. Dashboard → SQL Editor → New Query');
    console.log('2. Copiar conteúdo de: packages/supabase/migrations/037_redirects_schema.sql');
    console.log('3. Executar query');
  }
}

executeMigration();
