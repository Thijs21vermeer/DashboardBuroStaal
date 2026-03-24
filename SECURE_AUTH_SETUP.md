
# 🔐 Secure Authentication Setup

## Wat is er veranderd?

De authenticatie is nu **volledig beveiligd** met JWT tokens in plaats van simpele localStorage boolean checks.

### ❌ Oud (onveilig):
```javascript
localStorage.setItem('burostaal_authenticated', 'true'); // Iedereen kon dit doen!
```

### ✅ Nieuw (veilig):
```javascript
// Server genereert JWT token met signature
const token = await generateToken(); // SHA-256 signature + expiry
localStorage.setItem('auth_token', token);

// Bij elke mount wordt token gevalideerd
const isValid = await validateToken(token);
```

## 🔧 Vereiste Environment Variables

Voeg deze toe aan je `.env` bestand en **Netlify Environment Variables**:

```bash
# Dashboard wachtwoord (verplicht)
DASHBOARD_PASSWORD=jouw-veilige-wachtwoord-hier

# JWT signing secret (verplicht - maak dit een lange random string!)
AUTH_SECRET=<YOUR_SECURE_RANDOM_STRING_MIN_32_CHARS>
```

### AUTH_SECRET genereren:

Je kunt een veilige random string genereren met:

```bash
# Linux/Mac
openssl rand -base64 32

# Of online
# https://randomkeygen.com/
```

⚠️ **BELANGRIJK**: Gebruik NOOIT de default waarde in productie!

## 🛡️ Security Features

1. ✅ **JWT Tokens met SHA-256 signature**
   - Kan niet gefaakt worden zonder de AUTH_SECRET
   - Bevat expiry timestamp (24 uur)

2. ✅ **Server-side validatie**
   - Elke keer als de app laadt wordt token gevalideerd via API
   - Geen trust van client-side waarden

3. ✅ **Automatische expiry**
   - Tokens verlopen na 24 uur
   - Gebruiker moet opnieuw inloggen

4. ✅ **Geen hardcoded secrets**
   - Alle wachtwoorden via environment variables
   - Veilig voor GitHub commits

## 📝 Netlify Deployment

Zorg dat deze environment variables in Netlify staan:

1. Ga naar: **Site settings → Environment variables**
2. Voeg toe:
   ```
   AUTH_SECRET = <YOUR_SECURE_RANDOM_STRING_MIN_32_CHARS>
   DASHBOARD_PASSWORD = [jouw-wachtwoord]
   ```
3. **Redeploy** de site

## 🧪 Testen

### Test 1: Console hack werkt niet meer
```javascript
// ❌ Dit werkt NIET meer:
localStorage.setItem('auth_token', 'fake-token');
// Bij refresh wordt je uitgelogd (token validation faalt)
```

### Test 2: Token expiry
```javascript
// Na 24 uur wordt token automatisch ongeldig
// Gebruiker moet opnieuw inloggen
```

### Test 3: Wrong password
```javascript
// API geeft geen token terug bij fout wachtwoord
// LoginForm toont error message
```

## 🔍 API Endpoints

### POST /api/auth/login
```json
// Request
{
  "password": "het-wachtwoord"
}

// Response (success)
{
  "success": true,
  "token": "eyJjcmVhdGVkIjoxNzM3MzY..."
}

// Response (failure)
{
  "success": false,
  "message": "Ongeldig wachtwoord"
}
```

### POST /api/auth/validate
```json
// Request
{
  "token": "eyJjcmVhdGVkIjoxNzM3MzY..."
}

// Response
{
  "valid": true  // of false
}
```

## 🚀 Next Steps

1. ✅ Code is updated
2. ⏳ Voeg `AUTH_SECRET` toe aan `.env`
3. ⏳ Voeg `AUTH_SECRET` toe aan Netlify
4. ⏳ Test de nieuwe authentication
5. ⏳ Push naar GitHub

## 💡 Tips

- **AUTH_SECRET moet minimaal 32 karakters zijn**
- **Verander AUTH_SECRET niet nadat users ingelogd zijn** (alle tokens worden ongeldig)
- **Gebruik verschillende secrets voor staging en productie**

