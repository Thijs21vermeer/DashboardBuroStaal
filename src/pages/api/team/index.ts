import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getAll, insert } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const rows = await getAll('Team', {
      orderBy: 'createdAt DESC'
    }, locals);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij ophalen teamleden',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const data = await request.json();
    
    // Map frontend fields to database columns
    const newId = await insert('Team', {
      naam: data.naam,
      functie: data.rol || data.functie || '',
      email: data.email || '',
      telefoon: data.telefoon || null,
      bio: data.beschrijving || data.bio || null,
      afbeelding: data.foto || data.afbeelding || null,
      linkedIn: data.linkedIn || null,
      specialisaties: data.specialisaties || null,
    }, locals);

    const newTeamMember = {
      id: newId,
      naam: data.naam,
      functie: data.rol || data.functie || '',
      email: data.email || '',
      telefoon: data.telefoon || null,
      bio: data.beschrijving || data.bio || null,
      afbeelding: data.foto || data.afbeelding || null,
      linkedIn: data.linkedIn || null,
      specialisaties: data.specialisaties || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(newTeamMember), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij aanmaken teamlid',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

