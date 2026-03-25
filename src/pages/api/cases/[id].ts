import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import { getById, update, deleteById } from '../../../lib/turso-db';

// GET - Haal een specifieke case op
export const GET: APIRoute = async ({ params, request, locals }) => {
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  const { id } = params;
  
  try {
    const item = await getById('Cases', Number(id), locals);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse tags if string
    if (typeof item.tags === 'string') {
      try {
        item.tags = JSON.parse(item.tags);
      } catch {
        item.tags = [];
      }
    }

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Update een case
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

    const success = await update('Cases', Number(id), {
      titel: data.titel,
      beschrijving: data.beschrijving || '',
      klant: data.klant || '',
      resultaat: data.resultaat || '',
      afbeelding: data.afbeelding || null,
      tags: JSON.stringify(data.tags || []),
    }, locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedCase = await getById('Cases', Number(id), locals);
    
    // Parse tags
    if (typeof updatedCase.tags === 'string') {
      try {
        updatedCase.tags = JSON.parse(updatedCase.tags);
      } catch {
        updatedCase.tags = [];
      }
    }

    return new Response(JSON.stringify(updatedCase), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating case:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Verwijder een case
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

    const success = await deleteById('Cases', Number(id), locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Case not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Case deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting case:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
