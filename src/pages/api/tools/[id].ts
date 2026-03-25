import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getById, update, deleteById } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  const { id } = params;
  
  try {
    const item = await getById('Tools', Number(id), locals);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Tool not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (typeof item.tags === 'string') {
      try { item.tags = JSON.parse(item.tags); } catch { item.tags = []; }
    }

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching tool:', error);
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

    const success = await update('Tools', Number(id), {
      naam: data.naam,
      beschrijving: data.beschrijving || '',
      url: data.url || '',
      tags: JSON.stringify(data.tags || []),
      afbeelding: data.afbeelding || null,
    }, locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Tool not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedTool = await getById('Tools', Number(id), locals);
    if (typeof updatedTool.tags === 'string') {
      try { updatedTool.tags = JSON.parse(updatedTool.tags); } catch { updatedTool.tags = []; }
    }

    return new Response(JSON.stringify(updatedTool), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating tool:', error);
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

    const success = await deleteById('Tools', Number(id), locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Tool not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Tool deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting tool:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
