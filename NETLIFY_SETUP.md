# 🚀 Netlify Setup Complete!

Je Buro Staal Kennisbank is nu klaar voor deployment op Netlify!

## 📁 Wat is er aangemaakt?

```
netlify-app/
├── .github/workflows/
│   └── netlify.yml              # CI/CD workflow (optioneel)
├── scripts/
│   └── configure-api.sh         # Helper script voor API configuratie
├── src/
│   ├── lib/
│   │   ├── api-client.ts        # API client voor Azure Functions
│   │   └── config.ts            # App configuratie
│   ├── components/              # React componenten (van azure-static-web-app)
│   ├── pages/                   # Pagina's (van azure-static-web-app)
│   └── ...
├── netlify.toml                 # Netlify configuratie ⭐
├── _redirects                   # Netlify redirects (backup)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore
├── package.json                 # Dependencies
├── DEPLOYMENT.md                # Volledige deployment guide
├── QUICKSTART.md                # Snelle start guide
└── README.md                    # Algemene info
```

---

## ⚡ Quick Start

### 1. Configureer API URL

**Optie A: Via script (Makkelijkst!)**
```bash
cd netlify-app
./scripts/configure-api.sh
# Volg de instructies
```

**Optie B: Handmatig**
```bash
cd netlify-app

# Bewerk netlify.toml regel 21:
# Vervang: https://JOUW-FUNCTION-APP.azurewebsites.net
# Met:     https://burostaal-api.azurewebsites.net (of jouw naam)
```

### 2. Test Lokaal

```bash
cd netlify-app
npm install
npm run dev
```

Open: **http://localhost:3000** 🎉

### 3. Deploy naar Netlify

**GitHub (Aanbevolen):**
```bash
git add .
git commit -m "Setup Netlify deployment"
git push

# Ga naar netlify.com en connect je repository
```

**Drag & Drop:**
```bash
npm run build
# Drag netlify-app/dist naar netlify.com/drop
```

---

## 🏗️ Architectuur

```
┌──────────────────┐
│   Netlify        │  ← React Frontend (GRATIS!)
│   (Frontend)     │     • Automatic SSL
│                  │     • CDN
│                  │     • Preview deploys
└────────┬─────────┘
         │
         │ /api/* → Proxy
         ↓
┌──────────────────┐
│ Azure Functions  │  ← Backend API
│   (Backend)      │     • Serverless
│                  │     • Auto-scale
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Azure SQL DB    │  ← Database
└──────────────────┘
```

---

## 💰 Kosten

| Service | Tier | Kosten/maand |
|---------|------|--------------|
| **Netlify** | Free | €0 (100GB bandwidth) |
| **Azure Functions** | Consumption | €0-5 (1M gratis requests) |
| **Azure SQL** | Basic | €5 |
| **TOTAAL** | | **~€5-10** 🎉 |

**Azure Static Web Apps**: €0-9/maand
**Netlify**: €0 (Free tier is meer dan genoeg!)

---

## 🎯 Features

### Netlify Voordelen:
- ✅ **Gratis hosting** (Free tier)
- ✅ **Instant rollbacks** (1-click terugdraaien)
- ✅ **Preview deploys** (elke PR krijgt preview URL)
- ✅ **Form handling** (ingebouwd)
- ✅ **Snelle builds** (sneller dan Azure)
- ✅ **Custom domains** met gratis SSL
- ✅ **Edge Functions** (optioneel)
- ✅ **Analytics** (optioneel, €9/maand)

### App Features:
- ✅ React 18 + TypeScript
- ✅ Tailwind CSS
- ✅ Responsive design
- ✅ Kennisbank met zoeken & filteren
- ✅ Case studies
- ✅ Trends & Insights
- ✅ Team overzicht
- ✅ Intern nieuws
- ✅ Admin panel

---

## 📝 Environment Variables

### Netlify Dashboard
```
VITE_API_URL = /api
```

### Lokaal (.env)
```bash
# Development met lokale Azure Functions
VITE_API_URL=http://localhost:7071/api

# Of deployed Azure Functions
VITE_API_URL=https://burostaal-api.azurewebsites.net/api
```

---

## 🔧 Netlify Configuratie

### netlify.toml

Dit bestand configureert:
1. **Build settings** (command, output dir)
2. **Redirects** (SPA routing + API proxy)
3. **Headers** (security, caching)
4. **Environment** (Node version)

**Belangrijk**: Update regel 21 met jouw Azure Functions URL!

```toml
[[redirects]]
  from = "/api/*"
  to = "https://JOUW-FUNCTION-APP.azurewebsites.net/api/:splat"
```

---

## 🚀 Deployment Workflow

```bash
# 1. Maak wijziging
vim src/components/Dashboard.tsx

# 2. Commit & push
git add .
git commit -m "Update dashboard"
git push

# 3. Netlify deployt automatisch! ✅
# - Build start binnen 10 seconden
# - Deploy klaar in 1-2 minuten
# - Site live!
```

---

## 🔄 Preview Deploys

Elke Pull Request krijgt automatisch een preview URL:

```bash
git checkout -b feature/nieuwe-feature
git add .
git commit -m "Add nieuwe feature"
git push origin feature/nieuwe-feature

# Maak PR op GitHub
# Netlify comment in PR met preview URL:
# → https://deploy-preview-123--burostaal.netlify.app
```

**Perfect voor:** Testen voor merge naar main! ✅

---

## 📊 Monitoring

### Netlify Dashboard
- Deploy logs
- Build time
- Bandwidth usage
- Form submissions

### Azure Portal
- Function executions
- Database connections
- Errors & logs

---

## 🐛 Troubleshooting

### API calls falen?

**1. Check netlify.toml**
```bash
cat netlify-app/netlify.toml | grep "to ="
# Should show: https://jouw-app.azurewebsites.net/api/:splat
```

**2. Test Azure Functions**
```bash
curl https://burostaal-api.azurewebsites.net/api/kennisitems
```

**3. Check CORS in Azure Functions**
```typescript
headers: {
  'Access-Control-Allow-Origin': '*'
}
```

### Build fails?

```bash
cd netlify-app
rm -rf node_modules
npm install
npm run build
```

### Empty data?

```bash
cd azure-functions-api
npm run seed
```

---

## 📚 Documentatie

- **Quick Start**: [netlify-app/QUICKSTART.md](./netlify-app/QUICKSTART.md)
- **Deployment**: [netlify-app/DEPLOYMENT.md](./netlify-app/DEPLOYMENT.md)
- **README**: [netlify-app/README.md](./netlify-app/README.md)

### Externe Links
- [Netlify Docs](https://docs.netlify.com)
- [Netlify Forums](https://answers.netlify.com)
- [Azure Functions Docs](https://learn.microsoft.com/azure/azure-functions/)

---

## ✅ Next Steps

- [ ] Configureer API URL in netlify.toml
- [ ] Test lokaal met `npm run dev`
- [ ] Push naar GitHub
- [ ] Connect repository in Netlify
- [ ] Configure environment variables
- [ ] Deploy! 🚀
- [ ] (Optioneel) Custom domain toevoegen
- [ ] (Optioneel) Analytics inschakelen

---

## 🎉 Done!

Je Kennisbank is klaar voor Netlify!

**Voordelen van deze setup:**
- 💰 **Goedkoper** (Netlify gratis vs Azure Static Web Apps €9/maand)
- ⚡ **Sneller** (builds en deploys)
- 🔄 **Betere DX** (preview deploys, instant rollbacks)
- 🌐 **Betrouwbaarder** (Netlify CDN)
- 📊 **Betere analytics** (optioneel)

**Questions?**
- Check QUICKSTART.md voor snelle setup
- Check DEPLOYMENT.md voor volledige guide
- Check Netlify Docs voor platform specifieke vragen

---

**Made with 💜 for Buro Staal**

Deploy je eerste Kennisbank in 5 minuten! 🚀
