/**
 * Turso Database Connection
 * LibSQL client for serverless SQLite database
 */

import { createClient, type Client, type ResultSet } from '@libsql/client';
import type { APIContext } from 'astro';
import { getEnvVar } from './config';

let cachedClient: Client | null = null;

/**
 * Get or create Turso client
 */
export function getTursoClient(locals?: APIContext['locals']): Client {
  // In development, reuse client
  // In production (Cloudflare/Netlify), create per request
  if (cachedClient && import.meta.env.DEV) {
    return cachedClient;
  }

  const url = getEnvVar('TURSO_DATABASE_URL', locals);
  const authToken = getEnvVar('TURSO_AUTH_TOKEN', locals);

  if (!url || !authToken) {
    throw new Error('Turso credentials not configured. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.');
  }

  const client = createClient({
    url,
    authToken,
  });

  if (import.meta.env.DEV) {
    cachedClient = client;
  }

  return client;
}

/**
 * Execute a single SQL query with parameters
 */
export async function executeQuery(
  sql: string,
  args: any[] = [],
  locals?: APIContext['locals']
): Promise<ResultSet> {
  const client = getTursoClient(locals);
  
  try {
    return await client.execute({
      sql,
      args,
    });
  } catch (error) {
    console.error('Turso query error:', error);
    console.error('SQL:', sql);
    console.error('Args:', args);
    throw error;
  }
}

/**
 * Execute multiple SQL statements in a transaction
 */
export async function executeTransaction(
  statements: Array<{ sql: string; args?: any[] }>,
  locals?: APIContext['locals']
): Promise<ResultSet[]> {
  const client = getTursoClient(locals);
  
  try {
    const results: ResultSet[] = [];
    
    await client.execute('BEGIN');
    
    for (const stmt of statements) {
      const result = await client.execute({
        sql: stmt.sql,
        args: stmt.args || [],
      });
      results.push(result);
    }
    
    await client.execute('COMMIT');
    
    return results;
  } catch (error) {
    await client.execute('ROLLBACK');
    console.error('Turso transaction error:', error);
    throw error;
  }
}

/**
 * Get a single row by ID
 */
export async function getById(
  table: string,
  id: number,
  locals?: APIContext['locals']
): Promise<any | null> {
  const result = await executeQuery(
    `SELECT * FROM ${table} WHERE id = ? LIMIT 1`,
    [id],
    locals
  );
  
  return result.rows[0] || null;
}

/**
 * Get all rows from a table with optional filtering
 */
export async function getAll(
  table: string,
  options: {
    where?: string;
    args?: any[];
    orderBy?: string;
    limit?: number;
    offset?: number;
  } = {},
  locals?: APIContext['locals']
): Promise<any[]> {
  let sql = `SELECT * FROM ${table}`;
  const args = options.args || [];
  
  if (options.where) {
    sql += ` WHERE ${options.where}`;
  }
  
  if (options.orderBy) {
    sql += ` ORDER BY ${options.orderBy}`;
  }
  
  if (options.limit) {
    sql += ` LIMIT ?`;
    args.push(options.limit);
  }
  
  if (options.offset) {
    sql += ` OFFSET ?`;
    args.push(options.offset);
  }
  
  const result = await executeQuery(sql, args, locals);
  return result.rows as any[];
}

/**
 * Insert a new row
 */
export async function insert(
  table: string,
  data: Record<string, any>,
  locals?: APIContext['locals']
): Promise<number> {
  const columns = Object.keys(data);
  const placeholders = columns.map(() => '?').join(', ');
  const values = Object.values(data);
  
  const sql = `
    INSERT INTO ${table} (${columns.join(', ')})
    VALUES (${placeholders})
  `;
  
  const result = await executeQuery(sql, values, locals);
  return Number(result.lastInsertRowid);
}

/**
 * Update a row by ID
 */
export async function update(
  table: string,
  id: number,
  data: Record<string, any>,
  locals?: APIContext['locals']
): Promise<boolean> {
  const columns = Object.keys(data);
  const setClause = columns.map(col => `${col} = ?`).join(', ');
  const values = [...Object.values(data), id];
  
  const sql = `
    UPDATE ${table}
    SET ${setClause}, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  const result = await executeQuery(sql, values, locals);
  return result.rowsAffected > 0;
}

/**
 * Delete a row by ID
 */
export async function deleteById(
  table: string,
  id: number,
  locals?: APIContext['locals']
): Promise<boolean> {
  const result = await executeQuery(
    `DELETE FROM ${table} WHERE id = ?`,
    [id],
    locals
  );
  
  return result.rowsAffected > 0;
}

/**
 * Count rows in a table
 */
export async function count(
  table: string,
  where?: string,
  args?: any[],
  locals?: APIContext['locals']
): Promise<number> {
  let sql = `SELECT COUNT(*) as count FROM ${table}`;
  
  if (where) {
    sql += ` WHERE ${where}`;
  }
  
  const result = await executeQuery(sql, args, locals);
  return Number((result.rows[0] as any).count);
}

/**
 * Search across text fields
 */
export async function search(
  table: string,
  searchTerm: string,
  fields: string[],
  options: {
    orderBy?: string;
    limit?: number;
    offset?: number;
  } = {},
  locals?: APIContext['locals']
): Promise<any[]> {
  const conditions = fields.map(field => `${field} LIKE ?`).join(' OR ');
  const searchPattern = `%${searchTerm}%`;
  const args = fields.map(() => searchPattern);
  
  let sql = `SELECT * FROM ${table} WHERE ${conditions}`;
  
  if (options.orderBy) {
    sql += ` ORDER BY ${options.orderBy}`;
  }
  
  if (options.limit) {
    sql += ` LIMIT ?`;
    args.push(options.limit);
  }
  
  if (options.offset) {
    sql += ` OFFSET ?`;
    args.push(options.offset);
  }
  
  const result = await executeQuery(sql, args, locals);
  return result.rows as any[];
}

/**
 * Test database connection
 */
export async function testConnection(locals?: APIContext['locals']): Promise<boolean> {
  try {
    await executeQuery('SELECT 1', [], locals);
    return true;
  } catch (error) {
    console.error('Turso connection test failed:', error);
    return false;
  }
}

/**
 * Get database info
 */
export async function getDatabaseInfo(locals?: APIContext['locals']): Promise<any> {
  try {
    const tables = await executeQuery(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      [],
      locals
    );
    
    const info: any = {
      connected: true,
      tables: tables.rows.map((r: any) => r.name),
      counts: {},
    };
    
    // Get row count for each table
    for (const table of info.tables) {
      if (table.name && !table.name.startsWith('sqlite_')) {
        const countResult = await count(table.name, undefined, undefined, locals);
        info.counts[table.name] = countResult;
      }
    }
    
    return info;
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
