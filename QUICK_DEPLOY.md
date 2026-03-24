# ⚡ Quick Deploy Guide

## 🚀 Deploy naar Netlify in 5 minuten

### Stap 1: Push naar Git
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### Stap 2: Netlify Koppelen
1. Ga naar [netlify.com](https://netlify.com)
2. Klik **"Add new site"** → **"Import existing project"**
3. Selecteer je repository
4. Netlify detecteert automatisch de configuratie

### Stap 3: Environment Variables
Voeg toe in Netlify dashboard:
```
AZURE_SQL_SERVER=dashboardbs.database.windows.net
AZURE_SQL_DATABASE=dashboarddb
AZURE_SQL_USER=databasedashboard
AZURE_SQL_PASSWORD=<YOUR_SECURE_PASSWORD>
AZURE_SQL_PORT=1433
```

### Stap 4: Azure Firewall
1. Ga naar [Azure Portal](https://portal.azure.com)
2. SQL Server → Security → Networking
3. Schakel in: **"Allow Azure services"**
4. Klik **Save**

### Stap 5: Deploy!
Klik op **"Deploy site"** in Netlify

---

## ✅ Klaar!

Je site is live op: `https://your-site.netlify.app`

Test de API:
- `/api/kennisitems` - Kennisbank items
- `/api/cases` - Case studies
- `/api/trends` - Trends & insights
- `/api/nieuws` - Intern nieuws
- `/admin` - Admin panel

---

## 📖 Meer Info

Zie `NETLIFY_DEPLOYMENT.md` voor gedetailleerde instructies.
