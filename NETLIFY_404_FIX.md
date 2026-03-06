# Netlify 404 Error Fix

## Probleem
Je krijgt een 404 error wanneer je de site probeert te openen op Netlify.

## Oplossingen

### 1. ✅ Controleer Build Settings in Netlify Dashboard

Log in op Netlify en ga naar je site settings:

**Site settings → Build & deploy → Build settings**

Zorg ervoor dat deze instellingen correct zijn:

```
Build command: BUILD_TARGET=netlify npm run build
Publish directory: dist
```

### 2. ✅ Environment Variables Instellen

Ga naar: **Site settings → Environment variables**

Voeg de volgende variabelen toe:

```
AZURE_SQL_SERVER=<jouw-server>.database.windows.net
AZURE_SQL_DATABASE=<jouw-database-naam>
AZURE_SQL_USER=<jouw-username>
AZURE_SQL_PASSWORD=<jouw-password>
AZURE_SQL_PORT=1433
```

⚠️ **Belangrijk**: Zonder deze environment variables zal de API niet werken!

### 3. ✅ Controleer Functions Directory

De Netlify adapter genereert automatisch de juiste functie structuur.
Deze staat in `.netlify/v1/functions/ssr/`

Je hoeft hier niets mee te doen - Netlify detecteert dit automatisch.

### 4. ✅ Trigger een nieuwe deployment

Nadat je bovenstaande instellingen hebt aangepast:

1. Ga naar **Deploys** tab
2. Klik op **Trigger deploy** → **Clear cache and deploy site**

### 5. ✅ Check Deploy Logs

Kijk in de deploy logs of er errors zijn:

- Build moet succesvol zijn (geen TypeScript errors)
- Functions moeten correct worden gedetecteerd
- Zoek naar: "1 new functions to upload"

### 6. ⚠️ Veelvoorkomende Problemen

**A. "Page Not Found" op root path**

Dit kan komen doordat:
- De build command niet correct is ingesteld
- De publish directory verkeerd is (`dist` moet het zijn, niet `dist/`)
- Environment variables ontbreken (waardoor de app crasht)

**B. "Function invocation failed"**

Dit betekent meestal:
- Environment variables zijn niet ingesteld
- Database connectie faalt
- TypeScript errors in de build

**C. Static assets laden wel, maar pages geven 404**

Dit betekent:
- De Netlify function is niet correct gedetecteerd
- De `netlify.toml` heeft conflicterende redirects

## Debugging Steps

### Stap 1: Test lokaal met Netlify CLI

```bash
npm install -g netlify-cli
BUILD_TARGET=netlify npm run build
netlify dev
```

### Stap 2: Check Build Output

De build moet deze output laten zien:

```
[@astrojs/netlify] Generated SSR Function
[build] Server built in X.XXs
[build] Complete!
```

### Stap 3: Check Netlify Function Logs

In Netlify dashboard:
**Functions** tab → Klik op je function → **Realtime logs**

Hier zie je live errors tijdens requests.

## Werkende Configuratie

### netlify.toml (minimaal)

```toml
[build]
  command = "BUILD_TARGET=netlify npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

### astro.config.mjs

```javascript
const getAdapter = () => {
  if (process.env.BUILD_TARGET === 'netlify') {
    return netlify({
      edgeMiddleware: false  // Gebruik Netlify Functions (niet Edge)
    });
  }
  return cloudflare({...});
};

export default defineConfig({
  base: '',  // Leeg voor root deployment
  output: 'server',  // SSR mode
  adapter: getAdapter(),
  // ... rest
});
```

## Test Checklist

✅ Build succesvol (groen vinkje in Netlify)
✅ Function gedetecteerd (zie deploy logs)
✅ Environment variables ingesteld
✅ Geen TypeScript errors
✅ Site is live (geen 404 op root)

## Nog steeds 404?

Als je nog steeds een 404 krijgt na alle bovenstaande stappen:

1. **Check de exacte URL** - gebruik je `https://jouw-site.netlify.app` (zonder `/app` of andere paden)?

2. **Check Netlify Support Forums** - search voor "@astrojs/netlify 404"

3. **Check Build Logs voor warnings** - soms zijn er stille failures

4. **Probeer een fresh deployment**:
   ```bash
   # In je repo
   git commit --allow-empty -m "trigger rebuild"
   git push
   ```

5. **Contact Netlify Support** met:
   - Je site naam
   - Deploy ID (van de failing deploy)
   - Error logs

## Success Indicator

Als alles goed gaat zie je in de deploy logs:

```
[@astrojs/netlify] Generated SSR Function
Functions: 1 new function to upload
Site is live ✨
```

En je site zou moeten laden op `https://jouw-site.netlify.app`
