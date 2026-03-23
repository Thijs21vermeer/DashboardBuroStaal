import sql from 'mssql';
import { DB_CONFIG, getEnvVar } from './config';

/**
 * Database configuration
 */
const config: sql.config = {
  server: DB_CONFIG.server,
  database: DB_CONFIG.database,
  user: DB_CONFIG.user,
  password: DB_CONFIG.password,
  port: DB_CONFIG.port,
  options: {
    encrypt: true, // Verplicht voor Azure
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
  pool: {
    max: 50,
    min: 5,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;
let connecting: Promise<sql.ConnectionPool> | null = null;

/**
 * Krijg de database connection pool (met singleton pattern)
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  // Als er al een actieve pool is, gebruik die
  if (pool && pool.connected) {
    return pool;
  }

  // Als er al een connectie bezig is, wacht daarop
  if (connecting) {
    return connecting;
  }

  // Start een nieuwe connectie
  connecting = sql.connect(config);
  
  try {
    pool = await connecting;
    connecting = null;
    
    // Error handlers
    pool.on('error', (err) => {
      console.error('Database pool error:', err);
      pool = null;
    });

    return pool;
  } catch (error) {
    connecting = null;
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

/**
 * Voer een query uit
 */
export async function query<T = any>(queryString: string, params?: Record<string, any>): Promise<T[]> {
  let request;
  try {
    const dbPool = await getPool();
    request = dbPool.request();

    // Parameters toevoegen als ze er zijn
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.query(queryString);
    return result.recordset as T[];
  } catch (error: any) {
    console.error('Database query error:', error);
    
    // Reset pool alleen bij connection errors
    if (error?.code === 'ECONNRESET' || error?.code === 'ESOCKET' || error?.code === 'ETIMEOUT') {
      console.log('Connection error detected, resetting pool');
      if (pool) {
        try {
          await pool.close();
        } catch (e) {
          // Ignore close errors
        }
        pool = null;
        connecting = null;
      }
    }
    
    throw error;
  } finally {
    // Cleanup request
    if (request) {
      try {
        request.cancel();
      } catch (e) {
        // Ignore cancel errors
      }
    }
  }
}

/**
 * Voer een query uit die één rij teruggeeft
 */
export async function queryOne<T = any>(queryString: string, params?: Record<string, any>): Promise<T | null> {
  const results = await query<T>(queryString, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * Sluit de database connectie (gebruik bij shutdown)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.close();
    } catch (error) {
      console.error('Error closing pool:', error);
    }
    pool = null;
  }
  connecting = null;
}

// Types voor de database tabellen
export interface KennisItem {
  id: number;
  titel: string;
  type: string;
  tags: string; // JSON string
  gekoppeld_project?: string;
  eigenaar: string;
  samenvatting?: string;
  inhoud?: string;
  media_type?: string;
  media_url?: string;
  video_link?: string;
  datum_toegevoegd: Date;
  laatst_bijgewerkt: Date;
  views: number;
  featured: boolean;
}

export interface Case {
  id: number;
  titel: string;
  klant: string;
  industrie?: string;
  uitdaging?: string;
  oplossing?: string;
  resultaten?: string; // JSON string
  referenties?: string; // JSON string
  tags?: string; // JSON string
  eigenaar?: string;
  project_duur?: string;
  team_size?: string;
  roi?: string;
  datum_toegevoegd: Date;
  laatst_bijgewerkt: Date;
  featured: boolean;
  image_url?: string;
}

export interface Trend {
  id: number;
  titel: string;
  categorie: string;
  beschrijving?: string;
  relevantie?: string;
  impact?: string;
  bronnen?: string; // JSON string
  tags?: string; // JSON string
  eigenaar?: string;
  datum_toegevoegd: Date;
  laatst_bijgewerkt: Date;
  featured: boolean;
}

export interface Nieuws {
  id: number;
  titel: string;
  categorie: string;
  inhoud?: string;
  auteur?: string;
  datum: Date;
  featured: boolean;
  tags?: string; // JSON string
}

export interface TeamMember {
  id: number;
  naam: string;
  rol: string;
  expertise?: string; // JSON string
  bio?: string;
  email?: string;
  linkedin?: string;
  avatar_url?: string;
  is_partner: boolean;
  bedrijf?: string;
  specialisatie?: string;
}

// Helper functie om JSON strings te parsen
export function parseJsonField(jsonString: string | null | undefined): any {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

// Helper functie om JSON te stringifyen
export function stringifyJsonField(data: any): string {
  return JSON.stringify(data);
}





