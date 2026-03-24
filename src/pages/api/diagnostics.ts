import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db-config';
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

  try {
    // Type-safe runtime access (may not exist in all environments)
    const runtime = (locals as any)?.runtime;
    
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      // SECURITY: Only return boolean presence, no values
      JWT_SECRET: !!import.meta.env.JWT_SECRET || !!(runtime?.env?.JWT_SECRET),
      AZURE_SQL_SERVER: !!import.meta.env.AZURE_SQL_SERVER || !!(runtime?.env?.AZURE_SQL_SERVER),
      AZURE_SQL_DATABASE: !!import.meta.env.AZURE_SQL_DATABASE || !!(runtime?.env?.AZURE_SQL_DATABASE),
      AZURE_SQL_USER: !!import.meta.env.AZURE_SQL_USER || !!(runtime?.env?.AZURE_SQL_USER),
      AZURE_SQL_PASSWORD: !!import.meta.env.AZURE_SQL_PASSWORD || !!(runtime?.env?.AZURE_SQL_PASSWORD),
      
      // Platform info (safe to expose in dev)
      platform: import.meta.env.MODE,
      hasLocals: !!locals,
      hasRuntime: !!runtime,
      hasEnv: !!(runtime?.env),
    };

    // Test database connection
    let dbStatus = 'not_tested';
    let dbError = null;
    try {
      const dbPool = await getPool(locals);
      const result = await dbPool.request().query('SELECT 1 as test');
      dbStatus = 'connected';
    } catch (error) {
      const err = error as Error;
      console.error('Database connection test failed:', err);
      dbStatus = 'failed';
      // SECURITY: Don't expose full error message in production
      dbError = isDevelopment ? err.message : 'Connection failed';
    }

    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE,
        environmentVariables: envCheck,
        database: {
          status: dbStatus,
          ...(dbError && { error: dbError })
        },
      }, null, 2),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    const err = error as Error;
    return new Response(
      JSON.stringify({
        error: 'Diagnostics failed',
        // SECURITY: Don't expose stack traces in production
        message: isDevelopment ? err.message : 'Internal error',
        ...(isDevelopment && { stack: err.stack })
      }, null, 2),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
