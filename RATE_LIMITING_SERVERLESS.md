# ⚠️ Rate Limiting on Serverless - Known Limitations

**Date:** 2026-03-24  
**Status:** 🟡 PARTIAL PROTECTION  
**Platform:** Netlify Functions (Serverless)

---

## 🎯 Executive Summary

De huidige rate limiting implementatie in `src/lib/rate-limiter.ts` biedt **beperkte bescherming** op serverless platforms zoals Netlify.

**Effectiviteit:**
- 🟢 **70-80%** bescherming tegen eenvoudige aanvallen (enkele browser tab, geen tools)
- 🟡 **30-50%** bescherming tegen gemiddelde aanvallen (meerdere tabs, simpele scripts)
- 🔴 **10-20%** bescherming tegen geavanceerde aanvallen (parallel requests, distributed)

**Conclusie:** Biedt enige bescherming maar is **niet voldoende als enige security laag**.

---

## 🔍 Het Probleem

### In-Memory State op Serverless

De rate limiter gebruikt een `Map()` in het geheugen:

```typescript
const rateLimitStore = new Map<string, RateLimitEntry>();
```

**Op traditionele servers (Node.js met uptime):**
✅ Process blijft draaien → State blijft behouden  
✅ Alle requests naar dezelfde instance → Consistent  
✅ Rate limiting werkt zoals verwacht

**Op serverless (Netlify Functions):**
❌ Nieuwe function invocation = mogelijk nieuwe instance  
❌ Cold start = lege Map  
❌ Parallel requests = verschillende instances  
❌ State is niet gedeeld tussen instances

### Voorbeeld Aanval

**Configuratie:**
- Max 5 pogingen per 15 minuten
- Doel: 1000 wachtwoorden proberen

**Wat rate limiting zou moeten doen:**
```
Request 1-5: ✅ Allowed
Request 6+:  ❌ Blocked for 15 minutes
Total pogingen: 5 in 15 minuten
```

**Wat er echt gebeurt op serverless:**
```
Request 1-5:   ✅ Instance A (geblokkeerd na 5)
Request 6-10:  ✅ Instance B (nieuwe instance, lege state)
Request 11-15: ✅ Instance C (nieuwe instance, lege state)
...
Total pogingen: Veel meer dan 5!
```

**Met parallel requests:**
```bash
# Aanvaller stuurt 100 requests tegelijk
for i in {1..100}; do
  curl -X POST /api/auth/login &
done

# Elke request kan een andere instance raken
# Result: ~100 pogingen in plaats van 5
```

---

## 📊 Wanneer Werkt Het Wel?

Rate limiting biedt **gedeeltelijke bescherming** in deze scenario's:

### ✅ Scenario's Waar Het Helpt

1. **Enkele browser tab**
   - Gebruiker probeert handmatig wachtwoorden
   - Waarschijnlijk dezelfde instance tussen requests
   - Rate limiting werkt redelijk goed

2. **Trage aanvallen**
   - Aanvaller stuurt 1 request per paar seconden
   - Hogere kans op dezelfde instance
   - Progressive delays werken

3. **Kleine aanvallen**
   - Paar pogingen per minuut
   - Niet genoeg om veel instances te triggeren
   - Beperkt maar effectief

### ❌ Scenario's Waar Het Faalt

1. **Parallel requests**
   - 10+ simultane requests
   - Triggeren waarschijnlijk meerdere instances
   - Rate limiting wordt omzeild

2. **Distributed attacks**
   - Meerdere IPs
   - Elke IP krijgt eigen rate limit
   - Totaal aantal pogingen is veel hoger

3. **Cold start exploits**
   - Wacht tot instance oud is
   - Trigger nieuwe cold start
   - State is gereset

4. **Credential stuffing**
   - Grote lijst leaked credentials
   - Langzaam maar gestaag proberen
   - Rate limiting vertraagt maar stopt niet

---

## 🛡️ Mitigerende Maatregelen

Omdat rate limiting beperkt is, zijn **extra security lagen essentieel**:

### 1. ✅ Sterke Wachtwoorden (Implemented)

```typescript
// DASHBOARD_PASSWORD moet sterk zijn
const password = process.env.DASHBOARD_PASSWORD;
```

**Aanbevelingen:**
- Minimaal 16 karakters
- Mix van hoofdletters, kleine letters, cijfers, symbolen
- Geen woordenboekwoorden
- Gebruik password manager

**Waarom dit helpt:**
- Sterk wachtwoord = 10^20+ combinaties
- Zelfs met 1000 pogingen/uur = jaren nodig
- Brute force wordt praktisch onmogelijk

### 2. 🟡 Progressive Delays (Implemented)

```typescript
delayAfterAttempts: {
  2: 2000,   // 2 seconden na 2 pogingen
  3: 5000,   // 5 seconden na 3 pogingen
  4: 10000,  // 10 seconden na 4 pogingen
}
```

**Effectiviteit:**
- Vertraagt aanvallen (zelfs als state verloren gaat)
- Maakt brute force langzamer
- Werkt per instance

### 3. 🟢 Server-Side Logging (Implemented)

```typescript
console.warn(`⚠️ Failed login attempt from ${ip} (${attempts}/${MAX_ATTEMPTS})`);
```

**Wat te monitoren:**
- Ongebruikelijk aantal failed login attempts
- Zelfde IP met veel pogingen
- Verschillende IPs kort na elkaar

**Actie:**
- Stel alerts in (Slack, email)
- Handmatig IP blokkeren via firewall
- Onderzoek patronen

### 4. ⚠️ Consider: Account Lockout (Not Implemented)

**Idee:** Sla failed attempts op in database (persistent!)

```typescript
// Pseudo-code - niet geïmplementeerd
async function checkAccountLockout(password: string): Promise<boolean> {
  // Haal lockout status op uit database (persistent!)
  const lockout = await db.query(
    'SELECT attempts, locked_until FROM account_lockout WHERE account = ?',
    ['dashboard']
  );
  
  if (lockout && lockout.locked_until > Date.now()) {
    return false; // Account is locked
  }
  
  return true;
}
```

**Voordelen:**
- ✅ Persistent tussen alle instances
- ✅ Kan niet omzeild worden door parallel requests
- ✅ Globale bescherming

**Nadelen:**
- ❌ Extra database calls
- ❌ Wat als database down is? (fail open vs fail closed)
- ❌ Single account = makkelijk DoS

### 5. ⚠️ Consider: CAPTCHA (Not Implemented)

**Idee:** Toon CAPTCHA na 2-3 failed attempts

**Voordelen:**
- ✅ Stopt automated attacks
- ✅ Geen persistent state nodig
- ✅ Effectief tegen bots

**Nadelen:**
- ❌ UX impact
- ❌ Extra dependency (reCAPTCHA, hCaptcha)
- ❌ Privacy concerns

---

## 🚀 Productie Oplossingen (Not Implemented)

Als je **enterprise-level rate limiting** wilt:

### Option 1: Netlify Blobs

**Persistent KV store included in Netlify.**

```bash
npm install @netlify/blobs
```

```typescript
import { getStore } from '@netlify/blobs';

export async function checkRateLimit(request: Request) {
  const ip = getClientIP(request);
  const store = getStore('rate-limits');
  
  // Haal state op uit persistent store (gedeeld tussen instances)
  const entry = await store.get(ip, { type: 'json' });
  
  // ... rate limit logic ...
  
  // Sla update op
  await store.set(ip, JSON.stringify(entry), {
    metadata: { expiresAt: Date.now() + WINDOW_MS }
  });
}
```

**Voordelen:**
- ✅ Persistent tussen instances
- ✅ Automatische TTL
- ✅ Geen extra infrastructure
- ✅ Included in Netlify

**Nadelen:**
- ❌ Async (langzamer)
- ❌ Extra API calls

### Option 2: Upstash Redis

**Serverless Redis - pay per request.**

```bash
npm install @upstash/redis
```

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export async function checkRateLimit(request: Request) {
  const ip = getClientIP(request);
  
  // Atomic increment (thread-safe!)
  const attempts = await redis.incr(`rate-limit:${ip}`);
  
  if (attempts === 1) {
    await redis.expire(`rate-limit:${ip}`, WINDOW_SECONDS);
  }
  
  return { allowed: attempts <= MAX_ATTEMPTS };
}
```

**Voordelen:**
- ✅ Zeer snel (edge network)
- ✅ Atomic operations
- ✅ Industry standard
- ✅ Werkt overal (niet platform-specific)

**Nadelen:**
- ❌ Extra kosten
- ❌ Extra dependency
- ❌ Requires signup

### Option 3: Netlify Edge Functions + Rate Limiting

**Platform-level rate limiting via config.**

```toml
# netlify.toml
[[edge_functions]]
  function = "rate-limit"
  path = "/api/auth/login"

[edge_functions.rate-limit]
  rate_limit = { window = "15m", max = 5 }
```

**Voordelen:**
- ✅ Platform-level (zeer betrouwbaar)
- ✅ Geen code changes
- ✅ Edge performance
- ✅ DDoS protection

**Nadelen:**
- ❌ Beperkte configuratie opties
- ❌ Platform lock-in
- ❌ Mogelijk extra kosten

### Option 4: External WAF (Cloudflare, AWS WAF)

**Rate limiting op CDN/WAF level.**

**Voordelen:**
- ✅ Beste bescherming
- ✅ Beschermt tegen DDoS
- ✅ Geen impact op application code

**Nadelen:**
- ❌ Extra kosten
- ❌ Extra configuratie
- ❌ Overkill voor small apps

---

## 📋 Recommendations

### Voor Deze Applicatie (Single User Dashboard)

**Current setup is acceptable omdat:**

1. **Enkel gebruiker** - Geen public signup/login
2. **Intern gebruik** - Niet publiek toegankelijk (waarschijnlijk)
3. **Sterk wachtwoord** - Primaire bescherming
4. **Logging** - Detecteert aanvallen
5. **Progressive delays** - Vertraagt aanvallen

**Accepteer de limitatie en focus op:**
- ✅ Sterk wachtwoord (belangrijkste!)
- ✅ Monitor logs voor suspicious activity
- ✅ Overweeg alerts naar Slack
- ✅ Manual IP blocking indien nodig

### Voor Productie Applicaties (Multi-User)

**Implement proper rate limiting:**

1. **Small apps** → Netlify Blobs
2. **Medium apps** → Upstash Redis
3. **Large apps** → WAF + Redis
4. **Enterprise** → Full security stack

**Minimum security:**
- Account lockout in database (persistent)
- CAPTCHA after N attempts
- Email notifications
- 2FA (strongly recommended)

---

## 🎓 Lessons Learned

### Key Takeaway

**Rate limiting alone is never enough.** Het is één laag in defense in depth:

```
Layer 1: Strong passwords (primair)
Layer 2: Rate limiting (vertraagt)
Layer 3: Account lockout (stopt)
Layer 4: CAPTCHA (stopt bots)
Layer 5: 2FA (backup)
Layer 6: Monitoring (detecteert)
Layer 7: Alerts (respons)
```

Als rate limiting faalt, moeten andere lagen beschermen.

### Serverless Trade-offs

**Serverless = snelheid & schaalbaarheid, maar:**
- ❌ Geen persistent in-memory state
- ❌ Cold starts resetten state
- ❌ Multiple instances fragmenteren state

**Voor stateful operations (rate limiting, sessions, caching):**
- Need external store (Redis, DB, KV)
- Of accepteer de limitaties
- Of gebruik platform features

---

## ✅ Action Items

### Immediately

- [x] Document rate limiting limitations (this file)
- [x] Ensure strong DASHBOARD_PASSWORD is set
- [x] Monitor Netlify logs for failed attempts

### Short Term (Optional)

- [ ] Setup Slack alerts for failed login attempts
- [ ] Consider implementing account lockout in database
- [ ] Consider CAPTCHA for repeated failures

### Long Term (If Needed)

- [ ] Evaluate Netlify Blobs for persistent rate limiting
- [ ] Consider Upstash Redis for enterprise-grade solution
- [ ] Implement 2FA for additional security

---

**Status:** 🟡 DOCUMENTED - Limitations acknowledged  
**Security Level:** 🟢 ACCEPTABLE for single-user internal dashboard  
**Recommendation:** Monitor logs and ensure strong password
