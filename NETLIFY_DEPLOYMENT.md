# 🚀 Netlify Deployment Guide - Buro Staal Dashboard

Deze guide helpt je om de Buro Staal Kennisbank te deployen naar **Netlify** met een **Azure SQL Database** backend.

---

## 📋 Vereisten

Zorg dat je het volgende hebt:

1. ✅ Een **Netlify account** (gratis tier werkt)
2. ✅ Een **Azure SQL Database** (al geconfigureerd met tabellen en data)
3. ✅ De **database credentials**:
   - Server: `dashboardbs.database.windows.net`
   - Database: `dashboarddb`
   - User: `databasedashboard`
   - Password: `<YOUR_SECURE_PASSWORD>`
   - Port: `1433`

---

## 🔧 Stap 1: Repository Koppelen

### Via Netlify Dashboard:

1. Log in op [netlify.com](https://netlify.com)
2. Klik op **"Add new site"** → **"Import an existing project"**
3. Kies je Git provider (GitHub, GitLab, Bitbucket)
4. Selecteer de repository van dit project
5. Netlify detecteert automatisch de `netlify.toml` configuratie

### Build Settings (automatisch geconfigureerd):
```
Build command: BUILD_TARGET=netlify npm run build
Publish directory: dist
```

---

## 🔐 Stap 2: Environment Variables Instellen

In de Netlify dashboard voor je site:

1. Ga naar **Site settings** → **Environment variables**
2. Voeg de volgende variabelen toe:

```bash
AZURE_SQL_SERVER=dashboardbs.database.windows.net
AZURE_SQL_DATABASE=dashboarddb
AZURE_SQL_USER=databasedashboard
AZURE_SQL_PASSWORD=<YOUR_SECURE_PASSWORD>
AZURE_SQL_PORT=1433
```

**⚠️ Belangrijk:** Gebruik **nooit** deze credentials in productie! Dit zijn test credentials.

---

## 🌐 Stap 3: Azure SQL Firewall Configureren

Netlify gebruikt **dynamische IP adressen**, dus je moet de Azure SQL firewall openstellen:

### Optie A: Toegang vanaf alle Azure Services (Aanbevolen voor Netlify)

1. Ga naar [Azure Portal](https://portal.azure.com)
2. Open je SQL Server (`dashboardbs`)
3. Ga naar **Security** → **Networking**
4. Schakel in: **"Allow Azure services and resources to access this server"**
5. Klik op **Save**

### Optie B: Specifieke IP Range (Veiliger maar lastiger)

Voeg het IP range van Netlify toe:
```
35.168.0.0/12
44.192.0.0/10
52.0.0.0/8
```

---

## 🚀 Stap 4: Deployen

### Automatische Deployment:

1. Push je code naar je Git repository:
```bash
git add .
git commit -m "Configure for Netlify deployment"
git push origin main
```

2. Netlify detecteert automatisch de push en start de build
3. Wacht tot de deployment succesvol is (2-5 minuten)

### Handmatige Deployment:

Je kunt ook handmatig deployen via de Netlify CLI:

```bash
# Installeer Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

---

## ✅ Stap 5: Testen

Na deployment, test of alles werkt:

### 1. Check de homepage
- Ga naar je Netlify URL (bijv. `https://your-site.netlify.app`)
- De dashboard moet laden

### 2. Test de API endpoints
```bash
# Test kennisitems
curl https://your-site.netlify.app/api/kennisitems

# Test cases
curl https://your-site.netlify.app/api/cases

# Test trends
curl https://your-site.netlify.app/api/trends

# Test nieuws
curl https://your-site.netlify.app/api/nieuws
```

### 3. Test de admin panel
- Ga naar `https://your-site.netlify.app/admin`
- Test het toevoegen/bewerken van items

---

## 🐛 Troubleshooting

### Build Fails

**Probleem:** Build faalt met "Cannot find module 'mssql'"

**Oplossing:**
```bash
# Zorg dat mssql in dependencies staat
npm install mssql --save
```

### Database Connection Errors

**Probleem:** API returns "Failed to connect to database"

**Oplossing:**
1. Check of environment variables correct zijn ingesteld in Netlify
2. Verifieer Azure SQL firewall instellingen
3. Check Netlify Function logs: Site Settings → Functions → Function Log

### Slow Cold Starts

**Probleem:** Eerste request na inactiviteit is traag (10-15 seconden)

**Oplossing:**
- Dit is normaal voor serverless functions
- Gebruik een [uptime monitoring service](https://uptimerobot.com) om de site warm te houden
- Of upgrade naar Netlify Pro voor snellere cold starts

---

## 📊 Monitoring

### Netlify Analytics

1. Ga naar je site dashboard
2. Klik op **Analytics**
3. Bekijk traffic, bandwidth, en function invocations

### Function Logs

Real-time logs bekijken:
```bash
netlify functions:log
```

Of in de dashboard:
**Site settings** → **Functions** → **Function log**

---

## 🔄 Updates Deployen

### Automatisch:
Gewoon pushen naar je main branch:
```bash
git add .
git commit -m "Update dashboard"
git push origin main
```

### Preview Deployments:
Elke branch krijgt automatisch een preview URL:
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```

Preview URL: `https://feature-new-feature--your-site.netlify.app`

---

## 💰 Kosten

### Netlify Starter (Gratis):
- ✅ 100 GB bandwidth/maand
- ✅ 300 build minuten/maand
- ✅ 125K serverless function invocations/maand
- ✅ Onbeperkte sites

**Verwachte usage voor Buro Staal dashboard:**
- ~10-20 GB bandwidth/maand
- ~10-20 build minuten/maand  
- ~5-10K function invocations/maand

**Conclusie:** Gratis tier is ruim voldoende! 🎉

### Azure SQL Database:
- Basic tier: ~€4.50/maand
- Huidige configuratie: Basic tier

---

## 🔐 Security Best Practices

### 1. Roteer Database Credentials
Verander het wachtwoord in Azure en update in Netlify:
```bash
# Azure Portal → SQL Server → Credentials
# Netlify Dashboard → Environment Variables
```

### 2. Gebruik Netlify Identity (optioneel)
Beveilig de admin panel met authenticatie:
```bash
npm install @netlify/identity-widget
```

### 3. Rate Limiting
Implementeer rate limiting in API routes om abuse te voorkomen.

---

## 📚 Nuttige Links

- [Netlify Documentation](https://docs.netlify.com)
- [Astro Netlify Adapter](https://docs.astro.build/en/guides/deploy/netlify/)
- [Azure SQL Documentation](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

## 🆘 Support

Problemen? Check:
1. [Netlify Community Forum](https://answers.netlify.com)
2. [Astro Discord](https://astro.build/chat)
3. Netlify Support (via dashboard)

---

**🎉 Succes met je deployment!**
