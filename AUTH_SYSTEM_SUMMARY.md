# 🔒 Authentication System - Buro Staal Dashboard

## Overview
Token-based authentication systeem voor de Admin Panel. Beveiligt alle mutatie endpoints (POST, PUT, DELETE) terwijl lees-toegang (GET) publiek blijft.

## 🎯 Features

### ✅ Stateless JWT-style Tokens
- **Geen database vereist** - tokens zijn zelf-validerend
- **Persistent over page refreshes** - opgeslagen in localStorage
- **24 uur geldig** - automatische expiry
- **Signed tokens** - tamper-proof met SHA-256 signature

### ✅ Automatische Token Verificatie
- Bij page load wordt token gevalideerd
- Verlopen tokens worden automatisch verwijderd
- Seamless re-authentication flow

### ✅ Security
- Tokens bevatten signature die gevalideerd wordt
- Environment variable voor secret key (`AUTH_SECRET`)
- Server-side verificatie op alle protected endpoints

## 📁 File Structure

```
src/
├── lib/
│   ├── session-manager.ts      # JWT-style token generation & validation
│   ├── api-auth.ts             # Auth middleware voor API endpoints
│   └── auth-client.ts          # Client-side auth utilities
├── components/admin/
│   ├── AdminPanel.tsx          # Main admin met auth check
│   └── LoginModal.tsx          # Login UI component
└── pages/api/
    ├── auth/
    │   ├── login-v2.ts         # POST /api/auth/login-v2
    │   └── verify.ts           # POST /api/auth/verify
    └── [all endpoints]/
        └── *.ts                # Protected met requireAuth()
```

## 🔐 How It Works

### Token Structure
```typescript
{
  created: 1234567890,      // Timestamp van creatie
  expires: 1234654290,      // Timestamp + 24h
  signature: "abc123..."    // SHA-256 hash voor validatie
}
// Base64 encoded voor transport
```

### Authentication Flow

1. **Login** → `/api/auth/login-v2`
   ```typescript
   POST { password: "BurostaalDB" }
   → { success: true, token: "xyz...", expiresIn: 86400 }
   ```

2. **Token Storage** → `localStorage`
   ```typescript
   localStorage.setItem('buro_staal_auth_token', token);
   ```

3. **API Requests** → With Bearer Token
   ```typescript
   fetch('/api/kennisitems', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```

4. **Server Validation** → Signature Check
   ```typescript
   // Decode token
   // Check expiry
   // Verify signature matches
   → 200 OK of 401 Unauthorized
   ```

## 🛡️ Protected Endpoints

Alle POST/PUT/DELETE endpoints zijn beveiligd:

| Endpoint | GET (Public) | POST/PUT/DELETE (Auth) |
|----------|--------------|------------------------|
| `/api/kennisitems` | ✅ | 🔒 |
| `/api/cases` | ✅ | 🔒 |
| `/api/trends` | ✅ | 🔒 |
| `/api/nieuws` | ✅ | 🔒 |
| `/api/team` | ✅ | 🔒 |
| `/api/tools` | ✅ | 🔒 |
| `/api/videos` | ✅ | 🔒 |
| `/api/partners` | ✅ | 🔒 |

## 🚀 Usage

### For Developers

**Protected API Endpoint:**
```typescript
import { requireAuth } from '../../../lib/api-auth';

export const POST: APIRoute = async ({ request, locals }) => {
  // Check auth
  const authError = await requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  // Proceed with protected logic...
};
```

**Client-side Fetch:**
```typescript
import { authFetch } from '../../lib/auth-client';

const response = await authFetch('/api/kennisitems', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

### For Admin Users

1. **Navigate to** `/admin`
2. **Login modal** appears automatically als je nog niet bent ingelogd
3. **Enter password:** `BurostaalDB`
4. **Token blijft geldig** voor 24 uur (ook na page refresh!)
5. **Logout** via knop rechtsboven wanneer je klaar bent

## 🔧 Configuration

### Environment Variables

```bash
# .env
DASHBOARD_PASSWORD=BurostaalDB
AUTH_SECRET=burostaal-super-secret-key-2026-change-this-in-production
```

**Voor Netlify/Productie:**
Zet deze ook in Netlify environment variables!

### Token Expiry Aanpassen

In `src/lib/session-manager.ts`:
```typescript
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 uur
// Wijzig naar gewenste duur in milliseconden
```

## 🐛 Troubleshooting

### "Moet opnieuw inloggen na refresh"
✅ **FIXED!** Tokens zijn nu stateless en persistent.
- Oude issue: In-memory Map werd gewist bij server restart
- Nieuwe oplossing: JWT-style tokens met signature
- Token blijft geldig in localStorage over restarts heen

### "401 Unauthorized" bij API calls
1. Check of token in localStorage aanwezig is: `localStorage.getItem('buro_staal_auth_token')`
2. Verify token met: `GET /api/auth/verify`
3. Check of `Authorization` header correct is: `Bearer <token>`

### Token is verlopen
- Automatic cleanup: Client detecteert 401 en toont login modal
- Manual: Klik op "Uitloggen" en log opnieuw in

## 📊 Benefits vs Old System

| Aspect | Old (In-Memory) | New (JWT-style) |
|--------|----------------|-----------------|
| Persistent | ❌ Lost bij restart | ✅ Altijd persistent |
| Scalable | ❌ Single server | ✅ Multi-server ready |
| Database | ❌ Zou nodig zijn | ✅ Geen DB nodig |
| Performance | ⚠️ Memory lookup | ✅ Pure calculation |
| Stateless | ❌ Server state | ✅ Fully stateless |

## 🎉 Success Criteria

✅ Login werkt met wachtwoord
✅ Token wordt opgeslagen in localStorage
✅ Page refresh behoudt login state
✅ Alle POST/PUT/DELETE endpoints beveiligd
✅ GET endpoints blijven publiek
✅ Logout werkt correct
✅ 24h expiry wordt gerespecteerd
✅ Werkt in zowel dev als production (Netlify/Cloudflare)

## 📝 Notes

- **No database required** - perfect voor Netlify/Cloudflare deployment
- **Backwards compatible** - oude `/api/auth/login` blijft werken
- **Client-first** - localStorage persistence = no server state issues
- **Production ready** - just set `AUTH_SECRET` env var!

---

Last updated: March 16, 2026
Status: ✅ Production Ready & Tested
