import type { APIRoute } from 'astro';
import { getTursoClient } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const client = getTursoClient(locals);
    
    // Get schema for all tables
    const tables = ['KennisItems', 'Cases', 'Trends', 'Nieuws'];
    const schemas: any = {};
    
    for (const table of tables) {
      const result = await client.execute(`PRAGMA table_info(${table})`);
      schemas[table] = result.rows.map((row: any) => ({
        name: row.name,
        type: row.type,
        notNull: row.notnull,
        defaultValue: row.dflt_value,
      }));
    }
    
    return new Response(JSON.stringify(schemas, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching schema:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
