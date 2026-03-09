# Afbeeldingen Uploaden in de Kennisbank

## Overzicht

De kennisbank ondersteunt nu het uploaden van afbeeldingen bij kennisitems. Deze afbeeldingen worden alleen weergegeven op de detailpagina van het betreffende item, niet in de overzichtslijst.

## Implementatie Details

### Database Schema

Er is een nieuwe kolom toegevoegd aan de `kennisitems` tabel:

```sql
ALTER TABLE kennisitems
ADD afbeelding NVARCHAR(MAX);
```

Deze kolom slaat afbeeldingen op als base64-encoded strings, wat betekent dat:
- Geen externe bestandsopslag nodig is
- Afbeeldingen direct in de database worden opgeslagen
- Eenvoudig te implementeren en te onderhouden

### Migratie Uitvoeren

Om de database bij te werken met de nieuwe kolom:

```bash
npx tsx add-afbeelding-to-kennisitems.ts
```

Dit script:
1. Controleert of de kolom al bestaat
2. Voegt de `afbeelding` kolom toe als deze nog niet bestaat
3. Maakt een index aan voor betere performance
4. Verifieert dat de migratie succesvol was

### Hoe te Gebruiken

#### In het Admin Panel:

1. Ga naar het Admin Panel (`/admin`)
2. Open de Kennisitems Manager
3. Klik op "Nieuw Kennisitem" of bewerk een bestaand item
4. Scroll naar het veld "Afbeelding (optioneel)"
5. Klik op "Choose File" en selecteer een afbeelding
6. De afbeelding wordt direct getoond als preview
7. Sla het item op

**Ondersteunde formaten:**
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

**Aanbevelingen:**
- Maximale bestandsgrootte: ~2MB voor optimale performance
- Aanbevolen breedte: 1200px - 1600px
- Aspect ratio: 16:9 of 4:3 voor beste resultaten

#### Afbeelding Verwijderen:

Als je een afbeelding hebt geüpload en deze wilt verwijderen:
1. Open het item in de editor
2. Klik op "Verwijder afbeelding" onder de preview
3. Sla het item op

### Waar Worden Afbeeldingen Getoond?

**Overzichtspagina (`/kennisbank`):**
- ❌ Afbeeldingen worden NIET getoond in de kaartjes
- ✅ Alleen titel, samenvatting, type en tags zijn zichtbaar

**Detailpagina:**
- ✅ Afbeeldingen worden WEL getoond
- Weergegeven tussen de video player (indien aanwezig) en de hoofdinhoud
- Full-width weergave met afgeronde hoeken
- Responsief: past zich aan aan schermgrootte

### Technische Details

#### API Endpoints

**GET /api/kennisitems**
- Retourneert alle kennisitems inclusief `afbeelding` veld

**GET /api/kennisitems/[id]**
- Retourneert specifiek kennisitem inclusief `afbeelding` veld

**POST /api/kennisitems**
- Accepteert `afbeelding` veld (base64 string)
- Slaat afbeelding op in database

**PUT /api/kennisitems/[id]**
- Accepteert `afbeelding` veld (base64 string)
- Update afbeelding in database

#### TypeScript Types

```typescript
export interface KennisItem {
  id: number;
  titel: string;
  type: string;
  tags: string;
  gekoppeldProject?: string;
  eigenaar: string;
  samenvatting: string;
  inhoud: string;
  datum_toegevoegd: string;
  laatst_bijgewerkt: string;
  video_link?: string;
  afbeelding?: string;  // ✨ Nieuw veld
}
```

#### Base64 Conversie

Afbeeldingen worden automatisch geconverteerd naar base64 bij upload:

```typescript
const reader = new FileReader();
reader.onloadend = () => {
  setFormData({ ...formData, afbeelding: reader.result as string });
};
reader.readAsDataURL(file);
```

Format: `data:image/[type];base64,[encoded_data]`

### Performance Overwegingen

**Voordelen:**
- Geen externe CDN of bestandsserver nodig
- Eenvoudige backup: alles zit in de database
- Geen broken image links

**Nadelen:**
- Database grootte neemt toe met afbeeldingen
- Grotere response sizes voor API calls
- Niet ideaal voor zeer grote afbeeldingen (>5MB)

**Aanbevelingen:**
- Comprimeer afbeeldingen voor upload
- Gebruik moderne formaten zoals WebP voor kleinere bestandsgroottes
- Overweeg lazy loading voor lijsten met veel items

### Toekomstige Verbeteringen

Mogelijke verbeteringen voor de toekomst:
- [ ] Automatische afbeelding compressie bij upload
- [ ] Multiple afbeeldingen per kennisitem (gallery)
- [ ] Externe URL ondersteuning (naast base64)
- [ ] Image cropping tool in de admin interface
- [ ] Thumbnail generatie voor overzichtspagina
- [ ] CDN integratie voor betere performance

### Troubleshooting

**Afbeelding wordt niet geüpload:**
- Controleer of het bestand kleiner is dan 5MB
- Verifieer dat het een geldig afbeeldingsformaat is
- Check de browser console voor errors

**Afbeelding wordt niet getoond:**
- Verifieer dat de migratie is uitgevoerd
- Check of de database het `afbeelding` veld bevat
- Controleer of de base64 string valide is

**Performance problemen:**
- Reduceer afbeelding grootte voor upload
- Overweeg om oude, ongebruikte afbeeldingen te verwijderen
- Monitor database grootte

### Support

Voor vragen of problemen, neem contact op met het development team of maak een issue aan in de repository.
