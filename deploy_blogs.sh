#!/bin/bash

echo "🚀 Deploy dos 3 blogs via Vercel..."
echo ""

# Deploy Crypto
echo "📱 Deploy: crypto.zyperia.ai"
cd apps/crypto
vercel --prod
CRYPTO_STATUS=$?
cd ../..

echo ""
echo "---"
echo ""

# Deploy Intelligence
echo "📱 Deploy: intelligence.zyperia.ai"
cd apps/intelligence
vercel --prod
INTEL_STATUS=$?
cd ../..

echo ""
echo "---"
echo ""

# Deploy OnlineBiz
echo "📱 Deploy: onlinebiz.zyperia.ai"
cd apps/onlinebiz
vercel --prod
BIZ_STATUS=$?
cd ../..

echo ""
echo "📊 Resultado do Deploy:"
if [ $CRYPTO_STATUS -eq 0 ]; then echo "✅ Crypto"; else echo "❌ Crypto"; fi
if [ $INTEL_STATUS -eq 0 ]; then echo "✅ Intelligence"; else echo "❌ Intelligence"; fi
if [ $BIZ_STATUS -eq 0 ]; then echo "✅ OnlineBiz"; else echo "❌ OnlineBiz"; fi

