# 🔐 Environment Variables Template

Kopieer deze configuratie naar je `.env` bestand en vul de waarden in.

## 📋 Complete .env Template

```bash
# ============================================
# WEBFLOW CONFIGURATION (keep existing values)
# ============================================
WEBFLOW_API_HOST=<your existing value>
WEBFLOW_SITE_API_TOKEN=<your existing value>
WEBFLOW_CMS_SITE_API_TOKEN=<your existing value>

# ============================================
# AUTH0 AUTHENTICATION ⭐ NEW
# ============================================
# Get these from https://manage.auth0.com
# Follow AUTH0_QUICKSTART.md for 5-minute setup

AUTH0_DOMAIN=your-tenant.eu.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id_here
AUTH0_CLIENT_SECRET=your_auth0_client_secret_here
AUTH0_AUDIENCE=

# App Origin (change in production)
APP_ORIGIN=http://localhost:3000

# ============================================
# SECURITY SECRETS ⭐ NEW
# ============================================
# Generate with: openssl rand -base64 32

COOKIE_SECRET=GENERATE_ME_WITH_OPENSSL
JWT_SECRET=GENERATE_ME_WITH_OPENSSL

# ============================================
# LEGACY PASSWORD (Optional)
# ============================================
DASHBOARD_PASSWORD=your_password_here

# ============================================
# AZURE SQL DATABASE
# ============================================
AZURE_SQL_SERVER=dashboardbs.database.windows.net
AZURE_SQL_DATABASE=dashboarddb
AZURE_SQL_USER=databasedashboard
AZURE_SQL_PASSWORD=your_database_password_here
```

---

## 🚀 Quick Setup Guide

### Stap 1: Genereer Secrets

Open je terminal en run:

```bash
# Genereer Cookie Secret
openssl rand -base64 32

# Genereer JWT Secret (run opnieuw voor een andere waarde)
openssl rand -base64 32
```

Of gebruik Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Stap 2: Auth0 Setup

1. **Ga naar** [auth0.com](https://auth0.com) → Sign Up
2. **Maak Application:**
   - Type: Regular Web Application
   - Name: Buro Staal Dashboard
3. **Kopieer credentials:**
   - Domain (bijv. `buro-staal.eu.auth0.com`)
   - Client ID
   - Client Secret (klik "Show")
4. **Configureer URLs in Auth0:**
   ```
   Allowed Callback URLs:
   http://localhost:3000/api/auth0/callback

   Allowed Logout URLs:
   http://localhost:3000

   Allowed Web Origins:
   http://localhost:3000
   ```

### Stap 3: Update .env

Open `.env` en voeg toe:

```bash
AUTH0_DOMAIN=jouw-tenant.eu.auth0.com
AUTH0_CLIENT_ID=abc123...
AUTH0_CLIENT_SECRET=xyz789...
APP_ORIGIN=http://localhost:3000
COOKIE_SECRET=<output van openssl rand -base64 32>
JWT_SECRET=<output van openssl rand -base64 32>
```

### Stap 4: Test

```bash
npm run dev
```

Ga naar `http://localhost:3000` en log in! 🎉

---

## 📝 Variabelen Uitleg

### Auth0
- **AUTH0_DOMAIN** - Je Auth0 tenant domain
- **AUTH0_CLIENT_ID** - Application client ID
- **AUTH0_CLIENT_SECRET** - Application client secret (keep secret!)
- **AUTH0_AUDIENCE** - Optioneel, voor Auth0 API access
- **APP_ORIGIN** - Je app URL (voor callbacks)

### Security
- **COOKIE_SECRET** - Encrypts Auth0 session cookies
- **JWT_SECRET** - Voor legacy token validation
- **DASHBOARD_PASSWORD** - Oude password login (optioneel)

### Database
- **AZURE_SQL_SERVER** - Database server hostname
- **AZURE_SQL_DATABASE** - Database naam
- **AZURE_SQL_USER** - Database username
- **AZURE_SQL_PASSWORD** - Database password

---

## 🚨 Security Best Practices

✅ **DO:**
- Use different secrets for dev and production
- Rotate secrets regularly
- Keep `.env` in `.gitignore`
- Use strong random secrets (32+ chars)

❌ **DON'T:**
- Commit `.env` to Git
- Share secrets via email/chat
- Use simple passwords like "password123"
- Reuse secrets across projects

---

## 🌐 Production (Netlify)

Voor productie deployment:

1. **Netlify Dashboard** → Site Settings → Environment Variables
2. **Voeg alle variabelen toe** met productie waarden
3. **Update:**
   ```
   APP_ORIGIN=https://jouw-site.netlify.app
   ```
4. **Auth0 Settings** → Voeg productie URLs toe:
   ```
   https://jouw-site.netlify.app/api/auth0/callback
   https://jouw-site.netlify.app
   ```

---

## ❓ Hulp Nodig?

- 🚀 **Quick Start:** `AUTH0_QUICKSTART.md`
- 📖 **Volledige Guide:** `AUTH0_SETUP.md`
- 🔧 **Troubleshooting:** Zie AUTH0_SETUP.md

---

**Klaar!** 🎉 Vul je `.env` in en start met `npm run dev`
