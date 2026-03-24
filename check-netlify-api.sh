#!/bin/bash

echo "Testing Netlify API endpoints..."
echo "================================"
echo ""

BASE_URL="https://burostaaldashboard.netlify.app"

# Test diagnostics endpoint
echo "1. Testing diagnostics endpoint..."
curl -s "$BASE_URL/api/diagnostics" | jq '.' || echo "Failed"
echo ""

# Test health endpoint
echo "2. Testing health endpoint..."
curl -s "$BASE_URL/api/health" | jq '.' || echo "Failed"
echo ""

# Test tools endpoint (requires auth)
echo "3. Testing tools endpoint (should fail with 401)..."
curl -s -w "\nHTTP Status: %{http_code}\n" "$BASE_URL/api/tools"
echo ""

