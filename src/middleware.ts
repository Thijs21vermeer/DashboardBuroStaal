
// Load environment variables in development
import './env-init';

import type {MiddlewareHandler} from 'astro';
import { getAuth0Config } from './lib/auth0-config';
import { getSession, isSessionExpired } from './lib/auth0-session';

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const {request, locals} = ctx;
  const url = new URL(request.url);

  // Auth0 session handling - maak user beschikbaar in locals
  try {
    const config = getAuth0Config(locals);
    // Check Auth0 session
    const session = await getSession(request, config.cookieName, config.cookieSecret);
    if (session && !isSessionExpired(session)) {
      // Voeg user toe aan locals voor gebruik in pages/components
      locals.user = session.user;
      locals.auth0Session = session;
    }
  } catch (error) {
    // Session check failed, continue without user
    console.warn('⚠️ Failed to check Auth0 session');
  }

  if (import.meta.env.DEV && url.pathname === '/-wf/ready') {
    const resHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return new Response(JSON.stringify({ready: true}), {
      headers: resHeaders,
    });
  }

  return next();
};



