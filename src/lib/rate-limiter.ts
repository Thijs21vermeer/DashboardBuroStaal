import { RATE_LIMIT_CONFIG } from './config';

/**
 * Rate Limiter - Voorkomt brute force aanvallen op login endpoint
 * 
 * Implementeert een in-memory rate limiter met exponential backoff
 */

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  blockedUntil?: number;
}

// In-memory store voor rate limiting
// In productie zou je dit in Redis of een database kunnen opslaan
const rateLimitStore = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = RATE_LIMIT_CONFIG.maxAttempts;
const WINDOW_MS = RATE_LIMIT_CONFIG.windowMinutes * 60 * 1000;
const BLOCK_DURATION_MS = RATE_LIMIT_CONFIG.blockDurationMinutes * 60 * 1000;

/**
 * Haal IP adres op uit request
 */
function getClientIP(request: Request): string {
  // Check verschillende headers (afhankelijk van proxy/CDN setup)
  const headers = request.headers;
  
  return (
    headers.get('cf-connecting-ip') ||      // Cloudflare
    headers.get('x-real-ip') ||              // Nginx
    headers.get('x-forwarded-for')?.split(',')[0] || // Standard proxy
    'unknown'
  );
}

/**
 * Check of een IP geblokkeerd is
 */
export function checkRateLimit(request: Request): {
  allowed: boolean;
  remaining?: number;
  retryAfter?: number;
  reason?: string;
} {
  const ip = getClientIP(request);
  const now = Date.now();
  
  // Haal bestaande entry op
  const entry = rateLimitStore.get(ip);
  
  // Geen eerdere pogingen - allow
  if (!entry) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }
  
  // Check of IP momenteel geblokkeerd is
  if (entry.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      reason: `Te veel mislukte pogingen. Probeer over ${Math.ceil(retryAfter / 60)} minuten opnieuw.`
    };
  }
  
  // Check of we buiten het tijdvenster zijn - reset counter
  if (now - entry.firstAttempt > WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }
  
  // Check progressive delay
  for (const [attempts, delay] of Object.entries(RATE_LIMIT_CONFIG.delayAfterAttempts)) {
    if (entry.attempts >= parseInt(attempts)) {
      const timeSinceLastAttempt = now - entry.lastAttempt;
      if (timeSinceLastAttempt < delay) {
        const retryAfter = Math.ceil((delay - timeSinceLastAttempt) / 1000);
        return {
          allowed: false,
          retryAfter,
          reason: `Te snel. Wacht ${retryAfter} seconden voor de volgende poging.`
        };
      }
    }
  }
  
  // Check max attempts
  if (entry.attempts >= MAX_ATTEMPTS) {
    // Blokkeer voor langere tijd
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    rateLimitStore.set(ip, entry);
    
    const retryAfter = Math.ceil(BLOCK_DURATION_MS / 1000);
    return {
      allowed: false,
      retryAfter,
      reason: `Maximum aantal pogingen bereikt. Account tijdelijk geblokkeerd voor ${Math.ceil(retryAfter / 60)} minuten.`
    };
  }
  
  // Allow, maar geef aan hoeveel pogingen over zijn
  const remaining = MAX_ATTEMPTS - entry.attempts;
  return { allowed: true, remaining };
}

/**
 * Registreer een mislukte login poging
 */
export function recordFailedAttempt(request: Request): void {
  const ip = getClientIP(request);
  const now = Date.now();
  
  const entry = rateLimitStore.get(ip);
  
  if (!entry) {
    // Eerste poging
    rateLimitStore.set(ip, {
      attempts: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
  } else {
    // Verhoog counter
    entry.attempts += 1;
    entry.lastAttempt = now;
    rateLimitStore.set(ip, entry);
  }
  
  console.log(`⚠️ Failed login attempt from ${ip} (${entry?.attempts || 1}/${MAX_ATTEMPTS})`);
}

/**
 * Reset rate limit voor succesvol ingelogde gebruiker
 */
export function resetRateLimit(request: Request): void {
  const ip = getClientIP(request);
  rateLimitStore.delete(ip);
  console.log(`✅ Rate limit reset for ${ip}`);
}

/**
 * Cleanup oude entries (run periodiek)
 */
export function cleanupOldEntries(): void {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [ip, entry] of rateLimitStore.entries()) {
    // Verwijder entries ouder dan window + block duration
    const maxAge = WINDOW_MS + BLOCK_DURATION_MS;
    if (now - entry.firstAttempt > maxAge) {
      rateLimitStore.delete(ip);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} old rate limit entries`);
  }
}

/**
 * Start automatische cleanup
 */
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupOldEntries, RATE_LIMIT_CONFIG.cleanupIntervalMinutes * 60 * 1000);
}

/**
 * Get stats (voor monitoring/debugging)
 */
export function getRateLimitStats() {
  return {
    totalTrackedIPs: rateLimitStore.size,
    config: {
      maxAttempts: MAX_ATTEMPTS,
      windowMinutes: RATE_LIMIT_CONFIG.windowMinutes,
      blockDurationMinutes: RATE_LIMIT_CONFIG.blockDurationMinutes,
      cleanupIntervalMinutes: RATE_LIMIT_CONFIG.cleanupIntervalMinutes,
      delayAfterAttempts: RATE_LIMIT_CONFIG.delayAfterAttempts,
    },
  };
}


