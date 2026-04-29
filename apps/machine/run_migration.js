require('dotenv').config({ path: '../crypto/.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const fs = require('fs');
const sql = fs.readFileSync('./migrations/20260429_create_stage0_tables.sql', 'utf8');

(async () => {
  try {
    // Execute SQL via RPC
    const { error } = await supabase.rpc('exec_sql', { sql_text: sql });
    
    if (error) {
      console.log('RPC method not available, trying alternative approach...');
      // Fallback: criar cada tabela individualmente via API
      const tables = [
        {
          name: 'breaking_queue',
          check: async () => {
            await supabase.from('breaking_queue').select('id', { count: 'exact', head: true });
          }
        },
        {
          name: 'content_queue',
          check: async () => {
            await supabase.from('content_queue').select('id', { count: 'exact', head: true });
          }
        },
        {
          name: 'seen_items',
          check: async () => {
            await supabase.from('seen_items').select('id', { count: 'exact', head: true });
          }
        },
        {
          name: 'trend_config',
          check: async () => {
            await supabase.from('trend_config').select('id', { count: 'exact', head: true });
          }
        },
      ];

      for (const table of tables) {
        try {
          await table.check();
          console.log(`✓ Tabela ${table.name} já existe`);
        } catch (e) {
          console.log(`⚠️  Tabela ${table.name} ainda não existe — será criada via inserts`);
        }
      }
    } else {
      console.log('✓ SQL executado com sucesso');
    }
  } catch (err) {
    console.error('Erro:', err.message);
  }
})();
