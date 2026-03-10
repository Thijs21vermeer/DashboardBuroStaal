# 📢 Slack Integratie voor Kennisitems

## Overzicht
Wanneer er een nieuw kennisitem wordt toegevoegd via het admin panel, wordt er automatisch een notificatie gestuurd naar Slack.

## Configuratie

### 1. Slack Webhook URL instellen
De Slack webhook URL staat al geconfigureerd in `.env`:
```
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### 2. Webhook URL verkrijgen (indien nodig)
Als je een nieuwe webhook wilt maken:

1. Ga naar https://api.slack.com/apps
2. Selecteer je app of maak een nieuwe
3. Ga naar "Incoming Webhooks"
4. Activeer "Incoming Webhooks"
5. Klik op "Add New Webhook to Workspace"
6. Selecteer het kanaal waar notificaties naartoe moeten
7. Kopieer de webhook URL naar `.env`

## Notificatie Details

Wanneer een nieuw kennisitem wordt toegevoegd, ontvangt Slack:

- 📚 **Header**: "Nieuw Kennisitem"
- **Titel** van het item
- **Type** (Artikel, Video, Document, etc.)
- **Eigenaar** (wie het heeft toegevoegd)
- **Tags** (als aanwezig)
- **Samenvatting**
- **Timestamp** van toevoeging

## Voorbeeld Notificatie

```
📚 Nieuw Kennisitem

Titel: SEO Best Practices 2024
Type: Artikel

Eigenaar: John Doe
Tags: SEO, Marketing, Strategie

Samenvatting: Een overzicht van de belangrijkste SEO strategieën voor 2024.

Toegevoegd op 10-3-2026 13:45
```

## Technische Details

### API Endpoint
- **File**: `src/pages/api/kennisitems/index.ts`
- **Method**: POST
- **Trigger**: Na succesvolle database insert

### Foutafhandeling
- Als Slack niet bereikbaar is, faalt de API request NIET
- Errors worden gelogd maar niet doorgestuurd naar de client
- De kennisitem wordt altijd opgeslagen, ook als Slack notificatie mislukt

### Environment Variables
De webhook URL wordt opgehaald via:
1. `locals.runtime.env.SLACK_WEBHOOK` (Cloudflare/Netlify runtime)
2. `import.meta.env.SLACK_WEBHOOK` (fallback naar .env)

## Testing

Test de integratie door:
1. Ga naar `/admin`
2. Klik op "Kennisbank" tab
3. Voeg een nieuw kennisitem toe
4. Check je Slack kanaal voor de notificatie

## Deployment

### Netlify
Voeg environment variable toe:
```bash
netlify env:set SLACK_WEBHOOK "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

### Cloudflare Workers
Voeg secret toe via wrangler:
```bash
wrangler secret put SLACK_WEBHOOK
```

## Troubleshooting

### Notificaties komen niet aan
1. Check of `SLACK_WEBHOOK` correct is ingesteld in `.env`
2. Check de server logs voor errors
3. Verifieer dat de webhook URL nog geldig is in Slack
4. Test de webhook handmatig:
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"Test notificatie"}'
```

### Notificaties werken lokaal maar niet in productie
- Zorg dat de environment variable ook in productie is ingesteld
- Voor Netlify: check Netlify dashboard → Site settings → Environment variables
- Voor Cloudflare: check wrangler.toml of Cloudflare dashboard

## Uitbreiding

Je kunt de notificaties uitbreiden door:
- Link naar kennisitem detail pagina toevoegen
- Afbeelding preview toevoegen
- Mentions toevoegen (@gebruiker)
- Andere acties notificeren (updates, deletes)

Zie `src/pages/api/kennisitems/index.ts` → `sendSlackNotification()` functie.
