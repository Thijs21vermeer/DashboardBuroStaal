# 🏗️ Azure Architectuur - Buro Staal Kennisbank

## Overzicht

Deze kennisbank draait volledig op Azure met een moderne, schaalbare architectuur.

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         GEBRUIKER                                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Azure Front Door / CDN (Global)                     │
│  • SSL/TLS Termination                                          │
│  • DDoS Protection                                              │
│  • Static Content Caching                                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│           Azure Static Web Apps (West Europe)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Frontend                                          │  │
│  │  • React 18 + TypeScript                                │  │
│  │  • Vite Build System                                    │  │
│  │  • TailwindCSS                                          │  │
│  │  • Client-side Routing                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Features:                                                       │
│  ✓ Gratis SSL certificaten                                      │
│  ✓ Automatische HTTPS redirect                                  │
│  ✓ Global CDN                                                    │
│  ✓ Preview environments                                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ REST API calls
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│          Azure Functions (Consumption Plan)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Backend API (Node.js 18)                               │  │
│  │  • GET /api/kennisitems                                 │  │
│  │  • GET /api/cases                                       │  │
│  │  • GET /api/trends                                      │  │
│  │  • GET /api/nieuws                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Features:                                                       │
│  ✓ Serverless (pay per execution)                              │
│  ✓ Auto-scaling                                                 │
│  ✓ Managed runtime                                              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ SQL Queries
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Azure SQL Database                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database: BuroStaalKennisbank                          │  │
│  │                                                          │  │
│  │  Tables:                                                │  │
│  │  • kennisitems                                          │  │
│  │  • cases                                                │  │
│  │  • trends                                               │  │
│  │  • nieuws                                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Features:                                                       │
│  ✓ Automated backups                                           │
│  ✓ Point-in-time restore                                       │
│  ✓ Geo-replication (optioneel)                                 │
│  ✓ Built-in security                                           │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ Credentials
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Azure Key Vault                                     │
│  • Database credentials                                         │
│  • API keys                                                     │
│  • Connection strings                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              GitHub (Source Control + CI/CD)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Repository                                             │  │
│  │  • Source code                                          │  │
│  │  • GitHub Actions workflows                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  On Push to Main:                                               │
│  1. Run tests                                                   │
│  2. Build React app                                             │
│  3. Deploy to Azure Static Web Apps                            │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Gebruiker bezoekt website
```
Browser → Azure CDN → Static Web App → React App geladen
```

### 2. Data ophalen
```
React Component → fetch('/api/kennisitems') 
    → Azure Functions → SQL Query 
    → Azure SQL Database → Data terug 
    → JSON Response → UI Update
```

### 3. Deployment Flow
```
Developer push code → GitHub 
    → GitHub Actions triggered 
    → Build React app 
    → Deploy naar Azure Static Web Apps 
    → Live in productie! 🎉
```

## 💰 Kosten Breakdown (Schatting)

### Gratis Tier (Starter)
- **Azure Static Web Apps**: €0/maand (100 GB bandwidth gratis)
- **Azure Functions**: €0/maand (1M executions gratis)
- **Azure SQL Database**: ~€5/maand (Basic tier)
- **Totaal**: ~€5/maand

### Productie (Kleine schaal)
- **Azure Static Web Apps**: €0-10/maand
- **Azure Functions**: €0-20/maand
- **Azure SQL Database**: €15-50/maand (Standard tier)
- **Application Insights**: €0-5/maand
- **Totaal**: ~€30-85/maand

## 🔒 Security Features

### Netwerk Security
- ✅ HTTPS enforced (automatisch SSL)
- ✅ Azure Front Door WAF (optioneel)
- ✅ DDoS Protection (basic gratis)
- ✅ Private endpoints voor database (optioneel)

### Application Security
- ✅ Managed identities
- ✅ Key Vault voor secrets
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuratie
- ✅ Azure AD authenticatie (optioneel)

### Data Security
- ✅ Encrypted at rest (SQL Database)
- ✅ Encrypted in transit (TLS 1.2+)
- ✅ Automated backups (7-35 dagen)
- ✅ Geo-redundant storage (optioneel)

## 📈 Schaalbaarheid

### Azure Static Web Apps
- **Max**: 1000+ concurrent users
- **Scaling**: Automatisch via CDN
- **Latency**: <50ms (global CDN)

### Azure Functions
- **Max**: Onbeperkt (consumption plan)
- **Scaling**: Automatisch bij load
- **Cold start**: ~2-3 seconden (eerste request)

### Azure SQL Database
- **Basic Tier**: 2GB, 5 DTUs
- **Standard Tier**: Tot 1TB, 3000 DTUs
- **Premium Tier**: Tot 4TB, 4000 DTUs
- **Hyperscale**: Tot 100TB

## 🚀 Performance Optimizations

### Frontend
- ✅ Code splitting (Vite)
- ✅ Lazy loading components
- ✅ Asset compression
- ✅ CDN caching
- ✅ Service Worker (optioneel)

### Backend
- ✅ Connection pooling (SQL)
- ✅ Query optimization
- ✅ Response caching
- ✅ Serverless scaling

## 📊 Monitoring & Logging

### Application Insights (Optioneel)
```
Frontend Errors → Application Insights
API Calls → Application Insights
Performance Metrics → Dashboard
```

### Beschikbare Metrics
- Page load times
- API response times
- Error rates
- User flows
- Custom events

## 🔄 Backup & Recovery

### Azure SQL Database
- **Automated backups**: Dagelijks
- **Retention**: 7-35 dagen
- **Point-in-time restore**: Elk moment
- **Geo-replication**: Optioneel

### Recovery Time Objective (RTO)
- Static Web App: <5 minuten
- Azure Functions: <1 minuut
- SQL Database: <30 minuten

## 🌍 Multi-Region Setup (Future)

```
                    ┌─────────────┐
                    │ Azure Front │
                    │    Door     │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │                               │
    ┌──────▼──────┐              ┌────────▼──────┐
    │   West      │              │     East      │
    │   Europe    │              │     US        │
    └─────────────┘              └───────────────┘
```

## 🎯 Best Practices

### Development
1. ✅ Branch protection op `main`
2. ✅ Pull requests verplicht
3. ✅ Automated testing in CI/CD
4. ✅ Environment variables voor configs

### Operations
1. ✅ Monitor met Application Insights
2. ✅ Set up alerts voor errors
3. ✅ Regular security updates
4. ✅ Database backup verification

### Security
1. ✅ Gebruik Key Vault voor secrets
2. ✅ Enable Azure AD authenticatie
3. ✅ Regular security audits
4. ✅ Principle of least privilege

## 📞 Support & Resources

- **Azure Portal**: https://portal.azure.com
- **Azure Status**: https://status.azure.com
- **Documentation**: https://docs.microsoft.com/azure
- **Support**: Azure Support tickets

---

**Laatste update**: Maart 2024  
**Versie**: 1.0  
**Eigenaar**: Buro Staal IT Team
