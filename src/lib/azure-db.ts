import sql from 'mssql';

// Azure SQL configuratie
const config: sql.config = {
  server: import.meta.env.AZURE_SQL_SERVER || process.env.AZURE_SQL_SERVER || 'dashboardbs.database.windows.net',
  database: import.meta.env.AZURE_SQL_DATABASE || process.env.AZURE_SQL_DATABASE || 'dashboarddb',
  user: import.meta.env.AZURE_SQL_USER || process.env.AZURE_SQL_USER || 'databasedashboard',
  password: import.meta.env.AZURE_SQL_PASSWORD || process.env.AZURE_SQL_PASSWORD || 'Knolpower05!',
  port: parseInt(import.meta.env.AZURE_SQL_PORT || process.env.AZURE_SQL_PORT || '1433'),
  options: {
    encrypt: true, // Verplicht voor Azure
    trustServerCertificate: false,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 60000,
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
  try {
    const dbPool = await getPool();
    const request = dbPool.request();

    // Parameters toevoegen als ze er zijn
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
    }

    const result = await request.query(queryString);
    return result.recordset as T[];
  } catch (error) {
    console.error('Database query error:', error);
    // Reset pool bij error
    if (pool) {
      try {
        await pool.close();
      } catch (e) {
        // Ignore close errors
      }
      pool = null;
    }
    throw error;
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

export interface Tool {
  id: number;
  naam: string;
  categorie: string;
  beschrijving?: string;
  code?: string;
  taal?: string;
  tags?: string; // JSON string
  eigenaar?: string;
  favoriet: boolean;
  gebruik_count: number;
  datum_toegevoegd: Date;
  laatst_gebruikt?: Date;
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
