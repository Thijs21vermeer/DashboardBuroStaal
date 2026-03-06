import sql from 'mssql';

// Azure SQL configuratie
const config: sql.config = {
  server: import.meta.env.AZURE_SQL_SERVER || process.env.AZURE_SQL_SERVER || '',
  database: import.meta.env.AZURE_SQL_DATABASE || process.env.AZURE_SQL_DATABASE || '',
  user: import.meta.env.AZURE_SQL_USER || process.env.AZURE_SQL_USER || '',
  password: import.meta.env.AZURE_SQL_PASSWORD || process.env.AZURE_SQL_PASSWORD || '',
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
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

/**
 * Krijg de database connection pool
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
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
    await pool.close();
    pool = null;
  }
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
  tags?: string; // JSON string
  eigenaar?: string;
  project_duur?: string;
  team_size?: string;
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
