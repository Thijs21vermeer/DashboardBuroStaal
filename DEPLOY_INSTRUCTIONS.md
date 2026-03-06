# 🚀 Deploy naar jouw Azure Function App

## ✅ Jouw Configuratie

- **Function App**: `functieappbs`
- **Resource Group**: `Dashboarddatabase`
- **Regio**: `France Central`
- **URL**: `https://functieappbs.azurewebsites.net/api`

---

## 📝 Stap 1: Update je .env file

Voeg deze regels toe aan je `.env` file:

```env
# Azure Functions Configuration
AZURE_FUNCTION_APP=functieappbs
AZURE_RESOURCE_GROUP=Dashboarddatabase
AZURE_LOCATION=francecentral
AZURE_FUNCTIONS_URL=https://functieappbs.azurewebsites.net/api
```

---

## 🛠️ Stap 2: Installeer Azure Functions Core Tools (eenmalig)

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

Verificatie:
```bash
func --version
# Moet 4.x.x tonen
```

---

## 🔐 Stap 3: Login bij Azure

```bash
az login
```

Dit opent een browser voor login. Na login zie je je subscription(s).

---

## ⚙️ Stap 4: Configureer Database Connection in Azure

```bash
az functionapp config appsettings set \
  --name functieappbs \
  --resource-group Dashboarddatabase \
  --settings \
    AZURE_SQL_SERVER="dashboardbs.database.windows.net" \
    AZURE_SQL_DATABASE="dashboarddb" \
    AZURE_SQL_USER="databasedashboard" \
    AZURE_SQL_PASSWORD="Knolpower05!"
```

✅ Dit configureert de database credentials in je Function App

---

## 🌐 Stap 5: Configureer CORS

```bash
az functionapp cors add \
  --name functieappbs \
  --resource-group Dashboarddatabase \
  --allowed-origins "*"
```

✅ Dit staat alle origins toe (tijdelijk voor development)

Voor productie gebruik later:
```bash
az functionapp cors remove \
  --name functieappbs \
  --resource-group Dashboarddatabase \
  --allowed-origins "*"

az functionapp cors add \
  --name functieappbs \
  --resource-group Dashboarddatabase \
  --allowed-origins "https://jouw-productie-url.com"
```

---

## 🚀 Stap 6: Build en Deploy de Functions

```bash
# Ga naar de azure-functions-api directory
cd azure-functions-api

# Installeer dependencies
npm install

# Build het project
npm run build

# Deploy naar Azure!
func azure functionapp publish functieappbs
```

De deployment kan 1-2 minuten duren. Je ziet output zoals:
```
Uploading 4 functions...
✓ kennisitems
✓ cases
✓ trends
✓ nieuws
Deployment successful.
```

---

## ✅ Stap 7: Test de Endpoints

**In je browser of met curl:**

```bash
# Test kennisitems
curl https://functieappbs.azurewebsites.net/api/kennisitems

# Test cases
curl https://functieappbs.azurewebsites.net/api/cases

# Test trends
curl https://functieappbs.azurewebsites.net/api/trends

# Test nieuws
curl https://functieappbs.azurewebsites.net/api/nieuws
```

**Of open in je browser:**
- https://functieappbs.azurewebsites.net/api/kennisitems
- https://functieappbs.azurewebsites.net/api/cases
- https://functieappbs.azurewebsites.net/api/trends
- https://functieappbs.azurewebsites.net/api/nieuws

Je zou een JSON response moeten zien (mogelijk leeg `[]` als de database nog geen data heeft).

---

## 🔧 Stap 8: Configureer Astro App

Nu de Functions draaien, update je Astro app om de Azure Functions URL te gebruiken.

Je `.env` file moet deze regel hebben:
```env
AZURE_FUNCTIONS_URL=https://functieappbs.azurewebsites.net/api
```

Test lokaal:
```bash
npm run dev
```

Open http://localhost:3000 en check of de dashboard data laadt via Azure Functions!

---

## 📊 Monitoring & Logs

### Real-time logs bekijken:

```bash
func azure functionapp logstream functieappbs
```

### In Azure Portal:

1. Ga naar [portal.azure.com](https://portal.azure.com)
2. Zoek "functieappbs"
3. Klik op "Functions" in het menu
4. Je ziet alle 4 functions:
   - kennisitems
   - cases
   - trends
   - nieuws
5. Klik op een function en dan "Monitor" voor logs

---

## 🔄 Updates Deployen (later)

Wanneer je wijzigingen maakt aan de API:

```bash
cd azure-functions-api
npm run build
func azure functionapp publish functieappbs
```

---

## 🗄️ Database Seeden

Als je database nog leeg is, run dan de seed script:

```bash
npm run db:seed
```

Of handmatig via Azure Portal:
1. Ga naar je SQL Database "dashboarddb"
2. Klik op "Query editor"
3. Login met je credentials
4. Run de queries uit `db/azure-seed.sql`

---

## ❓ Troubleshooting

### "Cannot find module" errors tijdens build
```bash
cd azure-functions-api
rm -rf node_modules package-lock.json
npm install
npm run build
```

### "Unauthorized" bij database calls
Check of de credentials correct zijn:
```bash
az functionapp config appsettings list \
  --name functieappbs \
  --resource-group Dashboarddatabase \
  | grep AZURE_SQL
```

### Function App reageert niet
Restart de Function App:
```bash
az functionapp restart \
  --name functieappbs \
  --resource-group Dashboarddatabase
```

### CORS errors in browser
Check CORS settings:
```bash
az functionapp cors show \
  --name functieappbs \
  --resource-group Dashboarddatabase
```

---

## 📋 Deployment Checklist

- [ ] Azure Functions Core Tools geïnstalleerd
- [ ] Azure CLI geïnstalleerd en ingelogd (`az login`)
- [ ] Database credentials geconfigureerd in Function App
- [ ] CORS geconfigureerd
- [ ] Functions gebuild (`npm run build`)
- [ ] Functions gedeployed (`func azure functionapp publish functieappbs`)
- [ ] Endpoints getest in browser
- [ ] Astro app geconfigureerd met `AZURE_FUNCTIONS_URL`
- [ ] Astro app lokaal getest
- [ ] Database geseeded met testdata

---

## 🎯 Samenvatting Commando's

Als je alles in één keer wilt doen:

```bash
# 1. Login
az login

# 2. Configureer database
az functionapp config appsettings set \
  --name functieappbs \
  --resource-group Dashboarddatabase \
  --settings \
    AZURE_SQL_SERVER="dashboardbs.database.windows.net" \
    AZURE_SQL_DATABASE="dashboarddb" \
    AZURE_SQL_USER="databasedashboard" \
    AZURE_SQL_PASSWORD="Knolpower05!"

# 3. Configureer CORS
az functionapp cors add \
  --name functieappbs \
  --resource-group Dashboarddatabase \
  --allowed-origins "*"

# 4. Build en deploy
cd azure-functions-api
npm install
npm run build
func azure functionapp publish functieappbs

# 5. Test
curl https://functieappbs.azurewebsites.net/api/kennisitems
```

---

**Succes met je deployment! 🚀**

Heb je vragen? Laat het me weten!
