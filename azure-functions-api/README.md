# Buro Staal Azure Functions API

Deze Azure Functions API biedt RESTful endpoints voor de Kennisbank van Buro Staal.

## 🚀 Setup

### 1. Installeer Dependencies

```bash
cd azure-functions-api
npm install
```

### 2. Configureer Database Credentials

Bewerk `local.settings.json` en vul je Azure SQL credentials in:

```json
{
  "Values": {
    "AZURE_SQL_SERVER": "jouw-server.database.windows.net",
    "AZURE_SQL_DATABASE": "kennisbank",
    "AZURE_SQL_USER": "jouw-username",
    "AZURE_SQL_PASSWORD": "jouw-password"
  }
}
```

### 3. Start de Functions Lokaal

```bash
npm start
```

De API draait nu op: `http://localhost:7071/api`

## 📡 Endpoints

### Kennisitems
- `GET /api/kennisitems` - Haal alle kennisitems op
- `GET /api/kennisitems/{id}` - Haal specifiek kennisitem op
- `POST /api/kennisitems` - Maak nieuw kennisitem

### Cases
- `GET /api/cases` - Haal alle cases op
- `GET /api/cases/{id}` - Haal specifieke case op
- `POST /api/cases` - Maak nieuwe case

### Trends
- `GET /api/trends` - Haal alle trends op
- `GET /api/trends/{id}` - Haal specifieke trend op
- `POST /api/trends` - Maak nieuwe trend

### Nieuws
- `GET /api/nieuws` - Haal alle nieuwsitems op
- `GET /api/nieuws/{id}` - Haal specifiek nieuwsitem op
- `POST /api/nieuws` - Maak nieuw nieuwsitem

## 🔧 Deployment naar Azure

### Via Azure CLI

```bash
# Login
az login

# Maak resource group (als nog niet bestaat)
az group create --name buro-staal-rg --location westeurope

# Maak storage account
az storage account create --name burostaalsa --resource-group buro-staal-rg --location westeurope

# Maak function app
az functionapp create \
  --resource-group buro-staal-rg \
  --consumption-plan-location westeurope \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name buro-staal-api \
  --storage-account burostaalsa

# Deploy de code
func azure functionapp publish buro-staal-api

# Configureer environment variables
az functionapp config appsettings set \
  --name buro-staal-api \
  --resource-group buro-staal-rg \
  --settings \
    AZURE_SQL_SERVER="jouw-server.database.windows.net" \
    AZURE_SQL_DATABASE="kennisbank" \
    AZURE_SQL_USER="jouw-username" \
    AZURE_SQL_PASSWORD="jouw-password"
```

### Via VS Code

1. Installeer de Azure Functions extensie
2. Klik op het Azure icoon in de sidebar
3. Sign in naar Azure
4. Klik "Deploy to Function App..."
5. Volg de wizard

## 🔐 CORS Configuratie

Voor productie, configureer CORS in Azure Portal:
- Ga naar je Function App
- Klik op "CORS" onder API
- Voeg je Astro app URL toe (bijv. `https://jouw-app.webflow.io`)

## 🔗 Verbinden met Astro App

De Astro app moet aangepast worden om naar deze API te wijzen:

```typescript
// In je Astro API routes
const AZURE_FUNCTIONS_URL = import.meta.env.AZURE_FUNCTIONS_URL || 'http://localhost:7071/api';
```

Voeg toe aan `.env`:
```
AZURE_FUNCTIONS_URL=https://buro-staal-api.azurewebsites.net/api
```

## 📝 Database Schema

Zorg ervoor dat je Azure SQL database deze tabellen heeft:
- KennisItems
- Cases
- Trends
- Nieuws

Gebruik de schema files in `/db` folder van het hoofdproject.
