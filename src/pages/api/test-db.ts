import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/api-auth';
import { getDatabaseInfo, getAll } from '../../lib/turso-db';

/**
 * Database Test Endpoint
 * Tests Turso database connection and lists tables with row counts
 */
export const GET: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;

  try {
    console.log('🔍 Testing Turso database connection...');
    
    // Get database info
    const dbInfo = await getDatabaseInfo(locals);
    
    if (!dbInfo.connected) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database connection failed',
        details: dbInfo.error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Turso database connected');
    console.log('📊 Tables found:', dbInfo.tables);
    
    // Get sample data from each table
    const samples: Record<string, any[]> = {};
    for (const tableName of dbInfo.tables) {
      if (!tableName.startsWith('sqlite_')) {
        try {
          const rows = await getAll(tableName, { limit: 3 }, locals);
          samples[tableName] = rows;
        } catch (error) {
          samples[tableName] = [];
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      database: 'Turso (LibSQL)',
      tables: dbInfo.tables,
      counts: dbInfo.counts,
      samples,
      message: 'Database connection successful'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

