#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function timeline() {
  console.log('📅 TIMELINE — Quando os embeddings pararam?\n');

  // Artigos por data com status de embedding
  const { data: articles, error } = await supabase
    .from('blog_posts')
    .select('created_at, status, content_embedding')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }

  console.log('Data         | Status    | Embedding');
  console.log('-------------|-----------|----------');

  let lastDateWithEmbedding = null;
  let firstDateWithoutEmbedding = null;

  for (const article of articles) {
    const date = new Date(article.created_at).toISOString().split('T')[0];
    const hasEmbed = article.content_embedding !== null ? '✅ SIM' : '❌ NÃO';
    console.log(`${date} | published | ${hasEmbed}`);

    if (article.content_embedding !== null && !lastDateWithEmbedding) {
      lastDateWithEmbedding = date;
    }
    if (article.content_embedding === null && !firstDateWithoutEmbedding) {
      firstDateWithoutEmbedding = date;
    }
  }

  console.log('\n📊 RESUMO:');
  console.log(`Último artigo COM embedding: ${lastDateWithEmbedding}`);
  console.log(`Primeiro artigo SEM embedding: ${firstDateWithoutEmbedding}`);

  if (lastDateWithEmbedding && firstDateWithoutEmbedding) {
    console.log(`\n🚨 PONTO DE CORTE: entre ${lastDateWithEmbedding} e ${firstDateWithoutEmbedding}`);
  }

  // Verificar VOYAGE_API_KEY em .env.local
  console.log('\n\n🔑 VERIFICANDO VOYAGE_API_KEY...');
  const fs = require('fs');
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const hasVoyage = envContent.includes('VOYAGE_API_KEY');
  console.log(hasVoyage ? '✅ VOYAGE_API_KEY em .env.local' : '❌ VOYAGE_API_KEY NÃO em .env.local');
}

timeline();
