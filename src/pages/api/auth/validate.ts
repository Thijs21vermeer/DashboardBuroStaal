import type { APIRoute } from 'astro';
import { validateToken } from '../../../lib/session-manager';

export const POST: APIRoute = async ({ request }) => {
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

    const isValid = await validateToken(token);

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
