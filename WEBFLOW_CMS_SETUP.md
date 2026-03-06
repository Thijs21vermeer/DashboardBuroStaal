# Webflow CMS Setup voor Buro Staal Dashboard

## ✅ Conclusie: JA, dit kan met Webflow CMS!

Alle data structuren van het dashboard kunnen vormgegeven worden met Webflow CMS collections.

---

## 📋 Benodigde CMS Collections

### 1. **Kennisbank Items** (Primary Collection)
**Collection naam**: `Kennisbank`

| Veld | Type | Required | Opties/Details |
|------|------|----------|----------------|
| Name | Plain Text | ✅ | Auto-generated (titel) |
| Slug | Slug | ✅ | Auto-generated |
| Titel | Plain Text | ✅ | |
| Categorie | Option | ✅ | Maakindustrie, Online Marketing, Groeistrategieën, Case Studies, Tools & Technologie |
| Type | Option | ✅ | Artikel, Video, Whitepaper, Presentatie, Infographic, Podcast |
| Tags | Multi-reference | ❌ | Link naar Tags collection |
| Auteur | Plain Text | ✅ | |
| Samenvatting | Plain Text | ✅ | Max 200 chars |
| Inhoud | Rich Text | ✅ | Full content |
| Thumbnail | Image | ❌ | |
| Media URL | Link | ❌ | Voor video/externe media |
| Datum Gepubliceerd | Date | ✅ | |
| Laatst Bijgewerkt | Date | ✅ | |
| Views | Number | ❌ | Default: 0 |
| Featured | Switch | ❌ | Default: false |

---

### 2. **Case Studies**
**Collection naam**: `Cases`

| Veld | Type | Required | Details |
|------|------|----------|---------|
| Name | Plain Text | ✅ | Auto (titel) |
| Slug | Slug | ✅ | Auto |
| Klantnaam | Plain Text | ✅ | |
| Industrie | Plain Text | ✅ | |
| Titel | Plain Text | ✅ | |
| Uitdaging | Rich Text | ✅ | |
| Oplossing | Rich Text | ✅ | |
| Resultaten | Rich Text | ✅ | Bullet list |
| Thumbnail | Image | ❌ | |
| Tags | Multi-reference | ❌ | Link naar Tags |
| Datum Gepubliceerd | Date | ✅ | |
| Featured | Switch | ❌ | |

---

### 3. **Trends & Insights**
**Collection naam**: `Trends`

| Veld | Type | Required | Details |
|------|------|----------|---------|
| Name | Plain Text | ✅ | Auto (titel) |
| Slug | Slug | ✅ | Auto |
| Titel | Plain Text | ✅ | |
| Categorie | Option | ✅ | Maakindustrie, Digitale Marketing, Technologie, Business Development |
| Beschrijving | Rich Text | ✅ | |
| Relevantie | Option | ✅ | Hoog, Midden, Laag |
| Bronnen | Plain Text | ✅ | Comma separated |
| Datum Toegevoegd | Date | ✅ | |
| Impact | Rich Text | ✅ | |

---

### 4. **Team Members**
**Collection naam**: `Team`

| Veld | Type | Required | Details |
|------|------|----------|---------|
| Name | Plain Text | ✅ | Naam |
| Slug | Slug | ✅ | Auto |
| Rol | Plain Text | ✅ | |
| Expertise Gebieden | Plain Text | ✅ | Comma separated |
| Bio | Rich Text | ✅ | |
| Email | Email | ✅ | |
| Foto | Image | ❌ | |
| Volgorde | Number | ❌ | Voor sortering |

---

### 5. **Externe Partners**
**Collection naam**: `Partners`

| Veld | Type | Required | Details |
|------|------|----------|---------|
| Name | Plain Text | ✅ | Naam |
| Slug | Slug | ✅ | Auto |
| Bedrijf | Plain Text | ❌ | |
| Specialisatie | Plain Text | ✅ | |
| Expertise Gebieden | Plain Text | ✅ | Comma separated |
| Beschrijving | Rich Text | ✅ | |
| Email | Email | ✅ | |
| Telefoon | Phone | ❌ | |
| Website | Link | ❌ | |

---

### 6. **Intern Nieuws**
**Collection naam**: `Nieuws`

| Veld | Type | Required | Details |
|------|------|----------|---------|
| Name | Plain Text | ✅ | Auto (titel) |
| Slug | Slug | ✅ | Auto |
| Titel | Plain Text | ✅ | |
| Inhoud | Rich Text | ✅ | |
| Categorie | Option | ✅ | Succes, Team, Project, Event, Milestone |
| Datum | Date | ✅ | |
| Auteur | Plain Text | ❌ | |
| Tags | Multi-reference | ❌ | Link naar Tags |
| Belangrijk | Switch | ❌ | Highlight important news |

---

### 7. **Tags** (Helper Collection)
**Collection naam**: `Tags`

| Veld | Type | Required | Details |
|------|------|----------|---------|
| Name | Plain Text | ✅ | Tag naam |
| Slug | Slug | ✅ | Auto |
| Beschrijving | Plain Text | ❌ | |

---

## 🔧 Implementatie Stappen

### Stap 1: Collections Aanmaken in Webflow
1. Ga naar je Webflow project
2. Navigeer naar CMS Collections
3. Maak alle 7 collections aan met bovenstaande velden

### Stap 2: API Endpoints Aanpassen
We moeten de huidige mock API endpoints vervangen met echte Webflow CMS calls:

**Bestanden die aangepast moeten worden:**
- `src/pages/api/kennisitems/index.ts` → Fetch from Kennisbank collection
- `src/pages/api/kennisitems/[id].ts` → Fetch single item
- `src/pages/api/cases/index.ts` → Fetch from Cases collection
- `src/pages/api/cases/[id].ts` → Fetch single case
- `src/pages/api/trends/index.ts` → Fetch from Trends collection
- `src/pages/api/trends/[id].ts` → Fetch single trend
- `src/pages/api/nieuws/index.ts` → Fetch from Nieuws collection
- `src/pages/api/nieuws/[id].ts` → Fetch single nieuws item

### Stap 3: Admin Panel Aanpassing
Het admin panel moet aangepast worden om:
- Items aan te maken via Webflow CMS API (POST)
- Items te updaten via Webflow CMS API (PATCH)
- Items te verwijderen via Webflow CMS API (DELETE)

**⚠️ Belangrijke Limitatie:**
Webflow CMS API ondersteunt alleen **live (published)** items lezen. Voor schrijven (create/update/delete) heb je:
- Webflow CMS API schrijfrechten nodig
- Items worden eerst als "staged" opgeslagen
- Je moet ze handmatig publishen of via API publishen

---

## 💰 Kosten & Beperkingen

### Webflow CMS Limits (afhankelijk van je plan):
- **Basic**: 50 items per collection
- **CMS**: 2,000 items per collection  
- **Business**: 10,000 items per collection
- **Enterprise**: Custom limits

### API Rate Limits:
- 60 requests per minute (standard)
- Higher limits op Enterprise plans

---

## 🎯 Aanbevolen Approach

### Optie A: Hybrid (Aanbevolen voor nu)
✅ **Team Members** → Hard-coded (verandert zelden)
✅ **Externe Partners** → Hard-coded (verandert zelden)
✅ **Kennisbank Items** → Webflow CMS
✅ **Cases** → Webflow CMS
✅ **Trends** → Webflow CMS
✅ **Nieuws** → Webflow CMS

**Voordelen:**
- Eenvoudiger te onderhouden
- Minder API calls
- Statische data hoeft niet in CMS

### Optie B: Full CMS
Alles in Webflow CMS

**Voordelen:**
- Alles centraal beheerbaar
- Non-technical team members kunnen alles aanpassen

**Nadelen:**
- Meer API calls
- Complexer setup
- Iets tragere load times

---

## 🚀 Volgende Stap

Wil je dat ik:

1. **De CMS collections aanmaak** (ik heb toegang via de API)
2. **De API endpoints ombouw** naar echte Webflow CMS calls
3. **Het admin panel aanpas** om met Webflow CMS te werken
4. **Test data toevoeg** aan de collections

Of wil je **eerst zelf de collections aanmaken** in Webflow Designer en dan laat ik zien hoe je ze kunt gebruiken?

Laat me weten welke aanpak je voorkeur heeft! 🙂
