# 🔒 Security Fix: Debug Endpoints Protection

**Date:** 2026-03-24  
**Status:** ✅ FIXED  
**Severity:** HIGH

---

## 🎯 Vulnerabilities Fixed

### 1. Information Disclosure via Debug Endpoints

**Before:**
```
GET /api/diagnostics
GET /api/test-auth  
GET /api/test-db
```

These endpoints exposed:
- ❌ Stack traces (helps attackers plan exploits)
- ❌ JWT secret length (helps with brute force attacks)
- ❌ Database error messages (reveals infrastructure)
- ❌ Password length (aids credential attacks)
- ❌ Which env vars are set (reconnaissance info)

**After:**
All debug endpoints now require **triple protection**:
1. ✅ Development mode only (`NODE_ENV !== 'production'`)
2. ✅ Valid authentication (logged in user)
3. ✅ Admin secret header (`X-Admin-Secret`)

---

## 🛡️ Security Layers

### Layer 1: Development-Only

```typescript
const isDevelopment = import.meta.env.DEV || 
                     import.meta.env.MODE === 'development' ||
                     process.env.NODE_ENV === 'development';

if (!isDevelopment) {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404
  });
}
```

**Production behavior:** Returns 404 (endpoint doesn't exist)

### Layer 2: Authentication Required

```typescript
const authResponse = await requireAuth(context);
if (authResponse) return authResponse;
```

**Unauthenticated access:** Returns 401 Unauthorized

### Layer 3: Admin Secret Header

```typescript
const providedSecret = request.headers.get('X-Admin-Secret');
const adminSecret = getAdminSecret(locals);

if (!providedSecret || providedSecret !== adminSecret) {
  return new Response(JSON.stringify({ 
    error: 'Forbidden',
    hint: 'Provide X-Admin-Secret header'
  }), { status: 403 });
}
```

**Missing/wrong secret:** Returns 403 Forbidden

---

## 🔧 Setup Instructions

### 1. Generate Admin Secret

```bash
# Generate a strong random secret
openssl rand -base64 32
```

### 2. Set Environment Variable

**Local development (`.env`):**
```bash
ADMIN_SECRET=your-generated-secret-here
```

**Netlify:**
1. Go to Site settings → Environment variables
2. Add new variable:
   - **Key:** `ADMIN_SECRET`
   - **Value:** Your generated secret
3. Redeploy

---

## 📖 Usage Examples

### Using Debug Endpoints

**1. Login first to get session:**
```bash
curl -X POST https://your-app.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "your-dashboard-password"}' \
  -c cookies.txt
```

**2. Call debug endpoint with admin secret:**
```bash
curl https://your-app.netlify.app/api/diagnostics \
  -H "X-Admin-Secret: your-admin-secret" \
  -b cookies.txt
```

**3. Test auth:**
```bash
curl https://your-app.netlify.app/api/test-auth \
  -H "X-Admin-Secret: your-admin-secret" \
  -b cookies.txt
```

**4. Test database:**
```bash
curl https://your-app.netlify.app/api/test-db \
  -H "X-Admin-Secret: your-admin-secret" \
  -b cookies.txt
```

---

## 🚫 What Was Removed

### ❌ Stack Traces

**Before:**
```json
{
  "error": "Database connection failed",
  "stack": "Error: Connection refused\n    at Database.connect (/app/db.ts:42:15)\n    ..."
}
```

**After:**
```json
{
  "error": "Diagnostics failed",
  "message": "Internal error - check server logs"
}
```

### ❌ Secret Length

**Before:**
```json
{
  "authSecret": {
    "length": 32,
    "isDefault": false
  }
}
```

**After:**
```json
{
  "envVars": {
    "JWT_SECRET": { "exists": true }
  }
}
```

### ❌ Password Length

**Before:**
```json
{
  "config": {
    "passwordLength": 24
  }
}
```

**After:**
```json
{
  "configStatus": {
    "hasPassword": true
  }
}
```

### ❌ Detailed Error Messages

**Before:**
```json
{
  "error": "Login failed for user 'admin'@'azure-db-123.database.windows.net'"
}
```

**After:**
```json
{
  "error": "Connection failed - check server logs for details"
}
```

---

## ✅ What's Kept Safe

### Environment Variable Checks (Boolean Only)

```json
{
  "environmentVariables": {
    "JWT_SECRET": true,
    "AZURE_SQL_SERVER": true,
    "AZURE_SQL_DATABASE": true,
    "AZURE_SQL_USER": true,
    "AZURE_SQL_PASSWORD": true
  }
}
```

**Safe because:** Only shows IF they exist, not their values

### Database Status

```json
{
  "database": {
    "status": "connected"
  }
}
```

**Safe because:** Only shows connection state, no credentials

### Row Count

```json
{
  "query": {
    "rowCount": 42
  }
}
```

**Safe because:** Only counts, no actual data exposed

---

## 🎯 Attack Scenarios Prevented

### Scenario 1: Reconnaissance Attack

**Before:**
```bash
# Attacker can discover infrastructure
curl /api/diagnostics
→ "AZURE_SQL_SERVER": "prod-db-west-europe.database.windows.net"
→ "environment": "production"
→ Now attacker knows cloud provider, region, database type
```

**After:**
```bash
curl /api/diagnostics
→ 404 Not Found (endpoint doesn't exist in production)
```

### Scenario 2: Secret Brute Force

**Before:**
```bash
curl /api/test-auth
→ "authSecret": { "length": 12 }
→ Attacker knows to try 12-character secrets
```

**After:**
```bash
curl /api/test-auth
→ 404 Not Found (or 403 if trying in dev without admin secret)
```

### Scenario 3: Error-Based Information Disclosure

**Before:**
```bash
curl /api/test-db
→ "Login failed for user 'dbadmin'@'10.0.0.5'"
→ Attacker learns username and internal IP
```

**After:**
```bash
curl /api/test-db
→ "Connection failed - check server logs for details"
→ No useful information for attacker
```

---

## 📊 Security Comparison

| Aspect | Before | After |
|--------|--------|-------|
| **Production Access** | ⚠️ Protected by auth only | ✅ Completely disabled (404) |
| **Dev Access** | ⚠️ Auth only | ✅ Auth + ADMIN_SECRET |
| **Stack Traces** | ❌ Exposed to client | ✅ Server logs only |
| **Secret Info** | ❌ Length exposed | ✅ Boolean existence only |
| **Error Details** | ❌ Full error messages | ✅ Generic messages |
| **Config Values** | ⚠️ Some lengths exposed | ✅ Boolean presence only |

---

## 🔍 Health Endpoint

The `/api/health` endpoint is **public** but safe:

```json
{
  "status": "ok",
  "timestamp": "2026-03-24T10:30:00.000Z",
  "services": {
    "database": "connected",
    "authentication": "configured"
  }
}
```

**Safe because:**
- ✅ No stack traces
- ✅ No error details
- ✅ No configuration values
- ✅ Only service status (up/down)
- ✅ Standard health check format

**Purpose:** Load balancers and monitoring tools need this

---

## 🎓 Best Practices Applied

### 1. Fail Securely
- Production: Endpoints don't exist (404)
- Development: Require multiple authentication factors

### 2. Minimize Information Disclosure
- No stack traces in responses
- No credential lengths
- No infrastructure details
- Generic error messages

### 3. Defense in Depth
- Layer 1: Environment check
- Layer 2: Authentication
- Layer 3: Admin secret
- Each layer fails independently

### 4. Logging
```typescript
// Client gets generic error
return { error: 'Connection failed' };

// Server logs have details
console.error('[TEST-DB] Connection error:', err.message);
```

---

## 🚀 Deployment Checklist

- [ ] Generate `ADMIN_SECRET` using `openssl rand -base64 32`
- [ ] Add to `.env` for local development
- [ ] Add to Netlify environment variables
- [ ] Test endpoints locally with correct secret
- [ ] Verify production returns 404 for debug endpoints
- [ ] Check server logs for detailed error messages
- [ ] Document admin secret in password manager

---

## 📝 Files Changed

```
src/lib/config.ts                  - Added getAdminSecret()
src/pages/api/diagnostics.ts       - Triple protection + no stack traces
src/pages/api/test-auth.ts         - Triple protection + no secret length
src/pages/api/test-db.ts           - Triple protection + no password length
src/pages/api/health.ts            - Removed debug info exposure
```

---

## ✅ Verification

### Test Production Behavior

```bash
# Should return 404
curl https://your-app.netlify.app/api/diagnostics
curl https://your-app.netlify.app/api/test-auth
curl https://your-app.netlify.app/api/test-db

# Should return health status (200 or 503)
curl https://your-app.netlify.app/api/health
```

### Test Development Behavior

```bash
# Without admin secret - should return 403
curl http://localhost:3000/api/diagnostics

# With admin secret - should return data
curl http://localhost:3000/api/diagnostics \
  -H "X-Admin-Secret: your-secret"
```

---

## 🎯 Summary

**Before:** Debug endpoints exposed sensitive information that could aid attackers

**After:** Debug endpoints require triple protection and never expose sensitive data

**Impact:**
- 🛡️ Prevents infrastructure reconnaissance
- 🛡️ Prevents secret brute forcing
- 🛡️ Prevents error-based information disclosure
- 🛡️ Maintains useful debugging in development

**Security Level:** HIGH → VERY HIGH ✅
