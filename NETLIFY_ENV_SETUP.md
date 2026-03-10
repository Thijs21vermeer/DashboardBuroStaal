
# 🔧 Netlify Environment Variables Setup

## Probleem
De Slack notificaties werken lokaal maar niet in productie omdat de `SLACK_WEBHOOK` environment variable niet is ingesteld in Netlify.

## Oplossing

### Optie 1: Via Netlify Dashboard (Aanbevolen)

1. Ga naar https://app.netlify.com
2. Selecteer je site: **burostaaldashboard**
3. Ga naar **Site settings** → **Environment variables**
4. Klik op **Add a variable**
5. Voeg toe:
   - **Key**: `SLACK_WEBHOOK`
   - **Value**: `[Je Slack Webhook URL hier]`
   - **Scopes**: Selecteer alle scopes (Production, Deploy previews, Branch deploys)
6. Klik op **Create variable**
7. **Trigger een nieuwe deploy** (Site settings → Build & deploy → Trigger deploy → Deploy site)

### Optie 2: Via Netlify CLI

```bash
# Installeer Netlify CLI (als nog niet geïnstalleerd)
npm install -g netlify-cli

# Login
netlify login

# Stel environment variable in
netlify env:set SLACK_WEBHOOK "[Je Slack Webhook URL hier]"

# Trigger nieuwe deploy
netlify deploy --prod
```

## ⚠️ Bestaande Environment Variables

Zorg ervoor dat ook deze zijn ingesteld (deze staan waarschijnlijk al in Netlify):

- `AZURE_SQL_SERVER`
- `AZURE_SQL_DATABASE`
- `AZURE_SQL_USER`
- `AZURE_SQL_PASSWORD`
- `AZURE_SQL_PORT`

## Verificatie

Na het instellen en deployen:

1. Ga naar `/admin` op je live site
2. Voeg een nieuw kennisitem toe
3. Check je Slack kanaal - je zou een notificatie moeten zien! 📢

## Debug

Als het nog steeds niet werkt, check de Netlify deploy logs:

1. Ga naar je site in Netlify Dashboard
2. Klik op **Deploys**
3. Klik op de laatste deploy
4. Check de **Function logs** voor errors
5. Zoek naar de logs met 🔔, 📤, ✅ of ❌ emoji's

## Test Lokaal

Test de Slack integratie lokaal met:

```bash
npx tsx test-slack-notification.ts
```

Dit zou een test notificatie naar Slack moeten sturen.

## 🔒 Security Opmerking

**BELANGRIJK**: De webhook URL die in deze chat is verschenen is nu publiek zichtbaar. Overweeg om:

1. Deze webhook te revoeren in Slack
2. Een nieuwe webhook aan te maken
3. De nieuwe URL in Netlify en `.env` te zetten

Doe dit via: https://api.slack.com/apps → Je app → Incoming Webhooks

