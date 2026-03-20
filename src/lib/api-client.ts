
/**
 * API Client - Automatisch switchen tussen directe database toegang en Azure Functions
 * 
 * Als AZURE_FUNCTIONS_URL is ingesteld, wordt de Azure Functions API gebruikt.
 * Anders wordt de lokale Astro API gebruikt die direct met de database praat.
 */

import { baseUrl } from './base-url';
import { getSession } from './session-manager';

const AZURE_FUNCTIONS_URL = import.meta.env.AZURE_FUNCTIONS_URL;
const USE_AZURE_FUNCTIONS = !!AZURE_FUNCTIONS_URL;

/**
 * Bepaal de base URL voor API calls
 */
function getApiBaseUrl(): string {
  if (USE_AZURE_FUNCTIONS) {
    return AZURE_FUNCTIONS_URL;
  }
  // Gebruik lokale Astro API routes
  return `${baseUrl}/api`;
}

/**
 * Generic fetch wrapper met error handling en authenticatie
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  
  // Get JWT token from session
  const session = getSession();
  const token = session?.token;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        console.error('Unauthorized - redirecting to login');
        if (typeof window !== 'undefined') {
          window.location.href = `${baseUrl}/`;
        }
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API fetch error for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Kennisitems API
 */
export const kennisitemsApi = {
  getAll: () => apiFetch<any[]>('/kennisitems'),
  getById: (id: number) => apiFetch<any>(`/kennisitems/${id}`),
  create: (data: any) => apiFetch<any>('/kennisitems', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch<any>(`/kennisitems/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch<void>(`/kennisitems/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Cases API
 */
export const casesApi = {
  getAll: () => apiFetch<any[]>('/cases'),
  getById: (id: number) => apiFetch<any>(`/cases/${id}`),
  create: (data: any) => apiFetch<any>('/cases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch<any>(`/cases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch<void>(`/cases/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Trends API
 */
export const trendsApi = {
  getAll: () => apiFetch<any[]>('/trends'),
  getById: (id: number) => apiFetch<any>(`/trends/${id}`),
  create: (data: any) => apiFetch<any>('/trends', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch<any>(`/trends/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch<void>(`/trends/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Nieuws API
 */
export const nieuwsApi = {
  getAll: () => apiFetch<any[]>('/nieuws'),
  getById: (id: number) => apiFetch<any>(`/nieuws/${id}`),
  create: (data: any) => apiFetch<any>('/nieuws', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch<any>(`/nieuws/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch<void>(`/nieuws/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Log welke API wordt gebruikt
 */
if (typeof window !== 'undefined') {
  console.log(`🔌 API Client: ${USE_AZURE_FUNCTIONS ? 'Azure Functions' : 'Local Astro API'}`);
  console.log(`📍 Base URL: ${getApiBaseUrl()}`);
}

