#!/bin/bash
# ZYPERIA Quick Start Commands

echo "🚀 ZYPERIA - Quick Start Guide"
echo "==============================="
echo ""

# Show current status
echo "✅ Available Commands:"
echo ""
echo "1. LOCAL DEVELOPMENT:"
echo "   pnpm dev              # Run all 3 apps locally (ports 3001-3003)"
echo "   pnpm build            # Build all apps (TypeScript + Next.js)"
echo "   pnpm format           # Format code (if configured)"
echo ""

echo "2. SPECIFIC APP:"
echo "   cd apps/crypto && pnpm dev                 # Run crypto.zyperia.ai only"
echo "   cd apps/intelligence && pnpm dev           # Run intelligence.zyperia.ai only"
echo "   cd apps/onlinebiz && pnpm dev              # Run onlinebiz.zyperia.ai only"
echo ""

echo "3. DEPLOYMENT:"
echo "   # Step 1: Apply migrations (manual)"
echo "   # Go to: https://app.supabase.com/ → SQL Editor"
echo "   # Copy: packages/supabase/migrations/0_ALL_MIGRATIONS.sql"
echo ""
echo "   # Step 2: Deploy to Vercel"
echo "   npm i -g vercel              # Install Vercel CLI"
echo "   vercel deploy apps/crypto    # Deploy crypto app"
echo "   vercel deploy apps/intelligence"
echo "   vercel deploy apps/onlinebiz"
echo ""

echo "4. TESTING:"
echo "   # Test newsletter subscribe endpoint"
echo "   curl -X POST http://localhost:3000/api/newsletter/subscribe \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"test@example.com\",\"themes\":[\"crypto\"],\"source\":\"crypto_site\"}'"
echo ""

echo "5. USEFUL FILES:"
echo "   STATUS.md                 # Current project status"
echo "   DEPLOYMENT.md             # Detailed deployment guide"
echo "   APPLY_MIGRATIONS.txt      # Database migration instructions"
echo "   .env.local                # Environment variables (DO NOT COMMIT)"
echo ""

echo "📚 Documentation:"
echo "   - Read DEPLOYMENT.md for step-by-step instructions"
echo "   - Check STATUS.md for what's completed"
echo "   - See APPLY_MIGRATIONS.txt for database setup"
echo ""
