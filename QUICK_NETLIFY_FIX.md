# 🚀 Quick Fix voor Netlify 404 Errors

## Het Probleem
API routes geven 404 of 500 errors:
```
GET /api/auth/validate 404 (Not Found)
GET /api/kennisitems 500 (Internal Server Error)
```

## De Oplossing (2 stappen)

### ✅ Stap 1: Environment Variables Instellen

**KRITIEK:** Ga naar Netlify Dashboard en stel ALLE variables in:

1. Open: **Site settings** → **Environment variables**
2. Klik op **Add a variable** en voeg deze toe:

| Variable Name | Value | Scopes |
|--------------|-------|---------|
| `JWT_SECRET` | Een random string van minimaal 32 tekens | ✅ Builds, Functions, Post processing |
| `AZURE_SQL_SERVER` | `dashboardbs.database.windows.net` | ✅ Builds, Functions, Post processing |
| `AZURE_SQL_DATABASE` | `dashboarddb` | ✅ Builds, Functions, Post processing |
| `AZURE_SQL_USER` | `databasedashboard` | ✅ Builds, Functions, Post processing |
| `AZURE_SQL_PASSWORD` | Je database wachtwoord | ✅ Builds, Functions, Post processing |
| `AZURE_SQL_PORT` | `1433` | ✅ Builds, Functions, Post processing |

**Belangrijk:**
- Voor `JWT_SECRET` kun je een random string genereren:
  ```bash
  openssl rand -base64 32
  ```
  Of gebruik een online generator: https://www.random.org/strings/

### ✅ Stap 2: Redeploy de Site

Na het instellen van de variables:

**Optie A: Via Netlify Dashboard**
1. Ga naar: **Deploys** → **Trigger deploy**
2. Klik op: **Clear cache and deploy site**

**Optie B: Via Git Push**
```bash
# Commit de nieuwe code
git add .
git commit -m "Fix API routes en add diagnostics"
git push origin main
```

## 🧪 Verificatie

Na de deploy, test de endpoints:

```bash
# Test database connection (moet "connected" teruggeven)
curl https://burostaaldashboard.netlify.app/api/test-db | jq -r '.connection.status'

# Test diagnostics (moet alle env vars als "true" tonen)
curl https://burostaaldashboard.netlify.app/api/diagnostics | jq '.environment'

# Test health check
curl https://burostaaldashboard.netlify.app/api/health

# Test auth validate (moet 401 geven zonder token, 404 = niet gevonden)
curl https://burostaaldashboard.netlify.app/api/auth/validate
```

**Verwachte resultaten:**
- `/api/test-db` → status: "connected" ✅
- `/api/diagnostics` → alle env vars zijn true ✅
- `/api/health` → 200 OK ✅
- `/api/auth/validate` → 401 (zonder token) ✅

## 🐛 Troubleshooting

### "Environment variable JWT_SECRET is missing"
→ Zorg dat `JWT_SECRET` is ingesteld in Netlify en redeploy

### "Database connection failed"
→ Check of alle `AZURE_SQL_*` variables correct zijn ingesteld

### "Still getting 404"
→ Check Netlify Function logs:
- Ga naar: **Functions** → **ssr** → **View logs**
- Zoek naar errors

### "500 Internal Server Error"
→ Check de diagnostics:
```bash
curl https://burostaaldashboard.netlify.app/api/diagnostics
```

## 📝 Files Aangepast

Deze files zijn aangepast om het probleem op te lossen:

1. ✅ `src/pages/api/auth/validate.ts` - Ondersteunt nu GET requests
2. ✅ `src/pages/api/diagnostics.ts` - Nieuw diagnostics endpoint
3. ✅ `netlify.toml` - Correcte Netlify configuratie
4. ✅ `check-netlify-deployment.sh` - Automated deployment check script

## 🎯 Volgende Stappen

1. ✅ Stel environment variables in
2. ✅ Redeploy de site
3. ✅ Test met diagnostics endpoint
4. ✅ Login op de site
5. ✅ Verifieer dat data wordt geladen

**Zodra alles werkt:**
- Gebruikers kunnen inloggen
- Data wordt correct geladen uit Azure SQL
- Alle API endpoints zijn bereikbaar
- Dashboard toont de juiste informatie

---

💡 **Pro Tip:** Gebruik het `check-netlify-deployment.sh` script om automatisch alle endpoints te testen:

```bash
chmod +x check-netlify-deployment.sh
./check-netlify-deployment.sh
```

Dit script test alle endpoints en geeft een duidelijk overzicht van wat werkt en wat niet.
