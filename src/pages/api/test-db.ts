import type { APIRoute } from 'astro';
import { getPool, query } from '../../lib/azure-db';
import { validateDatabaseConfig, DB_CONFIG } from '../../lib/config';

export const GET: APIRoute = async ({ locals }) => {
  const results: any = {
    timestamp: new Date().toISOString(),
    configValidation: validateDatabaseConfig(),
    configValues: {
      server: DB_CONFIG.server,
      database: DB_CONFIG.database,
      user: DB_CONFIG.user,
      hasPassword: !!DB_CONFIG.password,
      passwordLength: DB_CONFIG.password?.length || 0,
      port: DB_CONFIG.port,
    },
    connection: {
      status: 'unknown',
      error: null as string | null,
    },
    query: {
      status: 'unknown',
      error: null as string | null,
      data: null as any,
    },
  };

  // Test connection
  try {
    const pool = await getPool(locals);
    results.connection.status = pool.connected ? 'connected' : 'disconnected';
  } catch (error) {
    results.connection.status = 'failed';
    results.connection.error = error instanceof Error ? error.message : String(error);
    
    return new Response(JSON.stringify(results, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Test query
  try {
    const testQuery = 'SELECT TOP 1 * FROM kennisitems ORDER BY id DESC';
    const data = await query(testQuery);
    results.query.status = 'success';
    results.query.data = {
      rowCount: data.length,
      sample: data[0] || null,
    };
  } catch (error) {
    results.query.status = 'failed';
    results.query.error = error instanceof Error ? error.message : String(error);
  }

  return new Response(JSON.stringify(results, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

