/**
 * JWT-based session management
 * Compatible with api-auth.ts validation
 */

import { getAuthSecret, SESSION_DURATION_SECONDS } from './config';

/**
 * Base64URL encode (JWT-compatible)
 */
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate HMAC signature for JWT
 */
async function generateSignature(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  );

  // Convert to base64url
  const base64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generate a JWT token
 * IMPORTANT: Pass locals from API context for Netlify compatibility
 * SECURITY: Will throw in production if no secret is configured (fail closed)
 */
export async function generateToken(locals?: any): Promise<string> {
  let secret: string;
  try {
    secret = getAuthSecret(locals);
  } catch (error) {
    console.error('🚨 CRITICAL: Cannot generate token - auth secret not configured');
    throw new Error('Authentication not properly configured');
  }
  
  // JWT header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // JWT payload
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    authenticated: true,
    iat: now,
    exp: now + SESSION_DURATION_SECONDS
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create signature
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = await generateSignature(dataToSign, secret);

  // Return complete JWT
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Create a new session (alias for generateToken)
 * IMPORTANT: Pass locals from API context for Netlify compatibility
 * SECURITY: Will throw in production if no secret is configured (fail closed)
 */
export async function createSession(locals?: any): Promise<string> {
  return await generateToken(locals);
}

/**
 * Validate a JWT token
 * IMPORTANT: Pass locals from API context for Netlify compatibility
 * SECURITY: Will throw in production if no secret is configured (fail closed)
 */
export async function validateToken(token: string, locals?: any): Promise<boolean> {
  if (!token) return false;

  let secret: string;
  try {
    secret = getAuthSecret(locals);
  } catch (error) {
    console.error('🚨 CRITICAL: Cannot validate token - auth secret not configured');
    return false; // Fail closed - reject token
  }
  
  const parts = token.split('.');
  
  if (parts.length !== 3) {
    return false;
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    // Verify signature
    const data = `${headerB64}.${payloadB64}`;
    const expectedSignature = await generateSignature(data, secret);

    if (signatureB64 !== expectedSignature) {
      console.warn('Invalid token signature');
      return false;
    }

    // Decode and check expiration
    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn('Token expired');
      return false;
    }

    return payload.authenticated === true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

/**
 * Get session from localStorage (client-side only)
 * @deprecated - Token is nu alleen in HttpOnly cookie, niet meer in localStorage
 * Deze functie blijft voor backward compatibility maar doet niets meer
 */
export function getSession(): { token: string } | null {
  // Token zit nu veilig in HttpOnly cookie
  // JavaScript kan er niet meer bij - beschermd tegen XSS!
  return null;
}

/**
 * Remove session (for logout - client-side action)
 * @deprecated - Gebruik de /api/auth/logout endpoint om cookie te verwijderen
 */
export function deleteSession(): void {
  // HttpOnly cookies kunnen niet door JavaScript verwijderd worden
  // Gebruik de /api/auth/logout endpoint
  console.warn('deleteSession is deprecated - use /api/auth/logout endpoint');
}

/**
 * Get active session count (always 0 for stateless auth)
 */
export function getActiveSessionCount(): number {
  return 0; // Stateless - we don't track sessions
}


