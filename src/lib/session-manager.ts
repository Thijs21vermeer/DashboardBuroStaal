/**
 * JWT-based session management
 * Compatible with api-auth.ts validation
 */

import { AUTH_SECRET, SESSION_DURATION_SECONDS } from './config';

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
 */
export async function generateToken(): Promise<string> {
  const secret = AUTH_SECRET;
  
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
 */
export async function createSession(): Promise<string> {
  return await generateToken();
}

/**
 * Validate a JWT token
 */
export async function validateToken(token: string): Promise<boolean> {
  if (!token) return false;

  const secret = AUTH_SECRET;
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
 */
export function getSession(): { token: string } | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('auth_token');
  if (!token) {
    return null;
  }

  return { token };
}

/**
 * Remove session (for logout - client-side action)
 */
export function deleteSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

/**
 * Get active session count (always 0 for stateless auth)
 */
export function getActiveSessionCount(): number {
  return 0; // Stateless - we don't track sessions
}

