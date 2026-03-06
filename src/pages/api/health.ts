import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: {
      hasAzureServer: !!import.meta.env.AZURE_SQL_SERVER,
      hasAzureDatabase: !!import.meta.env.AZURE_SQL_DATABASE,
      hasAzureUser: !!import.meta.env.AZURE_SQL_USER,
      hasAzurePassword: !!import.meta.env.AZURE_SQL_PASSWORD,
    },
    runtime: {
      node: typeof process !== 'undefined' ? process.version : 'N/A',
      platform: typeof process !== 'undefined' ? process.platform : 'N/A',
    }
  };

  return new Response(JSON.stringify(healthCheck, null, 2), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
};
