#!/bin/bash

echo "🧪 Pre-Deployment Test Suite voor Buro Staal Dashboard"
echo "======================================================"
echo ""

# Kleuren voor output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test teller
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functie voor tests
test_endpoint() {
  local endpoint=$1
  local description=$2
  
  echo -n "Testing ${description}... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${endpoint})
  
  if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ FAILED${NC} (HTTP $response)"
    ((TESTS_FAILED++))
  fi
}

test_endpoint_with_data() {
  local endpoint=$1
  local description=$2
  local min_items=$3
  
  echo -n "Testing ${description}... "
  
  response=$(curl -s http://localhost:3000${endpoint})
  http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000${endpoint})
  
  if [ "$http_code" -eq 200 ]; then
    count=$(echo $response | jq 'length')
    if [ "$count" -ge "$min_items" ]; then
      echo -e "${GREEN}✓ PASSED${NC} ($count items, expected ≥$min_items)"
      ((TESTS_PASSED++))
    else
      echo -e "${YELLOW}⚠ WARNING${NC} ($count items, expected ≥$min_items)"
      ((TESTS_FAILED++))
    fi
  else
    echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
    ((TESTS_FAILED++))
  fi
}

echo "1️⃣  Checking if dev server is running..."
if curl -s http://localhost:3000 > /dev/null; then
  echo -e "${GREEN}✓ Dev server is running${NC}"
  echo ""
else
  echo -e "${RED}✗ Dev server is NOT running${NC}"
  echo ""
  echo "Please start the dev server first:"
  echo "  npm run dev"
  exit 1
fi

echo "2️⃣  Testing API Endpoints..."
echo ""

test_endpoint "/" "Homepage"
test_endpoint "/admin" "Admin Panel"

echo ""
test_endpoint_with_data "/api/kennisitems" "Kennisitems API" 5
test_endpoint_with_data "/api/cases" "Cases API" 3
test_endpoint_with_data "/api/trends" "Trends API" 3
test_endpoint_with_data "/api/nieuws" "Nieuws API" 5

echo ""
echo "3️⃣  Testing Database Connection..."
echo ""

if npx tsx test-astro-db.ts > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Database connection successful${NC}"
  ((TESTS_PASSED++))
else
  echo -e "${RED}✗ Database connection failed${NC}"
  ((TESTS_FAILED++))
fi

echo ""
echo "4️⃣  Testing Individual API Endpoints..."
echo ""

test_endpoint "/api/kennisitems/1" "Single Kennisitem"
test_endpoint "/api/cases/1" "Single Case"
test_endpoint "/api/trends/1" "Single Trend"
test_endpoint "/api/nieuws/2" "Single Nieuws"

echo ""
echo "======================================================"
echo "Test Results:"
echo "======================================================"
echo -e "Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Tests Failed: ${RED}${TESTS_FAILED}${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 All tests passed! Ready for deployment!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. git add ."
  echo "  2. git commit -m 'Ready for deployment'"
  echo "  3. git push origin main"
  echo "  4. Follow QUICK_DEPLOY.md"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please fix issues before deploying.${NC}"
  exit 1
fi
