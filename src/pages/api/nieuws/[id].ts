import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getById, update, deleteById } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  const { id } = params;
  
  try {
    const item = await getById('Nieuws', Number(id), locals);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Nieuws item not found' }), {
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
    console.error('Error fetching nieuws:', error);
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

    const success = await update('Nieuws', Number(id), {
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      bron: data.bron || '',
      tags: JSON.stringify(data.tags || []),
      afbeelding: data.afbeelding || null,
    }, locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Nieuws item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedNieuwsItem = await getById('Nieuws', Number(id), locals);
    if (typeof updatedNieuwsItem.tags === 'string') {
      try { updatedNieuwsItem.tags = JSON.parse(updatedNieuwsItem.tags); } catch { updatedNieuwsItem.tags = []; }
    }

    return new Response(JSON.stringify(updatedNieuwsItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating nieuws:', error);
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

    const success = await deleteById('Nieuws', Number(id), locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Nieuws item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Nieuws item deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting nieuws:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
