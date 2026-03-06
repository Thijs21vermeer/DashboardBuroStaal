# Admin Panel - Gebruikershandleiding

## 🎯 Overzicht

Het Admin Panel is het centrale beheersysteem voor de Buro Staal Kennisbank. Hier kun je alle content beheren die op het dashboard wordt getoond.

## 🔐 Toegang

- **URL**: `/admin`
- **Wachtwoord**: `BurostaalDB`
- **Toegang vanaf dashboard**: Klik op de "Admin Panel" knop linksonder in het navigatiemenu

## 📚 Functionaliteit

### Kennisitems Beheren

In dit tabblad kun je alle kennisitems (artikelen, video's, documenten, checklists, templates) beheren:

- ✅ **Toevoegen**: Klik op "Nieuw Kennisitem" om een nieuw item toe te voegen
- ✏️ **Bewerken**: Klik op het potlood-icoon om een item te bewerken
- 🗑️ **Verwijderen**: Klik op het prullenbak-icoon om een item te verwijderen
- 🔍 **Zoeken**: Gebruik de zoekbalk om items te vinden
- 🔄 **Verversen**: Klik op het ververs-icoon om de lijst te herladen

**Velden**:
- Titel (verplicht)
- Type (Artikel, Video, Document, Checklist, Template)
- Eigenaar (verplicht)
- Tags (gescheiden door komma's)
- Gekoppeld Project (optioneel)
- Samenvatting (verplicht)
- Inhoud (verplicht)

### Cases Beheren

Beheer je case studies en succesverhalen:

- Alle CRUD operaties (Create, Read, Update, Delete)
- Zoek- en filterfunctionaliteit
- Real-time synchronisatie met de database

**Velden**:
- Titel
- Klant
- Fase (Discovery, Design, Ontwikkeling, Lancering, Onderhoud)
- Duur (in weken)
- Team (gescheiden door komma's)
- Uitdaging
- Oplossing
- Resultaten (één per regel)
- Tags

### Trends Beheren

Beheer trends en insights uit de maakindustrie:

- Volledige CRUD functionaliteit
- Relevantiescore beheer
- Bronnen tracking

**Velden**:
- Titel
- Categorie (Technologie, Marketing, Productie, Duurzaamheid, AI, Automatisering)
- Samenvatting
- Beschrijving
- Relevantie (0-100)
- Bronnen (één per regel)
- Tags

### Nieuws Beheren

Beheer intern nieuws en bedrijfsupdates:

- Nieuws items toevoegen en bewerken
- Categorie-indeling
- Belangrijk-markering voor prioritaire berichten

**Velden**:
- Titel
- Categorie (Project, Team, Klant, Technologie, Bedrijf)
- Auteur
- Datum
- Inhoud
- Belangrijk (checkbox)

## 💾 Database Verbinding

### Status Indicator

Bovenaan elk tabblad zie je een status banner die aangeeft:

- ✅ **Groen (Verbonden)**: Verbinding met Azure SQL database actief - alle wijzigingen worden opgeslagen
- 🟡 **Geel (Mock Data)**: Gebruikt tijdelijke data - wijzigingen worden NIET opgeslagen
- 🔴 **Rood (Fout)**: Verbindingsprobleem - controleer de database configuratie

### Opslaan van Wijzigingen

Wanneer je verbonden bent met de database:

1. ✅ Alle wijzigingen worden **direct opgeslagen** in de Azure SQL database
2. ✅ Wijzigingen zijn **meteen zichtbaar** op het dashboard
3. ✅ Data blijft **persistent** na herladen van de pagina
4. ✅ Je krijgt een **bevestigingsmelding** bij succesvolle acties

### Verificatie van Opgeslagen Data

Na het opslaan van een item:

1. Klik op het ververs-icoon (🔄) om de lijst te herladen
2. Ga terug naar het dashboard en ververs de pagina
3. Je wijzigingen zijn direct zichtbaar

## 🔄 Synchronisatie

Het admin panel en dashboard zijn volledig gesynchroniseerd:

- Wijzigingen in het admin panel zijn direct zichtbaar op het dashboard (na verversen)
- De Overview pagina haalt automatisch de nieuwste data op
- Statistieken worden automatisch bijgewerkt op basis van de database

## 🚀 API Endpoints

Het admin panel gebruikt de volgende API endpoints:

### Kennisitems
- `GET /api/kennisitems` - Haal alle kennisitems op
- `GET /api/kennisitems/[id]` - Haal één kennisitem op
- `POST /api/kennisitems` - Maak een nieuw kennisitem
- `PUT /api/kennisitems/[id]` - Bijwerken van een kennisitem
- `DELETE /api/kennisitems/[id]` - Verwijder een kennisitem

### Cases
- `GET /api/cases` - Haal alle cases op
- `GET /api/cases/[id]` - Haal één case op
- `POST /api/cases` - Maak een nieuwe case
- `PUT /api/cases/[id]` - Bijwerken van een case
- `DELETE /api/cases/[id]` - Verwijder een case

### Trends
- `GET /api/trends` - Haal alle trends op
- `GET /api/trends/[id]` - Haal één trend op
- `POST /api/trends` - Maak een nieuwe trend
- `PUT /api/trends/[id]` - Bijwerken van een trend
- `DELETE /api/trends/[id]` - Verwijder een trend

### Nieuws
- `GET /api/nieuws` - Haal alle nieuwsitems op
- `GET /api/nieuws/[id]` - Haal één nieuwsitem op
- `POST /api/nieuws` - Maak een nieuw nieuwsitem
- `PUT /api/nieuws/[id]` - Bijwerken van een nieuwsitem
- `DELETE /api/nieuws/[id]` - Verwijder een nieuwsitem

## 🛠️ Troubleshooting

### Wijzigingen worden niet opgeslagen

1. Controleer de status banner bovenaan - moet groen zijn
2. Controleer of je de juiste Azure SQL credentials hebt in `.env`
3. Test de database verbinding via `/api/health`
4. Kijk in de browser console voor error messages

### Mock data wordt gebruikt

Als je mock data ziet in plaats van echte database data:

1. Controleer je `.env` bestand voor de Azure SQL credentials
2. Test de verbinding: `curl http://localhost:3000/api/health`
3. Herstart de development server
4. Check de database firewall instellingen in Azure

### Success meldingen

Bij elke succesvolle actie verschijnt er een alert melding:
- ✅ "Item succesvol toegevoegd!"
- ✅ "Item succesvol bijgewerkt!"
- Bij fouten zie je een duidelijke foutmelding

## 📊 Database Schema

Alle data wordt opgeslagen in Azure SQL Server met de volgende tabellen:

- `KennisItems` - Kennisbank artikelen en documenten
- `Cases` - Case studies en projecten
- `Trends` - Trends en insights
- `Nieuws` - Intern nieuws items

Voor meer details over het database schema, zie `db/azure-schema.sql`.

## 🎨 Navigatie

- **Terug naar Dashboard**: Klik op de groene knop linksonder
- **Tussen tabbladen schakelen**: Gebruik de tabs bovenaan het admin panel
- **Refresh data**: Gebruik de refresh knop (🔄) in elk tabblad

## 📝 Tips

1. **Tags**: Gebruik consistente tags voor betere zoekbaarheid
2. **Samenvattingen**: Houd samenvattingen kort en krachtig (max 2-3 zinnen)
3. **Eigenaar**: Gebruik volledige namen voor duidelijkheid
4. **Dates**: Worden automatisch gegenereerd en bijgewerkt
5. **Backup**: De database wordt automatisch backed-up door Azure

## 🔒 Beveiliging

- Het admin panel is beveiligd met wachtwoord authenticatie
- Gebruik het wachtwoord alleen intern binnen het team
- Alle API calls verlopen over HTTPS in productie
- Database credentials worden veilig opgeslagen in environment variables
