import sql from 'mssql';
import { DB_CONFIG } from './config';

// Connection pool (singleton)
let pool: sql.ConnectionPool | null = null;

/**
 * Get database configuration at runtime
 * This ensures environment variables are available from locals in Netlify
 */
function getDbConfig(locals?: any) {
  // Try to get from locals.runtime.env (Netlify/Cloudflare)
  const server = locals?.runtime?.env?.AZURE_SQL_SERVER || import.meta.env.AZURE_SQL_SERVER || 'dashboardbs.database.windows.net';
  const database = locals?.runtime?.env?.AZURE_SQL_DATABASE || import.meta.env.AZURE_SQL_DATABASE || 'dashboarddb';
  const user = locals?.runtime?.env?.AZURE_SQL_USER || import.meta.env.AZURE_SQL_USER || 'databasedashboard';
  const password = locals?.runtime?.env?.AZURE_SQL_PASSWORD || import.meta.env.AZURE_SQL_PASSWORD || '';
  const port = parseInt(locals?.runtime?.env?.AZURE_SQL_PORT || import.meta.env.AZURE_SQL_PORT || '1433', 10);

  return {
    server,
    database,
    user,
    password,
    port
  };
}

/**
 * Get or create database connection pool
 */
export async function getPool(locals?: any): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }

  try {
    const config = getDbConfig(locals);
    
    // Validate config
    if (!config.server || !config.database || !config.user || !config.password) {
      const missing = [];
      if (!config.server) missing.push('AZURE_SQL_SERVER');
      if (!config.database) missing.push('AZURE_SQL_DATABASE');
      if (!config.user) missing.push('AZURE_SQL_USER');
      if (!config.password) missing.push('AZURE_SQL_PASSWORD');
      
      throw new Error(`Missing database configuration: ${missing.join(', ')}`);
    }

    pool = await sql.connect({
      server: config.server,
      database: config.database,
      user: config.user,
      password: config.password,
      port: config.port,
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    });

    console.log('✅ Database connected successfully');
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export function handleDbError(error: unknown, context: string) {
  console.error(`Error in ${context}:`, error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return new Response(JSON.stringify({ 
    error: `Failed to ${context}`,
    details: errorMessage,
    hint: 'Check database connection and Netlify environment variables'
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}



