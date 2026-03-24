import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db-config';
import { getEnvVar } from '../../lib/config';

export const GET: APIRoute = async ({ locals }) => {
  let dbStatus = 'unknown';
  
  // Test database connection
  try {
    const dbPool = await getPool(locals);
    await dbPool.request().query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    console.error('Health check - database connection failed:', error);
    dbStatus = 'failed';
  }
  
  // SECURITY: Only expose minimal necessary information
  // Don't expose specific missing env vars to prevent reconnaissance
  const hasAllDbConfig = !!(
    getEnvVar('AZURE_SQL_SERVER', locals) &&
    getEnvVar('AZURE_SQL_DATABASE', locals) &&
    getEnvVar('AZURE_SQL_USER', locals) &&
    getEnvVar('AZURE_SQL_PASSWORD', locals)
  );
  
  const hasAuthConfig = !!(
    getEnvVar('JWT_SECRET', locals) || 
    getEnvVar('AUTH_SECRET', locals)
  );
  
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        authentication: hasAuthConfig ? 'configured' : 'not_configured',
      },
      // Only in development: show more details
      ...(import.meta.env.DEV && {
        debug: {
          databaseConfig: hasAllDbConfig ? 'complete' : 'incomplete',
          environment: import.meta.env.MODE,
        }
      })
    }),
    {
      status: dbStatus === 'connected' && hasAuthConfig ? 200 : 503,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  );
};
