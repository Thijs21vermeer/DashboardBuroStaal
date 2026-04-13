
# Buro Staal Dashboard - Kennisbank & Media Bank

Een moderne kennisbank en mediabank applicatie voor Buro Staal, gebouwd met Astro, React, TypeScript en Azure SQL.

## 🚀 Features

- **🔐 Auth0 Authenticatie**: Veilige login met OAuth 2.0 en encrypted sessions
- **Kennisbank**: Doorzoekbare database met kennisitems, tags en filters
- **Case Studies**: Overzicht van succesvolle klantprojecten
- **Trends & Insights**: Actuele ontwikkelingen in de maakindustrie
- **Team & Expertise**: Overzicht van het Buro Staal team en externe partners
- **Intern Nieuws**: Updates en achievements binnen het bedrijf
- **Admin Panel**: Volledige CRUD functionaliteit voor content management

## 🛠️ Tech Stack

- **Frontend**: Astro + React + TypeScript
- **Authentication**: Auth0 (OAuth 2.0)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Azure SQL Database
- **Deployment**: Netlify

## 📦 Project Structure

```
├── src/
│   ├── components/       # React componenten
│   │   ├── auth/        # Auth0 login componenten
│   │   ├── dashboard/   # Dashboard componenten
│   │   └── kennisbank/  # Kennisbank componenten
│   ├── pages/           # Astro pagina's
│   │   └── api/         # API endpoints
│   │       ├── auth0/   # Auth0 OAuth endpoints
│   │       ├── kennisitems/
│   │       ├── cases/
│   │       └── trends/
│   ├── lib/             # Utilities en API client
│   │   ├── auth0-config.ts    # Auth0 configuratie
│   │   └── auth0-session.ts   # Sessie management
│   └── styles/          # Global styles
├── db/                  # Database schema en seed data
└── .env                 # Environment variabelen
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- Azure SQL Database
- Auth0 Account (gratis)

### Quick Start (5 minuten)

**1️⃣ Clone en installeer:**
```bash
git clone https://github.com/thijs21vermeer/DashboardBuroStaal.git
cd DashboardBuroStaal
npm install
```

**2️⃣ Auth0 Setup:**
- Volg **[AUTH0_QUICKSTART.md](./AUTH0_QUICKSTART.md)** (5 minuten)
- Of zie **[AUTH0_SETUP.md](./AUTH0_SETUP.md)** voor uitgebreide setup

**3️⃣ Environment variabelen:**
```bash
# .env
AUTH0_DOMAIN=jouw-tenant.eu.auth0.com
AUTH0_CLIENT_ID=jouw_client_id
AUTH0_CLIENT_SECRET=jouw_client_secret
APP_ORIGIN=http://localhost:3000
COOKIE_SECRET=genereer_random_string
JWT_SECRET=genereer_random_string

# Azure SQL
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=your-database
AZURE_SQL_USER=your-username
AZURE_SQL_PASSWORD=your-password
```

**4️⃣ Start development:**
```bash
npm run dev
```

Ga naar `http://localhost:3000` en log in met Auth0! 🎉

### Installation (uitgebreid)

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

## 🔐 Authenticatie

Deze applicatie gebruikt **Auth0** voor veilige authenticatie:

- ✅ OAuth 2.0 flow met CSRF protection
- ✅ Encrypted session cookies (HttpOnly, Secure)
- ✅ Single Sign-On ondersteuning
- ✅ Multi-Factor Authentication (MFA) optioneel
- ✅ Social logins mogelijk (Google, Microsoft, etc.)

**Setup guides:**
- 🚀 [Quick Start (5 min)](./AUTH0_QUICKSTART.md)
- 📖 [Volledige Setup Guide](./AUTH0_SETUP.md)
- 📋 [Implementatie Details](./AUTH0_IMPLEMENTATION_SUMMARY.md)

## 🎨 Design System

- **Primaire kleur**: Zwart
- **Secundaire kleur**: #280bc4 (blauw)
- **Accent kleur**: #7ef769 (groen)
- **Achtergrond**: Wit
- **Font**: PT Sans (body), System UI (headings)

## 📝 Documentation

- [🚀 Auth0 Quick Start](./AUTH0_QUICKSTART.md) - Start binnen 5 minuten
- [🔐 Auth0 Setup Guide](./AUTH0_SETUP.md) - Uitgebreide configuratie
- [📋 Auth0 Implementatie](./AUTH0_IMPLEMENTATION_SUMMARY.md) - Technische details
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

