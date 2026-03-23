import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db-config';

export const GET: APIRoute = async () => {
  try {
    // Probeer verbinding te maken
    const pool = await getPool();
    
    // Probeer een simpele query
    const result = await pool.request().query('SELECT 1 AS test');
    
    // Als we hier komen, werkt de connectie!
    return new Response(JSON.stringify({
      success: true,
      message: '✅ Database connectie werkt!',
      serverInfo: {
        connected: true,
        testQuery: result.recordset[0]
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    // Er is een fout opgetreden
    console.error('Database connection error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: '❌ Database connectie mislukt',
      error: error.message || 'Unknown error',
      details: {
        code: error.code,
        state: error.state,
        server: import.meta.env.AZURE_SQL_SERVER || process.env.AZURE_SQL_SERVER,
        database: import.meta.env.AZURE_SQL_DATABASE || process.env.AZURE_SQL_DATABASE,
        user: import.meta.env.AZURE_SQL_USER || process.env.AZURE_SQL_USER
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

