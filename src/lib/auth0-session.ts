/**
 * Auth0 Session Manager
 * 
 * Beheert gebruikerssessies met Auth0 tokens in encrypted cookies
 */

import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

interface Auth0Session {
  user: {
    sub: string;
    name: string;
    email: string;
    picture?: string;
  };
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 dagen

/**
 * Encrypt session data into a JWT
 */
export async function encryptSession(
  session: Auth0Session,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);

  const jwt = await new SignJWT({ ...session } as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);

  return jwt;
}

/**
 * Decrypt and verify session JWT
 */
export async function decryptSession(
  token: string,
  secret: string
): Promise<Auth0Session | null> {
  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    const { payload } = await jwtVerify(token, secretKey);

    return payload as unknown as Auth0Session;
  } catch (error) {
    console.error('Failed to decrypt session:', error);
    return null;
  }
}

/**
 * Create session cookie string
 */
export function createSessionCookie(
  cookieName: string,
  token: string,
  maxAge: number = COOKIE_MAX_AGE
): string {
  const cookieOptions = [
    `${cookieName}=${token}`,
    'HttpOnly',
    'Secure',
    'SameSite=Lax', // Lax for OAuth redirects
    'Path=/',
    `Max-Age=${maxAge}`,
  ];

  return cookieOptions.join('; ');
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(cookieName: string): string {
  return `${cookieName}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

/**
 * Get session from request cookies
 */
export async function getSession(
  request: Request,
  cookieName: string,
  secret: string
): Promise<Auth0Session | null> {
  const cookies = request.headers.get('cookie');
  if (!cookies) return null;

  const cookieMap = Object.fromEntries(
    cookies.split('; ').map(c => {
      const [key, ...values] = c.split('=');
      return [key, values.join('=')];
    })
  );

  const token = cookieMap[cookieName];
  if (!token) return null;

  return decryptSession(token, secret);
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: Auth0Session): boolean {
  return Date.now() >= session.expiresAt;
}

/**
 * Generate random state for OAuth flow
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
