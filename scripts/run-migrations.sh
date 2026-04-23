#!/bin/bash

# Load .env.local
set -a
source "$(dirname "$0")/../.env.local"
set +a

SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_ANON_KEY="${SUPABASE_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

# Extract connection string from Supabase URL
# Supabase uses: https://PROJECT_ID.supabase.co
PROJECT_ID=$(echo $SUPABASE_URL | sed 's|https://||' | sed 's|.supabase.co||')

echo "📦 ZYPERIA Database Migrations"
echo "================================"
echo "Project ID: $PROJECT_ID"
echo ""
echo "To apply migrations manually:"
echo "1. Go to: $SUPABASE_URL/sql/new"
echo "2. Copy & paste migrations from packages/supabase/migrations/"
echo "3. Execute them in order"
echo ""
echo "Migrations to apply:"
echo "  1. 001_blog_schema.sql"
echo "  2. 002_brutal_system_extension.sql"
echo "  3. 003_affiliate_tracking.sql"
echo ""
echo "Or use Supabase CLI:"
echo "  supabase db pull  # Pull current schema"
echo "  supabase db push  # Push migrations"
