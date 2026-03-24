import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db-config';
import { validateDatabaseConfig } from '../../lib/config';
import { requireAuth } from '../../lib/api-auth';
import { getAdminSecret } from '../../lib/config';

/**
 * SECURITY: Database testing endpoint - PROTECTED
 * 
 * Requirements:
 * 1. Must be in development mode (NODE_ENV !== 'production')
 * 2. Must be authenticated (valid session)
 * 3. Must provide correct ADMIN_SECRET header
 * 
 * This triple-protection prevents information disclosure in production.
 * 
 * REMOVED: Password length exposure
 * REMOVED: Actual error messages (replaced with generic ones)
 * REMOVED: Sample data from database
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

  const validation = validateDatabaseConfig(locals);
  
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    nodeEnv: process.env.NODE_ENV,
    configValidation: {
      valid: validation.valid,
      // SECURITY: Only expose WHICH fields are missing, not their values
      missingFields: validation.missing
    },
    // SECURITY: Only boolean presence checks
    configStatus: {
      hasServer: validation.valid && validation.config.server !== '',
      hasDatabase: validation.valid && validation.config.database !== '',
      hasUser: validation.valid && validation.config.user !== '',
      hasPassword: validation.valid && validation.config.password !== '',
    },
    connection: {
      status: 'unknown',
      error: null as string | null,
    },
    query: {
      status: 'unknown',
      error: null as string | null,
      tableExists: false,
    },
    security: {
      note: 'This endpoint requires auth + ADMIN_SECRET',
      layers: ['development-only', 'authentication', 'admin-secret']
    }
  };

  // Test connection
  try {
    const pool = await getPool(locals);
    results.connection.status = pool.connected ? 'connected' : 'disconnected';
    
    // Test if table exists (without exposing data)
    const result = await pool.request().query('SELECT COUNT(*) as count FROM kennisitems');
    results.query.status = 'success';
    results.query.tableExists = true;
    results.query.rowCount = result.recordset[0]?.count || 0;
    
  } catch (error) {
    const err = error as Error;
    console.error('[TEST-DB] Connection error:', err.message);
    
    results.connection.status = 'failed';
    // SECURITY: Generic error message only (no details)
    results.connection.error = 'Connection failed - check server logs for details';
    
    return new Response(JSON.stringify(results, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
