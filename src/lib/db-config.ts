import sql from 'mssql';
import { DB_CONFIG, getEnvVar } from './config';

/**
 * Get database configuration
 * Works for both server-side and Cloudflare Workers contexts
 */
export function getDbConfig(locals?: any): sql.config {
  const password = getEnvVar('AZURE_SQL_PASSWORD', locals);
  
  if (!password) {
    throw new Error('AZURE_SQL_PASSWORD is not configured');
  }

  return {
    server: getEnvVar('AZURE_SQL_SERVER', locals) || DB_CONFIG.server,
    database: getEnvVar('AZURE_SQL_DATABASE', locals) || DB_CONFIG.database,
    user: getEnvVar('AZURE_SQL_USER', locals) || DB_CONFIG.user,
    password,
    port: parseInt(getEnvVar('AZURE_SQL_PORT', locals) || String(DB_CONFIG.port), 10),
    options: {
      encrypt: true,
      trustServerCertificate: false,
      connectTimeout: 30000,
      requestTimeout: 30000,
    }
  };
};

let pool: sql.ConnectionPool | null = null;

export async function getPool() {
  if (!pool) {
    try {
      const config = getDbConfig();
      pool = await sql.connect(config);
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }
  return pool;
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


