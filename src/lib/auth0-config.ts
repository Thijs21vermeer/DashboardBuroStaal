
/**
 * Auth0 Configuration
 * 
 * Deze configuratie haalt Auth0 credentials uit environment variables
 * en ondersteunt zowel Cloudflare Workers als Netlify Functions.
 */

interface Auth0Config {
  domain: string;
  clientId: string;
  clientSecret: string;
  audience?: string;
  scope: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  cookieSecret: string;
  cookieName: string;
}

/**
 * Haal een environment variable op (met Netlify/Cloudflare support)
 */
function getEnvVar(key: string, locals?: any, required = true): string {
  // Try locals.runtime.env first (Netlify/Cloudflare)
  let value = locals?.runtime?.env?.[key];
  
  // Fallback to import.meta.env
  if (!value) {
    value = import.meta.env?.[key];
  }
  
  // Fallback to process.env (development)
  if (!value && typeof process !== 'undefined') {
    value = process.env[key];
  }
  
  if (required && !value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  
  return value || '';
}

/**
 * Get Auth0 configuration
 */
export function getAuth0Config(locals?: any): Auth0Config {
  const domain = getEnvVar('AUTH0_DOMAIN', locals);
  const clientId = getEnvVar('AUTH0_CLIENT_ID', locals);
  const clientSecret = getEnvVar('AUTH0_CLIENT_SECRET', locals);
  const appOrigin = getEnvVar('APP_ORIGIN', locals).replace(/\/$/, ''); // Remove trailing slash
  
  // Cookie secret (gebruik JWT_SECRET als fallback)
  const cookieSecret = getEnvVar('COOKIE_SECRET', locals, false) || 
                      getEnvVar('JWT_SECRET', locals);

  return {
    domain,
    clientId,
    clientSecret,
    audience: getEnvVar('AUTH0_AUDIENCE', locals, false),
    scope: 'openid profile email',
    redirectUri: `${appOrigin}/api/auth0/callback`,
    postLogoutRedirectUri: `${appOrigin}/`,
    cookieSecret,
    cookieName: 'auth0_session',
  };
}

/**
 * Generate Auth0 authorization URL
 */
export function getAuthorizationUrl(config: Auth0Config, state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state,
    ...(config.audience && { audience: config.audience }),
  });

  return `https://${config.domain}/authorize?${params.toString()}`;
}

/**
 * Generate Auth0 logout URL
 */
export function getLogoutUrl(config: Auth0Config): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    returnTo: config.postLogoutRedirectUri,
  });

  return `https://${config.domain}/v2/logout?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  config: Auth0Config,
  code: string
): Promise<{
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}> {
  const response = await fetch(`https://${config.domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${error}`);
  }

  return response.json();
}

/**
 * Get user info from Auth0
 */
export async function getUserInfo(
  config: Auth0Config,
  accessToken: string
): Promise<{
  sub: string;
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}> {
  const response = await fetch(`https://${config.domain}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}

