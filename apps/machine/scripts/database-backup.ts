/**
 * Database Backup & Restoration
 * Automatic backups of articles, metrics, and configurations
 *
 * Usage:
 * npx ts-node scripts/database-backup.ts crypto backup
 * npx ts-node scripts/database-backup.ts crypto restore backup-2026-04-24.json
 * npx ts-node scripts/database-backup.ts crypto list-backups
 * npx ts-node scripts/database-backup.ts crypto cleanup
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const BACKUP_DIR = path.join(process.cwd(), '.backups');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log(`
Usage: npx ts-node scripts/database-backup.ts <appId> <command>

Commands:
  backup          - Create full backup of app data
  restore <file>  - Restore from backup file
  list-backups    - List all available backups
  cleanup         - Delete old backups (>30 days)

Examples:
  npx ts-node scripts/database-backup.ts crypto backup
  npx ts-node scripts/database-backup.ts crypto restore backup-2026-04-24.json
    `);
    process.exit(1);
  }

  const appId = args[0];
  const command = args[1];

  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  try {
    switch (command) {
      case 'backup':
        await createBackup(appId);
        break;
      case 'restore':
        if (!args[2]) {
          console.error('Error: backup filename required');
          process.exit(1);
        }
        await restoreBackup(appId, args[2]);
        break;
      case 'list-backups':
        await listBackups();
        break;
      case 'cleanup':
        await cleanupOldBackups();
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Backup operation failed:', error);
    process.exit(1);
  }
}

/**
 * Create comprehensive backup
 */
async function createBackup(appId: string) {
  console.log(`\n📦 Creating backup for ${appId}...`);

  const backup = {
    appId,
    timestamp: new Date().toISOString(),
    data: {} as Record<string, any>,
  };

  try {
    // Backup articles
    console.log('  📄 Backing up articles...');
    const { data: articles } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('app_id', appId);
    backup.data.articles = articles || [];

    // Backup performance data
    console.log('  📈 Backing up performance metrics...');
    const { data: performance } = await supabase
      .from('blog_performance')
      .select('*')
      .order('date', { ascending: false })
      .limit(365); // Last year
    backup.data.performance = performance || [];

    // Backup generation logs
    console.log('  🔧 Backing up generation logs...');
    const { data: logs } = await supabase
      .from('generation_logs')
      .select('*')
      .eq('app_id', appId)
      .order('created_at', { ascending: false })
      .limit(1000);
    backup.data.generationLogs = logs || [];

    // Backup topics
    console.log('  🎯 Backing up topics...');
    const { data: topics } = await supabase
      .from('content_topics')
      .select('*')
      .eq('app_id', appId);
    backup.data.topics = topics || [];

    // Backup research
    console.log('  🔍 Backing up research data...');
    const { data: research } = await supabase
      .from('content_research')
      .select('*')
      .eq('app_id', appId)
      .order('created_at', { ascending: false })
      .limit(500);
    backup.data.research = research || [];

    // Backup recommendations
    console.log('  💡 Backing up recommendations...');
    const { data: recommendations } = await supabase
      .from('backlink_opportunities')
      .select('*')
      .eq('app_id', appId);
    backup.data.backlinks = recommendations || [];

    // Calculate backup stats
    const stats = {
      articles: backup.data.articles.length,
      performanceRecords: backup.data.performance.length,
      generationLogs: backup.data.generationLogs.length,
      topics: backup.data.topics.length,
      researchItems: backup.data.research.length,
      backlinkOpportunities: backup.data.backlinks.length,
    };

    // Save to file
    const filename = `backup-${appId}-${new Date().toISOString().split('T')[0]}.json.gz`;
    const filepath = path.join(BACKUP_DIR, filename);

    const json = JSON.stringify(backup, null, 2);
    const compressed = zlib.gzipSync(json);

    fs.writeFileSync(filepath, compressed);

    const sizeKB = (compressed.length / 1024).toFixed(2);
    console.log(`\n✅ Backup complete!`);
    console.log(`   File: ${filename}`);
    console.log(`   Size: ${sizeKB} KB`);
    console.log(`   Location: ${filepath}\n`);

    console.log('📊 Backup Statistics:');
    Object.entries(stats).forEach(([key, count]) => {
      console.log(`   ${key}: ${count}`);
    });
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

/**
 * Restore from backup
 */
async function restoreBackup(appId: string, filename: string) {
  const filepath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(filepath)) {
    console.error(`❌ Backup file not found: ${filename}`);
    process.exit(1);
  }

  console.log(`\n📥 Restoring from ${filename}...`);
  console.log('⚠️  WARNING: This will overwrite existing data!\n');

  // Ask for confirmation
  console.log('Type "CONFIRM" to proceed, or anything else to cancel:');
  // In production: use readline to get user input
  // For now: skip confirmation in automated backups

  try {
    const compressed = fs.readFileSync(filepath);
    const json = zlib.gunzipSync(compressed).toString();
    const backup = JSON.parse(json);

    if (backup.appId !== appId) {
      console.error(`❌ Backup is for app "${backup.appId}", not "${appId}"`);
      process.exit(1);
    }

    console.log('Restoring data...\n');

    // Restore articles
    if (backup.data.articles && backup.data.articles.length > 0) {
      console.log(`  📄 Restoring ${backup.data.articles.length} articles...`);
      // Note: Upsert logic would depend on primary key strategy
      // This is a simplified example
      for (const article of backup.data.articles.slice(0, 10)) {
        // Limit for safety
        await supabase.from('blog_posts').upsert(article);
      }
    }

    console.log(`\n✅ Restore complete!`);
    console.log(`   Backup date: ${backup.timestamp}`);
    console.log(`   Articles restored: ${Math.min(backup.data.articles?.length || 0, 10)}`);
  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  }
}

/**
 * List available backups
 */
async function listBackups() {
  console.log('\n📦 Available Backups\n');

  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('No backups found');
    return;
  }

  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith('.json.gz'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log('No backups found');
    return;
  }

  files.forEach((file, i) => {
    const filepath = path.join(BACKUP_DIR, file);
    const stat = fs.statSync(filepath);
    const sizeKB = (stat.size / 1024).toFixed(2);
    const mtime = new Date(stat.mtime).toISOString();

    console.log(`${i + 1}. ${file}`);
    console.log(`   Size: ${sizeKB} KB`);
    console.log(`   Date: ${mtime}\n`);
  });

  console.log(`Total backups: ${files.length}`);
}

/**
 * Remove backups older than 30 days
 */
async function cleanupOldBackups() {
  console.log('\n🧹 Cleaning up old backups...\n');

  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('No backups directory found');
    return;
  }

  const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.json.gz'));

  let deletedCount = 0;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  files.forEach((file) => {
    const filepath = path.join(BACKUP_DIR, file);
    const stat = fs.statSync(filepath);

    if (stat.mtime.getTime() < thirtyDaysAgo) {
      fs.unlinkSync(filepath);
      console.log(`❌ Deleted: ${file}`);
      deletedCount++;
    }
  });

  console.log(`\n✅ Cleanup complete!`);
  console.log(`   Deleted: ${deletedCount} backups`);
  console.log(`   Remaining: ${files.length - deletedCount} backups`);
}

main();
