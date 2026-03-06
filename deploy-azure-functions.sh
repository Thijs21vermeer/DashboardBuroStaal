#!/bin/bash

# Deploy Buro Staal API to Azure Functions
# Dit script automatiseert de deployment van de Azure Functions API

set -e  # Exit on error

echo "🚀 Starting Azure Functions deployment..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded environment variables"
else
    echo "❌ Error: .env not found"
    exit 1
fi

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed"
    echo "📥 Install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Check if Azure Functions Core Tools is installed
if ! command -v func &> /dev/null; then
    echo "❌ Azure Functions Core Tools is not installed"
    echo "📥 Install from: https://docs.microsoft.com/azure/azure-functions/functions-run-local"
    exit 1
fi

echo "✅ Prerequisites checked"

# Configuration
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-buro-staal-rg}"
LOCATION="${AZURE_LOCATION:-westeurope}"
STORAGE_ACCOUNT="${AZURE_STORAGE_ACCOUNT:-burostaalsa$(date +%s)}"
FUNCTION_APP="${AZURE_FUNCTION_APP:-buro-staal-api}"

echo "📋 Configuration:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo "   Storage Account: $STORAGE_ACCOUNT"
echo "   Function App: $FUNCTION_APP"
echo ""

# Check if logged in to Azure
echo "🔐 Checking Azure login..."
if ! az account show &> /dev/null; then
    echo "🔑 Please login to Azure..."
    az login
fi

SUBSCRIPTION=$(az account show --query name -o tsv)
echo "✅ Logged in to Azure (Subscription: $SUBSCRIPTION)"

# Create or use existing resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
echo "✅ Resource group ready"

# Create storage account
echo "💾 Creating storage account..."
if az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "✅ Storage account already exists"
else
    az storage account create \
      --name $STORAGE_ACCOUNT \
      --resource-group $RESOURCE_GROUP \
      --location $LOCATION \
      --sku Standard_LRS \
      --output none
    echo "✅ Storage account created"
fi

# Create function app
echo "⚡ Creating Function App..."
if az functionapp show --name $FUNCTION_APP --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo "✅ Function App already exists"
else
    az functionapp create \
      --resource-group $RESOURCE_GROUP \
      --consumption-plan-location $LOCATION \
      --runtime node \
      --runtime-version 18 \
      --functions-version 4 \
      --name $FUNCTION_APP \
      --storage-account $STORAGE_ACCOUNT \
      --os-type Linux \
      --output none
    echo "✅ Function App created"
fi

# Configure app settings (environment variables)
echo "🔧 Configuring database connection..."
az functionapp config appsettings set \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --settings \
    AZURE_SQL_SERVER="$AZURE_SQL_SERVER" \
    AZURE_SQL_DATABASE="$AZURE_SQL_DATABASE" \
    AZURE_SQL_USER="$AZURE_SQL_USER" \
    AZURE_SQL_PASSWORD="$AZURE_SQL_PASSWORD" \
  --output none
echo "✅ Database configuration set"

# Configure CORS
echo "🌐 Configuring CORS..."
az functionapp cors remove \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins "*" \
  --output none 2>/dev/null || true

az functionapp cors add \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins "*" \
  --output none
echo "✅ CORS configured"

# Build and deploy
echo "🔨 Building Azure Functions..."
cd azure-functions-api
npm install --silent
npm run build
echo "✅ Build complete"

echo "🚀 Deploying to Azure..."
func azure functionapp publish $FUNCTION_APP --typescript

# Get function app URL
FUNCTION_URL="https://${FUNCTION_APP}.azurewebsites.net/api"

echo ""
echo "✅ SUCCESS! Azure Functions deployed!"
echo ""
echo "🔗 Function App URL: $FUNCTION_URL"
echo ""
echo "📋 Test your endpoints:"
echo "   curl ${FUNCTION_URL}/kennisitems"
echo "   curl ${FUNCTION_URL}/cases"
echo "   curl ${FUNCTION_URL}/trends"
echo "   curl ${FUNCTION_URL}/nieuws"
echo ""
echo "📊 Monitor your functions:"
echo "   az functionapp show --name $FUNCTION_APP --resource-group $RESOURCE_GROUP"
echo "   func azure functionapp logstream $FUNCTION_APP"
echo ""
echo "🔧 Update your .env file:"
echo "   AZURE_FUNCTIONS_URL=$FUNCTION_URL"
echo ""
echo "🎉 Happy deploying!"
