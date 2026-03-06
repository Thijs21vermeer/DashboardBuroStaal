import type { APIRoute } from 'astro';
import { getPool } from '../../../lib/azure-db';
import type { CaseStudy } from '../../../types';

interface CaseStudyInput {
  titel: string;
  klant: string;
  industrie: string;
  uitdaging: string;
  oplossing: string;
  resultaten: string[];
  tags: string[];
  eigenaar: string;
  imageUrl?: string;
}

export const GET: APIRoute = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
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
        CONVERT(VARCHAR, datum_toegevoegd, 23) as datum,
        image_url as imageUrl
      FROM cases
      ORDER BY datum_toegevoegd DESC
    `);

    const cases: CaseStudy[] = result.recordset.map((row: any) => ({
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
    }));

    return new Response(JSON.stringify(cases), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error fetching cases:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: CaseStudyInput = await request.json();
    const { titel, klant, industrie, uitdaging, oplossing, resultaten, tags, eigenaar, imageUrl } = body;

    const pool = await getPool();
    const result = await pool.request()
      .input('titel', titel)
      .input('klant', klant)
      .input('industrie', industrie || '')
      .input('uitdaging', uitdaging || '')
      .input('oplossing', oplossing || '')
      .input('resultaten', JSON.stringify(resultaten || []))
      .input('tags', JSON.stringify(tags || []))
      .input('eigenaar', eigenaar || '')
      .input('project_duur', (body as any).project_duur || '')
      .input('team_size', (body as any).team_size || '')
      .input('featured', (body as any).featured ? 1 : 0)
      .input('image_url', imageUrl || null)
      .query(`
        INSERT INTO cases (titel, klant, industrie, uitdaging, oplossing, resultaten, tags, eigenaar, project_duur, team_size, featured, image_url)
        OUTPUT CAST(INSERTED.id AS VARCHAR) as id, INSERTED.titel, INSERTED.klant, INSERTED.industrie, INSERTED.uitdaging,
               INSERTED.oplossing, INSERTED.resultaten, INSERTED.tags, INSERTED.eigenaar,
               CONVERT(VARCHAR, INSERTED.datum_toegevoegd, 23) as datum, INSERTED.image_url
        VALUES (@titel, @klant, @industrie, @uitdaging, @oplossing, @resultaten, @tags, @eigenaar, @project_duur, @team_size, @featured, @image_url)
      `);

    const row = result.recordset[0];
    const newCase: CaseStudy = {
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

    return new Response(JSON.stringify(newCase), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating case:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};



