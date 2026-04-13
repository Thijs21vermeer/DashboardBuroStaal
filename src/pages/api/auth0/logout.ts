/**
 * Auth0 Logout Endpoint
 * 
 * Logs user out and clears session
 */

import type { APIRoute } from 'astro';
import { getAuth0Config, getLogoutUrl } from '../../../lib/auth0-config';
import { clearSessionCookie } from '../../../lib/auth0-session';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const config = getAuth0Config(locals);
    
    // Get Auth0 logout URL
    const logoutUrl = getLogoutUrl(config);
    
    // Clear session cookie
    const clearCookie = clearSessionCookie(config.cookieName);
    
    // Redirect to Auth0 logout (which will redirect back to home)
    return new Response(null, {
      status: 302,
      headers: {
        Location: logoutUrl,
        'Set-Cookie': clearCookie,
      },
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Logout failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST = GET; // Support both GET and POST
