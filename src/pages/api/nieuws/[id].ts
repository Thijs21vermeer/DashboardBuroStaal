import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import type { NewsItem } from '../../../types';

interface NewsItemUpdate {
  titel?: string;
  categorie?: 'Bedrijfsnieuws' | 'Team Update' | 'Project Lancering' | 'Prestatie' | 'Algemeen';
  inhoud?: string;
  auteur?: string;
  tags?: string[];
}

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const pool = await getPool();
    
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT 
          CAST(id AS VARCHAR) as id,
          titel,
          categorie,
          inhoud,
          auteur,
          CONVERT(VARCHAR, datum, 23) as datum,
          tags
        FROM nieuws
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = result.recordset[0];
    const item: NewsItem = {
      id: row.id,
      titel: row.titel,
      categorie: row.categorie,
      inhoud: row.inhoud || '',
      auteur: row.auteur || '',
      datum: row.datum,
      tags: row.tags ? JSON.parse(row.tags) : [],
    };

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching nieuws:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body: NewsItemUpdate = await request.json();
    const { titel, categorie, inhoud, auteur, tags } = body;

    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .input('titel', titel)
      .input('categorie', categorie)
      .input('inhoud', inhoud || '')
      .input('auteur', auteur || '')
      .input('tags', JSON.stringify(tags || []))
      .query(`
        UPDATE nieuws
        SET titel = @titel,
            categorie = @categorie,
            inhoud = @inhoud,
            auteur = @auteur,
            tags = @tags
        OUTPUT INSERTED.id, INSERTED.titel, INSERTED.categorie, INSERTED.inhoud,
               INSERTED.auteur, INSERTED.datum, INSERTED.tags
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Nieuws not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = result.recordset[0];
    const updatedItem: NewsItem = {
      id: String(row.id),
      titel: row.titel,
      categorie: row.categorie,
      inhoud: row.inhoud,
      auteur: row.auteur,
      datum: row.datum,
      tags: JSON.parse(row.tags),
    };

    return new Response(JSON.stringify(updatedItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error updating nieuws:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const pool = await getPool();
    
    await pool.request()
      .input('id', id)
      .query('DELETE FROM nieuws WHERE id = @id');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error deleting nieuws:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

