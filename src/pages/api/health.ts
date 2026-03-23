import type { APIRoute } from 'astro';
import { getPool } from '../../lib/db-config';
import { getEnvVar } from '../../lib/config';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const dbPool = await getPool(locals);
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
  
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasAzureServer: !!getEnvVar('AZURE_SQL_SERVER', locals),
        hasAzureDatabase: !!getEnvVar('AZURE_SQL_DATABASE', locals),
        hasAzureUser: !!getEnvVar('AZURE_SQL_USER', locals),
        hasAzurePassword: !!getEnvVar('AZURE_SQL_PASSWORD', locals),
        hasSlackWebhook: !!getEnvVar('SLACK_WEBHOOK', locals),
        hasJwtSecret: !!getEnvVar('JWT_SECRET', locals) || !!getEnvVar('AUTH_SECRET', locals),
      },
      runtime: {
        node: process.version,
        platform: process.platform,
      },
    }),
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
};




