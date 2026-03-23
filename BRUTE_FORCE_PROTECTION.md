# 🛡️ Brute Force Bescherming

## ✅ Geïmplementeerd

De login endpoint is nu volledig beschermd tegen brute force aanvallen met een geavanceerd rate limiting systeem.

## 🔒 Beveiligingslagen

### 1. **Progressive Rate Limiting**
- **3 pogingen**: 5 seconden vertraging
- **4 pogingen**: 30 seconden vertraging  
- **5 pogingen**: 5 minuten vertraging
- **5+ pogingen**: 1 uur volledige blokkering

### 2. **IP-gebaseerde Tracking**
- Unieke tracking per IP adres
- Werkt achter proxies/CDN (Cloudflare, Nginx, etc.)
- Ondersteunt headers: `cf-connecting-ip`, `x-real-ip`, `x-forwarded-for`

### 3. **Tijdvensters**
- 15 minuten rolling window voor pogingen
- Automatische reset na succesvolle login
- Cleanup van oude entries elk uur

### 4. **Gebruiksvriendelijke Feedback**
```json
// Na 3 pogingen:
{
  "success": false,
  "message": "Ongeldig wachtwoord. Nog 2 pogingen over."
}

// Bij te veel pogingen:
{
  "success": false,
  "message": "Maximum aantal pogingen bereikt. Account tijdelijk geblokkeerd voor 60 minuten.",
  "retryAfter": 3600
}

// Bij te snelle pogingen:
{
  "success": false,
  "message": "Te snel. Wacht 5 seconden voor de volgende poging.",
  "retryAfter": 5
}
```

## 📊 HTTP Status Codes

- **200**: Succesvolle login
- **401**: Verkeerd wachtwoord (telt mee voor rate limit)
- **429**: Too Many Requests (rate limit bereikt)
- **500**: Server error

## 🔧 Configuratie

Alle settings staan in `src/lib/rate-limiter.ts`:

```typescript
const CONFIG = {
  MAX_ATTEMPTS: 5,              // Max pogingen
  WINDOW_MS: 15 * 60 * 1000,    // 15 minuten window
  
  DELAY_AFTER_ATTEMPTS: {
    3: 5 * 1000,                // 5 sec na 3 pogingen
    4: 30 * 1000,               // 30 sec na 4 pogingen
    5: 5 * 60 * 1000,           // 5 min na 5 pogingen
  },
  
  BLOCK_DURATION_MS: 60 * 60 * 1000,  // 1 uur blokkering
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // Cleanup elk uur
};
```

## 🎯 Aanvalsscenario's Geblokkeerd

### ✅ Basis Brute Force
Een aanvaller probeert 1000 wachtwoorden:
- Na 5 pogingen → 1 uur geblokkeerd
- Effectief: 99.5% van pogingen geblokkeerd

### ✅ Slow Brute Force
Een aanvaller probeert langzaam (elke 30 sec):
- Progressive delays vertragen elk nog meer
- Na 5 pogingen → 1 uur geblokkeerd

### ✅ Distributed Brute Force
Meerdere IP's tegelijk:
- Elke IP wordt apart getracked
- Overweeg extra bescherming op firewall niveau

## 🔍 Monitoring

Console logging bij elke mislukte poging:
```
⚠️ Failed login attempt from 192.168.1.1 (3/5)
⚠️ Failed login attempt from 192.168.1.1 (4/5)
⚠️ Failed login attempt from 192.168.1.1 (5/5)
✅ Rate limit reset for 192.168.1.1
```

## 💾 Data Opslag

**Huidige implementatie**: In-memory Map
- ✅ Snel en simpel
- ⚠️ Reset bij server restart
- ⚠️ Niet geschikt voor meerdere server instances

**Productie aanbevelingen**:
- Redis voor gedeelde state tussen servers
- Database voor permanente logging
- CloudFlare rate limiting als extra laag

## 🚀 Deployment Checklist

- [x] Rate limiter geïmplementeerd
- [x] Login endpoint beveiligd
- [x] Progressive delays actief
- [x] Gebruiksvriendelijke error messages
- [x] Automatische cleanup
- [ ] Test rate limiting in staging
- [ ] Monitor logs in productie
- [ ] Overweeg CloudFlare rate limiting

## 🧪 Testen

### Handmatig testen:
1. Probeer 3x verkeerd wachtwoord → 5 sec delay
2. Probeer 4x verkeerd wachtwoord → 30 sec delay
3. Probeer 5x verkeerd wachtwoord → 1 uur blokkering
4. Login met correct wachtwoord → rate limit reset

### Console logs checken:
```bash
# Zie failed attempts
⚠️ Failed login attempt from <IP> (x/5)

# Zie succesvolle reset
✅ Rate limit reset for <IP>
```

## 📈 Statistieken

Functie beschikbaar voor monitoring:
```typescript
import { getRateLimitStats } from './lib/rate-limiter';

const stats = getRateLimitStats();
// { totalTrackedIPs: 5, config: {...} }
```

## 🔐 Security Best Practices

1. ✅ **Progressive delays** - Vertragen na elke poging
2. ✅ **IP tracking** - Per IP address limiteren
3. ✅ **Time windows** - Rolling window van 15 minuten
4. ✅ **User feedback** - Duidelijke error messages
5. ✅ **Auto cleanup** - Geen memory leaks
6. ⚠️ **HTTPS only** - Altijd via HTTPS in productie
7. ⚠️ **Strong password** - Gebruik een sterk DASHBOARD_PASSWORD
8. ⚠️ **Monitoring** - Log en monitor verdachte activiteit

## 🎉 Resultaat

**Voor brute force bescherming:**
- ❌ Onbeperkt wachtwoorden proberen
- ❌ Snelle automated attacks
- ❌ Credential stuffing attacks

**Nu:**
- ✅ Max 5 pogingen per 15 minuten
- ✅ Progressive delays vertragen aanvallers
- ✅ 1 uur blokkering na max attempts
- ✅ Automatische reset na succesvolle login
- ✅ Duidelijke feedback naar gebruiker

**Je applicatie is nu goed beschermd tegen brute force aanvallen! 🛡️**
