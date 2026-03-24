# 🔒 Security Fix: HttpOnly Cookies voor JWT Tokens

## Probleem
JWT tokens werden opgeslagen in `localStorage`, wat kwetsbaar is voor XSS-aanvallen. Als een aanvaller JavaScript kan injecteren via XSS, kan deze de token stelen en de sessie overnemen.

## Oplossing
Alle token opslag is verplaatst naar **HttpOnly cookies**. Dit betekent:

### ✅ Voordelen
- **XSS-bescherming**: JavaScript kan niet bij de cookie, ook niet bij XSS-aanvallen
- **Automatisch verzenden**: Browser stuurt cookie automatisch mee bij elk request
- **Secure flag**: Cookie wordt alleen over HTTPS verzonden (in productie)
- **SameSite=Strict**: Bescherming tegen CSRF-aanvallen

### 🔧 Wat is er veranderd?

#### 1. **Login endpoint** (`src/pages/api/auth/login.ts`)
- ✅ Zet token in HttpOnly cookie bij succesvolle login
- ✅ Cookie configuratie:
  ```
  HttpOnly, Secure, SameSite=Strict, Path=/, Max-Age=86400
  ```

#### 2. **Logout endpoint** (`src/pages/api/auth/logout.ts`)
- ✅ NIEUW: Dedicated endpoint om cookie te verwijderen
- ✅ Gebruikt `Max-Age=0` om cookie te wissen

#### 3. **Dashboard component** (`src/components/Dashboard.tsx`)
- ❌ VERWIJDERD: `localStorage.getItem('auth_token')`
- ❌ VERWIJDERD: `localStorage.setItem('auth_token', token)`
- ❌ VERWIJDERD: `localStorage.removeItem('auth_token')`
- ✅ TOEGEVOEGD: `credentials: 'include'` in fetch calls
- ✅ Logout via `/api/auth/logout` endpoint

#### 4. **API Client** (`src/lib/api-client.ts`)
- ❌ VERWIJDERD: Alle localStorage logica
- ✅ TOEGEVOEGD: `credentials: 'include'` in alle requests
- ✅ Cookie wordt automatisch meegestuurd door browser

#### 5. **Session Manager** (`src/lib/session-manager.ts`)
- ⚠️ `getSession()` is nu deprecated (geeft altijd `null`)
- ⚠️ `deleteSession()` is deprecated (gebruik logout endpoint)
- ℹ️ Functies blijven voor backward compatibility

#### 6. **Login Form** (`src/components/auth/LoginForm.tsx`)
- ✅ TOEGEVOEGD: `credentials: 'include'` in login request
- ✅ Token in response is nu alleen voor signaling, niet voor opslag

#### 7. **Validation endpoint** (`src/pages/api/auth/validate.ts`)
- ✅ Leest token uit cookie (prioriteit)
- ✅ Fallback naar Authorization header (backward compatibility)

#### 8. **API Auth Middleware** (`src/lib/api-auth.ts`)
- ✅ Leest token uit cookie (prioriteit)
- ✅ Fallback naar Authorization header (backward compatibility)

## 🔐 Security Verbeteringen

### Voor de fix:
```javascript
// ❌ ONVEILIG - kwetsbaar voor XSS
localStorage.setItem('auth_token', token);
const token = localStorage.getItem('auth_token');
```

### Na de fix:
```javascript
// ✅ VEILIG - JavaScript kan niet bij de token
// Server zet cookie:
Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Strict

// Client stuurt automatisch mee:
fetch('/api/kennisitems', {
  credentials: 'include' // Browser stuurt cookie automatisch
});
```

## 📝 Gebruikersinstructies

### Voor developers:
1. **Geen wijzigingen nodig** in je code - cookies worden automatisch verzonden
2. Gebruik `credentials: 'include'` in alle fetch calls (is al gedaan)
3. Gebruik `/api/auth/logout` endpoint voor uitloggen

### Voor gebruikers:
- ✅ Login werkt hetzelfde
- ✅ Logout werkt hetzelfde
- ✅ Sessies blijven 24 uur geldig
- ⚠️ Na deze update moet je opnieuw inloggen (oude tokens in localStorage zijn niet meer geldig)

## 🧪 Wat te testen

1. **Login**: 
   - ✅ Check of je kunt inloggen
   - ✅ Refresh de pagina - moet ingelogd blijven

2. **API calls**:
   - ✅ Check of data laadt in overzicht
   - ✅ Check of admin panel werkt
   - ✅ Check of je data kunt toevoegen/bewerken

3. **Logout**:
   - ✅ Check of logout werkt
   - ✅ Check of je na logout geen API calls meer kunt doen

4. **Security**:
   - ✅ Open DevTools > Application > Storage
   - ✅ Check dat `auth_token` NIET in localStorage staat
   - ✅ Check dat `auth_token` WEL in Cookies staat (met HttpOnly flag)
   - ✅ Probeer via console: `document.cookie` - token is NIET zichtbaar

## 🚀 Deployment

### Netlify
Geen extra configuratie nodig - HttpOnly cookies werken out of the box.

### Lokaal testen
```bash
npm run dev
```

De `Secure` flag werkt alleen over HTTPS. In development (localhost) wordt de cookie nog steeds gezet, maar zonder Secure flag.

## 📊 Backwards Compatibility

- ✅ Oude Authorization headers blijven werken (fallback)
- ✅ API endpoints zijn niet veranderd
- ⚠️ Oude tokens in localStorage zijn niet meer geldig
- ⚠️ Gebruikers moeten opnieuw inloggen na deployment

## 🔍 Troubleshooting

### "Cookie wordt niet gezet"
- Check of response `Set-Cookie` header heeft
- Check of `credentials: 'include'` aanwezig is in fetch

### "Cookie wordt niet meegestuurd"
- Check of `credentials: 'include'` aanwezig is in alle fetch calls
- Check of domein overeenkomt (localhost in dev, productie domein in prod)

### "Token validation failed"
- Check of `JWT_SECRET` correct is ingesteld
- Check of cookie niet verlopen is (Max-Age=86400 = 24 uur)

## 📚 Resources

- [MDN: HttpOnly cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [OWASP: XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

**Status**: ✅ Geïmplementeerd en getest
**Impact**: 🔒 Hoog - Belangrijke security verbetering
**Breaking Change**: ⚠️ Ja - Gebruikers moeten opnieuw inloggen
