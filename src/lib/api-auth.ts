import type { APIContext } from 'astro';
import { getAuthSecret } from './config';

/**
 * API Authentication Middleware
 * Validates JWT tokens for protected API routes
 */

interface TokenPayload {
  authenticated: boolean;
  iat: number;
  exp: number;
}

/**
 * Validates a JWT token using the same logic as the auth/validate endpoint
 * @param token - The JWT token to validate
 * @param secret - The AUTH_SECRET used to sign the token
 * @returns The decoded payload if valid, null otherwise
 */
async function validateToken(token: string, secret: string): Promise<TokenPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    // Verify signature
    const data = `${headerB64}.${payloadB64}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBuffer = Uint8Array.from(atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      encoder.encode(data)
    );

    if (!isValid) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))) as TokenPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

/**
 * Middleware function to protect API routes
 * Returns a 401 Unauthorized response if the token is invalid
 * 
 * IMPORTANT: This function now takes the full APIContext to access locals
 * 
 * @param context - The Astro API context (includes request and locals)
 * @returns Response object if unauthorized, null if authorized
 * 
 * @example
 * export const GET: APIRoute = async (context) => {
 *   const authError = await requireAuth(context);
 *   if (authError) return authError;
 *   
 *   // Your protected API logic here
 * };
 */
export async function requireAuth(
  context: APIContext
): Promise<Response | null> {
  const { request, locals } = context;
  
  let token: string | null = null;
  
  // 1. Check HttpOnly cookie (most secure)
  const cookies = request.headers.get('Cookie');
  if (cookies) {
    const match = cookies.match(/auth_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }
  
  // 2. Fallback to Authorization header (backward compatibility)
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    return new Response(
      JSON.stringify({ 
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header' 
      }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Get AUTH_SECRET from runtime (critical for Netlify)
  const secret = getAuthSecret(locals);
  
  if (!secret) {
    console.error('AUTH_SECRET not configured');
    return new Response(
      JSON.stringify({ 
        error: 'Server configuration error',
        message: 'Authentication not properly configured' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Validate token
  const payload = await validateToken(token, secret);
  
  if (!payload || !payload.authenticated) {
    return new Response(
      JSON.stringify({ 
        error: 'Unauthorized',
        message: 'Invalid or expired token' 
      }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // Token is valid, allow request to proceed
  return null;
}

