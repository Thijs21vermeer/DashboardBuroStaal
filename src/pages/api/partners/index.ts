import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import { requireAuth } from '../../../lib/api-auth';
import { query } from '../../../lib/azure-db';

export const GET: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
  if (authError) return authError;

  try {
    const dbPool = await getPool(locals);
    const result = await query(`
      SELECT 
        id,
        naam,
        bedrijf,
        specialisatie,
        email,
        telefoon,
        website,
        beschrijving,
        expertise_gebieden as expertiseGebieden,
        volgorde,
        created_at as createdAt,
        updated_at as updatedAt
      FROM externe_partners
      ORDER BY volgorde ASC, id ASC
    `);

    const partners = result.map((row: any) => ({
      ...row,
      expertiseGebieden: row.expertiseGebieden ? JSON.parse(row.expertiseGebieden) : []
    }));

    return new Response(JSON.stringify(partners), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch partners' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
  if (authError) return authError;
  
  try {
    const data = await request.json();
    const dbPool = await getPool(locals);
    const { naam, bedrijf, specialisatie, email, telefoon, website, beschrijving, expertiseGebieden, volgorde } = data;

    if (!naam || !specialisatie || !email) {
      return new Response(JSON.stringify({ error: 'Naam, specialisatie en email zijn verplicht' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const expertiseJson = JSON.stringify(expertiseGebieden || []);

    const result = await query(`
      INSERT INTO externe_partners (naam, bedrijf, specialisatie, email, telefoon, website, beschrijving, expertise_gebieden, volgorde)
      OUTPUT INSERTED.*
      VALUES (@naam, @bedrijf, @specialisatie, @email, @telefoon, @website, @beschrijving, @expertiseGebieden, @volgorde)
    `, {
      naam,
      bedrijf: bedrijf || null,
      specialisatie,
      email,
      telefoon: telefoon || null,
      website: website || null,
      beschrijving: beschrijving || '',
      expertiseGebieden: expertiseJson,
      volgorde: volgorde || 0
    });

    const newPartner = result[0];

    return new Response(JSON.stringify({
      ...newPartner,
      expertiseGebieden: JSON.parse(newPartner.expertise_gebieden || '[]')
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    return new Response(JSON.stringify({ error: 'Failed to create partner' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};



