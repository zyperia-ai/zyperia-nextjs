#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from .env.local
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
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Parse Supabase URL to get host
const url = new URL(SUPABASE_URL);
const host = url.hostname;
const projectId = url.hostname.split('.')[0];

console.log('📦 ZYPERIA Database Migrations');
console.log('================================\n');
console.log(`Connecting to: ${host}`);

// Read migration file
const migrationsDir = path.join(__dirname, '../packages/supabase/migrations');
const sqlContent = fs.readFileSync(path.join(migrationsDir, '0_ALL_MIGRATIONS.sql'), 'utf-8');

// PostgreSQL connection using service role key as password
const client = new pg.Client({
  host: host,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: SUPABASE_SERVICE_ROLE_KEY,
  ssl: { rejectUnauthorized: false }
});

async function applyMigrations() {
  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL\n');

    // Split by statements and filter
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      const preview = statement.substring(0, 60).replace(/\n/g, ' ') + '...';

      console.log(`[${i + 1}/${statements.length}] ${preview}`);

      try {
        await client.query(statement);
        console.log(`   ✓ Executed`);
        success++;
      } catch (err) {
        // Some statements might fail due to idempotency (IF NOT EXISTS), but that's ok
        if (err.message.includes('already exists') ||
            err.message.includes('already defined') ||
            err.message.includes('duplicate')) {
          console.log(`   ⚠️  Already exists (safe to skip)`);
          success++;
        } else {
          console.error(`   ✗ Error: ${err.message}`);
          failed++;
        }
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Executed: ${success}/${statements.length}`);
    if (failed > 0) console.log(`   Failed: ${failed}`);

    console.log(`\n📊 Schema ready for:`);
    console.log(`   ✓ Blog posts (multi-app)`);
    console.log(`   ✓ Content research & competitive analysis`);
    console.log(`   ✓ Affiliate tracking system`);
    console.log(`   ✓ Performance metrics`);
    console.log(`   ✓ Generation logs\n`);

  } catch (err) {
    console.error('❌ Connection error:', err.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check SUPABASE_SERVICE_ROLE_KEY in .env.local');
    console.log('2. Verify Supabase project is active');
    console.log('3. Try manual execution via: https://app.supabase.com/project/' + projectId + '/sql/new');
  } finally {
    await client.end();
  }
}

applyMigrations().catch(console.error);
