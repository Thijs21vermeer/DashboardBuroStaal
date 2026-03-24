# 🚀 Azure Functions Quick Start Guide

Je hebt een Function App aangemaakt in Azure. Hier is hoe je de Buro Staal API deployed.

## ✅ Wat je al hebt

- ✅ Azure SQL Database (`dashboardbs.database.windows.net`)
- ✅ Azure Function App (aangemaakt in Azure Portal)
- ✅ API code klaar in `azure-functions-api/`

## 📋 Benodigde Informatie

Vul deze gegevens in:

```bash
AZURE_FUNCTION_APP="jouw-function-app-naam"          # Naam van je Function App
AZURE_RESOURCE_GROUP="jouw-resource-group"           # Resource Group naam
AZURE_LOCATION="westeurope"                          # Regio (West Europe, North Europe, etc.)
```

## 🛠️ Installatie Stappen

### 1. Installeer Azure Functions Core Tools

**Windows:**
```powershell
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

**Mac:**
```bash
brew tap azure/functions
brew install azure-functions-core-tools@4
```

**Linux:**
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

### 2. Installeer Azure CLI (als je die nog niet hebt)

**Windows:**
Download van: https://aka.ms/installazurecliwindows

**Mac:**
```bash
brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 3. Login bij Azure

```bash
az login
```

Dit opent een browser waar je kunt inloggen met je Azure account.

## 🚀 Deployment

### Optie A: Automatisch (Aanbevolen)

```bash
# Update eerst .env met je Function App details
# Voeg toe:
# AZURE_FUNCTION_APP=jouw-function-app-naam
# AZURE_RESOURCE_GROUP=jouw-resource-group

# Run het deployment script
./deploy-azure-functions.sh
```

### Optie B: Handmatig

```bash
# 1. Ga naar de functions directory
cd azure-functions-api

# 2. Installeer dependencies
npm install

# 3. Build het project
npm run build

# 4. Configureer database connection in Azure
az functionapp config appsettings set \
  --name JOUW_FUNCTION_APP_NAAM \
  --resource-group JOUW_RESOURCE_GROUP \
  --settings \
    AZURE_SQL_SERVER="dashboardbs.database.windows.net" \
    AZURE_SQL_DATABASE="dashboarddb" \
    AZURE_SQL_USER="databasedashboard" \
    AZURE_SQL_PASSWORD="<YOUR_SECURE_PASSWORD>"

# 5. Configureer CORS
az functionapp cors add \
  --name JOUW_FUNCTION_APP_NAAM \
  --resource-group JOUW_RESOURCE_GROUP \
  --allowed-origins "*"

# 6. Deploy!
func azure functionapp publish JOUW_FUNCTION_APP_NAAM
```

## ✅ Verificatie

Na deployment test je de endpoints:

```bash
# Vervang JOUW_FUNCTION_APP met de echte naam
curl https://JOUW_FUNCTION_APP.azurewebsites.net/api/kennisitems
curl https://JOUW_FUNCTION_APP.azurewebsites.net/api/cases
curl https://JOUW_FUNCTION_APP.azurewebsites.net/api/trends
curl https://JOUW_FUNCTION_APP.azurewebsites.net/api/nieuws
```

Of open in je browser:
```
https://JOUW_FUNCTION_APP.azurewebsites.net/api/kennisitems
```

## 🔧 Astro App Configureren

Na succesvolle deployment, update je `.env`:

```env
# Voeg toe of update:
AZURE_FUNCTIONS_URL=https://JOUW_FUNCTION_APP.azurewebsites.net/api
```

Dan kun je de Astro app lokaal testen:
```bash
npm run dev
```

## 📊 Monitoring

### Logs bekijken (Real-time)

```bash
func azure functionapp logstream JOUW_FUNCTION_APP_NAAM
```

### In Azure Portal

1. Ga naar [portal.azure.com](https://portal.azure.com)
2. Zoek je Function App
3. Klik op "Functions" om alle functions te zien
4. Klik op "Monitor" om logs en metrics te bekijken

## 🔄 Updates Deployen

Wanneer je wijzigingen maakt aan de API:

```bash
cd azure-functions-api
npm run build
func azure functionapp publish JOUW_FUNCTION_APP_NAAM
```

## ❓ Troubleshooting

### "Cannot find Function App"
Check of je bent ingelogd:
```bash
az account show
```

### "Unauthorized" errors
Check of database credentials correct zijn in Azure:
```bash
az functionapp config appsettings list \
  --name JOUW_FUNCTION_APP_NAAM \
  --resource-group JOUW_RESOURCE_GROUP
```

### CORS errors
Update CORS settings:
```bash
az functionapp cors remove --name JOUW_FUNCTION_APP --resource-group JOUW_RESOURCE_GROUP --allowed-origins "*"
az functionapp cors add --name JOUW_FUNCTION_APP --resource-group JOUW_RESOURCE_GROUP --allowed-origins "*"
```

## 🎯 Volgende Stappen

1. ✅ Deploy Azure Functions
2. ✅ Test alle endpoints
3. ✅ Update Astro app met AZURE_FUNCTIONS_URL
4. ✅ Test Astro app lokaal
5. ✅ Deploy Astro app naar Cloudflare Workers

---

**Heb je hulp nodig?** Check de volledige guide in `AZURE_FUNCTIONS_DEPLOYMENT.md`
