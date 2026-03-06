# 🔍 Netlify Admin Panel Debug Guide

## Waarom werkt de admin panel niet in Netlify?

### Mogelijke oorzaken:

1. **Environment Variables ontbreken**
   - Azure SQL credentials zijn niet ingesteld in Netlify
   
2. **Database connectie faalt**
   - Netlify Functions hebben geen toegang tot Azure SQL
   
3. **Base URL problemen**
   - Paden kloppen niet op Netlify mount path

4. **Build problemen**
   - React componenten worden niet correct gebuild

---

## ✅ Oplossing 1: Check Environment Variables

### In Netlify Dashboard:
```
Site settings > Environment variables > Add:

AZURE_SQL_SERVER = dashboardbs.database.windows.net
AZURE_SQL_DATABASE = dashboarddb
AZURE_SQL_USER = databasedashboard
AZURE_SQL_PASSWORD = Knolpower05!
```

**⚠️ Let op:** Deze variabelen zijn momenteel hardcoded in de API endpoints!

---

## ✅ Oplossing 2: Gebruik Environment Variables

### Update API endpoints om env vars te gebruiken:

```typescript
// src/pages/api/kennisitems/index.ts
const config: sql.config = {
  server: import.meta.env.AZURE_SQL_SERVER || 'dashboardbs.database.windows.net',
  database: import.meta.env.AZURE_SQL_DATABASE || 'dashboarddb',
  user: import.meta.env.AZURE_SQL_USER || 'databasedashboard',
  password: import.meta.env.AZURE_SQL_PASSWORD || 'Knolpower05!',
  // ...
};
```

---

## ✅ Oplossing 3: Check Netlify Functions

### Netlify Functions locatie:
```
.netlify/functions-internal/
```

### Check of de API endpoints worden gebouwd:
```bash
npm run build
ls -la dist/_functions/
```

---

## ✅ Oplossing 4: Test in Netlify CLI

```bash
npm install -g netlify-cli
netlify dev
# Test op http://localhost:8888
```

---

## 🔧 Quick Fix: Mock Data Fallback

Als de database connectie faalt, gebruik mock data:

```typescript
// src/components/admin/KennisItemsManager.tsx
const loadItems = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/kennisitems`);
    if (!response.ok) {
      console.warn('API failed, using mock data');
      setItems(MOCK_ITEMS);
      return;
    }
    const data = await response.json();
    setItems(data);
  } catch (err) {
    console.error('Error:', err);
    setItems(MOCK_ITEMS); // Fallback to mock data
  }
};
```

---

## 📊 Debug Checklist

- [ ] Environment variables ingesteld in Netlify?
- [ ] Database bereikbaar vanaf Netlify? (firewall rules!)
- [ ] API endpoints gebouwd in dist/_functions/?
- [ ] baseUrl correct gebruikt in alle componenten?
- [ ] React hydration errors in console?
- [ ] Netlify Functions logs checked?

---

## 🌐 Netlify Specifiek

### Functions runtime:
- Netlify gebruikt Deno runtime (niet Node.js!)
- `mssql` package werkt mogelijk niet in Deno

### Mogelijke oplossing:
- Gebruik REST API naar Azure Functions in plaats van directe SQL
- Of gebruik Netlify Edge Functions met Deno-compatible SQL client

---

## 🎯 Aanbevolen Fix

**Optie A: Gebruik Azure Functions als backend**
```typescript
// src/lib/api-client.ts
const API_BASE = 'https://burostaal-api.azurewebsites.net/api';

export async function getKennisItems() {
  const response = await fetch(`${API_BASE}/kennisitems`);
  return response.json();
}
```

**Optie B: Verplaats naar Cloudflare** (huidige setup)
- Cloudflare Workers ondersteunen D1 database
- Sneller en betrouwbaarder

---

**Conclusie:**
De sandbox preview werkt met Node.js + mssql, maar Netlify Functions gebruiken Deno runtime die mogelijk geen mssql ondersteunt. 

**Beste oplossing:** Gebruik Azure Functions als backend API zoals oorspronkelijk gepland.
