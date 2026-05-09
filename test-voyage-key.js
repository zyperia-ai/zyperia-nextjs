#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const voyageKey = process.env.VOYAGE_API_KEY;

if (!voyageKey) {
  console.log('❌ VOYAGE_API_KEY não está em .env.local');
  process.exit(1);
}

console.log(`✅ VOYAGE_API_KEY configurada (começando com: ${voyageKey.substring(0, 10)}...)`);

// Teste básico da API (sem gastar créditos — apenas HEAD request)
console.log('\n🧪 Testando acesso à API Voyage...');

fetch('https://api.voyageai.com/v1/embeddings', {
  method: 'OPTIONS', // Não faz embedding real, apenas testa acesso
  headers: {
    'Authorization': `Bearer ${voyageKey}`,
    'Content-Type': 'application/json',
  },
})
  .then(response => {
    console.log(`Status: ${response.status}`);
    if (response.status === 200 || response.status === 204 || response.status === 405) {
      console.log('✅ API acessível com a chave');
    } else {
      console.log(`❌ Erro API: ${response.status}`);
    }
  })
  .catch(error => {
    console.log(`❌ Erro de rede: ${error.message}`);
  });
