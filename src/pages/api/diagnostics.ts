import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db-config';
import { requireAuth } from '../../lib/api-auth';
import { getAdminSecret } from '../../lib/config';

/**
 * SECURITY: Diagnostic endpoint - PROTECTED
 * 
 * Requirements:
 * 1. Must be in development mode (NODE_ENV !== 'production')
 * 2. Must be authenticated (valid session)
 * 3. Must provide correct ADMIN_SECRET header
 * 
 * This triple-protection prevents information disclosure in production.
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

  try {
    // Type-safe runtime access
    const runtime = (locals as any)?.runtime;
    
    // Check environment variables (SAFE: only boolean presence)
    const envCheck = {
      JWT_SECRET: !!import.meta.env.JWT_SECRET || !!(runtime?.env?.JWT_SECRET),
      AZURE_SQL_SERVER: !!import.meta.env.AZURE_SQL_SERVER || !!(runtime?.env?.AZURE_SQL_SERVER),
      AZURE_SQL_DATABASE: !!import.meta.env.AZURE_SQL_DATABASE || !!(runtime?.env?.AZURE_SQL_DATABASE),
      AZURE_SQL_USER: !!import.meta.env.AZURE_SQL_USER || !!(runtime?.env?.AZURE_SQL_USER),
      AZURE_SQL_PASSWORD: !!import.meta.env.AZURE_SQL_PASSWORD || !!(runtime?.env?.AZURE_SQL_PASSWORD),
      ADMIN_SECRET: !!adminSecret,
      
      // Platform info (safe in dev)
      platform: import.meta.env.MODE,
      nodeEnv: process.env.NODE_ENV,
      hasLocals: !!locals,
      hasRuntime: !!runtime,
      hasEnv: !!(runtime?.env),
    };

    // Test database connection
    let dbStatus = 'not_tested';
    let dbError: string | null = null;
    
    try {
      const dbPool = await getPool(locals);
      const result = await dbPool.request().query('SELECT 1 as test');
      dbStatus = 'connected';
    } catch (error) {
      const err = error as Error;
      console.error('[DIAGNOSTICS] Database connection test failed:', err.message);
      dbStatus = 'failed';
      // SECURITY: Generic error message only (no stack trace)
      dbError = 'Connection failed - check server logs for details';
    }

    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE,
        nodeEnv: process.env.NODE_ENV,
        environmentVariables: envCheck,
        database: {
          status: dbStatus,
          ...(dbError && { error: dbError })
        },
        security: {
          note: 'This endpoint requires auth + ADMIN_SECRET',
          layers: ['development-only', 'authentication', 'admin-secret']
        }
      }, null, 2),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    const err = error as Error;
    console.error('[DIAGNOSTICS] Endpoint error:', err);
    
    // SECURITY: NEVER expose stack traces to client
    return new Response(
      JSON.stringify({
        error: 'Diagnostics failed',
        message: 'Internal error - check server logs',
        timestamp: new Date().toISOString()
      }, null, 2),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
