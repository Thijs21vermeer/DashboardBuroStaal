# 🚀 START HIER - Webflow Sandbox → GitHub → Netlify

**Perfect opgezet! Je kunt nu in deze sandbox werken en automatisch deployen naar Netlify via GitHub!**

---

## ⚡ Super Quick Start (5 minuten)

### **1. Setup (eenmalig)**
```bash
cd netlify-app
cat SANDBOX_SETUP.md
# Volg de 5 stappen
```

### **2. Dagelijks gebruik**
```bash
cd netlify-app

# Maak wijzigingen
vim src/pages/Dashboard.tsx

# Push (1 commando!)
./.git-sync.sh

# Live in 2 minuten! ✅
```

**Dat is alles! 🎉**

---

## 📁 Folder Structuur

```
/
├── START_HERE.md              ← Dit bestand (begin hier!)
├── SANDBOX_WORKFLOW.md        ← Complete workflow uitleg
│
├── netlify-app/               ← WERK HIER!
│   ├── .git-sync.sh           ← Magic script (push to GitHub)
│   ├── SANDBOX_SETUP.md       ← Setup instructies
│   ├── QUICKSTART.md          ← 5-minuten guide
│   ├── DEPLOYMENT.md          ← Volledige deployment guide
│   ├── netlify.toml           ← Netlify config
│   └── src/                   ← Je code
│
├── NETLIFY_vs_AZURE.md        ← Platform vergelijking
└── azure-functions-api/       ← Backend (blijft op Azure)
```

---

## 🎯 Wat is er opgezet?

### ✅ **Git Sync Script**
`.git-sync.sh` in netlify-app/
- Pusht automatisch naar GitHub
- Vraagt om commit message
- Netlify deployt automatisch

### ✅ **Complete Documentatie**
5 markdown bestanden met:
- Setup instructies
- Workflow guides
- Troubleshooting
- Best practices

### ✅ **Netlify Configuratie**
`netlify.toml` met:
- Build settings
- API proxy naar Azure Functions
- SPA routing
- Security headers
- Cache optimization

---

## 🔄 De Flow

```
┌─────────────────────┐
│  Webflow Sandbox    │  ← Jij werkt hier
│  netlify-app/       │
└──────────┬──────────┘
           │
           │ .git-sync.sh (1 command!)
           ↓
┌─────────────────────┐
│  GitHub             │  ← Automatisch geüpdatet
│  Repository         │
└──────────┬──────────┘
           │
           │ Netlify auto-deploy
           ↓
┌─────────────────────┐
│  Netlify            │  ← Live website!
│  Production         │     (1-2 min deploy)
└─────────────────────┘
```

---

## 📚 Welke Docs Lezen?

### **Als je net begint:**
👉 **netlify-app/SANDBOX_SETUP.md** - 5-stappen setup

### **Voor dagelijks werk:**
👉 **SANDBOX_WORKFLOW.md** - Complete workflow guide

### **Voor deployment details:**
👉 **netlify-app/DEPLOYMENT.md** - Volledige guide

### **Voor platform info:**
👉 **NETLIFY_vs_AZURE.md** - Waarom Netlify

---

## 🎓 Quick Commands

```bash
# Push naar GitHub
cd netlify-app && ./.git-sync.sh

# Status check
cd netlify-app && git status

# Test lokaal
cd netlify-app && npm run dev

# Build test
cd netlify-app && npm run build

# Pull latest
cd netlify-app && git pull origin main
```

---

## 💰 Kosten

| Service | Kosten |
|---------|--------|
| Webflow Sandbox | €0 (development) |
| GitHub | €0 (public repo) |
| Netlify | €0 (Free tier) |
| Azure Functions | €0-5/maand |
| Azure SQL | €5/maand |
| **TOTAAL** | **€5-10/maand** |

**VS andere oplossingen: €20-50/maand** 💰

---

## ✅ Setup Checklist

- [ ] Gelezen: START_HERE.md (dit bestand)
- [ ] Gelezen: netlify-app/SANDBOX_SETUP.md
- [ ] GitHub repository aangemaakt
- [ ] Git geconfigureerd in sandbox
- [ ] Eerste push gedaan (`.git-sync.sh`)
- [ ] Netlify account aangemaakt
- [ ] Repository connected op Netlify
- [ ] Eerste deploy successful
- [ ] Azure Functions URL configured
- [ ] Test push gedaan

---

## 🚀 Get Started

```bash
# 1. Open setup guide
cd netlify-app
cat SANDBOX_SETUP.md

# 2. Volg de 5 stappen

# 3. Test je eerste push
echo "test" >> test.txt
./.git-sync.sh

# 4. Check Netlify
# Open: https://app.netlify.com
# Zie deploy live gaan!
```

---

## 🎯 Belangrijkste Files

### **In netlify-app/:**
- `.git-sync.sh` ⭐ - Push script (GEBRUIK DIT!)
- `SANDBOX_SETUP.md` - Setup guide (START HIER!)
- `netlify.toml` - Netlify config (UPDATE Azure URL!)
- `src/` - Je code (WERK HIER!)

### **In root:**
- `START_HERE.md` - Dit bestand
- `SANDBOX_WORKFLOW.md` - Complete workflow

---

## 🐛 Problemen?

### **Git errors?**
→ Check: netlify-app/SANDBOX_SETUP.md § Troubleshooting

### **Build fails?**
→ Test lokaal: `cd netlify-app && npm run build`

### **API niet werkend?**
→ Check: netlify-app/netlify.toml regel 21 (Azure URL)

### **Meer help?**
→ Lees: SANDBOX_WORKFLOW.md (volledige guide)

---

## 🎉 Klaar om te beginnen!

**Je workflow vanaf nu:**

1. Open sandbox
2. Werk in `netlify-app/`
3. Run `.git-sync.sh`
4. Live in 2 minuten! 🚀

**Simpeler wordt het niet! ✨**

---

## 📖 Lees Verder

- **SANDBOX_WORKFLOW.md** - Complete workflow guide
- **netlify-app/SANDBOX_SETUP.md** - Setup instructies
- **netlify-app/DEPLOYMENT.md** - Deployment details
- **NETLIFY_vs_AZURE.md** - Platform vergelijking

---

**Made with 💜 for Buro Staal**

Happy coding in de Webflow Sandbox! 🚀

Push regelmatig en zie je site automatisch live gaan!
