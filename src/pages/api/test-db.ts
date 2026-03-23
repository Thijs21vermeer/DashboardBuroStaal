import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db-config';
import { validateDatabaseConfig, getDatabaseConfig } from '../../lib/config';

export const GET: APIRoute = async ({ locals }) => {
  const dbConfig = getDatabaseConfig(locals);
  const validation = validateDatabaseConfig(locals);
  
  const results: any = {
    timestamp: new Date().toISOString(),
    configValidation: validation,
    configValues: {
      server: dbConfig.server,
      database: dbConfig.database,
      user: dbConfig.user,
      hasPassword: !!dbConfig.password,
      passwordLength: dbConfig.password?.length || 0,
      port: dbConfig.port,
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
    
    // Test query
    const result = await pool.request().query('SELECT TOP 1 * FROM kennisitems ORDER BY id DESC');
    results.query.status = 'success';
    results.query.data = {
      rowCount: result.recordset.length,
      sample: result.recordset[0] || null,
    };
  } catch (error) {
    results.connection.status = 'failed';
    results.connection.error = error instanceof Error ? error.message : String(error);
    
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
