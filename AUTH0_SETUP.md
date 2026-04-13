# 🔐 Auth0 Setup Guide

Deze guide helpt je Auth0 authenticatie in te stellen voor de Buro Staal Dashboard applicatie.

## 📋 Stap 1: Auth0 Account Aanmaken

1. **Ga naar** [auth0.com](https://auth0.com)
2. **Klik op "Sign Up"** en maak een gratis account aan
3. **Kies een tenant naam** (bijvoorbeeld: `buro-staal` → `buro-staal.eu.auth0.com`)

## 🔧 Stap 2: Application Configureren

1. **Ga naar** [Dashboard](https://manage.auth0.com/dashboard)
2. **Klik op "Applications" → "Applications"** in het linkermenu
3. **Klik op "Create Application"**
4. **Vul in:**
   - Name: `Buro Staal Dashboard`
   - Type: **Regular Web Application**
5. **Klik "Create"**

## ⚙️ Stap 3: Application Settings

Navigeer naar de **Settings** tab van je nieuwe application:

### Basic Information

Noteer deze waarden (je hebt ze later nodig):
- **Domain** (bijv. `buro-staal.eu.auth0.com`)
- **Client ID** (bijv. `abc123xyz...`)
- **Client Secret** (klik "Show" om te zien)

### Application URIs

Scroll naar beneden en vul in:

#### Development (localhost):
```
Allowed Callback URLs:
http://localhost:3000/api/auth0/callback

Allowed Logout URLs:
http://localhost:3000

Allowed Web Origins:
http://localhost:3000
```

#### Production (Netlify):
```
Allowed Callback URLs:
https://jouw-site.netlify.app/api/auth0/callback

Allowed Logout URLs:
https://jouw-site.netlify.app

Allowed Web Origins:
https://jouw-site.netlify.app
```

**💡 Tip:** Je kunt meerdere URLs toevoegen, gescheiden door komma's:
```
http://localhost:3000/api/auth0/callback, https://jouw-site.netlify.app/api/auth0/callback
```

### Advanced Settings

Ga naar **Advanced Settings** → **Grant Types** en zorg dat deze aangevinkt zijn:
- ✅ Authorization Code
- ✅ Refresh Token

**Klik "Save Changes"** onderaan de pagina.

## 🔑 Stap 4: Environment Variables Instellen

### Local Development (.env)

Maak een `.env` bestand in de root van je project:

```bash
# Auth0 Configuration
AUTH0_DOMAIN=buro-staal.eu.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_AUDIENCE=  # Optioneel

# App Configuration
APP_ORIGIN=http://localhost:3000

# Cookie Secret (voor sessie encryptie)
COOKIE_SECRET=your_long_random_string_here
JWT_SECRET=your_jwt_secret_here  # Voor backward compatibility

# Legacy password auth (optioneel, als fallback)
DASHBOARD_PASSWORD=your_password_here
```

### Cookie/JWT Secret Genereren

Gebruik een van deze methoden:

```bash
# Methode 1: OpenSSL
openssl rand -base64 32

# Methode 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Methode 3: Online
# https://www.random.org/strings/
```

### Netlify Production

1. **Ga naar je Netlify dashboard**
2. **Site Settings → Environment Variables**
3. **Voeg toe:**

```
AUTH0_DOMAIN = buro-staal.eu.auth0.com
AUTH0_CLIENT_ID = your_client_id_here
AUTH0_CLIENT_SECRET = your_client_secret_here
APP_ORIGIN = https://jouw-site.netlify.app
COOKIE_SECRET = your_long_random_string_here
JWT_SECRET = your_jwt_secret_here
```

**⚠️ BELANGRIJK:** Gebruik dezelfde secrets in development en production, of gebruikers moeten opnieuw inloggen.

## 👥 Stap 5: Gebruikers Toevoegen

### Methode 1: Sign Up Toestaan (Publiek)

1. **Authentication → Database**
2. **Klik op "Username-Password-Authentication"**
3. **Settings tab**
4. **Disable Sign Ups:** UIT (OFF)
5. **Save**

### Methode 2: Handmatig Toevoegen (Privé)

1. **User Management → Users**
2. **Klik "Create User"**
3. **Vul in:**
   - Email: `gebruiker@burostaal.nl`
   - Password: `SecurePassword123!`
   - Connection: `Username-Password-Authentication`
4. **Klik "Create"**

### Methode 3: Alleen Uitnodigingen (Aanbevolen)

1. **Authentication → Database**
2. **Klik "Username-Password-Authentication"**
3. **Disable Sign Ups:** AAN (ON) ✅
4. **Save**

Nu kunnen alleen admins gebruikers toevoegen via het dashboard.

## 🎨 Stap 6: Branding (Optioneel)

### Login Pagina Aanpassen

1. **Branding → Universal Login**
2. **Customize Login Page**
3. **Pas logo, kleuren en tekst aan**

### Logo's Uploaden

1. **Branding → Universal Login**
2. **Upload logo (240x240px aanbevolen)**

## 🔒 Stap 7: Beveiliging

### MFA (Multi-Factor Authentication)

1. **Security → Multi-Factor Auth**
2. **Kies gewenste MFA methoden:**
   - ✅ One-time Password
   - ✅ SMS
   - ✅ Email
3. **Define policies** → Kies wanneer MFA vereist is

### Attack Protection

1. **Security → Attack Protection**
2. **Breached Password Detection:** AAN ✅
3. **Brute Force Protection:** AAN ✅
4. **Suspicious IP Throttling:** AAN ✅

## 🧪 Stap 8: Testen

### Development Test

```bash
npm run dev
```

Navigeer naar `http://localhost:3000`:
1. Je wordt gevraagd in te loggen
2. Klik "Inloggen met Auth0"
3. Je wordt doorgestuurd naar Auth0
4. Log in met je credentials
5. Je wordt teruggestuurd naar het dashboard

### Production Test

Deploy naar Netlify en test de flow:
1. Bezoek je productie URL
2. Test login
3. Test logout
4. Controleer of sessies persistent zijn

## 📊 Stap 9: Monitoring

### Logs Bekijken

1. **Monitoring → Logs**
2. Zie alle login activiteit
3. Filter op:
   - Success/Failed logins
   - Suspicious activity
   - API calls

### Analytics

1. **Monitoring → Overview**
2. Bekijk:
   - Active users
   - Login trends
   - Failed login attempts

## 🔄 Migratie van Legacy Auth

De applicatie ondersteunt **beide** authenticatie methoden:
- **Auth0** (primair, aanbevolen)
- **Legacy password** (fallback)

### Gradual Migration

1. Configureer Auth0 zoals hierboven
2. Behoud `DASHBOARD_PASSWORD` in environment variables
3. Gebruikers kunnen kiezen welke methode te gebruiken
4. Wanneer iedereen Auth0 gebruikt, verwijder legacy code

### Switch Volledig naar Auth0

Om legacy auth te verwijderen:

```typescript
// src/components/Dashboard.tsx
// Verwijder import van LoginForm
// Gebruik alleen Auth0LoginForm
```

## ❓ Troubleshooting

### "Callback URL mismatch"

**Probleem:** Auth0 redirect werkt niet  
**Oplossing:** Controleer dat de callback URL exact matcht in:
- Auth0 Application Settings
- Environment variable `APP_ORIGIN`

### "Invalid state parameter"

**Probleem:** CSRF protection faalt  
**Oplossing:** 
- Clear cookies
- Probeer opnieuw in te loggen
- Check dat `COOKIE_SECRET` is ingesteld

### "Missing configuration"

**Probleem:** Environment variables niet geladen  
**Oplossing:**
- Check `.env` bestand
- Restart dev server
- Netlify: check Environment Variables in site settings

### Sessions werken niet

**Probleem:** Cookie wordt niet opgeslagen  
**Oplossing:**
- Check dat je `credentials: 'include'` gebruikt in fetch calls
- Controleer browser cookie settings
- Zorg dat `Secure` flag klopt (alleen HTTPS in productie)

## 📚 Meer Informatie

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 Quickstart Guide](https://auth0.com/docs/quickstart/webapp)
- [Auth0 Security Best Practices](https://auth0.com/docs/secure/security-guidance)

## 🎉 Klaar!

Je Auth0 authenticatie is nu geconfigureerd! 🚀

### Volgende Stappen

1. ✅ Test login flow
2. ✅ Voeg gebruikers toe
3. ✅ Configureer MFA (optioneel)
4. ✅ Pas branding aan
5. ✅ Monitor logs

Bij vragen of problemen, check de [Auth0 Community](https://community.auth0.com/) of de troubleshooting sectie hierboven.
