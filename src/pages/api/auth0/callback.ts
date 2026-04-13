


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
    
    // DEBUG: Log all query parameters
    console.log('🔍 Auth0 Callback Debug:');
    console.log('  Full URL:', request.url);
    console.log('  Query params:', Object.fromEntries(url.searchParams));
    
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
      console.error('  code present:', !!code);
      console.error('  state present:', !!returnedState);
      return redirect(`${baseUrl}/?error=invalid_callback`);
    }
    
    // Verify state (CSRF protection)
    const cookies = request.headers.get('cookie');
    console.log('🍪 Cookies received:', cookies);
    const cookieMap = cookies
      ? Object.fromEntries(
          cookies.split('; ').map(c => {
            const [key, ...values] = c.split('=');
            return [key, values.join('=')];
          })
        )
      : {};
    
    const storedState = cookieMap['auth0_state'];
    console.log('🔐 State validation:');
    console.log('  Stored state:', storedState?.substring(0, 20) + '...');
    console.log('  Returned state:', returnedState?.substring(0, 20) + '...');
    console.log('  Match:', storedState === returnedState);
    
    if (!storedState || storedState !== returnedState) {
      console.error('❌ State mismatch - possible CSRF attack');
      return redirect(`${baseUrl}/?error=invalid_state`);
    }
    
    // Exchange authorization code for tokens
    console.log('🔄 Exchanging code for tokens...');
    const tokens = await exchangeCodeForTokens(config, code);
    console.log('✅ Tokens received successfully');
    
    // Get user info
    console.log('👤 Fetching user info...');
    const userInfo = await getUserInfo(config, tokens.access_token);
    console.log('✅ User info:', { email: userInfo.email, name: userInfo.name });
    
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
    console.log('🔐 Creating encrypted session...');
    const sessionToken = await encryptSession(session, config.cookieSecret);
    console.log('✅ Session encrypted successfully');
    
    // Create session cookie
    const sessionCookie = createSessionCookie(config.cookieName, sessionToken);
    
    // Clear state cookie
    const clearStateCookie = clearSessionCookie('auth0_state');
    
    console.log('✅ Redirecting to dashboard with session cookie');
    console.log('🍪 Cookie being set:');
    console.log('  Name:', config.cookieName);
    console.log('  Value length:', sessionToken.length);
    console.log('  Cookie string:', sessionCookie.substring(0, 100) + '...');
    console.log('  Redirect to:', `${baseUrl}/`);
    
    // Redirect to dashboard with session cookie
    // IMPORTANT: Use Headers object to set multiple Set-Cookie headers correctly
    const headers = new Headers();
    headers.append('Location', `${baseUrl}/`);
    headers.append('Set-Cookie', sessionCookie);
    headers.append('Set-Cookie', clearStateCookie);
    
    return new Response(null, {
      status: 302,
      headers,
    });
  } catch (error) {
    console.error('❌ Auth0 callback error:', error);
    console.error('  Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('  Stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return redirect(
      `${baseUrl}/?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Authentication failed'
      )}`
    );
  }
};



