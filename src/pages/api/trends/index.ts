import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import type { Trend } from '../../../types';

interface TrendInput {
  titel: string;
  categorie: string;
  beschrijving: string;
  relevantie: 'Hoog' | 'Middel' | 'Laag';
  impact: string;
  bronnen: string[];
  tags: string[];
}

export const GET: APIRoute = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        CAST(id AS VARCHAR) as id,
        titel,
        categorie,
        beschrijving,
        relevantie,
        bronnen,
        tags,
        impact,
        CONVERT(VARCHAR, datum_toegevoegd, 23) as datum
      FROM trends
      ORDER BY datum_toegevoegd DESC
    `);

    const trends: Trend[] = result.recordset.map((row: any) => ({
      id: row.id,
      titel: row.titel,
      categorie: row.categorie,
      beschrijving: row.beschrijving || '',
      relevantie: row.relevantie as 'Hoog' | 'Middel' | 'Laag',
      bronnen: row.bronnen ? JSON.parse(row.bronnen) : [],
      datum: row.datum,
      tags: row.tags ? JSON.parse(row.tags) : [],
      impact: row.impact || '',
    }));

    return new Response(JSON.stringify(trends), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching trends:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: TrendInput = await request.json();
    const { titel, categorie, beschrijving, relevantie, impact, bronnen, tags } = body;

    const pool = await getPool();
    const result = await pool.request()
      .input('titel', titel)
      .input('categorie', categorie)
      .input('beschrijving', beschrijving || '')
      .input('relevantie', relevantie || 'Middel')
      .input('impact', impact || '')
      .input('bronnen', JSON.stringify(bronnen || []))
      .input('tags', JSON.stringify(tags || []))
      .query(`
        INSERT INTO trends (titel, categorie, beschrijving, relevantie, impact, bronnen, tags)
        OUTPUT INSERTED.id, INSERTED.titel, INSERTED.categorie, INSERTED.beschrijving,
               INSERTED.relevantie, INSERTED.impact, INSERTED.bronnen, INSERTED.tags, INSERTED.datum_toegevoegd
        VALUES (@titel, @categorie, @beschrijving, @relevantie, @impact, @bronnen, @tags)
      `);

    const row = result.recordset[0];
    const newTrend: Trend = {
      id: String(row.id),
      titel: row.titel,
      categorie: row.categorie,
      beschrijving: row.beschrijving,
      relevantie: row.relevantie,
      bronnen: JSON.parse(row.bronnen),
      datum: row.datum_toegevoegd,
      tags: JSON.parse(row.tags),
      impact: row.impact,
    };

    return new Response(JSON.stringify(newTrend), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating trend:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};



