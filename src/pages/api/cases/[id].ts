import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import type { CaseStudy } from '../../../types';
import { requireAuth } from '../../../lib/api-auth';

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

  // Parse tags safely
  let tags: string[] = [];
  if (dbRecord.tags) {
    if (typeof dbRecord.tags === 'string') {
      try {
        tags = JSON.parse(dbRecord.tags);
      } catch {
        tags = [];
      }
    } else if (Array.isArray(dbRecord.tags)) {
      tags = dbRecord.tags;
    }
  }

  // Parse referenties safely
  let referenties: string[] = [];
  if (dbRecord.referenties) {
    if (typeof dbRecord.referenties === 'string') {
      try {
        referenties = JSON.parse(dbRecord.referenties);
      } catch {
        referenties = [];
      }
    } else if (Array.isArray(dbRecord.referenties)) {
      referenties = dbRecord.referenties;
    }
  }

  return {
    id: dbRecord.id,
    titel: dbRecord.titel,
    klant: dbRecord.klant,
    industrie: dbRecord.industrie,
    uitdaging: dbRecord.challenge || dbRecord.uitdaging || '',
    oplossing: dbRecord.solution || dbRecord.oplossing || '',
    resultaten,
    tags,
    eigenaar: dbRecord.eigenaar || 'Onbekend',
    datum: dbRecord.datum_toegevoegd,
    imageUrl: dbRecord.image_url || undefined,
    featured: dbRecord.featured || false,
    type: dbRecord.type || undefined,
    // Extra velden uit database
    projectDuur: dbRecord.projectduur || undefined,
    team: dbRecord.team ? dbRecord.team.split(',') : [],
    status: dbRecord.status || 'afgerond',
    budget: dbRecord.budget || undefined,
    roi: dbRecord.roi || undefined,
    referenties,
  };
}

// GET - Haal een specifieke case op
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    const dbPool = await getPool();
    const result = await dbPool.request()
      .input('id', sql.Int, Number(id))
      .query('SELECT * FROM Cases WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const caseItem = mapDbToCaseStudy(result.recordset[0]);
    return new Response(JSON.stringify(caseItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'fetch case by id');
  }
};

// PUT - Update een case
export const PUT: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const dbPool = await getPool();

    const result = await dbPool.request()
      .input('id', sql.Int, parseInt(id))
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
        UPDATE Cases 
        SET 
          titel = @titel,
          klant = @klant,
          industrie = @industrie,
          uitdaging = @uitdaging,
          oplossing = @oplossing,
          resultaten = @resultaten,
          referenties = @referenties,
          tags = @tags,
          eigenaar = @eigenaar,
          project_duur = @project_duur,
          team_size = @team_size,
          image_url = @image_url,
          laatst_bijgewerkt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedCase = mapDbToCaseStudy(result.recordset[0]);
    return new Response(JSON.stringify(updatedCase), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'update case');
  }
};

// DELETE - Verwijder een case
export const DELETE: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dbPool = await getPool();
    const result = await dbPool.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM Cases WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Case deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'delete case');
  }
};











