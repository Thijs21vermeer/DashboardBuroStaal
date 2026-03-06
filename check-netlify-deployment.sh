#!/bin/bash

echo "🔍 Netlify Deployment Diagnostic Tool"
echo "======================================"
echo ""

# Check 1: Build output
echo "✓ Checking build configuration..."
if [ -f "netlify.toml" ]; then
    echo "  ✅ netlify.toml found"
    grep -q "BUILD_TARGET=netlify" netlify.toml && echo "  ✅ Build command correct" || echo "  ❌ Build command missing BUILD_TARGET"
    grep -q 'publish = "dist"' netlify.toml && echo "  ✅ Publish directory correct" || echo "  ❌ Publish directory incorrect"
else
    echo "  ❌ netlify.toml not found"
fi
echo ""

# Check 2: Adapter
echo "✓ Checking Astro adapter..."
if grep -q "@astrojs/netlify" package.json; then
    echo "  ✅ @astrojs/netlify installed"
else
    echo "  ❌ @astrojs/netlify not in package.json"
fi
echo ""

# Check 3: Build test
echo "✓ Running test build..."
BUILD_TARGET=netlify npm run build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
    echo "  ✅ Build successful"
    if grep -q "Generated SSR Function" /tmp/build.log; then
        echo "  ✅ SSR Function generated"
    else
        echo "  ❌ SSR Function not generated"
    fi
else
    echo "  ❌ Build failed - check /tmp/build.log"
    tail -20 /tmp/build.log
fi
echo ""

# Check 4: Output structure
echo "✓ Checking output structure..."
if [ -d "dist" ]; then
    echo "  ✅ dist/ directory exists"
    if [ -f "dist/favicon.ico" ]; then
        echo "  ✅ Static assets present"
    fi
else
    echo "  ❌ dist/ directory missing"
fi

if [ -d ".netlify/v1/functions/ssr" ]; then
    echo "  ✅ Netlify function directory exists"
    if [ -f ".netlify/v1/functions/ssr/ssr.mjs" ]; then
        echo "  ✅ SSR function file exists"
    fi
else
    echo "  ❌ Netlify function directory missing"
fi
echo ""

# Check 5: Environment variables (local)
echo "✓ Checking environment variables..."
if [ -f ".env" ]; then
    echo "  ✅ .env file found (for local development)"
    grep -q "AZURE_SQL_SERVER" .env && echo "  ✅ AZURE_SQL_SERVER set" || echo "  ⚠️  AZURE_SQL_SERVER not set"
    grep -q "AZURE_SQL_DATABASE" .env && echo "  ✅ AZURE_SQL_DATABASE set" || echo "  ⚠️  AZURE_SQL_DATABASE not set"
else
    echo "  ⚠️  .env file not found (not needed for deployment, but needed for local dev)"
fi
echo ""

echo "======================================"
echo "📋 Summary"
echo "======================================"
echo ""
echo "If all checks pass (✅), your deployment should work."
echo ""
echo "⚠️  Remember to set environment variables in Netlify Dashboard:"
echo "   - AZURE_SQL_SERVER"
echo "   - AZURE_SQL_DATABASE"
echo "   - AZURE_SQL_USER"
echo "   - AZURE_SQL_PASSWORD"
echo ""
echo "🚀 Deploy command:"
echo "   git push (if connected to Git)"
echo "   or"
echo "   netlify deploy --prod"
echo ""
