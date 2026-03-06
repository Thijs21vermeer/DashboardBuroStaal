# ✅ Azure SQL Only Configuration

Deze applicatie is nu **volledig geconfigureerd voor Azure SQL**.

## 🗑️ Verwijderd

- ❌ D1 database configuratie
- ❌ D1 migrations
- ❌ `src/lib/db.ts` (D1 connector)
- ❌ D1 bindings in wrangler.jsonc
- ❌ SQLite database files

## ✅ Behouden

- ✅ `src/lib/azure-db.ts` - Azure SQL connectie
- ✅ Alle API routes gebruiken Azure SQL
- ✅ `db/azure-schema.sql` - Database schema
- ✅ `db/azure-seed.sql` - Seed data
- ✅ `scripts/seed-via-api.ts` - Seed script

## 📁 Database Files

```
db/
├── azure-schema.sql    # CREATE TABLE statements
└── azure-seed.sql      # INSERT statements voor test data
```

## 🔧 Setup

1. **Maak Azure SQL database aan**
2. **Voer schema uit**:
   ```sql
   -- Kopieer inhoud van db/azure-schema.sql en voer uit in Azure Portal
   ```
3. **Configureer environment variables** in `.env`:
   ```env
   AZURE_SQL_SERVER=your-server.database.windows.net
   AZURE_SQL_DATABASE=kennisbank
   AZURE_SQL_USER=your-username
   AZURE_SQL_PASSWORD=your-password
   ```
4. **Test de connectie**:
   ```bash
   npm run dev
   # Bezoek: http://localhost:3000/api/test-db
   ```

## ⚠️ Deployment Waarschuwing

**Webflow Cloud / Cloudflare Workers ondersteunt geen directe Azure SQL connecties!**

Zie `DEPLOYMENT.md` voor deployment strategieën:
- Azure Functions als API layer (aanbevolen)
- Azure App Service
- Alternatieve hosting (Vercel/Netlify)

## 🔄 API Endpoints

Alle endpoints gebruiken Azure SQL via `src/lib/azure-db.ts`:

- `/api/kennisitems`
- `/api/cases`
- `/api/trends`
- `/api/nieuws`

## 📦 Dependencies

```json
{
  "mssql": "12.2.0"  // Azure SQL driver
}
```

Geen D1-specifieke dependencies meer nodig.
