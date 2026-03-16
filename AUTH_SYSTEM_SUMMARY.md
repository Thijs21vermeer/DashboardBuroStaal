# 🔐 Buro Staal Auth System - Versie 2.0 (Vereenvoudigd)

## 📋 Overzicht

Het auth systeem is **radicaal vereenvoudigd** naar **één enkele login**:

- ✅ **Dashboard login** = toegang tot hele app (lezen + bewerken)
- ❌ ~~Admin login~~ (verwijderd - was overbodig)

## 🎯 Architectuur

### **Single Token System**
- 1 login bij `/` (dashboard)
- Token geldt voor alle functionaliteit
- Simpel, veilig, gebruiksvriendelijk

### **Stateless JWT-style tokens**
- Tokens zelf-valideren met SHA-256 signature
- Geen server state nodig
- Werkt over dev server restarts
- Schaalbaar naar multiple servers

## 🔑 Wachtwoord

```
BurostaalDB
```

Wordt gecheckt in `src/middleware.ts`

## 🗂️ Bestandsstructuur

### **Core Auth Files**
```
src/
├── middleware.ts                    # Dashboard auth check
├── lib/
│   ├── api-auth.ts                 # API endpoint auth verificatie
│   └── session-manager.ts          # Stateless token generatie/validatie
└── pages/
    └── api/
        └── auth/
            └── login.ts            # Hoofdlogin endpoint
```

### **Verwijderde Files** ✂️
- ~~`src/lib/auth-client.ts`~~ - Admin client auth (niet meer nodig)
- ~~`src/components/admin/LoginModal.tsx`~~ - Admin login modal (verwijderd)
- ~~`src/pages/api/auth/login-v2.ts`~~ - Admin login endpoint (verwijderd)
- ~~`src/pages/api/auth/verify.ts`~~ - Admin token verificatie (verwijderd)

## 🔐 Token Flow (Vereenvoudigd)

### 1️⃣ **Login Flow**
```
Gebruiker → / (dashboard)
  ↓
Middleware checkt wachtwoord
  ↓
Genereert stateless token → localStorage
  ↓
Toegang tot hele app
```

### 2️⃣ **API Access**
```
Request → API Endpoint
  ↓
requireAuth() checkt token
  ↓
Valideert signature + expiry
  ↓
✅ Success of ❌ 401 Unauthorized
```

### 3️⃣ **Page Refresh**
```
localStorage token blijft bestaan
  ↓
Middleware/API valideert token
  ↓
✅ Blijft ingelogd!
```

## 📝 Token Details

### **Token Structuur**
```typescript
{
  timestamp: number,      // Aanmaak tijdstip
  expiresAt: number,     // Verloop tijdstip (24u)
  signature: string      // SHA-256 hash voor validatie
}
```

### **Token Validatie**
1. Parse token JSON
2. Check expiry (24 uur)
3. Recalculeer signature
4. Vergelijk signatures
5. ✅ of ❌

## 🛠️ Configuratie

### **Environment Variabelen**
```bash
# Optioneel - voor custom secret key
AUTH_SECRET=burostaal-super-secret-key-2026-change-this-in-production

# Default: "buro-staal-auth-secret-key-2026"
```

### **Wachtwoord wijzigen**
In `src/middleware.ts`:
```typescript
const password = 'BurostaalDB'; // ← Wijzig hier
```

## 🚀 Deployment (Netlify)

### **Environment Variables**
```
AUTH_SECRET=jouw-super-geheime-key-hier
```

### **Build Command**
```bash
npm run build:netlify
```

### **Publish Directory**
```
dist/
```

## ✅ Testen

### **Test Login Flow**
```bash
# 1. Open dashboard
curl http://localhost:3000/

# 2. Voer wachtwoord in: BurostaalDB

# 3. Check localStorage
# In browser console:
localStorage.getItem('dashboardToken')

# 4. Refresh page (F5)
# Blijft ingelogd!
```

### **Test API Access**
```bash
# Zonder token
curl http://localhost:3000/api/kennisitems
# → 401 Unauthorized

# Met token (na login)
# Token wordt automatisch meegestuurd door browser
```

## 🔒 Security Features

1. **Stateless tokens** - Geen server state te hacken
2. **SHA-256 signatures** - Tokens kunnen niet worden vervalst
3. **24-hour expiry** - Automatisch uitloggen
4. **Secret key** - Configureerbaar per environment
5. **Single source** - Eén wachtwoord te beheren

## 📊 Voordelen nieuwe systeem

| Feature | Voor | Na |
|---------|------|-----|
| **Aantal logins** | 2x (Dashboard + Admin) | 1x |
| **Token storage** | In-memory Map | Stateless JWT-style |
| **Page refresh** | ❌ Logout | ✅ Blijft ingelogd |
| **Server restart** | ❌ Alle tokens weg | ✅ Tokens blijven werken |
| **Scalability** | ❌ Single server | ✅ Multi-server ready |
| **Complexity** | 🔴 Hoog | 🟢 Laag |

## 🐛 Troubleshooting

### **"401 Unauthorized" na page refresh**
1. Check of token in localStorage zit:
   ```js
   localStorage.getItem('dashboardToken')
   ```
2. Check of AUTH_SECRET overeenstemt op server en client
3. Hard refresh browser (Ctrl+Shift+R)

### **Token verloopt te snel**
Token is 24 uur geldig. Voor langere sessies:
```typescript
// In session-manager.ts
const EXPIRY_MS = 24 * 60 * 60 * 1000; // ← Verhoog hier
```

### **Wachtwoord werkt niet**
Check `src/middleware.ts`:
```typescript
const password = 'BurostaalDB'; // Hoofdlettergevoelig!
```

## 🎉 Resultaat

**Één simpele login = toegang tot alles!**

✅ Dashboard bekijken  
✅ Admin panel bewerken  
✅ API calls maken  
✅ Persistent over refreshes  
✅ Geen dubbele login meer!

---

**Last Updated:** Maart 2026  
**Version:** 2.0 (Vereenvoudigd Single-Login)
