import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import type { CaseStudy } from '../../../types';

// Helper functie om database records te mappen naar TypeScript types
function mapDbToCaseStudy(dbRecord: any): CaseStudy {
  // Parse resultaten - handle string (JSON) or already parsed array
  let resultaten: string[] = [];
  if (dbRecord.resultaten) {
    if (typeof dbRecord.resultaten === 'string') {
      try {
        resultaten = JSON.parse(dbRecord.resultaten);
      } catch {
        // If it's not valid JSON, split by newlines
        resultaten = dbRecord.resultaten.split('\n').filter(Boolean);
      }
    } else if (Array.isArray(dbRecord.resultaten)) {
      resultaten = dbRecord.resultaten;
    }
  }

  return {
    id: String(dbRecord.id),
    titel: dbRecord.titel,
    klant: dbRecord.klant,
    industrie: dbRecord.industrie,
    uitdaging: dbRecord.uitdaging,
    oplossing: dbRecord.oplossing,
    resultaten,
    tags: dbRecord.tags ? JSON.parse(dbRecord.tags) : [],
    eigenaar: dbRecord.eigenaar,
    datum: dbRecord.datum_toegevoegd,
    imageUrl: dbRecord.image_url || undefined,
    featured: dbRecord.featured || false,
    referenties: dbRecord.referenties ? JSON.parse(dbRecord.referenties) : [],
  };
}

// GET - Haal alle cases op
export const GET: APIRoute = async () => {
  try {
    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT * FROM Cases ORDER BY datum_toegevoegd DESC');
    
    // Map database records to TypeScript types
    const cases = result.recordset.map(mapDbToCaseStudy);

    return new Response(JSON.stringify(cases), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return handleDbError(error, 'fetch cases');
  }
};

// POST - Voeg een nieuwe case toe
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const dbPool = await getPool();
    
    const result = await dbPool.request()
      .input('titel', sql.NVarChar, data.titel)
      .input('klant', sql.NVarChar, data.klant)
      .input('industrie', sql.NVarChar, data.industrie || null)
      .input('uitdaging', sql.NVarChar(sql.MAX), data.uitdaging || null)
      .input('oplossing', sql.NVarChar(sql.MAX), data.oplossing || null)
      .input('resultaten', sql.NVarChar(sql.MAX), JSON.stringify(data.resultaten || []))
      .input('referenties', sql.NVarChar(sql.MAX), JSON.stringify(data.referenties || []))
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .input('eigenaar', sql.NVarChar, data.eigenaar || null)
      .input('project_duur', sql.NVarChar, data.projectDuur || null)
      .input('team_size', sql.NVarChar, data.teamSize || null)
      .input('image_url', sql.NVarChar, data.imageUrl || null)
      .query(`
        INSERT INTO Cases 
        (titel, klant, industrie, uitdaging, oplossing, resultaten, referenties, tags, eigenaar, project_duur, team_size, datum_toegevoegd, laatst_bijgewerkt, featured, image_url)
        OUTPUT INSERTED.*
        VALUES 
        (@titel, @klant, @industrie, @uitdaging, @oplossing, @resultaten, @referenties, @tags, @eigenaar, @project_duur, @team_size, GETDATE(), GETDATE(), 0, @image_url)
      `);

    const newCase = mapDbToCaseStudy(result.recordset[0]);
    return new Response(JSON.stringify(newCase), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'create case');
  }
};







