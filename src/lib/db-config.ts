import sql from 'mssql';

export const getDbConfig = (): sql.config => {
  const password = import.meta.env.AZURE_SQL_PASSWORD;
  
  if (!password) {
    throw new Error(
      '❌ AZURE_SQL_PASSWORD environment variable is required. ' +
      'Please set it in your Netlify environment variables or .env file.'
    );
  }

  return {
    server: import.meta.env.AZURE_SQL_SERVER || 'dashboardbs.database.windows.net',
    database: import.meta.env.AZURE_SQL_DATABASE || 'dashboarddb',
    user: import.meta.env.AZURE_SQL_USER || 'databasedashboard',
    password: password,
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

