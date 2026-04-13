/**
 * Test Cookie Endpoint
 * 
 * Test of cookies correct worden ingesteld en gelezen
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  // Lees alle cookies
  const cookies = request.headers.get('cookie');
  const cookieMap = cookies
    ? Object.fromEntries(
        cookies.split('; ').map(c => {
          const [key, ...values] = c.split('=');
          return [key, values.join('=')];
        })
      )
    : {};

  // Zoek naar auth0_session cookie
  const hasAuth0Session = 'auth0_session' in cookieMap;
  const sessionValue = cookieMap['auth0_session'];

  return new Response(
    JSON.stringify({
      hasAuth0SessionCookie: hasAuth0Session,
      sessionCookieLength: sessionValue?.length || 0,
      sessionCookiePreview: sessionValue?.substring(0, 50) + '...',
      allCookieNames: Object.keys(cookieMap),
      totalCookies: Object.keys(cookieMap).length,
      rawCookieHeader: cookies,
    }, null, 2),
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
};
