# Azure SQL Database Setup voor Buro Staal Kennisbank

## 📋 Overzicht

Deze kennisbank is nu geconfigureerd om **Azure SQL Database** te gebruiken. Volg deze stappen om het op te zetten.

---

## 🚀 Stap 1: Azure SQL Database Aanmaken

### In Azure Portal:

1. **Log in op** [Azure Portal](https://portal.azure.com)

2. **Maak een SQL Database aan:**
   - Klik op "Create a resource"
   - Zoek naar "SQL Database"
   - Klik "Create"

3. **Configuratie:**
   - **Resource Group:** Maak nieuwe of kies bestaande
   - **Database naam:** `burostaal-kennisbank` (of eigen naam)
   - **Server:** Maak nieuwe server aan:
     - **Server naam:** `burostaal-server` (moet uniek zijn)
     - **Admin login:** Kies een username
     - **Password:** Kies een sterk wachtwoord (sla dit veilig op!)
     - **Location:** West Europe (of dichtsbij)
   - **Compute + Storage:**
     - Kies **Serverless** (goedkoopste optie)
     - Of kies **Basic** tier (~€4/maand)
   - Klik "Review + Create"

4. **Firewall regel toevoegen:**
   - Ga naar je SQL Server (niet database)
   - Ga naar "Networking"
   - Voeg "Client IP" toe (jouw huidige IP)
   - ✅ Schakel "Allow Azure services" IN
   - Sla op

---

## 🔧 Stap 2: Database Schema Aanmaken

### Optie A: Via Azure Portal

1. Ga naar je database in Azure Portal
2. Klik op "Query editor"
3. Log in met je admin credentials
4. Open het bestand `db/azure-schema.sql`
5. Kopieer de hele inhoud
6. Plak in de Query editor
7. Klik "Run"

### Optie B: Via Azure Data Studio (aanbevolen)

1. Download [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download)
2. Maak nieuwe connectie:
   - Server: `jouw-server.database.windows.net`
   - Authentication: SQL Login
   - Username & Password: van stap 1
   - Database: `burostaal-kennisbank`
3. Open `db/azure-schema.sql`
4. Execute het script

---

## 📊 Stap 3: Test Data Toevoegen (Optioneel)

Om de kennisbank te testen met voorbeelddata:

1. Open `db/azure-seed.sql` in Query editor of Azure Data Studio
2. Execute het script
3. Je hebt nu:
   - 5 kennisitems
   - 3 cases
   - 4 trends
   - 10 nieuwsberichten

---

## 🔐 Stap 4: Connection String Configureren

### Connection String Vinden:

1. Ga naar je database in Azure Portal
2. Klik op "Connection strings"
3. Kopieer de **ADO.NET** connection string

### .env File Aanmaken:

1. Maak een `.env` file in de root van je project
2. Vul in:

```env
AZURE_SQL_SERVER=jouw-server.database.windows.net
AZURE_SQL_DATABASE=burostaal-kennisbank
AZURE_SQL_USER=jouw-username
AZURE_SQL_PASSWORD=jouw-password
AZURE_SQL_PORT=1433
```

**Of gebruik de complete connection string:**

```env
AZURE_SQL_CONNECTION_STRING=Server=jouw-server.database.windows.net,1433;Database=burostaal-kennisbank;User Id=jouw-user;Password=jouw-password;Encrypt=true;
```

⚠️ **BELANGRIJK:** Voeg `.env` toe aan `.gitignore` (dit is al gedaan)

---

## 🧪 Stap 5: Testen

Start je development server:

```bash
npm run dev
```

Test de API endpoints:

```bash
# Test kennisitems
curl http://localhost:3000/api/kennisitems

# Test cases
curl http://localhost:3000/api/cases

# Test trends
curl http://localhost:3000/api/trends

# Test nieuws
curl http://localhost:3000/api/nieuws
```

Open je browser en ga naar:
- Dashboard: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

---

## 💰 Kosten

### Serverless (aanbevolen voor development):
- **€0** wanneer niet gebruikt
- **~€4-8/maand** bij gemiddeld gebruik
- Automatisch pauzeren na inactiviteit

### Basic Tier:
- **~€4,20/maand** (vast)
- 2GB storage
- Altijd actief

### Free Trial:
- Nieuwe Azure accounts krijgen **€170 gratis credit** voor 30 dagen

---

## 🚀 Deployment naar Cloudflare

Voor productie moet je de connection string toevoegen aan Cloudflare:

```bash
# Voeg secrets toe via Wrangler
npx wrangler secret put AZURE_SQL_SERVER
npx wrangler secret put AZURE_SQL_DATABASE
npx wrangler secret put AZURE_SQL_USER
npx wrangler secret put AZURE_SQL_PASSWORD
```

Of configureer het in de Cloudflare Dashboard onder "Workers & Pages" > "Settings" > "Environment Variables".

---

## 🔍 Troubleshooting

### "Cannot connect to database"
- ✅ Check of je IP adres is toegevoegd aan Firewall rules
- ✅ Check of "Allow Azure services" aan staat
- ✅ Verifieer username/password

### "Login failed for user"
- ✅ Check credentials in .env
- ✅ Zorg dat je de database naam correct hebt ingevuld

### "Network related error"
- ✅ Check of de server naam correct is (`jouw-server.database.windows.net`)
- ✅ Check of port 1433 open is (meestal wel)

---

## 📚 Database Structuur

### Tabellen:
- `kennisitems` - Kennis artikelen, video's, PDF's
- `cases` - Client case studies
- `trends` - Industrie trends en insights
- `nieuws` - Interne bedrijfsnieuws

Alle tabellen hebben:
- Auto-increment ID
- Timestamps (datum_toegevoegd, laatst_bijgewerkt)
- JSON fields voor arrays (tags, resultaten, etc.)
- Featured flag voor highlighted content

---

## 🎉 Klaar!

Je kennisbank draait nu op Azure SQL! 💙

Bij vragen of problemen, check de [Azure SQL documentation](https://docs.microsoft.com/en-us/azure/azure-sql/).
