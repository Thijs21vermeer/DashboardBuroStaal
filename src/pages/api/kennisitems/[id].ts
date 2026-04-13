import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import type { KennisItem, KennisItemRequest } from '../../../types';
import { getById, update, deleteById } from '../../../lib/turso-db';

// Helper functie om database records te mappen
function mapDbToKennisItem(dbRecord: any): KennisItem {
  let tags: string[] = [];
  if (dbRecord.tags) {
    if (typeof dbRecord.tags === 'string') {
      try {
        tags = JSON.parse(dbRecord.tags);
      } catch {
        tags = [];
      }
    } else if (Array.isArray(dbRecord.tags)) {
      tags = dbRecord.tags;
    }
  }

  return {
    id: dbRecord.id,
    titel: dbRecord.titel,
    type: dbRecord.categorie || 'Algemeen',
    categorie: dbRecord.categorie || 'Algemeen',
    tags,
    gekoppeldProject: dbRecord.gekoppeldProject || undefined,
    eigenaar: dbRecord.eigenaar || 'Onbekend',
    datum: dbRecord.createdAt,
    samenvatting: dbRecord.beschrijving || undefined,
    inhoud: dbRecord.beschrijving || undefined,
    afbeelding: dbRecord.afbeelding || undefined,
    featured: false,
    videoLink: undefined,
    media_type: dbRecord.mediaType || undefined,
    media_url: undefined,
    datumToegevoegd: dbRecord.createdAt,
    laatstBijgewerkt: dbRecord.updatedAt,
    views: 0,
  };
}

// GET - Haal een specifiek kennisitem op
export const GET: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  const { id } = params;
  
  try {
    const item = await getById('KennisItems', Number(id), locals);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const mappedItem = mapDbToKennisItem(item);
    return new Response(JSON.stringify(mappedItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching kennisitem:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT - Update een kennisitem
export const PUT: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
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

    const data = (await request.json()) as KennisItemRequest;
    
    console.log('📝 [PUT /api/kennisitems/:id] Updating kennisitem:', id);
    console.log('📝 Request data:', JSON.stringify(data, null, 2));

    const updateData = {
      titel: data.titel,
      beschrijving: data.samenvatting || data.inhoud || '',
      categorie: data.categorie || data.type || 'Algemeen',
      tags: JSON.stringify(data.tags || []),
      mediaType: data.media_type || null,
      afbeelding: data.afbeelding || null,
    };
    
    console.log('📝 Update data to be saved:', JSON.stringify(updateData, null, 2));

    const success = await update('KennisItems', Number(id), updateData, locals);
    
    console.log('📝 Update success:', success);

    if (!success) {
      console.error('❌ [PUT /api/kennisitems/:id] Item not found:', id);
      return new Response(JSON.stringify({ error: 'Kennisitem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch updated item
    const updatedItem = await getById('KennisItems', Number(id), locals);
    console.log('📝 Updated item from DB:', JSON.stringify(updatedItem, null, 2));
    
    const mappedItem = mapDbToKennisItem(updatedItem);

    return new Response(JSON.stringify(mappedItem), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ [PUT /api/kennisitems/:id] Error updating kennisitem:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE - Verwijder een kennisitem
export const DELETE: APIRoute = async ({ params, request, locals }) => {
  // Check authentication
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

    const success = await deleteById('KennisItems', Number(id), locals);

    if (!success) {
      return new Response(JSON.stringify({ error: 'Kennisitem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Kennisitem deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting kennisitem:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};



