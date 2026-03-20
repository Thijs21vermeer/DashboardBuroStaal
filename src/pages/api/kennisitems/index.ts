import type { APIRoute } from 'astro';
import sql from 'mssql';
import { getPool, handleDbError } from '../../../lib/db-config';
import type { KennisItem } from '../../../types';
import { requireAuth } from '../../../lib/api-auth';

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
    type: dbRecord.type,
    categorie: dbRecord.categorie || dbRecord.type || 'Algemeen',
    tags,
    gekoppeldProject: dbRecord.gekoppeld_project || undefined,
    eigenaar: dbRecord.eigenaar,
    auteur: dbRecord.eigenaar, // Alias voor frontend compatibility
    samenvatting: dbRecord.samenvatting,
    inhoud: dbRecord.inhoud,
    datumToegevoegd: dbRecord.datum_toegevoegd,
    laatstBijgewerkt: dbRecord.laatst_bijgewerkt,
    views: dbRecord.views || 0,
    featured: dbRecord.featured || false,
    videoLink: dbRecord.video_link || undefined,
    afbeelding: dbRecord.afbeelding || undefined,
  };
}

// Helper functie om Slack notificatie te sturen
async function sendSlackNotification(item: KennisItem, slackWebhook: string) {
  try {
    console.log('🔔 Attempting to send Slack notification...');
    console.log('📝 Item:', item.titel);
    console.log('🔗 Webhook URL exists:', slackWebhook ? 'Yes' : 'No');
    
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
      console.log('Response:', responseText);
    }
  } catch (error) {
    console.error('❌ Error sending Slack notification:', error);
    // Don't throw - we don't want to fail the API request if Slack fails
  }
}

// GET - Haal alle kennisitems op
export const GET: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
  if (authError) return authError;
  
  try {
    const dbPool = await getPool();
    const result = await dbPool.request().query('SELECT * FROM KennisItems ORDER BY datum_toegevoegd DESC');
    
    // Map database records to TypeScript types
    const items = result.recordset.map(mapDbToKennisItem);

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return handleDbError(error, 'fetch kennisitems');
  }
};

// POST - Voeg een nieuw kennisitem toe
export const POST: APIRoute = async ({ request, locals }) => {
  // Check authentication
  const authError = await requireAuth(request, locals);
  if (authError) return authError;
  
  try {
    const data = await request.json();
    const dbPool = await getPool();
    
    const result = await dbPool.request()
      .input('titel', sql.NVarChar, data.titel)
      .input('type', sql.NVarChar, data.type)
      .input('categorie', sql.NVarChar, data.categorie || data.type || 'Algemeen')
      .input('tags', sql.NVarChar, JSON.stringify(data.tags || []))
      .input('gekoppeld_project', sql.NVarChar, data.gekoppeld_project || null)
      .input('eigenaar', sql.NVarChar, data.eigenaar)
      .input('samenvatting', sql.NVarChar, data.samenvatting || null)
      .input('inhoud', sql.NVarChar(sql.MAX), data.inhoud || null)
      .input('media_type', sql.NVarChar, data.media_type || null)
      .input('media_url', sql.NVarChar, data.media_url || null)
      .input('video_link', sql.NVarChar, data.video_link || null)
      .input('afbeelding', sql.NVarChar(sql.MAX), data.afbeelding || null)
      .query(`
        INSERT INTO KennisItems 
        (titel, type, categorie, tags, gekoppeld_project, eigenaar, samenvatting, inhoud, media_type, media_url, video_link, afbeelding, datum_toegevoegd, laatst_bijgewerkt, views, featured)
        OUTPUT INSERTED.*
        VALUES 
        (@titel, @type, @categorie, @tags, @gekoppeld_project, @eigenaar, @samenvatting, @inhoud, @media_type, @media_url, @video_link, @afbeelding, GETDATE(), GETDATE(), 0, 0)
      `);

    const newItem = mapDbToKennisItem(result.recordset[0]);
    
    // Stuur Slack notificatie
    const slackWebhook = locals?.runtime?.env?.SLACK_WEBHOOK || import.meta.env.SLACK_WEBHOOK;
    if (slackWebhook) {
      // Don't await - send in background
      sendSlackNotification(newItem, slackWebhook);
    } else {
      console.warn('⚠️ SLACK_WEBHOOK not configured - skipping notification');
    }
    
    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleDbError(error, 'create kennisitem');
  }
};



















