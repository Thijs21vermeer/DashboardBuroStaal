# Turso Database Setup Guide

## ✅ Migratie van Azure SQL → Turso Compleet!

Je applicatie gebruikt nu **Turso** (SQLite in de cloud) in plaats van Azure SQL.

---

## 🔐 Stap 1: Environment Variables Configureren

### **Lokaal (.env bestand)**

Voeg deze regels toe aan je `.env` bestand:

```bash
# Turso Database
TURSO_DATABASE_URL=libsql://burostaal-database-thijs21vermeer.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=eyJ... # Jouw nieuwe token (na revoke)

# JWT Secret (bestaande)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### **Netlify (Production)**

1. Ga naar Netlify Dashboard
2. Site settings → Environment variables
3. Voeg toe:
   - `TURSO_DATABASE_URL` = `libsql://burostaal-database-thijs21vermeer.aws-eu-west-1.turso.io`
   - `TURSO_AUTH_TOKEN` = `[jouw nieuwe token]`
   - `JWT_SECRET` = `[je bestaande JWT secret]`

---

## 🗄️ Stap 2: Database Schema Aanmaken

Run dit commando om de tabellen aan te maken:

```bash
# Via Turso CLI
turso db shell burostaal-database < db/turso-schema.sql

# Of via het init script
npm run db:init
```

---

## 📊 Stap 3: Data Migreren (Optioneel)

### **Als je nog toegang hebt tot Azure:**

```bash
# 1. Export data van Azure
npm run db:export-azure

# 2. Import naar Turso
npm run db:import-turso
```

### **Als Azure verlopen is:**

Start met een lege database. Je admin panel werkt direct om nieuwe items toe te voegen!

---

## 🧪 Stap 4: Testen

```bash
# Test database connection
npm run db:test

# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/diagnostics
```

---

## 🚀 Stap 5: Deployment

```bash
# Build en deploy naar Netlify
npm run build
netlify deploy --prod

# Of via GitHub (automatic)
git push origin main
```

---

## 📋 Checklist

- [ ] Turso token ge-revoked en nieuwe aangemaakt
- [ ] `.env` bestand lokaal geconfigureerd
- [ ] Netlify environment variables ingesteld
- [ ] Database schema aangemaakt (`npm run db:init`)
- [ ] Data gemigreerd (optioneel)
- [ ] Lokaal getest (`npm run dev`)
- [ ] Deployed naar Netlify

---

## 🔧 Troubleshooting

### **"Missing TURSO_DATABASE_URL"**
→ Check of environment variables correct zijn ingesteld

### **"Authentication failed"**
→ Token is verlopen of fout, maak nieuwe aan

### **"Table does not exist"**
→ Run `npm run db:init` om schema aan te maken

### **"No items showing"**
→ Database is leeg, gebruik admin panel om items toe te voegen

---

## 📚 Commando's

```bash
# Database
npm run db:init         # Maak schema aan
npm run db:test         # Test connectie
npm run db:export-azure # Export van Azure (als toegang hebt)
npm run db:import-turso # Import naar Turso

# Development
npm run dev            # Start dev server
npm run build          # Build productie versie
npm run preview        # Preview productie build

# Deployment
netlify deploy --prod  # Deploy naar Netlify
```

---

## 💡 Tips

1. **Backup:** Download database regelmatig
   ```bash
   turso db dump burostaal-database > backup-$(date +%Y%m%d).sql
   ```

2. **Monitoring:** Check Turso dashboard voor usage
   ```bash
   turso db show burostaal-database
   ```

3. **Debugging:** Enable verbose logging
   ```bash
   DEBUG=turso:* npm run dev
   ```

---

## 🆘 Hulp Nodig?

- Turso Docs: https://docs.turso.tech
- Turso Discord: https://discord.gg/turso
- LibSQL Docs: https://github.com/libsql/libsql
