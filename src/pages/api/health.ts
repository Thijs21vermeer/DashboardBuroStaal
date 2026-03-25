import type { APIRoute } from 'astro';
import { testConnection } from '../../lib/turso-db';

/**
 * SECURITY: Minimal health check endpoint
 * 
 * Public endpoint for load balancers and monitoring tools.
 * Returns ONLY the minimum information needed:
 * - Is the service running? (always yes if this returns)
 * - Is it healthy? (can it connect to critical dependencies)
 * - When was it checked?
 * 
 * REMOVED for security:
 * ❌ Which services are configured (reconnaissance)
 * ❌ Which env vars are set (configuration disclosure)
 * ❌ Specific error messages (infrastructure details)
 * ❌ Authentication status (helps attackers)
 * ❌ Database connection details (infrastructure)
 * 
 * Standard health check format:
 * - 200 OK = Healthy (all critical services working)
 * - 503 Service Unavailable = Unhealthy (critical service down)
 */
export const GET: APIRoute = async ({ locals }) => {
  let isHealthy = false;
  
  try {
    // Test critical dependencies (database)
    // If this fails, the app cannot function
    isHealthy = await testConnection(locals);
  } catch (error) {
    // Log detailed error server-side only
    console.error('[HEALTH] Critical dependency check failed:', error);
    isHealthy = false;
  }
  
  // Minimal response - only status + timestamp
  const response = {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString()
  };
  
  return new Response(
    JSON.stringify(response),
    {
      status: isHealthy ? 200 : 503,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff'
      }
    }
  );
};

