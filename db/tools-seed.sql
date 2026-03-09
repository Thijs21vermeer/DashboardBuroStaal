-- Seed data voor tools tabel

-- Azure Database Connection String
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet)
VALUES (
  'Azure SQL Connection String',
  'Configuration',
  'Connection string voor Azure SQL Database in Node.js/TypeScript',
  'const dbConfig = {
  server: process.env.AZURE_SQL_SERVER || '''',
  database: process.env.AZURE_SQL_DATABASE || '''',
  user: process.env.AZURE_SQL_USER || '''',
  password: process.env.AZURE_SQL_PASSWORD || '''',
  port: parseInt(process.env.AZURE_SQL_PORT || ''1433''),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};',
  'typescript',
  'azure, database, mssql, connection',
  'Rick',
  1
);

-- Netlify Deployment Command
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet)
VALUES (
  'Deploy naar Netlify',
  'Command',
  'Build en deploy command voor Netlify deployment',
  'BUILD_TARGET=netlify npm run build && netlify deploy --prod',
  'bash',
  'netlify, deployment, build',
  'Rick',
  1
);

-- API Fetch Wrapper
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar)
VALUES (
  'Reusable Fetch Hook',
  'Code Snippet',
  'React hook voor data fetching met loading en error states',
  'import { useState, useEffect } from ''react'';
import { baseUrl } from ''../lib/base-url'';

export function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}${endpoint}`);
        if (!response.ok) throw new Error(''Failed to fetch'');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : ''An error occurred'');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}',
  'typescript',
  'react, hooks, fetch, api',
  'Rick'
);

-- Git Commands
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar)
VALUES (
  'Git: Nieuwe Branch en Push',
  'Command',
  'Maak een nieuwe branch aan, commit changes en push naar remote',
  'git checkout -b feature/nieuwe-feature
git add .
git commit -m "Add nieuwe feature"
git push -u origin feature/nieuwe-feature',
  'bash',
  'git, version-control, workflow',
  'Team'
);

-- SQL Query: Get Latest Items
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar)
VALUES (
  'SQL: Laatste 10 Items',
  'SQL',
  'Query om de laatste 10 items te krijgen met alle details',
  'SELECT TOP 10 
  id,
  titel,
  categorie,
  datum_toegevoegd,
  eigenaar
FROM kennisitems
ORDER BY datum_toegevoegd DESC;',
  'sql',
  'database, query, mssql',
  'Rick'
);

-- Environment Variables Template
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar, favoriet)
VALUES (
  '.env Template',
  'Configuration',
  'Environment variables template voor Azure SQL en andere services',
  '# Azure SQL Database
AZURE_SQL_SERVER=your-server.database.windows.net
AZURE_SQL_DATABASE=your-database
AZURE_SQL_USER=your-username
AZURE_SQL_PASSWORD=your-password
AZURE_SQL_PORT=1433

# Base URL (optional)
PUBLIC_BASE_URL=/app',
  'bash',
  'environment, configuration, azure',
  'Rick',
  1
);

-- React Component Template
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar)
VALUES (
  'React Component Template',
  'Code Snippet',
  'Basis template voor een nieuwe React component met TypeScript',
  'import { useState } from ''react'';

interface Props {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: Props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <button 
        onClick={() => setIsActive(!isActive)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Toggle: {isActive ? ''Active'' : ''Inactive''}
      </button>
    </div>
  );
}',
  'typescript',
  'react, component, template',
  'Kevin'
);

-- API Route Template
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar)
VALUES (
  'Astro API Route Template',
  'Code Snippet',
  'Template voor een nieuwe Astro API route met GET en POST',
  'import type { APIRoute } from ''astro'';
import sql from ''mssql'';

const dbConfig = {
  // ... your config
};

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .query(''SELECT * FROM your_table'');
    
    await pool.close();

    return new Response(JSON.stringify(result.recordset), {
      status: 200,
      headers: { ''Content-Type'': ''application/json'' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: ''Database error'' }), {
      status: 500,
      headers: { ''Content-Type'': ''application/json'' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    // ... handle post
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { ''Content-Type'': ''application/json'' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: ''Error'' }), {
      status: 500,
      headers: { ''Content-Type'': ''application/json'' },
    });
  }
};',
  'typescript',
  'astro, api, rest, template',
  'Rick'
);

-- NPM Install Commands
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar)
VALUES (
  'Veelgebruikte NPM Packages',
  'Command',
  'Installeer veelgebruikte packages voor dit project',
  '# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-select

# Database
npm install mssql @types/mssql

# Utilities
npm install clsx tailwind-merge date-fns',
  'bash',
  'npm, dependencies, install',
  'Team'
);

-- Tailwind Custom Classes
INSERT INTO tools (titel, categorie, beschrijving, code, taal, tags, eigenaar)
VALUES (
  'Custom Tailwind Utilities',
  'Code Snippet',
  'Handige custom Tailwind CSS utility classes',
  '/* In je global.css */

/* Gradient Text */
.gradient-text {
  @apply bg-gradient-to-r from-[#280bc4] to-[#7ef769] bg-clip-text text-transparent;
}

/* Glassmorphism Card */
.glass-card {
  @apply bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg;
}

/* Smooth Shadow */
.smooth-shadow {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}',
  'css',
  'tailwind, css, styling, utilities',
  'Kevin'
);
