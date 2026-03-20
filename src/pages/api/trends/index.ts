import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import { requireAuth } from '../../../lib/api-auth';
import type { Trend } from '../../../types';

// Helper functie om database records te mappen naar TypeScript types
function mapDbToTrend(dbRecord: any): Trend {
  return {
    id: String(dbRecord.id),
    titel: dbRecord.titel,
    categorie: dbRecord.categorie,
    beschrijving: dbRecord.beschrijving,
    relevantie: dbRecord.relevantie as 'Hoog' | 'Middel' | 'Laag',
    bronnen: dbRecord.bronnen ? JSON.parse(dbRecord.bronnen) : [],
    datum: dbRecord.datum_toegevoegd,
    tags: dbRecord.tags ? JSON.parse(dbRecord.tags) : [],
    impact: dbRecord.impact || '',
    eigenaar: dbRecord.eigenaar || 'Onbekend',
  };
}

// GET - Haal alle trends op
export const GET: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
  if (authError) return authError;

  try {
    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT * FROM Trends ORDER BY datum_toegevoegd DESC');
    
    // Map database records to TypeScript types
    const trends = result.recordset.map(mapDbToTrend);

    return new Response(JSON.stringify(trends), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return handleDbError(error, 'fetch trends');
  }
};

// POST - Voeg een nieuwe trend toe
export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
  if (authError) return authError;
  
  try {
    const data = await request.json();
    const dbPool = await getPool();
    
    const result = await dbPool.request()
      .input('titel', sql.NVarChar, data.titel)
      .input('categorie', sql.NVarChar, data.categorie)
      .input('beschrijving', sql.NVarChar(sql.MAX), data.beschrijving || null)
      .input('relevantie', sql.NVarChar, data.relevantie || null)
      .input('impact', sql.NVarChar(sql.MAX), data.impact || null)
      .input('bronnen', sql.NVarChar(sql.MAX), JSON.stringify(data.bronnen || []))
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .input('eigenaar', sql.NVarChar, data.eigenaar || null)
      .query(`
        INSERT INTO Trends 
        (titel, categorie, beschrijving, relevantie, impact, bronnen, tags, eigenaar, datum_toegevoegd, laatst_bijgewerkt, featured)
        OUTPUT INSERTED.*
        VALUES 
        (@titel, @categorie, @beschrijving, @relevantie, @impact, @bronnen, @tags, @eigenaar, GETDATE(), GETDATE(), 0)
      `);

    const newTrend = mapDbToTrend(result.recordset[0]);
    return new Response(JSON.stringify(newTrend), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'create trend');
  }
};








