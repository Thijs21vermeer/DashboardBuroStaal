import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import type { CaseStudy } from '../../../types';

interface CaseStudyUpdate {
  titel?: string;
  klant?: string;
  industrie?: string;
  uitdaging?: string;
  oplossing?: string;
  resultaten?: string[];
  tags?: string[];
  eigenaar?: string;
  imageUrl?: string;
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
          klant,
          industrie,
          uitdaging,
          oplossing,
          resultaten,
          tags,
          eigenaar,
          CONVERT(VARCHAR, datum, 23) as datum,
          image_url as imageUrl
        FROM cases
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = result.recordset[0];
    const caseItem: CaseStudy = {
      id: row.id,
      titel: row.titel,
      klant: row.klant,
      industrie: row.industrie || '',
      uitdaging: row.uitdaging || '',
      oplossing: row.oplossing || '',
      resultaten: row.resultaten ? JSON.parse(row.resultaten) : [],
      tags: row.tags ? JSON.parse(row.tags) : [],
      eigenaar: row.eigenaar || '',
      datum: row.datum,
      imageUrl: row.imageUrl,
    };

    return new Response(JSON.stringify(caseItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching case:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body: CaseStudyUpdate = await request.json();
    const { titel, klant, industrie, uitdaging, oplossing, resultaten, tags, eigenaar, imageUrl } = body;

    const pool = await getPool();
    const result = await pool.request()
      .input('id', id)
      .input('titel', titel)
      .input('klant', klant)
      .input('industrie', industrie || '')
      .input('uitdaging', uitdaging || '')
      .input('oplossing', oplossing || '')
      .input('resultaten', JSON.stringify(resultaten || []))
      .input('tags', JSON.stringify(tags || []))
      .input('eigenaar', eigenaar || '')
      .input('image_url', imageUrl || null)
      .query(`
        UPDATE cases
        SET titel = @titel,
            klant = @klant,
            industrie = @industrie,
            uitdaging = @uitdaging,
            oplossing = @oplossing,
            resultaten = @resultaten,
            tags = @tags,
            eigenaar = @eigenaar,
            image_url = @image_url
        OUTPUT INSERTED.id, INSERTED.titel, INSERTED.klant, INSERTED.industrie, INSERTED.uitdaging,
               INSERTED.oplossing, INSERTED.resultaten, INSERTED.tags, INSERTED.eigenaar,
               INSERTED.datum, INSERTED.image_url
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const row = result.recordset[0];
    const updatedCase: CaseStudy = {
      id: String(row.id),
      titel: row.titel,
      klant: row.klant,
      industrie: row.industrie,
      uitdaging: row.uitdaging,
      oplossing: row.oplossing,
      resultaten: JSON.parse(row.resultaten),
      tags: JSON.parse(row.tags),
      eigenaar: row.eigenaar,
      datum: row.datum,
      imageUrl: row.image_url,
    };

    return new Response(JSON.stringify(updatedCase), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error updating case:', error);
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
      .query('DELETE FROM cases WHERE id = @id');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error deleting case:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

