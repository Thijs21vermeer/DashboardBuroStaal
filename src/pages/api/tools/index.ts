import type { APIRoute } from 'astro';
import { query } from '../../../lib/azure-db';

export const GET: APIRoute = async () => {
  try {
    const result = await query(`
      SELECT 
        id,
        titel,
        categorie,
        beschrijving,
        code,
        taal,
        tags,
        eigenaar,
        datum_toegevoegd,
        laatst_bijgewerkt,
        gebruik_count,
        favoriet
      FROM tools
      ORDER BY favoriet DESC, laatst_bijgewerkt DESC
    `);

    const tools = result.map(row => ({
      ...row,
      favoriet: Boolean(row.favoriet),
      gebruik_count: row.gebruik_count || 0
    }));

    return new Response(JSON.stringify(tools), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet } = body;

    const result = await query(`
      INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet)
      OUTPUT INSERTED.*
      VALUES (@titel, @categorie, @beschrijving, @code, @taal, @tags, @eigenaar, @favoriet)
    `, {
      titel,
      categorie,
      beschrijving: beschrijving || null,
      code,
      taal: taal || null,
      tags: tags || null,
      eigenaar: eigenaar || null,
      favoriet: favoriet ? 1 : 0
    });

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
