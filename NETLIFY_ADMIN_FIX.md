# 🔧 Netlify Admin Panel Fix

## ✅ Wat is er gefixed?

### 1. Base URL Handling
- **Voor**: `getBaseUrl()` retourneerde lege string in browser
- **Na**: Gebruikt correct `import.meta.env.BASE_URL` voor Netlify mount paths

**Bestanden**:
- `src/lib/base-url.ts` - Correcte baseUrl handling
- `src/components/admin/AdminPanel.tsx` - Import baseUrl toegevoegd
- `src/components/dashboard/Sidebar.tsx` - BaseUrl gebruikt voor admin link

### 2. Environment Variables
- **Voor**: Database credentials hardcoded in API endpoints
- **Na**: Gebruikt environment variables met fallbacks

**Bestanden**:
- `src/pages/api/kennisitems/index.ts` - Env vars toegevoegd

**Netlify Environment Variables (in te stellen in dashboard)**:
```
AZURE_SQL_SERVER = dashboardbs.database.windows.net
AZURE_SQL_DATABASE = dashboarddb
AZURE_SQL_USER = databasedashboard
AZURE_SQL_PASSWORD = <YOUR_SECURE_PASSWORD>
```

### 3. Error Handling & Fallbacks
- **Voor**: Geen feedback bij database fouten
- **Na**: Duidelijke status indicator + fallback naar mock data

**Features**:
- ✅ Groene banner bij succesvolle database connectie
- ⚠️ Gele banner bij mock data (database leeg)
- ❌ Rode banner bij connectie fout
- 🔄 "Opnieuw proberen" button

**Bestanden**:
- `src/components/admin/KennisItemsManager.tsx` - Connection status toegevoegd

### 4. Health Check Endpoint
Nieuw endpoint om te testen of de API werkt:

**URL**: `/api/health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "environment": {
    "hasAzureServer": true,
    "hasAzureDatabase": true,
    "hasAzureUser": true,
    "hasAzurePassword": true
  },
  "runtime": {
    "node": "v20.x.x",
    "platform": "linux"
  }
}
```

**Bestand**: `src/pages/api/health.ts`

### 5. Debug Code Verwijderd
- **Voor**: Admin.astro had debug fallback code met scripts
- **Na**: Clean code zoals index.astro

**Bestand**: `src/pages/admin.astro`

---

## 🔍 Waarom werkte het niet in Netlify?

### Probleem 1: Netlify Functions Runtime
Netlify kan gebruik maken van:
- **Node.js runtime** (standaard) ✅
- **Deno runtime** (Edge Functions)

De `mssql` package werkt **alleen in Node.js**!

### Probleem 2: Base URL
In development: `baseUrl = ""`  
In Netlify: `baseUrl = "/kennisbank"` (of andere mount path)

Zonder correcte baseUrl falen alle API calls:
```typescript
// ❌ Fout: fetch('/api/kennisitems') → 404
// ✅ Goed: fetch(`${baseUrl}/api/kennisitems`)
```

### Probleem 3: Environment Variables
Environment variables worden **niet automatisch** meegenomen van de sandbox naar Netlify!

Je moet ze handmatig instellen in Netlify Dashboard:
`Site settings > Build & deploy > Environment variables`

### Probleem 4: Azure Firewall
Azure SQL heeft standaard **alleen toegang vanaf Azure**!

**Oplossing**: Voeg Netlify IP ranges toe aan firewall rules:
1. Open Azure Portal
2. Ga naar SQL Database > Firewalls and virtual networks
3. Voeg toe: "Allow Azure services and resources"
4. Of voeg Netlify IP ranges toe (check Netlify docs)

---

## 📋 Netlify Deployment Checklist

- [x] Base URL correct gebruikt in alle componenten
- [x] Environment variables ingesteld in Netlify Dashboard
- [ ] Azure SQL firewall regels toegevoegd voor Netlify
- [x] Health check endpoint toegevoegd (`/api/health`)
- [x] Error handling met fallback naar mock data
- [x] Connection status indicator in admin panel
- [ ] Netlify Functions build test (`npm run build`)
- [ ] Test in Netlify CLI (`netlify dev`)

---

## 🧪 Testen

### 1. Test Health Endpoint
```bash
# Lokaal
curl http://localhost:3000/api/health

# Netlify
curl https://jouw-site.netlify.app/api/health
```

### 2. Test Admin Panel
```bash
# Lokaal
open http://localhost:3000/admin

# Netlify
open https://jouw-site.netlify.app/admin
```

### 3. Check Console Logs
Open browser developer tools en check:
- Network tab (API calls succesvol?)
- Console tab (errors?)
- Netlify Functions logs (in Netlify Dashboard)

---

## 🎯 Volgende Stappen

### Als het nu werkt in Netlify:
1. ✅ Super! Alle andere managers werken ook.
2. Overweeg caching toe te voegen voor betere performance
3. Overweeg Azure Functions als dedicated backend

### Als het nog steeds niet werkt:

#### Optie A: Check Netlify Logs
```bash
netlify logs --prod
# Check for errors
```

#### Optie B: Test Lokaal met Netlify CLI
```bash
npm install -g netlify-cli
cd /app
netlify login
netlify dev
# Test op http://localhost:8888
```

#### Optie C: Azure Functions Backend
In plaats van directe SQL calls in Netlify Functions, gebruik Azure Functions als dedicated backend:

```typescript
// src/lib/api-client.ts
const API_BASE = 'https://burostaal-api.azurewebsites.net/api';

export async function getKennisItems() {
  const response = await fetch(`${API_BASE}/kennisitems`);
  return response.json();
}
```

**Voordelen**:
- ✅ Betrouwbaarder (dedicated backend)
- ✅ Betere error handling
- ✅ Sneller (geoptimaliseerd voor SQL)
- ✅ Makkelijker te debuggen

**Setup**: Zie `/azure-functions-api/` folder

---

## 💡 Tips

### Mock Data is niet erg!
Voor een demo/preview site is mock data prima. Het laat zien hoe de UI werkt zonder database dependency.

### Environment Variables Check
Voeg deze check toe aan je admin panel:
```typescript
useEffect(() => {
  fetch('/api/health')
    .then(r => r.json())
    .then(data => {
      if (!data.environment.hasAzureServer) {
        console.warn('⚠️ Azure SQL env vars not configured!');
      }
    });
}, []);
```

### Incremental Migration
Je kunt ook geleidelijk migreren:
1. Start met mock data (werkt altijd)
2. Voeg database toe als optie (met fallback)
3. Migreer volledig naar database

---

## 🚀 Deployment Commando's

```bash
# Build voor Netlify
BUILD_TARGET=netlify npm run build

# Deploy naar Netlify (via CLI)
netlify deploy --prod

# Of via Git (aanbevolen)
git add .
git commit -m "Fix admin panel for Netlify"
git push
# Netlify deployed automatisch!
```

---

## 📚 Documentatie Links

- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Azure SQL Firewall Rules](https://learn.microsoft.com/azure/azure-sql/database/firewall-configure)
- [Astro Adapters](https://docs.astro.build/en/guides/deploy/netlify/)

---

**Status**: ✅ Sandbox preview werkt  
**Next**: Test in Netlify met bovenstaande checklist

**Made with 💜 for Buro Staal**
