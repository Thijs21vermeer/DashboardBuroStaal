import type { APIRoute } from 'astro';

/**
 * Logout endpoint - Verwijdert de HttpOnly cookie
 */
export const POST: APIRoute = async () => {
  // Verwijder cookie door Max-Age=0 te zetten
  const cookieOptions = [
    'auth_token=',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    'Path=/',
    'Max-Age=0' // Verwijder cookie
  ];
  
  return new Response(
    JSON.stringify({ success: true, message: 'Logged out successfully' }),
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': cookieOptions.join('; ')
      }
    }
  );
};
