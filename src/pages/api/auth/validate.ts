import type { APIRoute } from 'astro';
import { validateToken } from '../../../lib/session-manager';

// GET: Check if user has valid session via Authorization header
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ valid: false, message: 'No token provided' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
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
    const { token } = await request.json();

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


