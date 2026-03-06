# Deployment Strategie voor Azure SQL + Webflow Cloud

## ⚠️ Belangrijk: Runtime Beperking

Webflow Cloud gebruikt **Cloudflare Workers** runtime, die:
- ❌ Geen native Node.js modules ondersteunt
- ❌ Geen TCP connecties kan maken
- ❌ Geen directe `mssql` package support heeft

## ✅ Aanbevolen Architectuur: API Layer

### Optie 1: Azure Functions als API (Aanbevolen)

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│  Webflow Cloud  │  HTTP   │  Azure Functions │  TCP    │  Azure SQL   │
│  (Astro/React)  ├────────►│   (Node.js API)  ├────────►│  Database    │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

**Setup:**

1. **Maak Azure Function App aan:**
   ```bash
   func init BuroStaalAPI --typescript
   cd BuroStaalAPI
   func new --template "HTTP trigger" --name GetKennisitems
   ```

2. **Implementeer API endpoints:**
   - GET /api/kennisitems
   - GET /api/kennisitems/{id}
   - POST /api/kennisitems
   - PUT /api/kennisitems/{id}
   - DELETE /api/kennisitems/{id}
   
   (Herhaal voor cases, trends, nieuws)

3. **Update Astro app:**
   ```typescript
   // src/lib/api-config.ts
   export const API_BASE_URL = import.meta.env.AZURE_API_URL || 
                                'https://your-function-app.azurewebsites.net';
   ```

4. **Update alle fetch calls:**
   ```typescript
   // Voor
   fetch(`${baseUrl}/api/kennisitems`)
   
   // Na
   fetch(`${API_BASE_URL}/api/kennisitems`)
   ```

### Optie 2: Azure App Service

Zelfde principe als Azure Functions, maar met volledige Express.js app:

```typescript
// server.js
import express from 'express';
import sql from 'mssql';

const app = express();

app.get('/api/kennisitems', async (req, res) => {
  const pool = await sql.connect(config);
  const result = await pool.request().query('SELECT * FROM kennisitems');
  res.json(result.recordset);
});

app.listen(3000);
```

### Optie 3: Alternatieve Hosting

**Deploy naar platform met Node.js support:**

1. **Vercel** - Native Node.js runtime
2. **Netlify** - Serverless functions met Node.js
3. **Azure Static Web Apps** - Met Azure Functions backend

**Voor Vercel:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

## 🔧 Huidige Code Aanpassen

Als je voor API Layer gaat, voer dan uit:

```bash
# Maak API config
cat > src/lib/api-config.ts << 'EOAPI'
export const API_BASE_URL = import.meta.env.PUBLIC_AZURE_API_URL || 
                             'http://localhost:7071';  // Local Azure Functions
EOAPI

# Update alle API calls in components
# Vervang ${baseUrl}/api/ met ${API_BASE_URL}/api/
```

## 📋 Checklist voor Deployment

- [ ] Azure SQL database aangemaakt en schema toegepast
- [ ] Azure Functions / App Service opgezet met API endpoints
- [ ] CORS ingesteld op Azure API
- [ ] Environment variables ingesteld in Webflow Cloud
- [ ] API calls in Astro app bijgewerkt naar Azure API
- [ ] Testen of data correct wordt opgehaald
- [ ] Deploy naar Webflow Cloud

## 🆘 Support

Voor vragen over deployment, zie:
- [Azure Functions Docs](https://docs.microsoft.com/azure/azure-functions/)
- [Webflow Cloud Docs](https://developers.webflow.com/docs/webflow-cloud)
