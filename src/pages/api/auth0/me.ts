/**
 * Auth0 User Info Endpoint
 * 
 * Returns current user information from session
 */

import type { APIRoute } from 'astro';
import { getAuth0Config } from '../../../lib/auth0-config';
import { getSession, isSessionExpired } from '../../../lib/auth0-session';

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const config = getAuth0Config(locals);
    
    // Get session from cookie
    const session = await getSession(request, config.cookieName, config.cookieSecret);
    
    if (!session) {
      return new Response(
        JSON.stringify({ authenticated: false }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Check if session is expired
    if (isSessionExpired(session)) {
      return new Response(
        JSON.stringify({ authenticated: false, error: 'Session expired' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Return user info (without tokens for security)
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: session.user,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Get user error:', error);
    
    return new Response(
      JSON.stringify({ authenticated: false, error: 'Failed to get user' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
