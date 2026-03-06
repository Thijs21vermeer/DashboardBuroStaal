# ⚡ Quick Fix: Admin Panel in Netlify

## TL;DR

Admin panel werkt nu in sandbox, maar niet in Netlify? **3 stappen om het te fixen:**

---

## ✅ Stap 1: Environment Variables (2 min)

### In Netlify Dashboard:
1. Ga naar: **Site settings** → **Environment variables**
2. Klik: **Add a variable** (5x)
3. Voeg toe:

```
AZURE_SQL_SERVER → dashboardbs.database.windows.net
AZURE_SQL_DATABASE → dashboarddb
AZURE_SQL_USER → databasedashboard
AZURE_SQL_PASSWORD → Knolpower05!
AZURE_SQL_PORT → 1433
```

4. Klik **Save**

---

## ✅ Stap 2: Azure Firewall (1 min)

### In Azure Portal:
1. Ga naar: **SQL Database** → **dashboarddb**
2. Klik: **Set server firewall** (toolbar)
3. Enable: **"Allow Azure services"** → `ON`
4. Klik: **Save**

---

## ✅ Stap 3: Test (1 min)

### Deploy & Verify:
```bash
git add .
git commit -m "Fix admin panel"
git push
```

Wacht 2 minuten, dan test:
```bash
curl https://jouw-site.netlify.app/api/health
```

**Verwacht**: Alle `has*` velden zijn `true` ✅

Open admin panel:
```
https://jouw-site.netlify.app/admin
```

**Verwacht**: Groene banner "Verbonden met database" ✅

---

## 🐛 Troubleshooting

| Symptom | Fix |
|---------|-----|
| ❌ Rode banner | Check env vars in Netlify |
| ⚠️ Gele banner | Database leeg, run seed |
| 🔒 Connection timeout | Check Azure firewall |
| 404 Not Found | Clear build cache, redeploy |

---

## 📚 Meer Info

- [ADMIN_PANEL_FIX_SUMMARY.md](./ADMIN_PANEL_FIX_SUMMARY.md) - Complete overzicht
- [NETLIFY_ENV_SETUP.md](./NETLIFY_ENV_SETUP.md) - Gedetailleerde setup
- [NETLIFY_ADMIN_FIX.md](./NETLIFY_ADMIN_FIX.md) - Technische details

---

**Totale tijd**: ~5 minuten  
**Status**: ✅ Production ready

🚀 **Deploy en test!**
