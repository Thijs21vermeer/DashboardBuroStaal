/**
 * Auth0 Login Endpoint
 * 
 * Redirects user to Auth0 for authentication
 */

import type { APIRoute } from 'astro';
import { getAuth0Config, getAuthorizationUrl } from '../../../lib/auth0-config';
import { generateState, createSessionCookie } from '../../../lib/auth0-session';

export const GET: APIRoute = async ({ locals, redirect }) => {
  try {
    const config = getAuth0Config(locals);
    
    // Generate random state for CSRF protection
    const state = generateState();
    
    // Store state in temporary cookie (expires in 10 minutes)
    const stateCookie = createSessionCookie('auth0_state', state, 10 * 60);
    
    // Get authorization URL
    const authUrl = getAuthorizationUrl(config, state);
    
    // Redirect to Auth0
    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
        'Set-Cookie': stateCookie,
      },
    });
  } catch (error) {
    console.error('❌ Auth0 login error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Authentication configuration error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
