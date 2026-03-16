import type { APIRoute } from 'astro';
import { createSession } from '../../../lib/session-manager';

/**
 * NIEUWE LOGIN ENDPOINT MET TOKEN SYSTEEM
 * Dit is een test versie - de oude /api/auth/login.ts blijft werken
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const { password } = await request.json();

    // Haal het wachtwoord op uit environment variables
    const correctPassword = import.meta.env.DASHBOARD_PASSWORD || process.env.DASHBOARD_PASSWORD || 'BurostaalDB';

    if (password === correctPassword) {
      // Genereer een nieuwe sessie token
      const token = await createSession();
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          token,
          expiresIn: 24 * 60 * 60 // 24 uur in seconden
        }),
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
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

