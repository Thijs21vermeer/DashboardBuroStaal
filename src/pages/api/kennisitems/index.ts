import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/api-auth';
import type { KennisItem, KennisItemRequest } from '../../../types';
import { getAll, insert } from '../../../lib/turso-db';
import { getEnvVar } from '../../../lib/config';

// Helper functie om database records te mappen naar TypeScript types
function mapDbToKennisItem(dbRecord: any): KennisItem {
  // Parse tags safely
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
    type: dbRecord.categorie || 'Algemeen', // SQLite gebruikt 'categorie'
    categorie: dbRecord.categorie || 'Algemeen',
    tags,
    gekoppeldProject: dbRecord.gekoppeldProject || undefined,
    eigenaar: dbRecord.eigenaar || 'Onbekend',
    auteur: dbRecord.eigenaar || 'Onbekend',
    samenvatting: dbRecord.beschrijving || '',
    inhoud: dbRecord.beschrijving || '',
    datumToegevoegd: dbRecord.createdAt,
    laatstBijgewerkt: dbRecord.updatedAt,
    views: 0,
    featured: false,
    videoLink: undefined,
    afbeelding: dbRecord.afbeelding || undefined,
  };
}

// Helper functie om Slack notificatie te sturen
async function sendSlackNotification(item: KennisItem, slackWebhook: string) {
  try {
    console.log('🔔 Attempting to send Slack notification...');
    console.log('📝 Item:', item.titel);
    
    const message = {
      text: `📚 Nieuw kennisitem: ${item.titel}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📚 Nieuw Kennisitem Toegevoegd",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${item.titel}*\n\n${item.samenvatting || 'Geen samenvatting beschikbaar'}`
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<https://burostaaldashboard.netlify.app|Bekijk in dashboard ›>`
          }
        }
      ]
    };

    console.log('📤 Sending to Slack...');
    const response = await fetch(slackWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ Failed to send Slack notification');
      console.error('Status:', response.status, response.statusText);
      console.error('Response:', responseText);
    } else {
      console.log('✅ Slack notification sent successfully');
    }
  } catch (error) {
    console.error('❌ Error sending Slack notification:', error);
  }
}

// GET - Haal alle kennisitems op
export const GET: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const rows = await getAll('KennisItems', {
      orderBy: 'createdAt DESC'
    }, locals);
    
    const items = rows.map(mapDbToKennisItem);

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error fetching kennisitems:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij ophalen kennisitems',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST - Voeg een nieuw kennisitem toe
export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth({ request, locals });
  if (authError) return authError;
  
  try {
    const data = (await request.json()) as KennisItemRequest;
    
    const newId = await insert('KennisItems', {
      titel: data.titel,
      beschrijving: data.samenvatting || data.inhoud || '',
      categorie: data.categorie || data.type || 'Algemeen',
      tags: JSON.stringify(data.tags || []),
      mediaType: data.media_type || null,
      afbeelding: data.afbeelding || null,
      referenties: null,
    }, locals);

    const newItem: KennisItem = {
      id: newId,
      titel: data.titel,
      type: data.type || 'Algemeen',
      categorie: data.categorie || data.type || 'Algemeen',
      tags: data.tags || [],
      eigenaar: data.eigenaar || 'Onbekend',
      auteur: data.eigenaar || 'Onbekend',
      samenvatting: data.samenvatting || '',
      inhoud: data.inhoud || '',
      datumToegevoegd: new Date().toISOString(),
      laatstBijgewerkt: new Date().toISOString(),
      views: 0,
      featured: false,
      afbeelding: data.afbeelding,
    };
    
    // Stuur Slack notificatie
    const slackWebhook = getEnvVar('SLACK_WEBHOOK', locals, false);
    if (slackWebhook) {
      sendSlackNotification(newItem, slackWebhook);
    } else {
      console.warn('⚠️ SLACK_WEBHOOK not configured - skipping notification');
    }
    
    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating kennisitem:', error);
    return new Response(JSON.stringify({ 
      error: 'Database fout bij aanmaken kennisitem',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
