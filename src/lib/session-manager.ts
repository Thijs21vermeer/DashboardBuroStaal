/**
 * JWT-style session management zonder database
 * Tokens zijn zelf-validerend met signature
 */

const SECRET_KEY = process.env.AUTH_SECRET || 'burostaal-secret-key-change-in-production';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 uur

interface TokenPayload {
  created: number;
  expires: number;
  signature: string;
}

/**
 * Simpele HMAC-achtige signature (voor lightweight auth)
 */
async function createSignature(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data + SECRET_KEY);
  
  // Use subtle crypto for signature
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Genereer een nieuwe token met embedded expiry
 */
export async function generateToken(): Promise<string> {
  const now = Date.now();
  const expires = now + SESSION_DURATION;
  
  const payload = {
    created: now,
    expires: expires,
  };
  
  const payloadString = JSON.stringify(payload);
  const signature = await createSignature(payloadString);
  
  const fullPayload: TokenPayload = {
    ...payload,
    signature,
  };
  
  // Base64 encode the entire payload
  return btoa(JSON.stringify(fullPayload));
}

/**
 * Creëer een nieuwe sessie (alias voor generateToken)
 */
export async function createSession(): Promise<string> {
  return await generateToken();
}

/**
 * Valideer of een token geldig is
 */
export async function validateToken(token: string): Promise<boolean> {
  if (!token) return false;
  
  try {
    // Decode token
    const decoded = atob(token);
    const payload: TokenPayload = JSON.parse(decoded);
    
    // Check expiry
    if (Date.now() > payload.expires) {
      return false;
    }
    
    // Verify signature
    const payloadWithoutSig = {
      created: payload.created,
      expires: payload.expires,
    };
    const expectedSignature = await createSignature(JSON.stringify(payloadWithoutSig));
    
    if (payload.signature !== expectedSignature) {
      console.warn('Invalid token signature');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

/**
 * Verwijder een sessie (voor logout - client-side actie)
 */
export function deleteSession(token: string): void {
  // Met JWT-style tokens hoeven we niks te doen server-side
  // Client verwijdert token uit localStorage
}

/**
 * Get actieve sessie count (altijd 0 bij stateless auth)
 */
export function getActiveSessionCount(): number {
  return 0; // Stateless - we tracken geen sessies
}
