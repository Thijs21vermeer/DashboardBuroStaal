# ⚡ Quick Start - Buro Staal Kennisbank

Snel aan de slag met je Azure Static Web App!

## 🚀 In 5 minuten live!

### Stap 1: Installeer Dependencies (1 min)

```bash
cd azure-static-web-app
npm install
```

### Stap 2: Start Development Server (1 min)

```bash
npm run dev
```

Open http://localhost:3000 🎉

### Stap 3: Deploy naar Azure (3 min)

```bash
# Build
npm run build

# Push naar GitHub (als je repo al gekoppeld is)
git add .
git commit -m "Initial deploy"
git push origin main
```

GitHub Actions deployt automatisch naar Azure! ✨

---

## 📱 Lokaal Testen

### Frontend Only
```bash
npm run dev
```
API calls gaan naar `/api` (proxy naar je Azure Functions)

### Met Lokale Azure Functions
```bash
# Terminal 1: Start Functions
cd ../azure-functions
func start

# Terminal 2: Start Frontend
cd ../azure-static-web-app
npm run dev
```

---

## 🔧 Configuratie

### Environment Variables

Maak `.env` aan:
```env
VITE_API_URL=/api
```

Voor lokale functions:
```env
VITE_API_URL=http://localhost:7071/api
```

---

## 📦 Build voor Productie

```bash
npm run build
```

Output komt in `dist/` folder.

---

## 🌐 Pagina's

- **Dashboard**: `/`
- **Kennisbank**: `/kennisbank`
- **Cases**: `/cases`
- **Trends**: `/trends`
- **Team**: `/team`
- **Nieuws**: `/nieuws`
- **Admin**: `/admin`

---

## 🐛 Troubleshooting

### Port 3000 al in gebruik?
```bash
# Vite gebruikt automatisch een andere port
npm run dev
```

### API errors?
Verifieer dat je Azure Functions draaien:
- Check Azure Portal
- Of start lokaal: `func start`

### Build errors?
```bash
# Clean install
rm -rf node_modules
npm install
npm run build
```

---

## 📚 Meer Info

- Volledige deployment: zie `DEPLOYMENT.md`
- Architectuur: zie `ARCHITECTURE.md`
- Features: zie `README.md`

---

## 🆘 Hulp Nodig?

```bash
# Check of alles werkt
npm run build

# Als dit lukt, is je setup correct! ✅
```

**Happy coding! 🎉**
