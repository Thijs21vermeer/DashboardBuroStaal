# Detail Pagina's - Kennisbank Dashboard

## Overzicht

Er zijn nu volledige detail pagina's toegevoegd voor alle content types in de kennisbank. Gebruikers kunnen nu op items klikken om de volledige inhoud te bekijken.

## Nieuwe Componenten

### 1. KennisItemDetail (`src/components/kennisbank/KennisItemDetail.tsx`)
- **Functie**: Toont volledige details van een kennisitem
- **Features**:
  - Volledige inhoud weergave
  - Meta informatie (auteur, datum, views, tags)
  - Gekoppeld project (indien aanwezig)
  - Tags overzicht
  - Terug knop naar overzicht

### 2. CaseDetail (`src/components/kennisbank/CaseDetail.tsx`)
- **Functie**: Toont volledige case study details
- **Features**:
  - Header met sector en fase badges
  - Key metrics (ROI, Project Type, Eigenaar)
  - Twee-kolom layout voor Uitdaging & Oplossing
  - Resultaten sectie met groene accent
  - Tags overzicht
  - Terug knop naar cases

### 3. TrendDetail (`src/components/kennisbank/TrendDetail.tsx`)
- **Functie**: Toont volledige trend informatie
- **Features**:
  - Relevantie indicator met kleuren (hoog/gemiddeld/laag)
  - Volledige beschrijving
  - Impact sectie
  - Aanbevelingen (indien aanwezig)
  - Meta informatie grid
  - Tags overzicht
  - Terug knop naar trends

### 4. NewsDetail (`src/components/kennisbank/NewsDetail.tsx`)
- **Functie**: Toont volledig nieuws artikel
- **Features**:
  - Categorie-specifieke kleuren
  - Volledig artikel inhoud
  - Meta informatie (auteur, datum, views)
  - Tags overzicht
  - Terug knop naar nieuws

## Navigatie

### Hoe werkt het?

1. **Overzichtspagina**: Gebruiker ziet lijst met items (kennisitems, cases, trends, of nieuws)
2. **Klikbaar**: Hele card is klikbaar, plus een specifieke "Lees meer" knop
3. **Detail pagina**: Toont volledige informatie
4. **Terug navigatie**: "Terug" knop bovenaan en onderaan om terug te gaan naar overzicht

### State Management

Elke overzichtspagina gebruikt een `selectedId` state:
```typescript
const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

// Conditionele rendering
if (selectedItemId !== null) {
  return <DetailComponent itemId={selectedItemId} onBack={() => setSelectedItemId(null)} />;
}
```

## Design Principes

### Consistentie
- Alle detail pagina's volgen hetzelfde patroon
- Terug knop altijd op dezelfde positie
- Loading states en error handling consistent

### Visuele Hiërarchie
- Header met gradient en accent kleuren
- Meta informatie in grid layout
- Hoofdcontent in aparte cards
- Tags onderaan

### Kleuren
- **Primary**: `#280bc4` (paars)
- **Accent**: `#7ef769` (groen)
- **Relevantie indicatoren**:
  - Hoog: Rood
  - Gemiddeld: Oranje
  - Laag: Geel

### Responsive Design
- Grid layouts passen aan op mobile
- Cards stacken op kleinere schermen
- Tekst blijft leesbaar op alle formaten

## Data Fetching

Alle detail componenten fetchen hun data via de API:

```typescript
const response = await fetch(`${baseUrl}/api/{endpoint}/${id}`);
```

### Endpoints:
- Kennisitems: `/api/kennisitems/{id}`
- Cases: `/api/cases/{id}`
- Trends: `/api/trends/{id}`
- Nieuws: `/api/nieuws/{id}`

## Loading States

Elke detail pagina heeft:
- Loading spinner tijdens data fetch
- Error state als item niet gevonden
- Proper terug navigatie in alle states

## Gebruikerservaring

### Klikbare Elementen
- **Hele card**: Opent detail pagina
- **Lees meer knop**: Opent detail pagina (met event.stopPropagation())
- **Tags in cards**: Filtert op die tag (met event.stopPropagation())

### Visuele Feedback
- Hover effects op cards
- Cursor: pointer op klikbare elementen
- Smooth transitions

## Toekomstige Verbeteringen

Mogelijke uitbreidingen:
1. **Breadcrumbs**: Voor betere navigatie
2. **Gerelateerde items**: "Bekijk ook deze items"
3. **Social sharing**: Deel knoppen
4. **Print functie**: Print vriendelijke versie
5. **Bookmark/Favoriet**: Items opslaan
6. **Commentaar sectie**: Discussie per item
7. **Versie geschiedenis**: Wijzigingen bijhouden
8. **Export functie**: PDF download

## Testing Checklist

- [x] Kennisitem detail pagina werkt
- [x] Case detail pagina werkt
- [x] Trend detail pagina werkt
- [x] Nieuws detail pagina werkt
- [x] Terug navigatie werkt
- [x] Loading states tonen correct
- [x] Error states tonen correct
- [x] Mobile responsive
- [x] Alle meta data toont correct
- [x] Tags tonen correct
- [x] API calls werken

## Technische Details

### Dependencies
- React hooks (useState, useEffect)
- Lucide React icons
- shadcn/ui components (Card, Badge, Button)
- baseUrl van `src/lib/base-url.ts`

### Type Safety
Alle components gebruiken TypeScript en zijn typesafe met `any` types voor flexibiliteit tijdens development.

### Performance
- Data wordt alleen gefetched wanneer detail pagina getoond wordt
- Geen onnodige re-renders
- Efficient state management
