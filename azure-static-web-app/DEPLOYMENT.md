# 🚀 Deployment Guide - Buro Staal Kennisbank

Deze guide helpt je om de Kennisbank volledig op Azure te deployen.

## 📋 Prerequisites

- Azure account met actief subscription
- GitHub account
- Azure CLI geïnstalleerd (optioneel)
- Je bestaande Azure SQL Database en Functions

## 🎯 Stap 1: Azure Static Web App Aanmaken

### Via Azure Portal (Aanbevolen)

1. Ga naar [Azure Portal](https://portal.azure.com)
2. Klik op "Create a resource"
3. Zoek naar "Static Web App"
4. Klik op "Create"

**Configuratie:**
- **Subscription**: Kies je subscription
- **Resource Group**: Gebruik dezelfde als je Functions (bv. `rg-burostaal`)
- **Name**: `swa-burostaal-kennisbank`
- **Plan type**: Free (voor starten)
- **Region**: West Europe
- **Source**: GitHub
- **GitHub account**: Autoriseer je GitHub account
- **Organization**: Je GitHub username/org
- **Repository**: Selecteer je repository
- **Branch**: `main`
- **Build Presets**: React
- **App location**: `/azure-static-web-app`
- **API location**: (leeg laten - we gebruiken je bestaande Functions)
- **Output location**: `dist`

5. Klik op "Review + Create"
6. Klik op "Create"

### Via Azure CLI

```bash
# Login
az login

# Maak Static Web App
az staticwebapp create \
  --name swa-burostaal-kennisbank \
  --resource-group rg-burostaal \
  --source https://github.com/JOUW-USERNAME/JOUW-REPO \
  --location westeurope \
  --branch main \
  --app-location "/azure-static-web-app" \
  --output-location "dist" \
  --login-with-github
```

## 🔗 Stap 2: Bestaande Azure Functions Koppelen

Je hebt al Azure Functions draaien. Nu gaan we deze koppelen aan je Static Web App.

### Optie A: Via Azure Portal

1. Ga naar je Static Web App
2. Klik op "APIs" in het menu
3. Selecteer "Link to an existing Function App"
4. Kies je bestaande Function App
5. Klik op "Link"

### Optie B: Via Proxy Configuration

Update `staticwebapp.config.json` met je Functions URL:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"],
      "rewrite": "https://JOUW-FUNCTION-APP.azurewebsites.net/api/{path}"
    }
  ]
}
```

## ⚙️ Stap 3: Environment Variables Configureren

### In Azure Portal

1. Ga naar je Static Web App
2. Klik op "Configuration"
3. Voeg toe onder "Application settings":

```
VITE_API_URL=/api
```

### Database Connection (in je Function App)

Zorg dat je Function App de volgende environment variables heeft:

```
AZURE_SQL_SERVER=jouw-server.database.windows.net
AZURE_SQL_DATABASE=BuroStaalKennisbank
AZURE_SQL_USER=jouw-username
AZURE_SQL_PASSWORD=jouw-password (gebruik Key Vault!)
```

## 🔐 Stap 4: Secrets Configureren in GitHub

1. Ga naar je GitHub repository
2. Ga naar Settings > Secrets and variables > Actions
3. De `AZURE_STATIC_WEB_APPS_API_TOKEN` is al toegevoegd door Azure
4. Verifieer dat deze bestaat

## 📦 Stap 5: Deploy!

### Automatisch (via GitHub Actions)

```bash
git add .
git commit -m "Deploy Kennisbank to Azure"
git push origin main
```

GitHub Actions pakt dit automatisch op en deployt naar Azure! 🎉

### Handmatig (via Azure CLI)

```bash
# Build lokaal
cd azure-static-web-app
npm install
npm run build

# Deploy
az staticwebapp deploy \
  --name swa-burostaal-kennisbank \
  --resource-group rg-burostaal \
  --source ./dist
```

## 🌐 Stap 6: Custom Domain (Optioneel)

### Via Azure Portal

1. Ga naar je Static Web App
2. Klik op "Custom domains"
3. Klik op "Add"
4. Voer je domein in (bv. `kennisbank.burostaal.nl`)
5. Volg de DNS instructies
6. Wacht op validatie (kan enkele minuten duren)

### DNS Records

Voeg deze records toe bij je DNS provider:

**CNAME Record:**
```
kennisbank.burostaal.nl  ->  jouw-static-web-app.azurestaticapps.net
```

Of voor root domain:

**ALIAS/A Record:**
```
@  ->  IP van Azure Static Web App
```

## ✅ Stap 7: Verifiëren

1. Ga naar je deployment URL (vind je in Azure Portal)
2. Test alle pagina's:
   - Dashboard (/)
   - Kennisbank (/kennisbank)
   - Cases (/cases)
   - Trends (/trends)
   - Team (/team)
   - Nieuws (/nieuws)
   - Admin (/admin)
3. Test API calls (open browser console)
4. Verifieer dat data uit je Azure SQL Database komt

## 🔍 Troubleshooting

### Build Errors

Check GitHub Actions logs:
1. Ga naar je repository
2. Klik op "Actions"
3. Bekijk de laatste workflow run

### API Niet Bereikbaar

- Verifieer dat je Function App draait
- Check CORS instellingen in Function App
- Verifieer environment variables

### Database Connection Issues

```bash
# Test connection via Azure CLI
az sql db show-connection-string \
  --server jouw-server \
  --name BuroStaalKennisbank \
  --client sqlcmd
```

### Static Web App Errors

```bash
# Bekijk logs
az staticwebapp logs show \
  --name swa-burostaal-kennisbank \
  --resource-group rg-burostaal
```

## 📊 Monitoring

### Application Insights (Aanbevolen)

1. Maak een Application Insights resource
2. Kopieer de Instrumentation Key
3. Voeg toe aan je Function App environment variables

### Logs Bekijken

```bash
# Streaming logs
az staticwebapp logs tail \
  --name swa-burostaal-kennisbank \
  --resource-group rg-burostaal
```

## 🎉 Klaar!

Je Buro Staal Kennisbank draait nu volledig op Azure! 🚀

**Live URL:** `https://jouw-app-naam.azurestaticapps.net`

## 📞 Support

Bij vragen of problemen:
- Check de Azure Portal logs
- Bekijk GitHub Actions workflow
- Controleer Application Insights (als ingeschakeld)

## 🔄 Updates Deployen

Simpel:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

GitHub Actions doet de rest! ✨
