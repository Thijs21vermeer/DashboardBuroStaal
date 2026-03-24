import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db-config';
import { validateDatabaseConfig } from '../../lib/config';
import { requireAuth } from '../../lib/api-auth';

export const GET: APIRoute = async (context) => {
  const { locals, request } = context;
  
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

  const validation = validateDatabaseConfig(locals);
  
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE,
    configValidation: validation,
    // SECURITY: Never expose actual config values
    configStatus: {
      hasServer: validation.valid && validation.config.server !== '',
      hasDatabase: validation.valid && validation.config.database !== '',
      hasUser: validation.valid && validation.config.user !== '',
      hasPassword: validation.valid && validation.config.password !== '',
      // DO NOT expose password length - removed
    },
    connection: {
      status: 'unknown',
      error: null as string | null,
    },
    query: {
      status: 'unknown',
      error: null as string | null,
      // SECURITY: Never expose actual data
      tableExists: false,
    },
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
    // SECURITY: NO sample data returned
  } catch (error) {
    results.connection.status = 'failed';
    results.connection.error = error instanceof Error 
      ? 'Connection failed (details hidden for security)' 
      : 'Unknown error';
    
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
