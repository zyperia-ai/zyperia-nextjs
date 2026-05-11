#!/bin/bash

echo "=== VERIFICAÇÃO NEWSLETTER ZYPERIA ==="
echo ""
echo "1. Verificando arquivo da API de newsletter..."
if grep -q "POST" apps/machine/app/api/newsletter/subscribe/route.ts; then
  echo "   ✅ Arquivo route.ts existe e contém POST handler"
else
  echo "   ❌ Arquivo não encontrado"
fi

echo ""
echo "2. Verificando componente NewsletterForm..."
if grep -q "NewsletterForm" packages/shared-ui/components/NewsletterForm.tsx 2>/dev/null; then
  echo "   ✅ Componente NewsletterForm existe"
else
  echo "   ❌ Componente não encontrado"
fi

echo ""
echo "3. Verificando integração em SiteNav..."
grep -r "NewsletterForm" packages/shared-ui --include="*.tsx" 2>/dev/null | head -3
echo ""

echo "4. Último commit com newsletter:"
git log --oneline --grep="newsletter" -5 2>/dev/null || git log --oneline -10 | grep -i newsletter

echo ""
echo "5. Status do último commit:"
git log -1 --format="Commit: %h (%s) - %ar"

