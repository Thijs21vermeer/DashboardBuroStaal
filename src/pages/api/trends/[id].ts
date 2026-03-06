import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import type { Trend } from '../../../types';

interface TrendUpdate {
  titel?: string;
  categorie?: string;
  beschrijving?: string;
  relevantie?: 'Hoog' | 'Middel' | 'Laag';
  impact?: string;
  bronnen?: string[];
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
          beschrijving,
          relevantie,
          bronnen,
          tags,
          impact,
          CONVERT(VARCHAR, datum, 23) as datum
        FROM trends
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = result.recordset[0];
    const trend: Trend = {
      id: row.id,
      titel: row.titel,
      categorie: row.categorie,
      beschrijving: row.beschrijving || '',
      relevantie: row.relevantie as 'Hoog' | 'Middel' | 'Laag',
      bronnen: row.bronnen ? JSON.parse(row.bronnen) : [],
      datum: row.datum,
      tags: row.tags ? JSON.parse(row.tags) : [],
      impact: row.impact || '',
    };

    return new Response(JSON.stringify(trend), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching trend:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const body: TrendUpdate = await request.json();
    const { id } = params;
    const { titel, categorie, beschrijving, relevantie, impact, bronnen, tags } = body;

    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .input('titel', titel)
      .input('categorie', categorie)
      .input('beschrijving', beschrijving || '')
      .input('relevantie', relevantie || 'Middel')
      .input('impact', impact || '')
      .input('bronnen', JSON.stringify(bronnen || []))
      .input('tags', JSON.stringify(tags || []))
      .query(`
        UPDATE trends
        SET titel = @titel,
            categorie = @categorie,
            beschrijving = @beschrijving,
            relevantie = @relevantie,
            impact = @impact,
            bronnen = @bronnen,
            tags = @tags
        OUTPUT INSERTED.id, INSERTED.titel, INSERTED.categorie, INSERTED.beschrijving,
               INSERTED.relevantie, INSERTED.impact, INSERTED.bronnen, INSERTED.tags, INSERTED.datum
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = result.recordset[0];
    const updatedTrend: Trend = {
      id: String(row.id),
      titel: row.titel,
      categorie: row.categorie,
      beschrijving: row.beschrijving,
      relevantie: row.relevantie,
      bronnen: JSON.parse(row.bronnen),
      datum: row.datum,
      tags: JSON.parse(row.tags),
      impact: row.impact,
    };

    return new Response(JSON.stringify(updatedTrend), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error updating trend:', error);
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
      .query('DELETE FROM trends WHERE id = @id');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error deleting trend:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};



