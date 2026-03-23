import type { APIRoute } from 'astro';
import { getAuthSecret } from '../../lib/config';

export const GET: APIRoute = async ({ locals }) => {
  const authSecret = getAuthSecret(locals);
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    authSecret: {
      exists: !!authSecret,
      length: authSecret ? authSecret.length : 0,
      isDefault: authSecret === 'burostaal-secret-key-change-in-production',
      source: 'from getAuthSecret(locals)'
    },
    envVars: {
      JWT_SECRET: {
        fromImportMeta: !!import.meta.env.JWT_SECRET,
        fromLocals: !!locals?.runtime?.env?.JWT_SECRET,
        exists: !!(import.meta.env.JWT_SECRET || locals?.runtime?.env?.JWT_SECRET)
      },
      AUTH_SECRET: {
        fromImportMeta: !!import.meta.env.AUTH_SECRET,
        fromLocals: !!locals?.runtime?.env?.AUTH_SECRET,
        exists: !!(import.meta.env.AUTH_SECRET || locals?.runtime?.env?.AUTH_SECRET)
      }
    },
    platform: import.meta.env.PROD ? 'production' : 'development'
  };

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

