import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import type { NewsItem } from '../../../types';

// Helper functie om database records te mappen naar TypeScript types
function mapDbToNewsItem(dbRecord: any): NewsItem {
  return {
    id: String(dbRecord.id),
    titel: dbRecord.titel,
    categorie: dbRecord.categorie as 'Bedrijfsnieuws' | 'Team Update' | 'Project Lancering' | 'Prestatie' | 'Algemeen',
    inhoud: dbRecord.inhoud,
    auteur: dbRecord.auteur,
    datum: dbRecord.datum,
    tags: dbRecord.tags ? JSON.parse(dbRecord.tags) : [],
  };
}

// GET - Haal een specifiek nieuwsitem op
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  
  try {
    const dbPool = await getPool();
    const result = await dbPool.request()
      .input('id', sql.Int, Number(id))
      .query('SELECT * FROM Nieuws WHERE id = @id');

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const nieuws = mapDbToNewsItem(result.recordset[0]);
    return new Response(JSON.stringify(nieuws), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'fetch nieuws by id');
  }
};

// PUT - Update een nieuwsitem
export const PUT: APIRoute = async ({ params, request }) => {
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
      .input('categorie', sql.NVarChar, data.categorie)
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('auteur', sql.NVarChar, data.auteur || null)
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .query(`
        UPDATE Nieuws 
        SET 
          titel = @titel,
          categorie = @categorie,
          inhoud = @inhoud,
          auteur = @auteur,
          tags = @tags
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedNieuws = mapDbToNewsItem(result.recordset[0]);
    return new Response(JSON.stringify(updatedNieuws), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'update nieuws');
  }
};

// DELETE - Verwijder een nieuwsitem
export const DELETE: APIRoute = async ({ params }) => {
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
      .query('DELETE FROM Nieuws WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Nieuws deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'delete nieuws');
  }
};



