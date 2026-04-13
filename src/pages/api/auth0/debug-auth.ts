/**
 * Auth0 Debug Endpoint
 * 
 * Test de Auth0 configuratie en toon wat er wordt verstuurd
 */

import type { APIRoute } from 'astro';
import { getAuth0Config, getAuthorizationUrl } from '../../../lib/auth0-config';
import { generateState } from '../../../lib/auth0-session';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const config = getAuth0Config(locals);
    const state = generateState();
    const authUrl = getAuthorizationUrl(config, state);
    
    // Parse de URL om de parameters te tonen
    const url = new URL(authUrl);
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        config: {
          domain: config.domain,
          clientId: config.clientId,
          redirectUri: config.redirectUri,
          scope: config.scope,
          hasAudience: !!config.audience,
          hasOrganization: !!config.organization,
        },
        authUrl,
        authParams: params,
        organizationInfo: config.organization 
          ? `Organization ID: ${config.organization}`
          : 'No organization configured (this might be the issue if Auth0 requires it)',
      }, null, 2),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }, null, 2),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
