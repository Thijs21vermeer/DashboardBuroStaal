
#!/usr/bin/env node

/**
 * .env Configuration Checker
 * Validates that all required environment variables are set
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
config({ path: join(__dirname, '.env') });

console.log('🔍 Checking .env configuration...\n');

// Define required and optional variables
const requiredVars = {
  'Auth0 Authentication': [
    { key: 'AUTH0_DOMAIN', example: 'your-tenant.eu.auth0.com' },
    { key: 'AUTH0_CLIENT_ID', example: 'abc123...' },
    { key: 'AUTH0_CLIENT_SECRET', example: 'xyz789...' },
    { key: 'APP_ORIGIN', example: 'http://localhost:3000' },
  ],
  'Security Secrets': [
    { key: 'COOKIE_SECRET', example: 'base64 string (32+ chars)' },
    { key: 'JWT_SECRET', example: 'base64 string (32+ chars)', hasValue: !!process.env.JWT_SECRET },
  ],
  'Azure SQL Database': [
    { key: 'AZURE_SQL_SERVER', example: 'dashboardbs.database.windows.net' },
    { key: 'AZURE_SQL_DATABASE', example: 'dashboarddb' },
    { key: 'AZURE_SQL_USER', example: 'databasedashboard' },
    { key: 'AZURE_SQL_PASSWORD', example: 'your_password' },
  ],
};

const optionalVars = {
  'Webflow (Already Set ✓)': [
    { key: 'WEBFLOW_API_HOST', hasValue: !!process.env.WEBFLOW_API_HOST },
    { key: 'WEBFLOW_SITE_API_TOKEN', hasValue: !!process.env.WEBFLOW_SITE_API_TOKEN },
    { key: 'WEBFLOW_CMS_SITE_API_TOKEN', hasValue: !!process.env.WEBFLOW_CMS_SITE_API_TOKEN },
  ],
  'Optional Features': [
    { key: 'DASHBOARD_PASSWORD', note: 'Legacy password login', hasValue: !!process.env.DASHBOARD_PASSWORD },
    { key: 'SLACK_WEBHOOK', note: 'Slack notifications', hasValue: !!process.env.SLACK_WEBHOOK },
    { key: 'TURSO_DATABASE_URL', note: 'Turso database (not used)', hasValue: !!process.env.TURSO_DATABASE_URL },
    { key: 'TURSO_AUTH_TOKEN', note: 'Turso auth (not used)', hasValue: !!process.env.TURSO_AUTH_TOKEN },
  ],
};

let missingCount = 0;
let warningCount = 0;

// Check required variables
console.log('═══════════════════════════════════════════════════');
console.log('📋 REQUIRED VARIABLES');
console.log('═══════════════════════════════════════════════════\n');

for (const [category, vars] of Object.entries(requiredVars)) {
  console.log(`\n${category}:`);
  console.log('─'.repeat(50));
  
  for (const { key, example, hasValue } of vars) {
    const value = hasValue !== undefined ? hasValue : !!process.env[key];
    
    if (value) {
      console.log(`  ✅ ${key}`);
    } else {
      console.log(`  ❌ ${key} - MISSING!`);
      console.log(`     Example: ${example}`);
      missingCount++;
    }
  }
}

// Check optional variables
console.log('\n\n═══════════════════════════════════════════════════');
console.log('🔧 OPTIONAL VARIABLES');
console.log('═══════════════════════════════════════════════════\n');

for (const [category, vars] of Object.entries(optionalVars)) {
  console.log(`\n${category}:`);
  console.log('─'.repeat(50));
  
  for (const { key, note, hasValue } of vars) {
    const value = hasValue !== undefined ? hasValue : !!process.env[key];
    const noteText = note ? ` (${note})` : '';
    
    if (value) {
      console.log(`  ✅ ${key}${noteText}`);
    } else {
      console.log(`  ⚪ ${key}${noteText} - not set`);
    }
  }
}

// Summary
console.log('\n\n═══════════════════════════════════════════════════');
console.log('📊 SUMMARY');
console.log('═══════════════════════════════════════════════════\n');

if (missingCount === 0) {
  console.log('✅ All required variables are set!');
  console.log('🚀 You can run: npm run dev\n');
} else {
  console.log(`❌ ${missingCount} required variable(s) missing!`);
  console.log('\n📝 Next steps:');
  console.log('1. Check ENV_TEMPLATE.md for the complete template');
  console.log('2. Follow AUTH0_QUICKSTART.md for Auth0 setup');
  console.log('3. Run ./generate-secrets.sh to generate new secrets');
  console.log('4. Update your .env file with the missing values\n');
}

// Additional checks
console.log('═══════════════════════════════════════════════════');
console.log('🔐 SECURITY CHECKS');
console.log('═══════════════════════════════════════════════════\n');

// Check JWT_SECRET length
if (process.env.JWT_SECRET) {
  const jwtLength = process.env.JWT_SECRET.length;
  if (jwtLength < 32) {
    console.log(`⚠️  JWT_SECRET is too short (${jwtLength} chars, recommended: 32+)`);
    warningCount++;
  } else {
    console.log(`✅ JWT_SECRET length OK (${jwtLength} chars)`);
  }
}

// Check COOKIE_SECRET length
if (process.env.COOKIE_SECRET) {
  const cookieLength = process.env.COOKIE_SECRET.length;
  if (cookieLength < 32) {
    console.log(`⚠️  COOKIE_SECRET is too short (${cookieLength} chars, recommended: 32+)`);
    warningCount++;
  } else {
    console.log(`✅ COOKIE_SECRET length OK (${cookieLength} chars)`);
  }
}

// Check if using default/example values
const examplePatterns = [
  'your_', 'your-', 'example', 'GENERATE_ME', 'abc123', 'xyz789'
];

for (const [key, value] of Object.entries(process.env)) {
  if (typeof value === 'string') {
    for (const pattern of examplePatterns) {
      if (value.includes(pattern)) {
        console.log(`⚠️  ${key} appears to contain an example value`);
        warningCount++;
        break;
      }
    }
  }
}

if (warningCount === 0 && missingCount === 0) {
  console.log('\n✅ No security warnings!');
}

console.log('\n');
process.exit(missingCount > 0 ? 1 : 0);

