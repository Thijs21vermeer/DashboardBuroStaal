import type { APIRoute } from 'astro';
import { generateToken } from '../../../lib/session-manager';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { password } = await request.json();

    // Haal het wachtwoord op uit environment variables
    const correctPassword = import.meta.env.DASHBOARD_PASSWORD || process.env.DASHBOARD_PASSWORD;

    if (!correctPassword) {
      return new Response(
        JSON.stringify({ success: false, message: 'Server configuration error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (password === correctPassword) {
      // Genereer een echte JWT token
      const token = await generateToken();
      
      return new Response(
        JSON.stringify({ success: true, token }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, message: 'Ongeldig wachtwoord' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

