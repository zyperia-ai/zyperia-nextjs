#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticles() {
  console.log('📄 VERIFICANDO ARTIGOS POR STATUS\n');

  // Artigos publicados sem embedding (2026-05-08)
  const { data: recent } = await supabase
    .from('blog_posts')
    .select('id, app_id, slug, status, created_at, published_at, content_embedding, internal_link_count')
    .gte('created_at', '2026-05-08T00:00:00Z')
    .order('created_at', { ascending: false });

  console.log('📅 Artigos criados em 2026-05-08 (SEM EMBEDDING):\n');
  for (const article of recent || []) {
    const embed = article.content_embedding ? '✅' : '❌';
    const status = article.status;
    const links = article.internal_link_count || 0;
    console.log(`   ${embed} | ${article.app_id.padEnd(15)} | ${article.slug.substring(0, 40).padEnd(40)} | Status: ${status.padEnd(10)} | Links: ${links}`);
  }

  console.log('\n\n📄 CONTAGEM DE ARTIGOS POR STATUS:\n');

  const { data: allByStatus } = await supabase
    .from('blog_posts')
    .select('status');

  const statusCount = {};
  for (const article of allByStatus || []) {
    statusCount[article.status] = (statusCount[article.status] || 0) + 1;
  }

  for (const [status, count] of Object.entries(statusCount)) {
    console.log(`   ${status}: ${count}`);
  }

  // Verificar artigos que foram publicados DEPOIS de criados
  console.log('\n\n🔄 ARTIGOS COM DIFERENÇA ENTRE created_at E published_at:\n');

  const { data: published } = await supabase
    .from('blog_posts')
    .select('id, slug, created_at, published_at, content_embedding')
    .eq('status', 'published')
    .gte('created_at', '2026-05-05T00:00:00Z')
    .order('created_at', { ascending: false });

  for (const article of published || []) {
    if (article.published_at && article.created_at !== article.published_at) {
      const createdDate = new Date(article.created_at).toISOString().split('T')[0];
      const publishedDate = new Date(article.published_at).toISOString().split('T')[0];
      const embed = article.content_embedding ? '✅' : '❌';
      console.log(`   ${embed} | Created: ${createdDate} | Published: ${publishedDate} | ${article.slug.substring(0, 50)}`);
    }
  }
}

checkArticles();
