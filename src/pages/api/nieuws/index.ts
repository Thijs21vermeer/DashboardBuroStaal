import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import type { NewsItem } from '../../../types';

interface NewsItemInput {
  titel: string;
  categorie: 'Bedrijfsnieuws' | 'Team Update' | 'Project Lancering' | 'Prestatie' | 'Algemeen';
  inhoud: string;
  auteur: string;
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
        inhoud,
        auteur,
        CONVERT(VARCHAR, datum, 23) as datum,
        tags
      FROM nieuws
      ORDER BY datum DESC
    `);

    const items: NewsItem[] = result.recordset.map((row: any) => ({
      id: row.id,
      titel: row.titel,
      categorie: row.categorie,
      inhoud: row.inhoud || '',
      auteur: row.auteur || '',
      datum: row.datum,
      tags: row.tags ? JSON.parse(row.tags) : [],
    }));

    return new Response(JSON.stringify(items), {
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: NewsItemInput = await request.json();
    const { titel, categorie, inhoud, auteur, tags } = body;

    const pool = await getPool();
    const result = await pool.request()
      .input('titel', titel)
      .input('categorie', categorie)
      .input('inhoud', inhoud || '')
      .input('auteur', auteur || '')
      .input('tags', JSON.stringify(tags || []))
      .query(`
        INSERT INTO nieuws (titel, categorie, inhoud, auteur, tags)
        OUTPUT INSERTED.id, INSERTED.titel, INSERTED.categorie, INSERTED.inhoud,
               INSERTED.auteur, INSERTED.datum, INSERTED.tags
        VALUES (@titel, @categorie, @inhoud, @auteur, @tags)
      `);

    const row = result.recordset[0];
    const newItem: NewsItem = {
      id: String(row.id),
      titel: row.titel,
      categorie: row.categorie,
      inhoud: row.inhoud,
      auteur: row.auteur,
      datum: row.datum,
      tags: JSON.parse(row.tags),
    };

    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating nieuws:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

