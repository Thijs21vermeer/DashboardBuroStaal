# Cloudflare D1 Database - Deployment Instructies

## ✅ Wat is al gedaan:

De volledige code is voorbereid voor Cloudflare D1:

1. **Database schema** (`migrations/0001_initial_schema.sql`)
   - Tabellen voor kennisitems, cases, trends en nieuws
   - Indexes voor snelle queries

2. **Seed data** (`migrations/0002_seed_data.sql`)
   - Testdata voor alle tabellen
   - 5 kennisitems, 3 cases, 5 trends, 5 nieuwsberichten

3. **Database helper** (`src/lib/db.ts`)
   - Alle CRUD operaties
   - TypeScript types
   - Optimized queries

4. **API endpoints** (allemaal bijgewerkt)
   - `/api/kennisitems` - GET, POST
   - `/api/kennisitems/[id]` - GET, PUT, DELETE
   - `/api/cases` - GET, POST
   - `/api/cases/[id]` - GET, PUT, DELETE
   - `/api/trends` - GET, POST
   - `/api/trends/[id]` - GET, PUT, DELETE
   - `/api/nieuws` - GET, POST
   - `/api/nieuws/[id]` - GET, PUT, DELETE

5. **Wrangler configuratie** (`wrangler.jsonc`)
   - D1 database binding geconfigureerd

## 🚀 Deployment stappen:

### Stap 1: Deploy de app in Webflow
Gewoon op "Deploy" klikken in de Webflow interface.

### Stap 2: Automatische setup
Webflow detecteert automatisch dat je een D1 database nodig hebt en:
- ✅ Creëert de database
- ✅ Voert migrations uit (schema + seed data)
- ✅ Koppelt de database aan je app

### Stap 3: Test de app
Na deployment:
1. Ga naar je gedeployde URL
2. Navigeer naar `/admin`
3. Je ziet direct alle testdata!
4. Voeg nieuwe artikelen toe - ze blijven bewaard!

## 💰 Kosten:

**100% GRATIS** binnen deze limieten:
- ✅ 5GB opslag
- ✅ 5 miljoen reads per dag
- ✅ 100.000 writes per dag

Voor een kennisbank is dit meer dan voldoende!

## 🎯 Admin functies:

Na deployment kun je via `/admin`:

### Kennisitems beheren
- Toevoegen: titel, categorie, type, tags, auteur, content
- Bewerken: alle velden aanpasbaar
- Verwijderen: met bevestiging
- Featured items instellen

### Cases beheren
- Klantprojecten toevoegen
- Uitdaging, oplossing en resultaten
- Tags en industrie
- Featured cases

### Trends beheren
- Industrie trends toevoegen
- Impact score instellen (1-10)
- Relevantie bepalen
- Bron vermelden

### Nieuws beheren
- Intern nieuws posten
- Categorieën toewijzen
- Auteur selecteren
- Featured items

## 📊 Database structuur:

```sql
-- Kennisitems
id, titel, categorie, type, tags, auteur, samenvatting, 
inhoud, thumbnail, media_url, datum_gepubliceerd, 
laatst_bijgewerkt, views, featured

-- Cases
id, klantnaam, industrie, titel, uitdaging, oplossing, 
resultaten, tags, thumbnail, datum_gepubliceerd, featured

-- Trends
id, titel, categorie, samenvatting, inhoud, impact_score, 
relevantie, bron, tags, datum_gepubliceerd, featured

-- Nieuws
id, titel, categorie, inhoud, auteur, datum_gepubliceerd, featured
```

## 🔧 Troubleshooting:

### Database niet gevonden
Als je een foutmelding krijgt over database:
1. Check of de deployment succesvol was
2. Kijk in Webflow logs voor errors
3. Herstart de deployment

### Geen data zichtbaar
1. Check of migrations zijn uitgevoerd (in deployment logs)
2. Probeer een item handmatig toe te voegen via Admin
3. Check browser console voor errors

### API errors
1. Open browser DevTools
2. Check Network tab voor API calls
3. Kijk naar response errors
4. Check deployment logs in Webflow

## ✨ Volgende stappen na deployment:

1. **Test alle functionaliteit**
   - Voeg een kennisitem toe
   - Bewerk een case
   - Verwijder een trend
   - Check of alles blijft staan na refresh

2. **Vul eigen content in**
   - Vervang testdata met echte content
   - Upload eigen cases
   - Voeg actuele trends toe

3. **Pas styling aan** (optioneel)
   - Admin panel kleuren
   - Dashboard layout
   - Mobile responsiveness

## 📝 Notes:

- Database is **persistent** - data blijft bestaan tussen deployments
- Backups worden automatisch gemaakt door Cloudflare
- Geen rate limiting problemen binnen gratis tier
- Production-ready setup, geen extra configuratie nodig

## 🎉 Klaar!

Je kunt nu:
- ✅ Deployen zonder extra configuratie
- ✅ Content toevoegen via Admin panel
- ✅ Dashboard gebruiken met echte data
- ✅ Schalen zonder kosten zorgen

Veel succes met de deployment! 🚀
