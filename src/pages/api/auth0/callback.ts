/**
 * Auth0 Callback Endpoint
 * 
 * Handles the OAuth callback from Auth0
 */

import type { APIRoute } from 'astro';
import { baseUrl } from '../../../lib/base-url';
import { getAuth0Config, exchangeCodeForTokens, getUserInfo } from '../../../lib/auth0-config';
import { encryptSession, createSessionCookie, clearSessionCookie } from '../../../lib/auth0-session';

export const GET: APIRoute = async ({ request, locals, redirect }) => {
  try {
    const config = getAuth0Config(locals);
    const url = new URL(request.url);
    
    // Get authorization code and state from query params
    const code = url.searchParams.get('code');
    const returnedState = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    
    // Check for errors from Auth0
    if (error) {
      console.error('❌ Auth0 error:', error, errorDescription);
      return redirect(`${baseUrl}/?error=${encodeURIComponent(errorDescription || error)}`);
    }
    
    // Validate required parameters
    if (!code || !returnedState) {
      console.error('❌ Missing code or state in callback');
      return redirect(`${baseUrl}/?error=invalid_callback`);
    }
    
    // Verify state (CSRF protection)
    const cookies = request.headers.get('cookie');
    const cookieMap = cookies
      ? Object.fromEntries(
          cookies.split('; ').map(c => {
            const [key, ...values] = c.split('=');
            return [key, values.join('=')];
          })
        )
      : {};
    
    const storedState = cookieMap['auth0_state'];
    
    if (!storedState || storedState !== returnedState) {
      console.error('❌ State mismatch - possible CSRF attack');
      return redirect(`${baseUrl}/?error=invalid_state`);
    }
    
    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(config, code);
    
    // Get user info
    const userInfo = await getUserInfo(config, tokens.access_token);
    
    // Calculate token expiration (convert seconds to milliseconds)
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    
    // Create session object
    const session = {
      user: {
        sub: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      },
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      expiresAt,
    };
    
    // Encrypt session into a JWT
    const sessionToken = await encryptSession(session, config.cookieSecret);
    
    // Create session cookie
    const sessionCookie = createSessionCookie(config.cookieName, sessionToken);
    
    // Clear state cookie
    const clearStateCookie = clearSessionCookie('auth0_state');
    
    // Redirect to dashboard with session cookie
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${baseUrl}/`,
        'Set-Cookie': [sessionCookie, clearStateCookie].join(', '),
      },
    });
  } catch (error) {
    console.error('❌ Auth0 callback error:', error);
    
    return redirect(
      `${baseUrl}/?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Authentication failed'
      )}`
    );
  }
};
