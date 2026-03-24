# Netlify Database Setup Instructies

## Probleem
De database connectie faalt op Netlify omdat de environment variabelen niet correct zijn ingesteld.

## Oplossing: Environment Variabelen Instellen in Netlify

### Stap 1: Ga naar Netlify Dashboard
1. Log in op [Netlify](https://app.netlify.com/)
2. Selecteer je site: **DashboardBuroStaal**
3. Ga naar **Site settings** → **Environment variables**

### Stap 2: Voeg de Volgende Variabelen Toe

Klik op **Add a variable** en voeg deze één voor één toe:

#### Database Credentials (Verplicht)
```
AZURE_SQL_SERVER = dashboardbs.database.windows.net
AZURE_SQL_DATABASE = dashboarddb
AZURE_SQL_USER = databasedashboard
AZURE_SQL_PASSWORD = <YOUR_SECURE_PASSWORD>
AZURE_SQL_PORT = 1433
```

#### Auth Secret (Verplicht)
```
JWT_SECRET = [genereer een random string van minimaal 32 characters]
```

Je kunt een JWT secret genereren met:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Slack Webhook (Optioneel)
```
SLACK_WEBHOOK = [jouw slack webhook URL]
```

### Stap 3: Deploy Opnieuw

Na het toevoegen van de environment variabelen:

1. Ga naar **Deploys**
2. Klik op **Trigger deploy** → **Clear cache and deploy site**

### Stap 4: Verificatie

Bezoek deze endpoints om te controleren of alles werkt:

1. **Health Check**: `https://jouw-site.netlify.app/api/health`
   - Moet laten zien: `hasAzureServer: true`, `hasAzurePassword: true`, etc.

2. **Database Test**: `https://jouw-site.netlify.app/api/test-db`
   - Moet laten zien: `connection.status: "connected"`

## Veelvoorkomende Problemen

### "Missing required database environment variables"
❌ **Probleem**: Environment variabelen zijn niet ingesteld in Netlify  
✅ **Oplossing**: Volg Stap 2 hierboven

### "Login failed for user"
❌ **Probleem**: Verkeerde credentials  
✅ **Oplossing**: Controleer username en password in Azure SQL

### "Cannot open server"
❌ **Probleem**: Netlify IP is geblokkeerd door Azure Firewall  
✅ **Oplossing**: Voeg Netlify IPs toe aan Azure SQL firewall rules

#### Azure Firewall Configuratie

1. Ga naar [Azure Portal](https://portal.azure.com/)
2. Navigeer naar je SQL Server: **dashboardbs**
3. Ga naar **Security** → **Networking** (of **Firewalls and virtual networks**)
4. Voeg deze regel toe:
   ```
   Rule name: AllowNetlify
   Start IP: 0.0.0.0
   End IP: 255.255.255.255
   ```
   
   ⚠️ **Let op**: Dit opent de database voor alle IPs. Voor betere beveiliging:
   - Gebruik alleen specifieke Netlify IP ranges
   - Of schakel "Allow Azure services and resources to access this server" in

5. Klik op **Save**

## Testen Lokaal vs Productie

### Lokaal (Development)
Environment variabelen komen uit `.env` file

### Netlify (Production)  
Environment variabelen komen uit Netlify dashboard

### Beide controleren met:
```bash
# Lokaal
npm run dev
# Bezoek: http://localhost:3000/api/test-db

# Productie
# Bezoek: https://jouw-site.netlify.app/api/test-db
```

## Checklist

- [ ] Environment variabelen toegevoegd in Netlify dashboard
- [ ] JWT_SECRET gegenereerd en toegevoegd
- [ ] Site opnieuw gedeployed (clear cache)
- [ ] `/api/health` toont alle credentials als `true`
- [ ] `/api/test-db` toont `connection.status: "connected"`
- [ ] Azure firewall regels geconfigureerd
- [ ] Admin panel laadt zonder "Database Connectie Mislukt"

## Support

Als het nog steeds niet werkt:
1. Check de Netlify function logs: **Functions** tab in dashboard
2. Bekijk de database test output: `/api/test-db`
3. Controleer Azure SQL activity logs in Azure Portal
