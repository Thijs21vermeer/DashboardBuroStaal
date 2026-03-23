# Netlify 404 API Routes Fix

## Probleem
API routes geven 404 errors op Netlify:
```
GET https://burostaaldashboard.netlify.app/api/auth/validate 404 (Not Found)
```

## Oorzaak
De Astro Netlify adapter gebruikt server-side rendering (SSR) voor alle routes, inclusief API routes. Alle verzoeken worden afgehandeld door een enkele serverless function.

## Oplossing

### 1. Correcte Build Configuratie
De `netlify.toml` moet correct zijn geconfigureerd:

```toml
[build]
  command = "BUILD_TARGET=netlify npm run build"
  publish = "dist"
  functions = ".netlify/v1/functions"

[build.environment]
  NODE_VERSION = "20"
```

### 2. Environment Variables Instellen op Netlify

**KRITIEK:** Zorg ervoor dat ALLE environment variables zijn ingesteld in de Netlify dashboard:

1. Ga naar: Site settings → Environment variables
2. Voeg toe:
   - `AZURE_SQL_SERVER` - Je Azure SQL server hostname
   - `AZURE_SQL_DATABASE` - Database naam
   - `AZURE_SQL_USER` - Database gebruikersnaam
   - `AZURE_SQL_PASSWORD` - Database wachtwoord
   - `AZURE_SQL_PORT` - Database poort (1433)
   - `JWT_SECRET` - Een veilige random string voor JWT tokens (minimaal 32 characters)
   - `SLACK_WEBHOOK` - (optioneel) Voor notificaties

3. **Belangrijk:** Zet de "scopes" op:
   - ✅ Builds
   - ✅ Functions
   - ✅ Post processing

### 3. Rebuild en Deploy

Na het instellen van de environment variables:

```bash
# Trigger een nieuwe build
git commit --allow-empty -m "Trigger rebuild with env vars"
git push origin main
```

Of gebruik de Netlify dashboard:
- Ga naar: Deploys → Trigger deploy → Clear cache and deploy site

### 4. Verificatie

Test de API routes na deployment:

```bash
# Test health check
curl https://burostaaldashboard.netlify.app/api/health

# Test database connection
curl https://burostaaldashboard.netlify.app/api/test-db
```

### 5. Common Issues

#### Issue: Still getting 404s
**Oplossing:** Check Netlify function logs:
- Ga naar: Functions → View function logs
- Zoek naar errors in de `ssr` function

#### Issue: Environment variables not loading
**Oplossing:** 
1. Verify in Netlify dashboard dat ze correct zijn ingesteld
2. Check dat ze in alle scopes staan (Builds, Functions, Post processing)
3. Doe een clean deploy: Clear cache and deploy site

#### Issue: Database connection fails
**Oplossing:**
1. Test lokaal eerst: `npm run test:predeploy`
2. Check firewall rules in Azure:
   - Sta Netlify's IP ranges toe (0.0.0.0 - 255.255.255.255 voor development, beperk dit later)
3. Verify credentials in Azure portal

### 6. Debug Tips

Check de Netlify function logs voor details:
```bash
# In Netlify dashboard
Functions → ssr → View logs
```

Check de build logs:
```bash
# In Netlify dashboard  
Deploys → [Your deploy] → Deploy log
```

### 7. Next Steps

Als alles correct is ingesteld:
1. ✅ Environment variables zijn ingesteld
2. ✅ Build is succesvol
3. ✅ API routes werken
4. → Gebruikers kunnen inloggen en data zien!

## Quick Checklist

- [ ] `netlify.toml` is correct geconfigureerd
- [ ] Alle environment variables zijn ingesteld in Netlify dashboard
- [ ] Environment variables hebben de juiste scopes (Builds, Functions, Post processing)
- [ ] Site is opnieuw deployed (clear cache)
- [ ] API health check werkt (`/api/health`)
- [ ] Database connection werkt (`/api/test-db`)
- [ ] Login werkt (`/api/auth/login`)

## Support

Als je nog steeds problemen hebt:
1. Check de Netlify function logs
2. Check de build logs
3. Test lokaal met: `BUILD_TARGET=netlify npm run build && netlify dev`
