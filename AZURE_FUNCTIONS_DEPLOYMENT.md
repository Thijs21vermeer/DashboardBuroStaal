# Azure Functions Deployment Guide

Deze guide helpt je bij het deployen van de Buro Staal API naar Azure Functions.

## 📋 Vereisten

- Azure account
- Azure CLI geïnstalleerd ([Download](https://docs.microsoft.com/cli/azure/install-azure-cli))
- Node.js 18+ geïnstalleerd
- Azure Functions Core Tools ([Download](https://docs.microsoft.com/azure/azure-functions/functions-run-local))

## 🚀 Stap-voor-stap Deployment

### 1. Voorbereiding

```bash
# Ga naar de Azure Functions directory
cd azure-functions-api

# Installeer dependencies
npm install

# Build het project
npm run build
```

### 2. Login bij Azure

```bash
# Login bij Azure CLI
az login

# Selecteer je subscription (als je er meerdere hebt)
az account list --output table
az account set --subscription "JOUW_SUBSCRIPTION_ID"
```

### 3. Maak Azure Resources

```bash
# Definieer variabelen
RESOURCE_GROUP="buro-staal-rg"
LOCATION="westeurope"
STORAGE_ACCOUNT="burostaalsa"
FUNCTION_APP="buro-staal-api"

# Maak resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Maak storage account
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS

# Maak function app (Node.js 18)
az functionapp create \
  --resource-group $RESOURCE_GROUP \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name $FUNCTION_APP \
  --storage-account $STORAGE_ACCOUNT \
  --os-type Linux
```

### 4. Configureer Database Connectie

```bash
# Stel environment variables in voor de function app
az functionapp config appsettings set \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --settings \
    AZURE_SQL_SERVER="jouw-server.database.windows.net" \
    AZURE_SQL_DATABASE="kennisbank" \
    AZURE_SQL_USER="jouw-username" \
    AZURE_SQL_PASSWORD="jouw-password"
```

### 5. Configureer CORS

```bash
# Voeg je Astro app URL toe aan CORS
az functionapp cors add \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins "https://jouw-app.webflow.io"

# Of sta alle origins toe tijdens development (NIET voor productie!)
az functionapp cors add \
  --name $FUNCTION_APP \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins "*"
```

### 6. Deploy de Functions

```bash
# Deploy vanuit de azure-functions-api directory
func azure functionapp publish $FUNCTION_APP
```

### 7. Verify Deployment

```bash
# Test een endpoint
curl https://buro-staal-api.azurewebsites.net/api/kennisitems

# Check logs
func azure functionapp logstream $FUNCTION_APP
```

## 🔧 Astro App Configuratie

### Lokale Development (Directe Database)

In je `.env` file:
```env
# Laat AZURE_FUNCTIONS_URL leeg voor directe database verbinding
AZURE_FUNCTIONS_URL=
AZURE_SQL_SERVER=jouw-server.database.windows.net
AZURE_SQL_DATABASE=kennisbank
AZURE_SQL_USER=jouw-username
AZURE_SQL_PASSWORD=jouw-password
```

### Productie (Via Azure Functions)

In je Cloudflare Workers environment variables:
```env
# Gebruik Azure Functions URL
AZURE_FUNCTIONS_URL=https://buro-staal-api.azurewebsites.net/api

# Database credentials zijn nu NIET nodig in de Astro app
# (alleen in Azure Functions)
```

## 📊 Monitoring

### Azure Portal

1. Ga naar [portal.azure.com](https://portal.azure.com)
2. Navigeer naar je Function App
3. Klik op "Monitor" of "Application Insights"

### View Logs

```bash
# Real-time logs
func azure functionapp logstream buro-staal-api

# Of via Azure CLI
az webapp log tail --name buro-staal-api --resource-group buro-staal-rg
```

## 🔐 Beveiliging

### API Keys (Optioneel)

Je kunt authentication toevoegen door `authLevel` te veranderen in `function.json`:

```json
{
  "authLevel": "function"  // Change from "anonymous"
}
```

Haal dan de function key op:
```bash
az functionapp function keys list \
  --name buro-staal-api \
  --resource-group buro-staal-rg \
  --function-name kennisitems
```

### Gebruik Keys in Astro App

```typescript
// In api-client.ts
const headers = {
  'Content-Type': 'application/json',
  'x-functions-key': import.meta.env.AZURE_FUNCTIONS_KEY
};
```

## 🔄 Updates Deployen

```bash
# 1. Build nieuwe versie
npm run build

# 2. Deploy
func azure functionapp publish buro-staal-api

# 3. Verify
curl https://buro-staal-api.azurewebsites.net/api/kennisitems
```

## 💰 Kosten Optimalisatie

Azure Functions Consumption Plan is **gratis** voor:
- Eerste 1 miljoen requests per maand
- Eerste 400.000 GB-s aan compute tijd

Voor een klein team is dit waarschijnlijk gratis!

## 🆘 Troubleshooting

### Functions laden niet

```bash
# Check status
az functionapp show --name buro-staal-api --resource-group buro-staal-rg

# Restart de app
az functionapp restart --name buro-staal-api --resource-group buro-staal-rg
```

### Database connectie problemen

```bash
# Check firewall regels op Azure SQL
# Zorg dat Azure Services toegang hebben
az sql server firewall-rule create \
  --resource-group buro-staal-rg \
  --server jouw-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### CORS errors

```bash
# Check CORS instellingen
az functionapp cors show --name buro-staal-api --resource-group buro-staal-rg

# Update CORS
az functionapp cors remove --name buro-staal-api --resource-group buro-staal-rg --allowed-origins "*"
az functionapp cors add --name buro-staal-api --resource-group buro-staal-rg --allowed-origins "https://jouw-app.webflow.io"
```

## 🎯 Volgende Stappen

1. ✅ Deploy Azure Functions
2. ✅ Test alle endpoints
3. ✅ Update Astro app met `AZURE_FUNCTIONS_URL`
4. ✅ Deploy Astro app naar Cloudflare
5. ✅ Monitor performance en errors

## 📚 Nuttige Links

- [Azure Functions Documentatie](https://docs.microsoft.com/azure/azure-functions/)
- [Azure CLI Referentie](https://docs.microsoft.com/cli/azure/)
- [Node.js Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-reference-node)
