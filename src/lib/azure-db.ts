/**
 * Legacy compatibility layer for azure-db
 * This file provides backwards compatibility while using the new getPool approach
 */

import { getPool } from './db-config';

/**
 * Execute a query (legacy function - use getPool directly in new code)
 * @deprecated Use getPool(locals) directly in API routes for better Netlify compatibility
 */
export async function query<T = any>(
  queryString: string, 
  params?: Record<string, any>,
  locals?: any
): Promise<T[]> {
  const pool = await getPool(locals);
  const request = pool.request();

  // Add parameters if provided
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
  }

  const result = await request.query(queryString);
  return result.recordset as T[];
}

/**
 * Execute a query that returns a single row
 * @deprecated Use getPool(locals) directly in API routes for better Netlify compatibility
 */
export async function queryOne<T = any>(
  queryString: string, 
  params?: Record<string, any>,
  locals?: any
): Promise<T | null> {
  const results = await query<T>(queryString, params, locals);
  return results.length > 0 ? results[0] : null;
}

// Re-export getPool for convenience
export { getPool } from './db-config';

// Types for database tables
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

// Helper functions for JSON fields
export function parseJsonField(jsonString: string | null | undefined): any {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

export function stringifyJsonField(data: any): string {
  return JSON.stringify(data);
}
