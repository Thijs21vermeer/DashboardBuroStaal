import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getById, update, deleteById } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  const { id } = params;
  
  try {
    const item = await getById('Team', Number(id), locals);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Team member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();

    const success = await update('Team', Number(id), {
      naam: data.naam,
      rol: data.rol || '',
      email: data.email || '',
      telefoon: data.telefoon || null,
      beschrijving: data.beschrijving || null,
      foto: data.foto || null,
    }, locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Team member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedTeamMember = await getById('Team', Number(id), locals);

    return new Response(JSON.stringify(updatedTeamMember), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const success = await deleteById('Team', Number(id), locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Team member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Team member deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
