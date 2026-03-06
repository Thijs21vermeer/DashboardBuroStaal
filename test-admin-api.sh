#!/bin/bash

echo "🧪 Testing Admin API endpoints..."
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Create a new kennisitem
echo "📝 Test 1: Creating a new kennisitem..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/kennisitems" \
  -H "Content-Type: application/json" \
  -d '{
    "titel": "Test Item via API",
    "type": "artikel",
    "tags": ["test", "api", "demo"],
    "eigenaar": "Admin Test",
    "samenvatting": "Dit is een test item gemaakt via de API",
    "inhoud": "Dit is de volledige inhoud van het test item."
  }')

if echo "$RESPONSE" | grep -q '"id"'; then
  echo "✅ Kennisitem successfully created!"
  ITEM_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
  echo "   Item ID: $ITEM_ID"
else
  echo "❌ Failed to create kennisitem"
  echo "   Response: $RESPONSE"
  exit 1
fi

echo ""

# Test 2: Retrieve the created item
echo "📖 Test 2: Retrieving the created kennisitem..."
RESPONSE=$(curl -s "$BASE_URL/api/kennisitems/$ITEM_ID")

if echo "$RESPONSE" | grep -q "Test Item via API"; then
  echo "✅ Kennisitem successfully retrieved!"
else
  echo "❌ Failed to retrieve kennisitem"
  echo "   Response: $RESPONSE"
  exit 1
fi

echo ""

# Test 3: Update the item
echo "✏️  Test 3: Updating the kennisitem..."
RESPONSE=$(curl -s -X PUT "$BASE_URL/api/kennisitems/$ITEM_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "titel": "Test Item via API (UPDATED)",
    "type": "artikel",
    "tags": ["test", "api", "demo", "updated"],
    "eigenaar": "Admin Test",
    "samenvatting": "Dit is een BIJGEWERKT test item",
    "inhoud": "De inhoud is ook bijgewerkt."
  }')

if echo "$RESPONSE" | grep -q "UPDATED"; then
  echo "✅ Kennisitem successfully updated!"
else
  echo "❌ Failed to update kennisitem"
  echo "   Response: $RESPONSE"
  exit 1
fi

echo ""

# Test 4: Delete the item
echo "🗑️  Test 4: Deleting the kennisitem..."
RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/kennisitems/$ITEM_ID")

echo "✅ Delete request completed"
echo "   Response: $RESPONSE"

echo ""

# Test 5: Verify deletion
echo "🔍 Test 5: Verifying deletion..."
RESPONSE=$(curl -s "$BASE_URL/api/kennisitems/$ITEM_ID")

if echo "$RESPONSE" | grep -q "not found" || [ -z "$RESPONSE" ] || echo "$RESPONSE" | grep -q "null"; then
  echo "✅ Kennisitem successfully deleted!"
else
  echo "⚠️  Item might still exist or different response"
  echo "   Response: $RESPONSE"
fi

echo ""
echo "🎉 All tests completed!"
