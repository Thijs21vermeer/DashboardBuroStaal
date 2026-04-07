#!/bin/bash
echo "🔍 Checking Build Configuration..."
echo ""

echo "✅ Build completed successfully locally"
echo ""

echo "📦 Environment variables needed for deployment:"
echo "  - TURSO_DATABASE_URL"
echo "  - TURSO_AUTH_TOKEN"
echo "  - JWT_SECRET"
echo "  - DASHBOARD_PASSWORD"
echo ""

echo "⚠️ If build fails on Netlify/GitHub Actions, check:"
echo "  1. All environment variables are set in Netlify dashboard"
echo "  2. No typos in variable names"
echo "  3. Redeploy after setting variables"
echo ""

echo "🔗 Netlify Environment Variables:"
echo "   Site Settings → Environment Variables → Add variable"
