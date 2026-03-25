import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getById, update, deleteById } from '../../../lib/turso-db';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  const { id } = params;
  
  try {
    const item = await getById('Trends', Number(id), locals);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
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
    console.error('Error fetching trend:', error);
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

    const success = await update('Trends', Number(id), {
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      categorie: data.categorie || 'Algemeen',
      eigenaar: data.eigenaar || '',
      tags: JSON.stringify(data.tags || []),
      afbeelding: data.afbeelding || null,
    }, locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedTrend = await getById('Trends', Number(id), locals);
    if (typeof updatedTrend.tags === 'string') {
      try { updatedTrend.tags = JSON.parse(updatedTrend.tags); } catch { updatedTrend.tags = []; }
    }

    return new Response(JSON.stringify(updatedTrend), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating trend:', error);
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

    const success = await deleteById('Trends', Number(id), locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Trend not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Trend deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting trend:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
