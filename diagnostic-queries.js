#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis SUPABASE não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDiagnostics() {
  console.log('🔍 DIAGNÓSTICO — Internal Linking System\n');

  try {
    // Query 1: Verificar se coluna content_embedding existe
    console.log('1️⃣ VERIFICANDO COLUNA content_embedding...');
    const { data: colInfo, error: colError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (colError) {
      console.error('❌ Erro ao acessar blog_posts:', colError.message);
    } else {
      const hasEmbedding = colInfo && colInfo[0] && 'content_embedding' in colInfo[0];
      if (hasEmbedding) {
        console.log('✅ Coluna content_embedding EXISTE');
      } else {
        console.log('❌ Coluna content_embedding NÃO EXISTE (ou está NULL em todos)');
      }
    }

    // Query 2: Verificar se tabela article_internal_links existe
    console.log('\n2️⃣ VERIFICANDO TABELA article_internal_links...');
    const { data: linksCount, error: linksError } = await supabase
      .from('article_internal_links')
      .select('id', { count: 'exact', head: true });

    if (linksError) {
      if (linksError.message.includes('not found') || linksError.message.includes('does not exist')) {
        console.log('❌ Tabela article_internal_links NÃO EXISTE');
      } else {
        console.log('❌ Erro:', linksError.message);
      }
    } else {
      console.log(`✅ Tabela article_internal_links EXISTE`);
      const { count } = await supabase
        .from('article_internal_links')
        .select('*', { count: 'exact', head: true });
      console.log(`   → Total de links: ${count || 0}`);
    }

    // Query 3: Artigos publicados com/sem embedding
    console.log('\n3️⃣ ARTIGOS COM/SEM EMBEDDING (por app)...');
    const { data: appStats, error: statsError } = await supabase
      .from('blog_posts')
      .select('app_id, content_embedding')
      .eq('status', 'published');

    if (statsError) {
      console.error('❌ Erro:', statsError.message);
    } else {
      const stats = {};
      for (const article of appStats || []) {
        if (!stats[article.app_id]) {
          stats[article.app_id] = { total: 0, com: 0, sem: 0 };
        }
        stats[article.app_id].total++;
        if (article.content_embedding !== null) {
          stats[article.app_id].com++;
        } else {
          stats[article.app_id].sem++;
        }
      }

      for (const [app, counts] of Object.entries(stats)) {
        console.log(`\n   ${app}:`);
        console.log(`   - Total publicados: ${counts.total}`);
        console.log(`   - Com embedding: ${counts.com}`);
        console.log(`   - Sem embedding: ${counts.sem}`);
      }
    }

    // Query 4: Artigos mais recentes
    console.log('\n4️⃣ ARTIGOS MAIS RECENTES (últimos 10)...');
    const { data: recent, error: recentError } = await supabase
      .from('blog_posts')
      .select('app_id, slug, created_at, content_embedding')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('❌ Erro:', recentError.message);
    } else {
      for (const article of recent || []) {
        const status = article.content_embedding ? '✅ COM' : '❌ SEM';
        console.log(`   ${status} | ${article.app_id} | ${article.slug} | ${new Date(article.created_at).toISOString().split('T')[0]}`);
      }
    }

    // Query 5: Contar links internos por blog
    console.log('\n5️⃣ LINKS INTERNOS POR BLOG...');
    try {
      const { data: linksByBlog, error: linksStatsError } = await supabase
        .rpc('count_internal_links_by_app');

      if (linksStatsError) {
        console.log('❌ RPC count_internal_links_by_app não existe ou erro:', linksStatsError.message);
      } else {
        for (const item of linksByBlog || []) {
          console.log(`   ${item.app_id}: ${item.link_count} links`);
        }
      }
    } catch (e) {
      // Fallback: query manual
      console.log('   (tentando query manual...)');
      const { data: allLinks, error: allLinksError } = await supabase
        .from('article_internal_links')
        .select('source_id, target_id');

      if (!allLinksError && allLinks) {
        console.log(`   Total de links na tabela: ${allLinks.length}`);
      } else if (allLinksError) {
        console.log('❌ Erro ao acessar article_internal_links:', allLinksError.message);
      }
    }

  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
  }

  console.log('\n✅ Diagnóstico concluído\n');
}

runDiagnostics();
