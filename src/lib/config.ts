




// Load environment variables from .env in development
import './load-env.cjs';

/**
 * Application Configuration
 * Centralized configuration for all environment variables and constants
 */

// ============================================================================
// Environment Variable Helper (for Node.js and Cloudflare Workers)
// ============================================================================

function getEnv(key: string): string | undefined {
  // Try import.meta.env first (works in both dev and production)
  if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
    return import.meta.env[key];
  }
  
  // Fallback to process.env for Node.js (development mode)
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  
  return undefined;
}

// ============================================================================
// Environment Detection
// ============================================================================

// Environment detection - works in both Node.js and Astro contexts
export const isDevelopment = 
  (typeof import.meta !== 'undefined' && import.meta.env?.DEV) || 
  process.env.NODE_ENV === 'development';

export const isProduction = 
  (typeof import.meta !== 'undefined' && import.meta.env?.PROD) || 
  process.env.NODE_ENV === 'production';

// ============================================================================
// Authentication & Security (RUNTIME)
// ============================================================================

/**
 * Get AUTH_SECRET at runtime from locals or environment
 * This is CRITICAL for Netlify where env vars come from locals.runtime.env
 * 
 * SECURITY: In production, we FAIL CLOSED if no secret is configured.
 * A default secret is a security vulnerability - anyone with access to the code
 * can generate valid tokens.
 */
export function getAuthSecret(locals?: any): string {
  // Try locals.runtime.env first (Netlify/Cloudflare runtime)
  const secret = 
    locals?.runtime?.env?.JWT_SECRET || 
    locals?.runtime?.env?.AUTH_SECRET ||
    getEnv('JWT_SECRET') || 
    getEnv('AUTH_SECRET');
  
  // SECURITY: FAIL CLOSED in production if no secret is configured
  if (!secret) {
    if (isProduction) {
      console.error('🚨 SECURITY ERROR: No JWT_SECRET or AUTH_SECRET configured in production!');
      throw new Error('Authentication secret not configured. Application cannot start.');
    }
    
    // In development, allow a default for convenience, but warn loudly
    console.warn('⚠️  WARNING: Using default auth secret in development. DO NOT use in production!');
    return 'dev-only-secret-DO-NOT-USE-IN-PRODUCTION';
  }
  
  // Additional validation: Reject known unsafe secrets
  const unsafeSecrets = [
    'burostaal-secret-key-change-in-production',
    'change-me',
    'secret',
    'password',
    'dev-only-secret-DO-NOT-USE-IN-PRODUCTION',
  ];
  
  if (unsafeSecrets.includes(secret)) {
    if (isProduction) {
      console.error('🚨 SECURITY ERROR: Unsafe/default secret detected in production!');
      throw new Error('Unsafe authentication secret detected. Application cannot start.');
    }
    console.warn('⚠️  WARNING: Using unsafe secret in development.');
  }
  
  return secret;
}

// Session configuration
export const SESSION_DURATION_HOURS = 24;
export const SESSION_DURATION_MS = SESSION_DURATION_HOURS * 60 * 60 * 1000;
export const SESSION_DURATION_SECONDS = SESSION_DURATION_HOURS * 60 * 60;

// ============================================================================
// Database Configuration (RUNTIME)
// ============================================================================

/**
 * Get database configuration at runtime
 * This ensures environment variables are available from locals in Netlify
 */
export function getDatabaseConfig(locals?: any) {
  return {
    server: locals?.runtime?.env?.AZURE_SQL_SERVER || getEnv('AZURE_SQL_SERVER') || 'dashboardbs.database.windows.net',
    database: locals?.runtime?.env?.AZURE_SQL_DATABASE || getEnv('AZURE_SQL_DATABASE') || 'dashboarddb',
    user: locals?.runtime?.env?.AZURE_SQL_USER || getEnv('AZURE_SQL_USER') || 'databasedashboard',
    password: locals?.runtime?.env?.AZURE_SQL_PASSWORD || getEnv('AZURE_SQL_PASSWORD') || '',
    port: parseInt(locals?.runtime?.env?.AZURE_SQL_PORT || getEnv('AZURE_SQL_PORT') || '1433', 10),
  };
}

// Validate database config
export function validateDatabaseConfig(locals?: any): { valid: boolean; missing: string[] } {
  const config = getDatabaseConfig(locals);
  const missing: string[] = [];
  
  if (!config.server) missing.push('AZURE_SQL_SERVER');
  if (!config.database) missing.push('AZURE_SQL_DATABASE');
  if (!config.user) missing.push('AZURE_SQL_USER');
  if (!config.password) missing.push('AZURE_SQL_PASSWORD');
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// ============================================================================
// API Configuration
// ============================================================================

export const API_CONFIG = {
  azureFunctionsUrl: getEnv('AZURE_FUNCTIONS_URL'),
  useAzureFunctions: !!getEnv('AZURE_FUNCTIONS_URL'),
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
} as const;

// ============================================================================
// Rate Limiting
// ============================================================================

export const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMinutes: 15,
  blockDurationMinutes: 30,
  cleanupIntervalMinutes: 60,
  delayAfterAttempts: {
    3: 1000,
    4: 3000,
    5: 5000,
  }
} as const;

// ============================================================================
// Notifications
// ============================================================================

export function getSlackWebhook(locals?: any): string | undefined {
  return locals?.runtime?.env?.SLACK_WEBHOOK || getEnv('SLACK_WEBHOOK');
}

// ============================================================================
// Dashboard Password
// ============================================================================

export function getDashboardPassword(locals?: any): string | undefined {
  return locals?.runtime?.env?.DASHBOARD_PASSWORD || getEnv('DASHBOARD_PASSWORD');
}

// ============================================================================
// UI Constants
// ============================================================================

export const UI_CONSTANTS = {
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Search
  minSearchLength: 2,
  searchDebounceMs: 300,
  maxSearchResults: 50,
  
  // Display
  maxTagsDisplay: 5,
  maxDescriptionLength: 200,
  maxTitleLength: 100,
  
  // Colors
  colors: {
    primary: '#280bc4',
    secondary: '#7ef769',
    accent: '#7f56d9',
    background: '#f4ebff',
  },
  
  // Sizes
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxImageSize: 2 * 1024 * 1024, // 2MB
} as const;

// ============================================================================
// Content Types
// ============================================================================

export const CONTENT_TYPES = {
  kennisitem: {
    label: 'Kennisitem',
    color: 'bg-blue-100 text-blue-800',
    icon: 'BookOpen',
  },
  case: {
    label: 'Case Study',
    color: 'bg-purple-100 text-purple-800',
    icon: 'Briefcase',
  },
  trend: {
    label: 'Trend',
    color: 'bg-green-100 text-green-800',
    icon: 'TrendingUp',
  },
  tool: {
    label: 'Tool',
    color: 'bg-orange-100 text-orange-800',
    icon: 'Wrench',
  },
  nieuws: {
    label: 'Nieuws',
    color: 'bg-red-100 text-red-800',
    icon: 'Newspaper',
  },
  video: {
    label: 'Video',
    color: 'bg-pink-100 text-pink-800',
    icon: 'Video',
  },
} as const;

// ============================================================================
// Kennisitem Types
// ============================================================================

export const KENNISITEM_TYPES = [
  'Artikel',
  'Tutorial',
  'Best Practice',
  'Documentatie',
  'Handleiding',
  'Tip',
  'Onderzoek',
  'Whitepaper',
] as const;

// ============================================================================
// Kennisbank Categories and Media Types
// ============================================================================

export const KENNISBANK_CATEGORIES = [
  'SEO & Online Marketing',
  'Webdesign & Development',
  'Branding & Communicatie',
  'Social Media',
  'Analytics & Data',
  'Algemeen'
] as const;

export const MEDIA_TYPES = [
  'Artikel',
  'Video',
  'Presentatie',
  'Template',
  'Checklist',
  'Document',
  'Whitepaper'
] as const;

export type KennisCategorie = typeof KENNISBANK_CATEGORIES[number];
export type MediaType = typeof MEDIA_TYPES[number];

// ============================================================================
// Relevantie Levels
// ============================================================================

export const RELEVANTIE_LEVELS = {
  HOOG: {
    label: 'Hoog',
    color: 'bg-red-100 text-red-800 border-red-300',
    iconColor: 'text-red-500',
    threshold: 80, // For numeric relevantie
  },
  GEMIDDELD: {
    label: 'Gemiddeld',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    iconColor: 'text-yellow-500',
    threshold: 50, // For numeric relevantie
  },
  LAAG: {
    label: 'Laag',
    color: 'bg-green-100 text-green-800 border-green-300',
    iconColor: 'text-green-500',
    threshold: 0, // For numeric relevantie
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get environment variable with runtime fallback (for Cloudflare Workers)
 */
export function getEnvVar(key: string, locals?: any): string | undefined {
  return locals?.runtime?.env?.[key] || getEnv(key);
}

/**
 * Get content type configuration
 */
export function getContentTypeConfig(type: string) {
  return CONTENT_TYPES[type as keyof typeof CONTENT_TYPES] || {
    label: type,
    color: 'bg-gray-100 text-gray-800',
    icon: 'File',
  };
}

/**
 * Get relevantie level from value (string or number)
 */
export function getRelevantieLevel(relevantie: string | number) {
  if (typeof relevantie === 'string') {
    const rel = relevantie.toLowerCase();
    if (rel.includes('zeer') || rel === 'hoog') {
      return RELEVANTIE_LEVELS.HOOG;
    } else if (rel === 'relevant' || rel === 'gemiddeld' || rel === 'middel') {
      return RELEVANTIE_LEVELS.GEMIDDELD;
    }
    return RELEVANTIE_LEVELS.LAAG;
  } else if (typeof relevantie === 'number') {
    if (relevantie >= RELEVANTIE_LEVELS.HOOG.threshold) {
      return RELEVANTIE_LEVELS.HOOG;
    } else if (relevantie >= RELEVANTIE_LEVELS.GEMIDDELD.threshold) {
      return RELEVANTIE_LEVELS.GEMIDDELD;
    }
    return RELEVANTIE_LEVELS.LAAG;
  }
  return RELEVANTIE_LEVELS.LAAG;
}

/**
 * Truncate text to max length
 */
export function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format date to Dutch locale
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to short Dutch format
 */
export function formatDateShort(date: string | Date | undefined | null): string {
  if (!date) return 'Geen datum';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('nl-NL');
}





