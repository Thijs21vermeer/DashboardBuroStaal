import type { APIRoute } from 'astro';
import { query } from '../../../lib/azure-db';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import { requireAuth } from '../../../lib/api-auth';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

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
      WHERE id = @id
    `, { id: parseInt(id!) });

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'Partner not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const partner = result[0];

    return new Response(JSON.stringify({
      ...partner,
      expertiseGebieden: partner.expertiseGebieden ? JSON.parse(partner.expertiseGebieden) : []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch partner' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { naam, bedrijf, specialisatie, email, telefoon, website, beschrijving, expertiseGebieden, volgorde } = body;

    if (!naam || !specialisatie || !email) {
      return new Response(JSON.stringify({ error: 'Naam, specialisatie en email zijn verplicht' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const expertiseJson = JSON.stringify(expertiseGebieden || []);

    await query(`
      UPDATE externe_partners
      SET naam = @naam,
          bedrijf = @bedrijf,
          specialisatie = @specialisatie,
          email = @email,
          telefoon = @telefoon,
          website = @website,
          beschrijving = @beschrijving,
          expertise_gebieden = @expertiseGebieden,
          volgorde = @volgorde,
          updated_at = GETDATE()
      WHERE id = @id
    `, {
      id: parseInt(id!),
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
      WHERE id = @id
    `, { id: parseInt(id!) });

    const updatedPartner = result[0];

    return new Response(JSON.stringify({
      ...updatedPartner,
      expertiseGebieden: JSON.parse(updatedPartner.expertiseGebieden || '[]')
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return new Response(JSON.stringify({ error: 'Failed to update partner' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals } as any);
  if (authError) return authError;
  
  try {
    const { id } = params;

    await query(`DELETE FROM externe_partners WHERE id = @id`, {
      id: parseInt(id!)
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete partner' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};


