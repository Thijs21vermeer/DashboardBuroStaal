import sql from 'mssql';
import { getDatabaseConfig, validateDatabaseConfig } from './config';

// Connection pool (singleton)
let pool: sql.ConnectionPool | null = null;

/**
 * Get or create database connection pool
 * IMPORTANT: Always pass locals from API context for Netlify compatibility
 */
export async function getPool(locals?: any): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) {
    return pool;
  }

  try {
    const config = getDatabaseConfig(locals);
    
    // Validate config
    const validation = validateDatabaseConfig(locals);
    if (!validation.valid) {
      throw new Error(`Missing database configuration: ${validation.missing.join(', ')}`);
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
