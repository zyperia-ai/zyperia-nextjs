import os
import subprocess
import sys

# Ler conteúdo da migration
with open('packages/supabase/migrations/037_redirects_schema.sql', 'r') as f:
    sql = f.read()

print("🔄 Aplicando migration redirects_schema.sql...")
print("⚠️  Nota: Execute manualmente no Supabase Dashboard:")
print("")
print("1. Abra: https://app.supabase.com/project/echhftptqtznxqpvjgta/sql/new")
print("2. Cole o SQL abaixo:")
print("=" * 70)
print(sql)
print("=" * 70)
print("")
print("3. Clique em 'RUN'")
print("")
