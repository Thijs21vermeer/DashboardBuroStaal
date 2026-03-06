# Buro Staal Kennisbank - Azure Static Web App

Een complete kennisbank voor Buro Staal, volledig gehost op Azure.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Azure Functions (Node.js)
- **Database**: Azure SQL Database
- **Hosting**: Azure Static Web Apps
- **CI/CD**: GitHub Actions

## 📁 Project Structuur

```
azure-static-web-app/
├── src/
│   ├── components/       # React componenten
│   ├── pages/           # Pagina's (routing)
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── dist/                # Build output (wordt gegenereerd)
├── .github/workflows/   # GitHub Actions
├── staticwebapp.config.json  # Azure SWA configuratie
├── vite.config.ts       # Vite configuratie
└── package.json
```

## 🛠️ Lokale Development

### Prerequisites
- Node.js 18+
- npm of yarn
- Azure Functions Core Tools (voor API's)

### Installatie

```bash
cd azure-static-web-app
npm install
```

### Development Server Starten

```bash
npm run dev
```

Frontend draait op: http://localhost:3000

### Build voor Productie

```bash
npm run build
```

## 🌐 Azure Functions API

De backend API's zijn beschikbaar via Azure Functions. Deze zijn al geconfigureerd in je bestaande Azure omgeving.

### API Endpoints:
- `GET /api/kennisitems` - Haal alle kennisitems op
- `GET /api/cases` - Haal alle cases op
- `GET /api/trends` - Haal alle trends op
- `GET /api/nieuws` - Haal alle nieuwsitems op

## 📦 Deployment naar Azure

### Automatisch via GitHub Actions

1. Maak een Azure Static Web App in de Azure Portal
2. Kopieer de deployment token
3. Voeg deze toe als GitHub Secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
4. Push naar de `main` branch
5. GitHub Actions bouwt en deployt automatisch!

### Handmatig via Azure CLI

```bash
# Login
az login

# Deploy
npm run build
az staticwebapp deploy --app-name buro-staal-kennisbank --source ./dist
```

## 🔧 Configuratie

### Environment Variables

Maak een `.env` bestand aan voor lokale development:

```env
VITE_API_URL=http://localhost:7071/api
```

In Azure Static Web Apps configureer je deze via de Azure Portal onder "Configuration".

## 📊 Features

- ✅ Dashboard met statistieken
- ✅ Kennisbank met zoekfunctie
- ✅ Case studies overzicht
- ✅ Trends & Insights
- ✅ Team overzicht
- ✅ Intern nieuws
- ✅ Admin panel
- ✅ Responsive design
- ✅ Azure SQL Database integratie
- ✅ Automatische CI/CD

## 🎨 Design System

- **Primary Color**: #280bc4 (paars/blauw)
- **Accent Color**: #7ef769 (groen)
- **Background**: White
- **Text**: Gray-900
- **Borders**: Gray-200

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Security

- API endpoints zijn beveiligd via Azure Functions
- Database credentials worden beheerd via Azure Key Vault
- HTTPS wordt automatisch afgedwongen door Azure Static Web Apps

## 📝 To Do

- [ ] Voeg authenticatie toe (Azure AD B2C)
- [ ] Implementeer search functionaliteit
- [ ] Voeg analytics toe (Application Insights)
- [ ] Maak detail pagina's voor kennisitems

## 🤝 Contributing

Dit is een intern project voor Buro Staal.

## 📄 License

Proprietary - Buro Staal 2024
