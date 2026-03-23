import type { APIRoute } from 'astro';
import { validateToken } from '../../../lib/session-manager';

/**
 * Helper function to get token from request
 * Priority: Cookie > Authorization header > Request body
 */
function getTokenFromRequest(request: Request, bodyToken?: string): string | null {
  // 1. Check HttpOnly cookie (most secure)
  const cookies = request.headers.get('Cookie');
  if (cookies) {
    const match = cookies.match(/auth_token=([^;]+)/);
    if (match) {
      return match[1];
    }
  }
  
  // 2. Check Authorization header (backward compatibility)
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 3. Check request body (backward compatibility)
  if (bodyToken) {
    return bodyToken;
  }
  
  return null;
}

// GET: Check if user has valid session
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return new Response(
        JSON.stringify({ valid: false, message: 'No token provided' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const isValid = await validateToken(token, locals);

    return new Response(
      JSON.stringify({ valid: isValid }),
      {
        status: isValid ? 200 : 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, message: 'Validation error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// POST: Validate token from request body
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { token: bodyToken } = await request.json();
    const token = getTokenFromRequest(request, bodyToken);

    if (!token) {
      return new Response(
        JSON.stringify({ valid: false, message: 'No token provided' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const isValid = await validateToken(token, locals);

    return new Response(
      JSON.stringify({ valid: isValid }),
      {
        status: isValid ? 200 : 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ valid: false, message: 'Validation error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};



