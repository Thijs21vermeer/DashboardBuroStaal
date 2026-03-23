#!/bin/bash

# Kleuren voor output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking Netlify Deployment..."
echo ""

# Check if site URL is provided
if [ -z "$1" ]; then
    SITE_URL="https://burostaaldashboard.netlify.app"
    echo -e "${YELLOW}No URL provided, using default: $SITE_URL${NC}"
else
    SITE_URL="$1"
fi

echo ""
echo "📍 Testing: $SITE_URL"
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Check..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Health check passed (200)${NC}"
else
    echo -e "${RED}❌ Health check failed (HTTP $HEALTH_RESPONSE)${NC}"
fi

# Test 2: Database Connection
echo ""
echo "2️⃣  Testing Database Connection..."
DB_RESPONSE=$(curl -s "$SITE_URL/api/test-db")
DB_STATUS=$(echo "$DB_RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ "$DB_STATUS" = "connected" ]; then
    echo -e "${GREEN}✅ Database connected${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo "Response: $DB_RESPONSE"
fi

# Test 3: Diagnostics
echo ""
echo "3️⃣  Testing Diagnostics..."
DIAG_RESPONSE=$(curl -s "$SITE_URL/api/diagnostics")
if echo "$DIAG_RESPONSE" | grep -q "JWT_SECRET"; then
    echo -e "${GREEN}✅ Diagnostics endpoint reachable${NC}"
    
    # Check if JWT_SECRET is configured
    JWT_SET=$(echo "$DIAG_RESPONSE" | grep -o '"JWT_SECRET":[^,}]*' | grep -o 'true\|false')
    if [ "$JWT_SET" = "true" ]; then
        echo -e "   ${GREEN}✓ JWT_SECRET configured${NC}"
    else
        echo -e "   ${RED}✗ JWT_SECRET NOT configured${NC}"
    fi
    
    # Check if database vars are configured
    DB_VARS_SET=$(echo "$DIAG_RESPONSE" | grep -o '"AZURE_SQL_SERVER":[^,}]*' | grep -o 'true\|false')
    if [ "$DB_VARS_SET" = "true" ]; then
        echo -e "   ${GREEN}✓ Database variables configured${NC}"
    else
        echo -e "   ${RED}✗ Database variables NOT configured${NC}"
    fi
else
    echo -e "${RED}❌ Diagnostics endpoint not found${NC}"
fi

# Test 4: Auth Validate Endpoint
echo ""
echo "4️⃣  Testing Auth Validate..."
AUTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/auth/validate")
if [ "$AUTH_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ Auth endpoint reachable (HTTP $AUTH_RESPONSE)${NC}"
    echo "   (401 is expected without valid token)"
elif [ "$AUTH_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Auth endpoint reachable (HTTP $AUTH_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Auth endpoint issue (HTTP $AUTH_RESPONSE)${NC}"
    echo "   Expected: 200 or 401, Got: $AUTH_RESPONSE"
fi

# Test 5: Kennisitems API
echo ""
echo "5️⃣  Testing Kennisitems API..."
KENNIS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/kennisitems")
if [ "$KENNIS_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ Kennisitems API reachable (HTTP $KENNIS_RESPONSE)${NC}"
    echo "   (401 is expected without valid token)"
elif [ "$KENNIS_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Kennisitems API reachable (HTTP $KENNIS_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Kennisitems API error (HTTP $KENNIS_RESPONSE)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Summary:"
echo ""

ISSUES=0

if [ "$HEALTH_RESPONSE" != "200" ]; then
    ((ISSUES++))
fi
if [ "$DB_STATUS" != "connected" ]; then
    ((ISSUES++))
fi
if [ "$AUTH_RESPONSE" != "401" ] && [ "$AUTH_RESPONSE" != "200" ]; then
    ((ISSUES++))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment looks good!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Visit $SITE_URL"
    echo "2. Login with your credentials"
    echo "3. Check if data loads correctly"
    echo ""
    echo "If you can't login or see data:"
    echo "- Make sure JWT_SECRET is set in Netlify env vars"
    echo "- Redeploy the site after setting env vars"
else
    echo -e "${RED}⚠️  Issues detected!${NC}"
    echo ""
    echo "Troubleshooting:"
    if [ "$HEALTH_RESPONSE" != "200" ]; then
        echo "- Health check failed: Check Netlify function logs"
    fi
    if [ "$DB_STATUS" != "connected" ]; then
        echo "- Database not connected: Check environment variables in Netlify"
        echo "  Required: AZURE_SQL_SERVER, AZURE_SQL_DATABASE, AZURE_SQL_USER, AZURE_SQL_PASSWORD"
    fi
    if [ "$AUTH_RESPONSE" != "401" ] && [ "$AUTH_RESPONSE" != "200" ]; then
        echo "- Auth endpoint not working: Check JWT_SECRET environment variable"
    fi
    echo ""
    echo "📖 See QUICK_NETLIFY_FIX.md for detailed instructions"
fi

echo ""

