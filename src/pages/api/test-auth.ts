import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/api-auth';
import { getAdminSecret } from '../../lib/config';

/**
 * SECURITY: Auth testing endpoint - PROTECTED
 * 
 * Requirements:
 * 1. Must be in development mode (NODE_ENV !== 'production')
 * 2. Must be authenticated (valid session)
 * 3. Must provide correct ADMIN_SECRET header
 * 
 * This triple-protection prevents information disclosure in production.
 * 
 * REMOVED: Secret length exposure (aids brute force)
 * REMOVED: Default secret detection (aids misconfiguration exploitation)
 */
export const GET: APIRoute = async (context) => {
  const { locals, request } = context;
  
  // SECURITY LAYER 1: Development-only
  const isDevelopment = import.meta.env.DEV || 
                       import.meta.env.MODE === 'development' ||
                       process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    return new Response(JSON.stringify({ 
      error: 'Not found' 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // SECURITY LAYER 2: Require authentication
  const authResponse = await requireAuth(context);
  if (authResponse) return authResponse;

  // SECURITY LAYER 3: Require ADMIN_SECRET header
  const providedSecret = request.headers.get('X-Admin-Secret');
  const adminSecret = getAdminSecret(locals);
  
  if (!adminSecret) {
    return new Response(JSON.stringify({ 
      error: 'Admin secret not configured',
      hint: 'Set ADMIN_SECRET environment variable'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  if (!providedSecret || providedSecret !== adminSecret) {
    return new Response(JSON.stringify({ 
      error: 'Forbidden',
      hint: 'Provide X-Admin-Secret header'
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    nodeEnv: process.env.NODE_ENV,
    authentication: {
      status: 'valid',
      note: 'You are authenticated'
    },
    envVars: {
      JWT_SECRET: {
        exists: !!(import.meta.env.JWT_SECRET || locals?.runtime?.env?.JWT_SECRET)
      },
      AUTH_SECRET: {
        exists: !!(import.meta.env.AUTH_SECRET || locals?.runtime?.env?.AUTH_SECRET)
      },
      ADMIN_SECRET: {
        exists: !!adminSecret
      }
    },
    security: {
      note: 'This endpoint requires auth + ADMIN_SECRET',
      layers: ['development-only', 'authentication', 'admin-secret']
    }
  };

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
