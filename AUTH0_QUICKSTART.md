# 🚀 Auth0 Quick Start (5 minuten)

Snelle setup voor Auth0 authenticatie - volg deze stappen om binnen 5 minuten te beginnen.

## 📝 Stap 1: Auth0 Account (1 min)

1. Ga naar [auth0.com](https://auth0.com) → **Sign Up**
2. Kies een tenant naam (bijv. `buro-staal`)
3. Selecteer regio: **EU**

## 🔧 Stap 2: Application (2 min)

1. Dashboard → **Applications** → **Create Application**
2. Name: `Buro Staal Dashboard`
3. Type: **Regular Web Application**
4. **Create**

### Settings invullen:

```
Allowed Callback URLs:
http://localhost:3000/api/auth0/callback

Allowed Logout URLs:
http://localhost:3000

Allowed Web Origins:
http://localhost:3000
```

**Save Changes** ✅

## 🔑 Stap 3: Credentials (1 min)

Kopieer uit de **Settings** tab:
- Domain (bijv. `buro-staal.eu.auth0.com`)
- Client ID
- Client Secret (klik "Show")

## ⚙️ Stap 4: Environment Variables (1 min)

Maak `.env` in project root:

```bash
# Auth0
AUTH0_DOMAIN=jouw-tenant.eu.auth0.com
AUTH0_CLIENT_ID=jouw_client_id
AUTH0_CLIENT_SECRET=jouw_client_secret
APP_ORIGIN=http://localhost:3000

# Secrets (genereer met: openssl rand -base64 32)
COOKIE_SECRET=jouw_random_string_hier
JWT_SECRET=jouw_jwt_secret_hier
```

## ✅ Stap 5: Test (30 sec)

```bash
npm run dev
```

Ga naar `http://localhost:3000`:
- Klik "Inloggen met Auth0"
- Log in met je Auth0 account
- Je bent ingelogd! 🎉

## 👤 Stap 6: Eerste Gebruiker Toevoegen

### Quick: Zelf registreren

In Auth0 is registratie standaard **AAN**. Klik op "Sign up" tijdens login.

### Veilig: Handmatig toevoegen

1. Auth0 Dashboard → **User Management** → **Users**
2. **Create User**
3. Vul email + password in
4. **Create** ✅

### Best: Disable Public Signup

Voor productie, schakel publieke registratie uit:

1. **Authentication** → **Database**
2. Klik `Username-Password-Authentication`
3. **Settings** → **Disable Sign Ups**: **ON** ✅
4. Nu kunnen alleen admins gebruikers toevoegen

## 🚀 Productie Deployment

### Netlify

1. **Site Settings** → **Environment Variables**
2. Voeg dezelfde variabelen toe:

```
AUTH0_DOMAIN = jouw-tenant.eu.auth0.com
AUTH0_CLIENT_ID = jouw_client_id
AUTH0_CLIENT_SECRET = jouw_client_secret
APP_ORIGIN = https://jouw-site.netlify.app
COOKIE_SECRET = jouw_random_string
JWT_SECRET = jouw_jwt_secret
```

3. Update Auth0 Application Settings:

```
Allowed Callback URLs:
http://localhost:3000/api/auth0/callback,
https://jouw-site.netlify.app/api/auth0/callback

Allowed Logout URLs:
http://localhost:3000,
https://jouw-site.netlify.app

Allowed Web Origins:
http://localhost:3000,
https://jouw-site.netlify.app
```

4. **Redeploy** op Netlify

## 🎯 Volgende Stappen

- ✅ Test login/logout
- 🔒 Schakel MFA in (Security → Multi-Factor Auth)
- 🎨 Pas branding aan (Branding → Universal Login)
- 👥 Voeg team leden toe
- 📊 Monitor logs (Monitoring → Logs)

## ❓ Problemen?

### "Callback URL mismatch"
→ Check dat URLs exact matchen in Auth0 Settings

### "Missing configuration"
→ Check `.env` bestand, restart dev server

### Cookies werken niet
→ Check `credentials: 'include'` in fetch calls

## 📚 Meer Info

Volledige setup guide: zie `AUTH0_SETUP.md`

---

**Klaar in 5 minuten! 🚀** Vragen? Check [Auth0 Docs](https://auth0.com/docs)
