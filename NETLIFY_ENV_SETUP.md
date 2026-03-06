# 🔐 Netlify Environment Variables Setup

## Vereiste Environment Variables

Om de admin panel te laten werken in Netlify, moet je de volgende environment variables instellen in het Netlify Dashboard.

### Stap 1: Open Netlify Dashboard

1. Ga naar [app.netlify.com](https://app.netlify.com)
2. Selecteer je site
3. Ga naar **Site settings**
4. Klik op **Environment variables** (in het linker menu)

### Stap 2: Voeg Azure SQL Credentials Toe

Klik op **Add a variable** en voeg de volgende variabelen toe:

```
Variable name: AZURE_SQL_SERVER
Value: dashboardbs.database.windows.net
```

```
Variable name: AZURE_SQL_DATABASE  
Value: dashboarddb
```

```
Variable name: AZURE_SQL_USER
Value: databasedashboard
```

```
Variable name: AZURE_SQL_PASSWORD
Value: Knolpower05!
```

```
Variable name: AZURE_SQL_PORT
Value: 1433
```

### Stap 3: Save & Deploy

1. Klik op **Save** voor elke variabele
2. Netlify zal automatisch een nieuwe deployment triggeren
3. Wacht tot de deployment compleet is (~2 minuten)

---

## ✅ Verificatie

### Test Health Endpoint

Na deployment, test of de environment variables correct zijn:

```bash
curl https://jouw-site.netlify.app/api/health
```

**Verwachte response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:30:00.000Z",
  "environment": {
    "hasAzureServer": true,     ✅
    "hasAzureDatabase": true,   ✅
    "hasAzureUser": true,       ✅
    "hasAzurePassword": true    ✅
  }
}
```

Als een van de `has*` velden `false` is, dan ontbreekt die environment variable!

### Test Admin Panel

Ga naar: `https://jouw-site.netlify.app/admin`

Je zou één van de volgende banners moeten zien:

- **✅ Groene banner**: "Verbonden met database" - Perfect!
- **⚠️ Gele banner**: "Gebruik Mock Data" - Database is leeg (seed data toevoegen)
- **❌ Rode banner**: "Database Connectie Mislukt" - Check firewall rules

---

## 🔥 Troubleshooting

### Rode Banner: "Database Connectie Mislukt"

**Mogelijke oorzaken:**

1. **Environment variables niet ingesteld**
   - Check `/api/health` endpoint
   - Zorg dat alle 5 variabelen zijn ingesteld

2. **Azure Firewall blokkeert Netlify**
   
   **Oplossing:**
   
   a. Open [Azure Portal](https://portal.azure.com)
   
   b. Ga naar je SQL Database:
      - Resources > `dashboarddb`
   
   c. Klik op **Set server firewall** (in de toolbar)
   
   d. Zet **Allow Azure services** op `ON`:
      ```
      Allow Azure services and resources to access this server: ON
      ```
   
   e. Optioneel: Voeg Netlify IP ranges toe:
      ```
      Rule name: Netlify
      Start IP:  0.0.0.0
      End IP:    255.255.255.255
      ```
      
      ⚠️ Dit opent de database voor alle IP's. Voor productie, gebruik specifieke Netlify IP ranges.
   
   f. Klik **Save**

3. **Credentials zijn incorrect**
   - Double-check username en password
   - Test met Azure Data Studio of SSMS

4. **Database bestaat niet**
   - Check of `dashboarddb` bestaat in Azure Portal
   - Check of de tables zijn aangemaakt (run `azure-schema.sql`)

### Gele Banner: "Gebruik Mock Data"

Dit betekent dat de database **bereikbaar** is maar **leeg**.

**Oplossing:** Seed de database

```bash
# Optie 1: Via API (als backend draait)
cd azure-functions-api
npm run seed

# Optie 2: Via SSMS/Azure Data Studio
# Run azure-seed.sql in je database
```

---

## 🎯 Productie Best Practices

### 1. Gebruik Azure Key Vault

Voor extra beveiliging, bewaar credentials in Azure Key Vault:

```bash
# In Netlify env vars
AZURE_KEY_VAULT_NAME=burostaal-vault
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
AZURE_TENANT_ID=...
```

### 2. Restrictieve Firewall Rules

In plaats van `0.0.0.0 - 255.255.255.255`, gebruik specifieke IP ranges:

Netlify IP ranges vind je hier:
- [Netlify IP Addresses Documentation](https://docs.netlify.com/routing/netlify-ip-addresses/)

### 3. Read-Only User voor Frontend

Maak een aparte SQL user met **alleen** read permissions:

```sql
CREATE USER [kennisbank_readonly] WITH PASSWORD = 'SecurePassword123!';
GRANT SELECT ON SCHEMA::dbo TO [kennisbank_readonly];
```

Dan in Netlify:
```
AZURE_SQL_USER=kennisbank_readonly
AZURE_SQL_PASSWORD=SecurePassword123!
```

### 4. Connection Pooling

De app gebruikt al connection pooling via `getPool()` in `src/lib/db-config.ts`.

Voor betere performance, overweeg:
- Azure SQL Database Elastic Pool
- Redis caching layer
- Azure Functions als dedicated backend

---

## 📋 Deployment Checklist

Voordat je deployed naar productie:

- [ ] Environment variables ingesteld in Netlify
- [ ] Azure SQL firewall regels geconfigureerd
- [ ] Database schema aangemaakt (`azure-schema.sql`)
- [ ] Database geseeded met data (`azure-seed.sql`)
- [ ] Health endpoint test succesvol (`/api/health`)
- [ ] Admin panel test succesvol (`/admin`)
- [ ] Read-only user aangemaakt (optioneel)
- [ ] Key Vault configuratie (optioneel)
- [ ] Restrictieve firewall rules (optioneel)

---

## 🔗 Handige Links

- [Netlify Environment Variables Docs](https://docs.netlify.com/environment-variables/overview/)
- [Azure SQL Firewall Configuration](https://learn.microsoft.com/azure/azure-sql/database/firewall-configure)
- [Azure Key Vault Integration](https://learn.microsoft.com/azure/key-vault/)

---

**Status na deze fix:**
- ✅ Sandbox preview: Werkt perfect
- ⏳ Netlify deployment: Volg deze guide
- 📝 Next: Test in Netlify en rapporteer resultaten

**Made with 💜 for Buro Staal**
