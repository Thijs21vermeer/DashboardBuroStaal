# 🔄 Webflow Sandbox → GitHub → Netlify Workflow

**Perfect! Ik heb alles opgezet zodat je in deze sandbox kunt werken en alles automatisch sync naar GitHub en Netlify!**

---

## 🎯 De Setup

```
┌─────────────────────────────┐
│   Webflow Sandbox           │  ← JIJ WERKT HIER!
│   (Development)             │     • Code schrijven
│                             │     • Testen
│   netlify-app/              │     • Features bouwen
└──────────────┬──────────────┘
               │
               │ .git-sync.sh (1 commando!)
               ↓
┌─────────────────────────────┐
│   GitHub Repository         │  ← Automatisch geüpdatet
│   (Source Control)          │     • Code backup
│                             │     • Version history
│   github.com/jouw/repo      │     • Collaboration
└──────────────┬──────────────┘
               │
               │ Automatic deployment (Netlify)
               ↓
┌─────────────────────────────┐
│   Netlify Production        │  ← Live website!
│   (Hosting)                 │     • Automatic deploys
│                             │     • SSL + CDN
│   jouw-site.netlify.app     │     • Preview URLs
└─────────────────────────────┘
```

---

## 🚀 Quick Start (Eenmalige Setup)

### **Stap 1: GitHub Repository Aanmaken**

```bash
# Ga naar: https://github.com/new
# Repository naam: burostaal-kennisbank (of eigen naam)
# Maak repository aan (public of private)
# Kopieer de repository URL (bijv. https://github.com/username/burostaal-kennisbank.git)
```

### **Stap 2: Git Configureren in Sandbox**

```bash
cd netlify-app

# Configureer je Git identity (eenmalig)
git config --global user.name "Jouw Naam"
git config --global user.email "jouw@email.com"

# Run sync script (initialiseert Git + push)
./.git-sync.sh

# Volg de instructies:
# - Voer je GitHub repository URL in
# - Script pusht naar GitHub
```

### **Stap 3: Netlify Koppelen**

```bash
# Ga naar: https://app.netlify.com
# Log in / Sign up

# Klik: "Add new site" → "Import an existing project"
# Kies: "Deploy with GitHub"
# Authoriseer Netlify op GitHub
# Selecteer je repository: burostaal-kennisbank

# Configure build settings:
Base directory:        netlify-app
Build command:         npm run build
Publish directory:     netlify-app/dist

# Environment variables:
VITE_API_URL          /api

# Klik: "Deploy site"
```

**Klaar! 🎉**

---

## 💻 Dagelijkse Workflow

### **Je werkt in de Webflow Sandbox:**

```bash
# 1. Open je sandbox
cd netlify-app

# 2. Maak wijzigingen
vim src/pages/Dashboard.tsx
# Of gebruik de Webflow editor

# 3. Test lokaal (optioneel)
npm run dev
# Check http://localhost:3000

# 4. Push naar GitHub (1 commando!)
./.git-sync.sh

# Script vraagt:
# - Commit message (of Enter voor standaard)
# - Pusht automatisch naar GitHub
# - Netlify deployt automatisch!

# 5. Check Netlify
# Ga naar: https://app.netlify.com
# Zie je deploy live gaan (1-2 minuten)
```

**Dat is alles! ✨**

---

## 🎨 Voorbeeld Workflows

### **Workflow 1: Kleine Fix**

```bash
cd netlify-app

# Edit file
vim src/components/Header.tsx

# Push
./.git-sync.sh
# → Type: "Fix header styling"
# → Enter

# Done! Live in 2 minuten ✅
```

### **Workflow 2: Nieuwe Feature**

```bash
cd netlify-app

# Maak nieuwe component
vim src/components/NewFeature.tsx

# Add to page
vim src/pages/Dashboard.tsx

# Test
npm run dev

# Push
./.git-sync.sh
# → Type: "Add new feature X"
# → Enter

# Done! ✅
```

### **Workflow 3: Meerdere Changes**

```bash
cd netlify-app

# Werk aan meerdere files
vim src/pages/Cases.tsx
vim src/pages/Trends.tsx
vim src/components/Sidebar.tsx

# Test alles
npm run build

# Push alles in 1 commit
./.git-sync.sh
# → Type: "Update Cases, Trends and Sidebar"
# → Enter

# Done! ✅
```

---

## 🔧 Git Sync Script Features

Het `.git-sync.sh` script doet:

1. ✅ **Check status** - Toont welke files gewijzigd zijn
2. ✅ **Stage changes** - `git add .`
3. ✅ **Commit** - Met jouw message (of timestamp)
4. ✅ **Push** - Naar GitHub (current branch)
5. ✅ **First-time setup** - Helpt bij eerste push
6. ✅ **Error handling** - Duidelijke error messages

**Gebruik:**
```bash
cd netlify-app
./.git-sync.sh
```

**Alias maken (optioneel):**
```bash
# In je shell config (~/.bashrc of ~/.zshrc)
alias sync="cd /path/to/netlify-app && ./.git-sync.sh"

# Dan overal:
sync
```

---

## 🌿 Branches (Advanced)

### **Werken met branches voor features:**

```bash
cd netlify-app

# Maak nieuwe branch voor feature
git checkout -b feature/nieuwe-dashboard

# Werk aan feature
vim src/pages/Dashboard.tsx

# Test
npm run dev

# Push naar branch
./.git-sync.sh
# → Pusht naar feature/nieuwe-dashboard

# Netlify maakt automatisch preview URL! 🎉
# bijv: feature-nieuwe-dashboard--jouw-site.netlify.app
```

### **Merge naar main:**

```bash
# Via GitHub UI (aanbevolen):
# 1. Ga naar GitHub
# 2. Maak Pull Request
# 3. Review changes
# 4. Merge PR
# 5. Netlify deployt main automatisch!

# Of lokaal:
git checkout main
git merge feature/nieuwe-dashboard
./.git-sync.sh
```

---

## 📊 Netlify Dashboard

Na setup zie je in Netlify:

### **Deploys Tab:**
- ✅ Laatste deploys
- ✅ Build logs
- ✅ Deploy preview URLs
- ✅ Rollback buttons

### **Site Settings:**
- ✅ Domain settings
- ✅ Environment variables
- ✅ Build settings
- ✅ Deploy hooks

### **Functions Tab:**
- ⚠️ Leeg (je gebruikt Azure Functions)

---

## 🔄 Automatische Deploys

**Netlify deployt automatisch bij:**

1. ✅ **Push naar main** → Production deploy
2. ✅ **Push naar branch** → Preview deploy
3. ✅ **Pull Request** → Preview deploy (URL in PR)
4. ✅ **Merge PR** → Production deploy

**Je hoeft NIETS handmatig te doen!** 🎉

---

## 🐛 Troubleshooting

### **❌ "Git is not initialized"**

```bash
cd netlify-app
./.git-sync.sh
# Volg de setup wizard
```

### **❌ "Permission denied (publickey)"**

```bash
# Setup SSH key voor GitHub
ssh-keygen -t ed25519 -C "your@email.com"
cat ~/.ssh/id_ed25519.pub
# Kopieer en add to GitHub: Settings → SSH Keys
```

### **❌ "Push rejected"**

```bash
# Pull eerst
git pull origin main

# Los conflicts op (als nodig)
# Dan push
./.git-sync.sh
```

### **❌ "Build failed on Netlify"**

```bash
# Check build logs op Netlify
# Test lokaal:
cd netlify-app
npm run build

# Fix errors en push opnieuw
./.git-sync.sh
```

---

## 🎯 Best Practices

### **Commit Messages:**
```bash
✅ "Add kennisbank search filter"
✅ "Fix header responsive design"
✅ "Update API client for trends"

❌ "update"
❌ "fix"
❌ "changes"
```

### **Testen voor Push:**
```bash
# Altijd testen voor push!
npm run build

# Als build succeeds → push
./.git-sync.sh
```

### **Frequentie:**
```bash
# Push regelmatig!
✅ Na elke feature
✅ Einde van de dag
✅ Voor belangrijke demos

❌ Niet: 1x per week (te lang tussen pushes)
```

---

## 📱 Pull Changes (als je ook lokaal werkt)

```bash
# In sandbox
cd netlify-app
git pull origin main

# Nu heb je laatste changes
```

---

## 🎓 Git Basics (Cheat Sheet)

```bash
# Status check
git status

# Zie changes
git diff

# History
git log --oneline

# Branches
git branch              # List
git checkout -b naam    # Create
git checkout main       # Switch

# Undo (voorzichtig!)
git reset --hard HEAD   # Discard all changes
git checkout -- file    # Discard file changes

# Pull latest
git pull origin main
```

---

## 🚀 Complete Setup Checklist

- [ ] GitHub repository aangemaakt
- [ ] Git config in sandbox (`git config --global`)
- [ ] `.git-sync.sh` script gerund (eerste keer)
- [ ] Repository URL ingevoerd
- [ ] Eerste push succesvol
- [ ] Netlify account aangemaakt
- [ ] Repository connected in Netlify
- [ ] Build settings geconfigureerd
- [ ] Environment variable `VITE_API_URL=/api` ingesteld
- [ ] Eerste deploy succesvol
- [ ] Custom domain toegevoegd (optioneel)
- [ ] `netlify.toml` Azure Functions URL geconfigureerd

---

## 🎉 Klaar!

**Je workflow is nu:**

1. **Werk** in Webflow Sandbox
2. **Run** `./.git-sync.sh`
3. **Deploy** gebeurt automatisch via Netlify
4. **Live** in 1-2 minuten!

**Zo simpel is het! 🚀**

---

## 📚 Meer Info

- **Git Basics**: [git-scm.com](https://git-scm.com/book/en/v2)
- **GitHub Docs**: [docs.github.com](https://docs.github.com)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Netlify Deploy Docs**: [docs.netlify.com/site-deploys](https://docs.netlify.com/site-deploys/overview/)

---

## 🆘 Hulp Nodig?

Check deze files:
- **SANDBOX_WORKFLOW.md** (dit bestand) - Workflow uitleg
- **netlify-app/QUICKSTART.md** - Quick setup
- **netlify-app/DEPLOYMENT.md** - Deployment guide

---

**Happy coding in de Webflow Sandbox! 💜**

Push regelmatig en zie je site automatisch live gaan! 🚀
