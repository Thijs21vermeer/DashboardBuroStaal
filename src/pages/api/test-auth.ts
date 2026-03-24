import type { APIRoute } from 'astro';
import { getAuthSecret } from '../../lib/config';
import { requireAuth } from '../../lib/api-auth';

export const GET: APIRoute = async (context) => {
  const { locals } = context;
  
  // SECURITY: Only allow in development, and only with authentication
  const isDevelopment = import.meta.env.DEV || 
                       import.meta.env.MODE === 'development';
  
  if (!isDevelopment) {
    return new Response(JSON.stringify({ 
      error: 'This endpoint is only available in development mode' 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Require authentication even in development
  const authResponse = await requireAuth(context);
  if (authResponse) return authResponse;

  const authSecret = getAuthSecret(locals);
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    authSecret: {
      exists: !!authSecret,
      length: authSecret ? authSecret.length : 0,
      // SECURITY: Don't expose if using default (removed isDefault check)
    },
    envVars: {
      JWT_SECRET: {
        exists: !!(import.meta.env.JWT_SECRET || locals?.runtime?.env?.JWT_SECRET)
      },
      AUTH_SECRET: {
        exists: !!(import.meta.env.AUTH_SECRET || locals?.runtime?.env?.AUTH_SECRET)
      }
    }
  };

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
