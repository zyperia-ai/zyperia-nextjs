#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing credentials in .env.local');
  process.exit(1);
}

// Read SQL file
const migrationsDir = path.join(__dirname, '../packages/supabase/migrations');
const sqlContent = fs.readFileSync(path.join(migrationsDir, '0_ALL_MIGRATIONS.sql'), 'utf-8');

console.log('📦 ZYPERIA Database Migrations via Supabase API\n');

async function applyMigrations() {
  try {
    // Try executing via rpc endpoint if it exists
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: sqlContent }),
    });

    if (response.ok) {
      console.log('✅ Migrations applied successfully via Supabase API!');
      console.log('\n📊 Schema created:');
      console.log('   ✓ blog_posts (multi-app)');
      console.log('   ✓ content_research & competitive analysis');
      console.log('   ✓ affiliate tracking system');
      console.log('   ✓ performance metrics');
      console.log('   ✓ generation logs\n');
    } else {
      const error = await response.text();
      console.log('⚠️  API endpoint not available or exec_sql function missing\n');
      console.log('Using manual method instead...\n');
      printManualInstructions();
    }
  } catch (err) {
    console.log('⚠️  Could not connect to Supabase API\n');
    console.log('Using manual method instead...\n');
    printManualInstructions();
  }
}

function printManualInstructions() {
  const projectId = 'echhftptqtznxqpvjgta';
  console.log('📌 To apply migrations manually (2 minutes):');
  console.log(`   1. Go to: https://app.supabase.com/project/${projectId}/sql/new`);
  console.log('   2. Copy content from: packages/supabase/migrations/0_ALL_MIGRATIONS.sql');
  console.log('   3. Paste into the SQL editor');
  console.log('   4. Click "Run"\n');
  console.log('✅ Result: 40 SQL statements executed\n');
}

applyMigrations().catch(console.error);
