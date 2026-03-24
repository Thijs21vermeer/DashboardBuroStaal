# 🔒 Security Fix: Debug Endpoints Beveiligd

**Datum:** 24 maart 2026  
**Prioriteit:** 🚨 KRITIEK

## Probleem Geïdentificeerd

Meerdere debug/test endpoints waren **onbeveiligd** en lekten gevoelige informatie:

### 1. `/api/test-db` - Database Informatie Lek
**Ernst:** KRITIEK

**Geëxposeerde data:**
- ✗ Database server hostname
- ✗ Database naam
- ✗ Username
- ✗ Password lengte
- ✗ Sample data uit kennisitems tabel
- ✗ Volledige error messages

**Impact:** Volledige database reconnaissance voor aanvallers zonder authenticatie.

### 2. `/api/diagnostics` - Environment Variabelen Lek
**Ernst:** HOOG

**Geëxposeerde data:**
- ✗ Aanwezigheid van alle environment variabelen
- ✗ Platform details
- ✗ Runtime informatie
- ✗ Volledige error stack traces

**Impact:** Infrastructuur reconnaissance en potentiële exploitatie.

### 3. `/api/test-auth` - Auth Configuratie Lek
**Ernst:** HOOG

**Geëxposeerde data:**
- ✗ Auth secret lengte
- ✗ Of default secret gebruikt wordt
- ✗ Welke environment variabelen aanwezig zijn

**Impact:** Auth mechanisme reconnaissance.

### 4. `/api/health` - Te Veel Informatie
**Ernst:** MEDIUM

**Geëxposeerde data:**
- ✗ Exacte environment variabelen status
- ✗ Platform/Node.js versie
- ✗ Proces informatie

**Impact:** Beperkte reconnaissance informatie.

---

## Toegepaste Fixes

### ✅ 1. Development-Only + Auth Required

**Alle test endpoints:**
```typescript
// SECURITY: Only allow in development, and only with authentication
const isDevelopment = import.meta.env.DEV || 
                     import.meta.env.MODE === 'development';

if (!isDevelopment) {
  return new Response(JSON.stringify({ 
    error: 'This endpoint is only available in development mode' 
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Require authentication even in development
const authResponse = await requireAuth(context);
if (authResponse) return authResponse;
```

### ✅ 2. Geen Gevoelige Data Meer

**Voor:**
```typescript
configValues: {
  server: dbConfig.server,
  database: dbConfig.database,
  user: dbConfig.user,
  passwordLength: dbConfig.password?.length || 0,
  sample: result.recordset[0] || null,
}
```

**Na:**
```typescript
configStatus: {
  hasServer: validation.valid && validation.config.server !== '',
  hasDatabase: validation.valid && validation.config.database !== '',
  hasUser: validation.valid && validation.config.user !== '',
  hasPassword: validation.valid && validation.config.password !== '',
  // NO password length
  // NO sample data
}
```

### ✅ 3. Generieke Error Messages

**Voor:**
```typescript
dbError = err.message; // Exposes full error
```

**Na:**
```typescript
dbError = isDevelopment ? err.message : 'Connection failed';
```

### ✅ 4. Health Endpoint Minimaal

**Voor:**
```typescript
environment: {
  hasAzureServer: !!getEnvVar('AZURE_SQL_SERVER', locals),
  hasAzureDatabase: !!getEnvVar('AZURE_SQL_DATABASE', locals),
  hasAzureUser: !!getEnvVar('AZURE_SQL_USER', locals),
  hasAzurePassword: !!getEnvVar('AZURE_SQL_PASSWORD', locals),
  hasSlackWebhook: !!getEnvVar('SLACK_WEBHOOK', locals),
  hasJwtSecret: !!getEnvVar('JWT_SECRET', locals),
}
```

**Na:**
```typescript
services: {
  database: dbStatus, // 'connected' | 'failed'
  authentication: hasAuthConfig ? 'configured' : 'not_configured',
}
// Geen individuele environment variabelen meer
```

---

## Endpoint Toegang Matrix

| Endpoint | Productie | Development | Auth Required | Data Exposed |
|----------|-----------|-------------|---------------|--------------|
| `/api/health` | ✅ Publiek | ✅ Publiek | ❌ Nee | Minimaal (status only) |
| `/api/test-db` | ❌ 404 | ✅ Beschikbaar | ✅ Ja | Count only, no samples |
| `/api/diagnostics` | ❌ 404 | ✅ Beschikbaar | ✅ Ja | Boolean checks only |
| `/api/test-auth` | ❌ 404 | ✅ Beschikbaar | ✅ Ja | Boolean checks only |

---

## Testen

### Test in Development (lokaal)
```bash
# Should work after login
curl http://localhost:3000/api/test-db

# Should return 404
curl http://localhost:3000/api/test-db # (als uitgelogd)
```

### Test in Production
```bash
# Should return 404
curl https://your-app.netlify.app/api/test-db
curl https://your-app.netlify.app/api/diagnostics
curl https://your-app.netlify.app/api/test-auth

# Should work (public)
curl https://your-app.netlify.app/api/health
```

---

## Security Best Practices Toegepast

✅ **Defense in Depth:** Meerdere lagen beveiliging  
✅ **Least Privilege:** Minimale data exposure  
✅ **Fail Secure:** 404 in productie, niet 403 (geen info leak)  
✅ **Environment Gating:** Verschillende gedrag dev/prod  
✅ **Auth Required:** Zelfs in development voor debug endpoints  
✅ **Generic Errors:** Geen stack traces of details in productie  
✅ **No Enumeration:** Geen hints over welke env vars bestaan  

---

## Volgende Stappen

1. ✅ Code is gefixed
2. ⏳ Push naar GitHub
3. ⏳ Deploy naar productie
4. ⏳ Verifieer dat endpoints 404 returnen in productie
5. ⏳ Test health endpoint blijft werken
6. ⏳ Document in security audit

---

## Impact Summary

**Voor:** Aanvaller kon zonder authenticatie:
- Volledige database configuratie zien
- Sample data uit database ophalen
- Environment variabelen enumereren
- Auth mechanisme analyseren

**Na:** Aanvaller krijgt:
- 404 errors in productie
- Minimale health status (public endpoint)
- In development: alleen na login, alleen boolean checks

**Risico Reductie:** 🚨 KRITIEK → ✅ LAAG

---

## Checklist voor Andere Projecten

Bij het maken van nieuwe apps, check altijd:

- [ ] Geen test/debug endpoints in productie
- [ ] Alle admin/diagnostic endpoints achter auth
- [ ] Geen database credentials in responses
- [ ] Geen sample data exposen
- [ ] Geen environment variabelen waarden tonen
- [ ] Geen detailed stack traces in productie
- [ ] Health checks tonen alleen status, geen details
- [ ] 404 voor disabled endpoints, niet 403
- [ ] Development-only endpoints gated op environment
- [ ] Zelfs in development, debug endpoints achter auth

---

**Status:** ✅ COMPLEET  
**Review:** Aanbevolen voor alle projecten  
**Priority:** Onmiddellijk uitrollen naar productie
