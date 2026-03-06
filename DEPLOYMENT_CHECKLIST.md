# ✅ Deployment Checklist - Buro Staal Dashboard

Gebruik deze checklist om ervoor te zorgen dat alles klaar is voor deployment naar Netlify.

---

## 📋 Pre-Deployment Checklist

### 1. Lokale Development ✓
- [x] Dashboard werkt lokaal
- [x] Alle pagina's laden correct
- [x] API endpoints retourneren data
- [x] Admin panel werkt

### 2. Database Setup ✓
- [x] Azure SQL Database is opgezet
- [x] Database tabellen zijn aangemaakt (`azure-schema.sql`)
- [x] Database is gevuld met seed data (`azure-seed.sql` of `db:seed`)
- [x] Database credentials zijn bekend

### 3. Environment Variables
Zorg dat je deze variabelen hebt:
```
AZURE_SQL_SERVER=dashboardbs.database.windows.net
AZURE_SQL_DATABASE=dashboarddb
AZURE_SQL_USER=databasedashboard
AZURE_SQL_PASSWORD=Knolpower05!
AZURE_SQL_PORT=1433
```

### 4. Git Repository
- [ ] Code is gecommit naar Git
- [ ] Repository is gepusht naar GitHub/GitLab/Bitbucket
- [ ] `.env` bestand is **NIET** gecommit (staat in .gitignore)

### 5. Netlify Account
- [ ] Account aangemaakt op [netlify.com](https://netlify.com)
- [ ] Site is aangemaakt en gekoppeld aan repository
- [ ] Environment variables zijn ingesteld

### 6. Azure SQL Firewall
- [ ] Firewall regel toegevoegd: "Allow Azure services"
- [ ] Of specifieke Netlify IP ranges toegevoegd

---

## 🧪 Testing Before Deployment

### Lokaal testen:
```bash
# Start dev server
npm run dev

# In andere terminal, run tests
npm run test:predeploy
```

**Verwachte output:**
- ✅ Homepage loads
- ✅ Admin panel loads
- ✅ API endpoints return data
- ✅ Database connection works

---

## 🚀 Deployment Steps

### Methode 1: Via Netlify Dashboard (Aanbevolen)

1. **Push naar Git:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Netlify Dashboard:**
   - Ga naar [app.netlify.com](https://app.netlify.com)
   - Klik "Add new site" → "Import existing project"
   - Selecteer je Git provider en repository
   - Build settings worden automatisch gedetecteerd uit `netlify.toml`

3. **Environment Variables:**
   - Site Settings → Environment Variables
   - Voeg alle 5 Azure SQL variabelen toe

4. **Deploy:**
   - Klik "Deploy site"
   - Wacht 2-5 minuten

5. **Test Production:**
   - Open je site URL (bijv. `https://buro-staal.netlify.app`)
   - Test alle pagina's en API endpoints

### Methode 2: Via Netlify CLI

```bash
# Installeer Netlify CLI (eenmalig)
npm install -g netlify-cli

# Login
netlify login

# Deploy
npm run deploy:netlify
```

---

## ✅ Post-Deployment Checklist

### 1. Functionality Tests
- [ ] Homepage laadt correct
- [ ] Dashboard toont data
- [ ] Kennisbank pagina werkt
- [ ] Cases pagina werkt
- [ ] Trends pagina werkt
- [ ] Nieuws pagina werkt
- [ ] Team pagina werkt
- [ ] Admin panel is toegankelijk

### 2. API Tests
Test elk endpoint:
```bash
# Vervang YOUR_SITE met je Netlify URL
SITE_URL="https://your-site.netlify.app"

curl $SITE_URL/api/kennisitems
curl $SITE_URL/api/cases
curl $SITE_URL/api/trends
curl $SITE_URL/api/nieuws
```

Verwachte respons: JSON array met items

### 3. Admin Panel Tests
- [ ] Admin panel laadt
- [ ] Kan kennisitems toevoegen
- [ ] Kan cases toevoegen
- [ ] Kan trends toevoegen
- [ ] Kan nieuws toevoegen
- [ ] Kan items bewerken
- [ ] Kan items verwijderen
- [ ] Refresh buttons werken

### 4. Performance Tests
- [ ] Homepage laadt in <3 seconden
- [ ] API responses in <2 seconden
- [ ] Geen console errors in browser

### 5. Mobile Tests
- [ ] Dashboard werkt op mobiel
- [ ] Navigation menu werkt
- [ ] Admin panel werkt op mobiel

---

## 🐛 Common Issues & Solutions

### Issue: Build Fails
**Symptoom:** Deployment fails met "Build command failed"

**Oplossing:**
```bash
# Test build lokaal
BUILD_TARGET=netlify npm run build

# Check build logs in Netlify dashboard
```

### Issue: Database Connection Error
**Symptoom:** API returns empty arrays of 500 errors

**Checklist:**
1. ✅ Environment variables correct ingesteld in Netlify?
2. ✅ Azure SQL firewall staat open?
3. ✅ Database credentials zijn correct?
4. ✅ Database tabellen bestaan?
5. ✅ Database bevat data?

**Test:**
```bash
# Check Netlify Function logs
netlify functions:log

# Of in dashboard: Site Settings → Functions → Function log
```

### Issue: Slow Cold Starts
**Symptoom:** Eerste request duurt 10-15 seconden

**Dit is normaal voor serverless!** Oplossingen:
1. Gebruik [UptimeRobot](https://uptimerobot.com) om site warm te houden
2. Upgrade naar Netlify Pro voor snellere cold starts
3. Implementeer caching in API routes

### Issue: 404 on Sub-pages
**Symptoom:** Direct navigeren naar `/admin` geeft 404

**Oplossing:** Check `netlify.toml` redirect regel:
```toml
[[redirects]]
  from = "/*"
  to = "/.netlify/functions/___netlify-handler"
  status = 200
```

---

## 📊 Monitoring

### Netlify Dashboard
Monitor je site in real-time:
- **Analytics:** Traffic en bandwidth
- **Functions:** Invocations en execution time
- **Logs:** Real-time function logs
- **Deploys:** Deployment history

### Set up Alerts
1. Site Settings → Notifications
2. Add Slack/Email notifications voor:
   - Deploy failed
   - Deploy succeeded
   - Function errors

### Uptime Monitoring
Optioneel: Stel uptime monitoring in met:
- [UptimeRobot](https://uptimerobot.com) (gratis)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

---

## 🔄 Continuous Deployment

Elke push naar `main` triggert automatisch een nieuwe deployment:

```bash
# Make changes
git add .
git commit -m "Update dashboard"
git push origin main

# Netlify deployt automatisch!
```

### Preview Deployments
Test features in preview branches:
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature

# Krijg preview URL: https://feature-new-feature--site.netlify.app
```

---

## 🎯 Success Criteria

Je deployment is succesvol als:

✅ Site is bereikbaar op Netlify URL
✅ Alle pagina's laden binnen 3 seconden
✅ API endpoints retourneren correcte data
✅ Admin panel werkt volledig
✅ Geen JavaScript errors in console
✅ Database connectie werkt
✅ Alle CRUD operaties werken

---

## 📚 Resources

- [Netlify Deployment Guide](./NETLIFY_DEPLOYMENT.md) - Gedetailleerde instructies
- [Quick Deploy Guide](./QUICK_DEPLOY.md) - 5-minuten quick start
- [Netlify Docs](https://docs.netlify.com)
- [Astro Docs](https://docs.astro.build)
- [Azure SQL Docs](https://docs.microsoft.com/azure/azure-sql/)

---

## 🆘 Need Help?

1. Check Netlify Function logs
2. Check Azure SQL firewall settings
3. Verify environment variables
4. Check [Netlify Community](https://answers.netlify.com)
5. Check [Astro Discord](https://astro.build/chat)

---

**🎉 Veel succes met je deployment!**

Bij vragen of problemen, check de documentatie of neem contact op met support.
