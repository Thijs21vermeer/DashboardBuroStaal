# 🚀 Quickstart Guide

## Lokaal testen (5 minuten setup)

### 1. Dependencies installeren
```bash
cd azure-functions-api
npm install
```

### 2. Database credentials configureren
Bewerk `local.settings.json`:
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

### 3. Start de API
```bash
npm start
```

API draait nu op: `http://localhost:7071/api`

### 4. Test een endpoint
Open een nieuwe terminal:
```bash
curl http://localhost:7071/api/kennisitems
```

## Verbind met Astro App

### Optie A: Lokale Azure Functions (Development)

In je Astro app root directory, voeg toe aan `.env`:
```env
AZURE_FUNCTIONS_URL=http://localhost:7071/api
```

De Astro app gebruikt nu automatisch de Azure Functions API!

### Optie B: Directe Database (Sneller voor development)

In `.env`:
```env
# Laat AZURE_FUNCTIONS_URL leeg of verwijder deze regel
AZURE_FUNCTIONS_URL=

# Gebruik direct de database
AZURE_SQL_SERVER=jouw-server.database.windows.net
AZURE_SQL_DATABASE=kennisbank
AZURE_SQL_USER=jouw-username
AZURE_SQL_PASSWORD=jouw-password
```

## Deployment naar Azure

Volg de volledige guide in `AZURE_FUNCTIONS_DEPLOYMENT.md`

Snelle versie:
```bash
# Login
az login

# Deploy
cd azure-functions-api
func azure functionapp publish buro-staal-api
```

## 🎯 API Endpoints

Alle endpoints zijn beschikbaar op `/api/`:

**Kennisitems**
- GET `/kennisitems` - Alle items
- GET `/kennisitems/{id}` - Specifiek item
- POST `/kennisitems` - Nieuw item

**Cases**
- GET `/cases`
- GET `/cases/{id}`
- POST `/cases`

**Trends**
- GET `/trends`
- GET `/trends/{id}`
- POST `/trends`

**Nieuws**
- GET `/nieuws`
- GET `/nieuws/{id}`
- POST `/nieuws`

## ✨ Features

✅ Automatische database connection pooling
✅ CORS geconfigureerd
✅ TypeScript support
✅ Error handling
✅ JSON responses
✅ Parameterized queries (SQL injection safe)

## 🔧 Troubleshooting

**Port 7071 al in gebruik?**
```bash
# Kill bestaande processen
npx kill-port 7071
```

**Database verbinding fails?**
- Check of je IP toegang heeft tot Azure SQL
- Controleer firewall rules in Azure Portal
- Test verbinding met Azure Data Studio

**Functions laden niet?**
```bash
# Rebuild
npm run build

# Herstart
npm start
```

## 📚 Meer Info

- Zie `README.md` voor volledige API documentatie
- Zie `AZURE_FUNCTIONS_DEPLOYMENT.md` voor deployment guide
