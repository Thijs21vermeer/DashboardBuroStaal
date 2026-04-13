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

    // Parse JSON fields
    if (typeof item.tags === 'string') {
      try {
        item.tags = JSON.parse(item.tags);
      } catch {
        item.tags = [];
      }
    }
    
    // Parse resultaten if it's a string
    if (typeof item.resultaten === 'string') {
      try {
        item.resultaten = JSON.parse(item.resultaten);
      } catch {
        item.resultaten = [];
      }
    }
    
    // Parse referenties if it's a string
    if (typeof item.referenties === 'string') {
      try {
        item.referenties = JSON.parse(item.referenties);
      } catch {
        item.referenties = [];
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
      klant: data.klant,
      industrie: data.industrie || '',
      beschrijving: data.beschrijving || '',
      uitdaging: data.uitdaging || '',
      oplossing: data.oplossing || '',
      resultaat: data.resultaat || data.oplossing || '',
      resultaten: JSON.stringify(data.resultaten || []),
      referenties: JSON.stringify(data.referenties || []),
      eigenaar: data.eigenaar || '',
      datum: data.datum || new Date().toISOString().split('T')[0],
      featured: data.featured ? 1 : 0,
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
    
    // Parse JSON fields
    if (typeof updatedCase.tags === 'string') {
      try {
        updatedCase.tags = JSON.parse(updatedCase.tags);
      } catch {
        updatedCase.tags = [];
      }
    }
    
    // Parse resultaten if it's a string
    if (typeof updatedCase.resultaten === 'string') {
      try {
        updatedCase.resultaten = JSON.parse(updatedCase.resultaten);
      } catch {
        updatedCase.resultaten = [];
      }
    }
    
    // Parse referenties if it's a string
    if (typeof updatedCase.referenties === 'string') {
      try {
        updatedCase.referenties = JSON.parse(updatedCase.referenties);
      } catch {
        updatedCase.referenties = [];
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




