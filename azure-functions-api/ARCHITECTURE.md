# 🏗️ Architectuur Overzicht

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Buro Staal Kennisbank                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Astro Web App  │         │  Azure Functions │
│   (Cloudflare)   │◄───────►│      API         │
│                  │         │                  │
│  - Dashboard UI  │         │  - HTTP Triggers │
│  - Admin Panel   │         │  - REST Routes   │
│  - Client Logic  │         │  - Business Logic│
└────────┬─────────┘         └────────┬─────────┘
         │                            │
         │ Option A: Direct DB        │ Option B: Via API
         │ (Development)              │ (Production)
         │                            │
         └────────────────┬───────────┘
                          │
                          ▼
                ┌─────────────────┐
                │   Azure SQL     │
                │   Database      │
                │                 │
                │ - KennisItems   │
                │ - Cases         │
                │ - Trends        │
                │ - Nieuws        │
                └─────────────────┘
```

## Deployment Opties

### Optie 1: Directe Database Verbinding (Huidige Setup)

**Voordelen:**
- ✅ Sneller (geen extra network hop)
- ✅ Simpeler setup
- ✅ Minder moving parts
- ✅ Geen extra Azure kosten

**Nadelen:**
- ❌ Database credentials in Cloudflare Workers
- ❌ Minder flexibel voor toekomstige clients
- ❌ Alle business logic in Astro app

**Gebruik dit voor:**
- Development
- MVP / Proof of Concept
- Small teams

### Optie 2: Via Azure Functions (Productie Ready)

**Voordelen:**
- ✅ Database credentials alleen in Azure
- ✅ Centralized business logic
- ✅ Schaalbaar voor meerdere clients
- ✅ Betere security boundaries
- ✅ Makkelijker te monitoren
- ✅ Rate limiting mogelijk
- ✅ Caching layer toe te voegen

**Nadelen:**
- ❌ Extra latency (~50-200ms)
- ❌ Complexere setup
- ❌ Extra resources te beheren

**Gebruik dit voor:**
- Production deployment
- Multiple frontends (web, mobile, etc.)
- Enterprise scenarios

## Data Flow

### GET Request Flow

```
User Browser
    │
    │ 1. GET /kennisbank
    ▼
Astro SSR
    │
    │ 2. Check AZURE_FUNCTIONS_URL
    ▼
┌─────────────────┐
│ Is URL set?     │
└────┬───────┬────┘
     │       │
  YES│       │NO
     │       │
     ▼       ▼
Azure      Direct
Functions  Database
API        Query
     │       │
     └───┬───┘
         │
         ▼
    JSON Response
         │
         ▼
    Render UI
```

### POST Request Flow (Admin Panel)

```
Admin UI
    │
    │ 1. Submit form
    ▼
React Component
    │
    │ 2. api-client.ts
    ▼
┌─────────────────┐
│ AZURE_FUNCTIONS │
│ _URL set?       │
└────┬───────┬────┘
     │       │
  YES│       │NO
     │       │
     ▼       ▼
POST to     POST to
Azure       /api/kennisitems
Functions   (Astro route)
     │       │
     └───┬───┘
         │
         ▼
    SQL INSERT
         │
         ▼
    Return new item
         │
         ▼
    Update UI
```

## File Structure

```
/
├── azure-functions-api/          # 🆕 Azure Functions Project
│   ├── src/
│   │   ├── lib/
│   │   │   └── db.ts            # Database connection pool
│   │   ├── kennisitems/
│   │   │   ├── function.json    # HTTP trigger config
│   │   │   └── index.ts         # Handler logic
│   │   ├── cases/
│   │   │   ├── function.json
│   │   │   └── index.ts
│   │   ├── trends/
│   │   │   ├── function.json
│   │   │   └── index.ts
│   │   └── nieuws/
│   │       ├── function.json
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── host.json               # Functions runtime config
│   └── local.settings.json     # Local environment vars
│
├── src/
│   ├── lib/
│   │   ├── api-client.ts       # 🆕 Smart API client
│   │   └── azure-db.ts         # Direct DB access (fallback)
│   ├── pages/
│   │   └── api/                # Astro API routes (fallback)
│   │       ├── kennisitems/
│   │       ├── cases/
│   │       ├── trends/
│   │       └── nieuws/
│   └── components/
│       └── admin/              # Admin UI components
│
└── .env                        # Environment variables
```

## Environment Variables

### Development (Direct DB)
```env
AZURE_FUNCTIONS_URL=              # Leeg laten
AZURE_SQL_SERVER=xxx
AZURE_SQL_DATABASE=xxx
AZURE_SQL_USER=xxx
AZURE_SQL_PASSWORD=xxx
```

### Development (Local Azure Functions)
```env
AZURE_FUNCTIONS_URL=http://localhost:7071/api
# DB credentials niet nodig in Astro app
```

### Production (Azure Functions)
```env
AZURE_FUNCTIONS_URL=https://buro-staal-api.azurewebsites.net/api
# DB credentials niet nodig in Astro app
```

## Security Layers

### Layer 1: Network
- Azure SQL Firewall
- HTTPS only
- CORS restrictions

### Layer 2: Authentication
- Optional: Function keys
- Optional: Azure AD
- Optional: API Management

### Layer 3: Authorization
- SQL user permissions
- Row-level security (mogelijk)
- Input validation

### Layer 4: Data
- Encrypted at rest
- Encrypted in transit
- Parameterized queries (SQL injection safe)

## Monitoring & Logging

### Azure Functions
- Application Insights (automatisch)
- Function execution logs
- Performance metrics
- Error tracking

### Astro App (Cloudflare)
- Cloudflare Analytics
- Workers logs
- Custom logging (Sentry, etc.)

### Database
- Azure SQL Insights
- Query performance
- Connection pool stats

## Cost Estimation

### Azure Functions (Consumption Plan)
- **Free tier:** 1M requests/month
- **Beyond free:** $0.20 per million executions
- **Estimated:** €0-5/maand voor small team

### Azure SQL
- **Basic tier:** ~€4.50/maand
- **Standard S0:** ~€13/maand
- **Estimated:** €5-15/maand

### Cloudflare Workers (Astro)
- **Free tier:** 100k requests/day
- **Paid:** $5/maand unlimited
- **Estimated:** €0-5/maand

**Total:** ~€10-25/maand voor complete setup

## Scalability

### Current Setup
- Handles: ~1,000 daily active users
- Response time: <500ms
- Database: 100 DTUs (5 GB)

### Future Growth
- **+10x users:** Geen code changes nodig
- **+100x users:** Add Redis caching
- **+1000x users:** Add CDN, read replicas

## Migration Path

### Phase 1: MVP (Current)
Direct database verbinding voor snelle development

### Phase 2: Production Ready
Migreer naar Azure Functions voor betere security

### Phase 3: Enterprise
- Add API Management
- Add Redis cache
- Add monitoring stack
- Add CI/CD pipeline

## Recommendations

### Voor Buro Staal (klein team)

**Start met:** Directe database verbinding
- Sneller te ontwikkelen
- Minder complexity
- Voldoende voor eerste versie

**Upgrade naar:** Azure Functions wanneer:
- Je multiple clients hebt (web + mobile)
- Je externe developers toegang geeft
- Je rate limiting nodig hebt
- Je advanced caching wilt

**Timeline:** 
- Maand 1-3: Direct DB
- Maand 4+: Evalueer Azure Functions
- Maand 6+: Mogelijk migratie

De code is al voorbereid voor beide opties! 🎉
