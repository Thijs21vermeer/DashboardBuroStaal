import type { APIRoute } from 'astro';
import { validateToken, getActiveSessionCount } from '../../../lib/session-manager';

/**
 * TEST ENDPOINT: Verificatie van session token
 * Gebruik dit om te testen of het token systeem werkt
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // Haal token uit Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Geen token gevonden',
          hint: 'Stuur token mee in Authorization header: Bearer <token>'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Valideer token
    const isValid = validateToken(token);

    if (isValid) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Token is geldig',
          activeSessions: getActiveSessionCount()
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Token is ongeldig of verlopen'
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Verify error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

/**
 * GET endpoint voor snelle health check
 */
export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  return new Response(
    JSON.stringify({ 
      endpoint: '/api/auth/verify',
      method: 'POST',
      description: 'Verificeer of een session token geldig is',
      usage: {
        header: 'Authorization: Bearer <your-token>',
        response: {
          success: 'boolean',
          message: 'string'
        }
      },
      currentToken: token ? 'Token ontvangen' : 'Geen token',
      isValid: token ? validateToken(token) : false,
      activeSessions: getActiveSessionCount()
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
