# Buro Staal Dashboard - Kennisbank & Media Bank

Een moderne kennisbank en mediabank applicatie voor Buro Staal, gebouwd met Astro, React, TypeScript en Azure SQL.

## 🚀 Features

- **Kennisbank**: Doorzoekbare database met kennisitems, tags en filters
- **Case Studies**: Overzicht van succesvolle klantprojecten
- **Trends & Insights**: Actuele ontwikkelingen in de maakindustrie
- **Team & Expertise**: Overzicht van het Buro Staal team en externe partners
- **Intern Nieuws**: Updates en achievements binnen het bedrijf
- **Admin Panel**: Volledige CRUD functionaliteit voor content management

## 🛠️ Tech Stack

- **Frontend**: Astro + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Azure SQL Database
- **API**: Azure Functions (Node.js)
- **Deployment**: Netlify / Azure Static Web Apps

## 📦 Project Structure

```
├── netlify-app/          # Frontend applicatie (Astro + React)
│   ├── src/
│   │   ├── components/   # React componenten
│   │   ├── pages/        # Astro pagina's
│   │   ├── lib/          # Utilities en API client
│   │   └── styles/       # Global styles
│   └── .env              # Environment variabelen
├── azure-functions-api/  # Backend API (Azure Functions)
│   ├── src/
│   │   ├── cases/        # Cases endpoints
│   │   ├── kennisitems/  # Kennisitems endpoints
│   │   ├── nieuws/       # News endpoints
│   │   └── trends/       # Trends endpoints
│   └── local.settings.json
└── db/                   # Database schema en seed data
    ├── azure-schema.sql
    └── azure-seed.sql
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- Azure SQL Database
- Azure Functions Core Tools

### Installation

1. Clone de repository:
```bash
git clone https://github.com/thijs21vermeer/DashboardBuroStaal.git
cd DashboardBuroStaal
```

2. Installeer dependencies voor frontend:
```bash
cd netlify-app
npm install
```

3. Installeer dependencies voor backend:
```bash
cd ../azure-functions-api
npm install
```

4. Configureer environment variabelen:
```bash
# netlify-app/.env
VITE_API_URL=/api

# azure-functions-api/local.settings.json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_SQL_SERVER": "your-server.database.windows.net",
    "AZURE_SQL_DATABASE": "your-database",
    "AZURE_SQL_USERNAME": "your-username",
    "AZURE_SQL_PASSWORD": "your-password"
  }
}
```

5. Setup database:
```bash
# Run schema.sql en seed.sql in Azure SQL
```

### Development

Start de frontend:
```bash
cd netlify-app
npm run dev
```

Start de backend:
```bash
cd azure-functions-api
npm start
```

## 🎨 Design System

- **Primaire kleur**: Zwart
- **Secundaire kleur**: #280bc4 (blauw)
- **Accent kleur**: #7ef769 (groen)
- **Achtergrond**: Wit
- **Font**: PT Sans (body), System UI (headings)

## 📝 Documentation

- [Azure SQL Setup](./AZURE_SQL_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Quick Start Guide](./QUICKSTART.md)

## 🤝 Contributing

Dit is een intern project voor Buro Staal.

## 📄 License

Proprietary - Buro Staal

## 👥 Team

- **Rosanne** - Eigenaar & Strategisch/Marketing
- **Annemieke** - Eigenaar & Financieel Beheer
- **Kevin** - Design Lead
- **Rick** - Lead Developer
- **Coen** - Support & Tech

---

Made with 💚 by Buro Staal
