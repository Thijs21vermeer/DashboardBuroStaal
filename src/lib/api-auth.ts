import type { APIContext } from 'astro';
import { validateToken } from './session-manager';

/**
 * Helper functie om te checken of een request geauthenticeerd is
 * Returns token als geldig, anders null
 */
export async function getAuthToken(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return null;
  
  const token = authHeader.replace('Bearer ', '');
  if (!token) return null;
  
  const isValid = await validateToken(token);
  return isValid ? token : null;
}

/**
 * Middleware om endpoints te beveiligen
 * Returns error response als niet geauthenticeerd, anders null
 */
export async function requireAuth(context: APIContext): Promise<Response | null> {
  const token = await getAuthToken(context.request);
  
  if (!token) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Unauthorized - geldig token vereist',
        hint: 'Login via /api/auth/login-v2 om een token te krijgen'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return null; // Auth OK
}
