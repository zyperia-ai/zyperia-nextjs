#!/bin/bash

echo "=== ESTADO DOS 5 PROJECTOS VERCEL ==="
echo ""
echo "Projectos em Vercel (verificados há 10 horas atrás):"
echo ""

# Verificar se vercel CLI consegue listar projectos
vercel projects list --json 2>/dev/null > /tmp/vercel_projects.json

if [ -f /tmp/vercel_projects.json ]; then
  echo "✅ Vercel projects encontrados:"
  cat /tmp/vercel_projects.json | grep -o '"name": "[^"]*"' | cut -d'"' -f4 | sort
  echo ""
fi

echo "Última actualização de cada projecto:"
echo ""

projects=("home" "machine" "zyperia-crypto" "zyperia-intelligence" "zyperia-onlinebiz")

for proj in "${projects[@]}"; do
  if grep -q "\"name\": \"$proj\"" /tmp/vercel_projects.json 2>/dev/null; then
    timestamp=$(grep -A5 "\"name\": \"$proj\"" /tmp/vercel_projects.json | grep "updatedAt" | grep -o '[0-9]*' | head -1)
    if [ ! -z "$timestamp" ]; then
      date_readable=$(date -d @$((timestamp/1000)) 2>/dev/null || echo "N/A")
      echo "  • $proj: $date_readable (timestamp: $timestamp)"
    fi
  fi
done

echo ""
echo "Commit actual no repositório:"
git log -1 --format="  • Commit: %h (%s)"
git log -1 --format="  • Data: %ai"

echo ""
echo "Nota: Home project precisa de redeploy após commit ae9919e (fix sitemaps)"

