# Kennisitems Fix - Categorie Kolom

## Probleem
De kennisbank pagina laat zien dat er 0 items zijn, terwijl de items wel worden geladen. Dit komt doordat:

1. De `id` werd geretourneerd als String in plaats van number
2. De `categorie` kolom ontbrak in de database
3. Tags werden niet veilig geparsed als array

## Oplossing

### 1. Database Migratie (MOET UITGEVOERD WORDEN)
Voer het volgende SQL commando uit in je Azure SQL database:

```sql
-- Voeg categorie kolom toe als deze nog niet bestaat
IF NOT EXISTS (
  SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'KennisItems' AND COLUMN_NAME = 'categorie'
)
BEGIN
  ALTER TABLE KennisItems
  ADD categorie NVARCHAR(100) NULL;
END

-- Update bestaande records
UPDATE KennisItems
SET categorie = type
WHERE categorie IS NULL;
```

**OF** gebruik het migratie script:
```bash
npx tsx add-categorie-to-kennisitems.ts
```

### 2. Code Fixes (AL TOEGEPAST)

✅ **Type definitie aangepast** (`src/types/index.ts`):
- `id` is nu `number` in plaats van string
- `categorie` toegevoegd als verplicht veld
- `auteur`, `views`, `featured` toegevoegd

✅ **API endpoints gefixed** (`src/pages/api/kennisitems/`):
- `id` wordt nu als number geretourneerd
- `categorie` wordt nu correct gemapped
- Tags worden veilig geparsed (met fallback naar lege array)
- POST endpoint bevat nu `categorie` in INSERT
- PUT endpoint bevat nu `categorie` in UPDATE

### 3. Test na Deployment

Na deployment, test de kennisbank pagina:
1. Ga naar de kennisbank pagina
2. Controleer of de item teller correct is (niet 0)
3. Controleer of items correct gefilterd kunnen worden op categorie
4. Test het toevoegen van een nieuw kennisitem met categorie

## Waarom Dit Werkt

De frontend filtert items op `item.categorie`, maar dit veld bestond niet in de database. Door:
1. De kolom toe te voegen aan de database
2. De API te updaten om deze kolom te retourneren
3. Safe parsing toe te passen voor arrays

Zal de frontend nu correct werken en de juiste aantallen tonen.

## Deployment Checklist

- [ ] SQL migratie uitgevoerd in Azure SQL database
- [ ] Code gecommit en gepusht naar GitHub
- [ ] Netlify deployment succesvol
- [ ] Kennisbank pagina test - item teller werkt
- [ ] Filter op categorie test - werkt correct
- [ ] Nieuw item toevoegen test - categorie wordt opgeslagen
