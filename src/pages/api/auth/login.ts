import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { password } = await request.json();

    // Haal het wachtwoord op uit environment variables
    const correctPassword = import.meta.env.DASHBOARD_PASSWORD || process.env.DASHBOARD_PASSWORD || 'BurostaalDB';

    if (password === correctPassword) {
      return new Response(
        JSON.stringify({ success: true }),
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
