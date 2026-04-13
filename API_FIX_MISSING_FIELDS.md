# API Fix: Missing Fields Not Being Saved

## 🐛 Probleem

Items konden worden toegevoegd aan de database, maar nieuwe velden werden niet opgeslagen bij het aanmaken van items.

## 🔍 Oorzaak

De POST endpoints (create) in verschillende APIs sloegen niet alle velden op die in de frontend werden ingevuld. De PUT endpoints (update) waren wel correct geconfigureerd.

## ✅ Oplossing

Alle POST handlers zijn bijgewerkt om alle velden op te slaan.

### KennisItems (`/api/kennisitems/index.ts`)

**Toegevoegd:**
- `eigenaar` - Eigenaar van het kennisitem
- `gekoppeldProject` - Gekoppeld project
- `videoLink` - Link naar video

### Cases (`/api/cases/index.ts`)

**Toegevoegd:**
- `industrie` - Industrie van de case
- `resultaten` - Lijst met resultaten (JSON)

### Trends (`/api/trends/index.ts`)

**Toegevoegd:**
- `bron` - Bron van de trend
- `relevantie` - Relevantie score/beschrijving
- `volledige_inhoud` - Volledige inhoud van de trend

### Nieuws (`/api/nieuws/index.ts`)

**Toegevoegd:**
- `categorie` - Categorie van het nieuwsitem

## 📊 Voor/Na

### Voor
```typescript
const newId = await insert('KennisItems', {
  titel: data.titel,
  beschrijving: data.samenvatting || data.inhoud || '',
  categorie: data.categorie || data.type || 'Algemeen',
  tags: JSON.stringify(data.tags || []),
  mediaType: data.media_type || null,
  afbeelding: data.afbeelding || null,
  referenties: null,
}, locals);
// ❌ eigenaar, gekoppeldProject, videoLink NIET opgeslagen
```

### Na
```typescript
const newId = await insert('KennisItems', {
  titel: data.titel,
  beschrijving: data.samenvatting || data.inhoud || '',
  categorie: data.categorie || data.type || 'Algemeen',
  tags: JSON.stringify(data.tags || []),
  eigenaar: data.eigenaar || null,
  gekoppeldProject: data.gekoppeldProject || null,
  videoLink: data.videoLink || null,
  mediaType: data.media_type || null,
  afbeelding: data.afbeelding || null,
  referenties: null,
}, locals);
// ✅ Alle velden worden nu opgeslagen
```

## 🧪 Testen

Na deployment kun je testen:

1. **KennisItems**: Voeg nieuw item toe met eigenaar, project en video link → Check of velden opgeslagen zijn
2. **Cases**: Voeg nieuwe case toe met industrie en resultaten → Check of velden opgeslagen zijn
3. **Trends**: Voeg nieuwe trend toe met bron, relevantie en volledige inhoud → Check of velden opgeslagen zijn
4. **Nieuws**: Voeg nieuwsitem toe met categorie → Check of veld opgeslagen is

## 🚀 Deployment

```bash
# Build (al getest - werkt!)
npm run build

# Push naar GitHub (triggert auto-deploy)
git add .
git commit -m "Fix: Save all fields in POST endpoints for all content types"
git push origin main
```

## ✨ Impact

- ✅ Alle nieuwe items worden nu volledig opgeslagen
- ✅ Geen data verlies meer bij het aanmaken van items
- ✅ Admin panel werkt nu volledig zoals bedoeld
- ✅ Bestaande update (PUT) functionaliteit blijft ongewijzigd

## 📝 Opmerking

De PUT endpoints waren al correct geconfigureerd. Dit probleem betrof alleen de POST endpoints (nieuwe items aanmaken).
