
# Team & Partners Database Setup

## Optie 1: Automatische Migratie (Aanbevolen)

Voer het migratie script uit vanuit je lokale omgeving met toegang tot de database:

```bash
# Zorg dat je .env file correct is ingesteld met Azure SQL credentials
npm run tsx scripts/migrate-team-tables.ts
```

Dit script:
- ✅ Controleert of tabellen al bestaan (voorkomt dubbele aanmaak)
- ✅ Maakt de `team_members` en `externe_partners` tabellen aan
- ✅ Voegt automatisch 5 teamleden en 5 partners toe
- ✅ Toont een overzicht van de database status

## Optie 2: Handmatige SQL Uitvoering

Als je de voorkeur geeft aan handmatige controle:

```bash
# Kopieer de inhoud van db/team-schema.sql en voer deze uit in je Azure SQL database
# via Azure Portal, SQL Server Management Studio, of Azure Data Studio
```

Dit script doet het volgende:
1. Maakt de `team_members` tabel aan
2. Maakt de `externe_partners` tabel aan  
3. Voegt 5 teamleden toe (inclusief Rosanne en Annemieke als eigenaren)
4. Voegt 5 externe partners toe

## Stap 2: Test de API endpoints

Na het uitvoeren van het schema kun je testen of alles werkt:

```bash
# Test team members endpoint
curl http://localhost:3000/api/team

# Test partners endpoint
curl http://localhost:3000/api/partners
```

## Stap 3: Gebruik het Admin Panel

1. Ga naar `/admin` in je browser
2. Klik op de "Team" tab
3. Hier kun je:
   - **Team leden toevoegen/bewerken/verwijderen**
   - **Externe partners toevoegen/bewerken/verwijderen**
   - Volgorde aanpassen
   - Aangeven wie eigenaar is
   - Expertisegebieden beheren

## Stap 4: Bekijk de Team pagina

De Team pagina op `/` (via het menu) toont nu automatisch:
- Alle teamleden uit de database
- Externe partners
- Collectieve expertise
- Stats (aantal leden, expertisegebieden, disciplines)

## Database Structuur

### team_members tabel
- `id` - Primary key
- `naam` - Naam van het teamlid
- `rol` - Functie/rol
- `email` - Email adres
- `bio` - Korte bio
- `expertise_gebieden` - JSON array met expertisegebieden
- `is_eigenaar` - Boolean voor eigenaar status
- `volgorde` - Voor sortering
- `created_at`, `updated_at` - Timestamps

### externe_partners tabel  
- `id` - Primary key
- `naam` - Naam van de partner
- `bedrijf` - Bedrijfsnaam (optioneel)
- `specialisatie` - Hoofdspecialisatie
- `email` - Email adres
- `telefoon` - Telefoonnummer (optioneel)
- `website` - Website (optioneel)
- `beschrijving` - Korte beschrijving
- `expertise_gebieden` - JSON array met expertisegebieden
- `volgorde` - Voor sortering
- `created_at`, `updated_at` - Timestamps

## Wijzigingen

De volgende bestanden zijn toegevoegd/aangepast:

### Nieuw:
- `db/team-schema.sql` - Database schema en seed data
- `src/pages/api/team/index.ts` - API voor team CRUD operaties
- `src/pages/api/team/[id].ts` - API voor individueel teamlid
- `src/pages/api/partners/index.ts` - API voor partners CRUD operaties
- `src/pages/api/partners/[id].ts` - API voor individuele partner
- `src/components/admin/TeamManager.tsx` - Admin interface voor team beheer

### Aangepast:
- `src/types/index.ts` - TeamMember en ExternePartner types toegevoegd
- `src/components/admin/AdminPanel.tsx` - Team tab toegevoegd
- `src/components/kennisbank/TeamPage.tsx` - Nu met database integratie

