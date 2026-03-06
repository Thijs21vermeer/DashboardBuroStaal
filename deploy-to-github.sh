
#!/bin/bash

# Deploy Buro Staal Dashboard to GitHub
# This script will create a repository and push all code

set -e  # Exit on error

echo "🚀 Starting GitHub deployment..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded environment variables"
else
    echo "❌ Error: .env not found"
    exit 1
fi

# Check if required variables are set
if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" = "your_github_personal_access_token_here" ]; then
    echo "❌ Error: GITHUB_TOKEN not set in .env"
    exit 1
fi

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GITHUB_USERNAME not set in .env"
    exit 1
fi

REPO_NAME="DashboardBuroStaal"
echo "📦 Repository name: $REPO_NAME"

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "🔧 Initializing git repository..."
    git init
    git config user.name "$GITHUB_USERNAME"
    git config user.email "$GITHUB_USERNAME@users.noreply.github.com"
else
    echo "✅ Git already initialized"
fi

# Create .gitignore if it doesn't exist or update it
echo "📝 Creating/updating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/
.output/
.astro/

# Environment variables
.env
.env.local
.env.*.local
netlify-app/.env
azure-functions-api/.env

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Wrangler
.wrangler/
.mf/

# Azure
local.settings.json

# Misc
*.tsbuildinfo
.cache/
EOF

# Create README.md
echo "📄 Creating README.md..."
cat > README.md << 'EOF'
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
EOF

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit
echo "💾 Creating commit..."
git commit -m "Initial commit: Buro Staal Dashboard - Kennisbank & Media Bank

- Complete Astro + React frontend
- Azure Functions backend API
- Azure SQL database integration
- Admin panel with CRUD operations
- Kennisbank, Cases, Trends, News pages
- Team overview with external partners
- Modern design with Tailwind CSS + shadcn/ui" || echo "No changes to commit"

# Create GitHub repository using API
echo "🌐 Creating GitHub repository..."
curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
     -H "Content-Type: application/json" \
     -d "{\"name\":\"$REPO_NAME\",\"description\":\"Kennisbank & Media Bank voor Buro Staal - Moderne dashboard applicatie voor het beheren van kennis, cases, trends en nieuws\",\"private\":false,\"auto_init\":false}" \
     https://api.github.com/user/repos

echo ""
echo "⏳ Waiting for repository to be created..."
sleep 3

# Add remote
echo "🔗 Adding remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Renaming branch to main..."
    git branch -M main
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ SUCCESS! Dashboard deployed to GitHub!"
echo ""
echo "🔗 Repository URL: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "🌐 View online: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "📋 Next steps:"
echo "1. Visit your repository: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "2. Setup Azure SQL database (zie AZURE_SQL_SETUP.md)"
echo "3. Deploy backend naar Azure Functions"
echo "4. Deploy frontend naar Netlify of Azure Static Web Apps"
echo ""
echo "🎉 Happy coding!"

