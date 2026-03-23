/**
 * API Client - Centralized API calls with authentication
 * 
 * Provides a consistent interface for all API calls with:
 * - Automatic JWT token handling
 * - Error handling and retries
 * - Timeout management
 * - Type safety
 */

import { baseUrl } from './base-url';
import { getSession } from './session-manager';
import { API_CONFIG } from './config';

/**
 * API Client Configuration
 */
const DEFAULT_TIMEOUT = API_CONFIG.timeout;
const MAX_RETRY_ATTEMPTS = API_CONFIG.retryAttempts;

/**
 * Generic fetch wrapper met error handling en authenticatie
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit, retryCount = 0): Promise<T> {
  const url = `${baseUrl}/api${endpoint}`;
  
  // Get JWT token from session
  const session = getSession();
  const token = session?.token;
  
  try {
    const response = await Promise.race([
      fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options?.headers,
        },
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), DEFAULT_TIMEOUT)
      )
    ]);

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
    // Retry logic for network errors
    if (retryCount < MAX_RETRY_ATTEMPTS && error instanceof Error) {
      console.warn(`Request failed, retrying... (${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return apiFetch(endpoint, options, retryCount + 1);
    }
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
 * Tools API
 */
export const toolsApi = {
  getAll: () => apiFetch<any[]>('/tools'),
  getById: (id: number) => apiFetch<any>(`/tools/${id}`),
  create: (data: any) => apiFetch<any>('/tools', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch<any>(`/tools/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch<void>(`/tools/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Videos API
 */
export const videosApi = {
  getAll: () => apiFetch<any[]>('/videos'),
  getById: (id: number) => apiFetch<any>(`/videos/${id}`),
  create: (data: any) => apiFetch<any>('/videos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch<any>(`/videos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch<void>(`/videos/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Team/Partners API
 */
export const teamApi = {
  getAll: () => apiFetch<any[]>('/team'),
  getById: (id: number) => apiFetch<any>(`/team/${id}`),
  create: (data: any) => apiFetch<any>('/team', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch<any>(`/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch<void>(`/team/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * Unified API Client export
 */
export const apiClient = {
  kennisitems: kennisitemsApi,
  cases: casesApi,
  trends: trendsApi,
  nieuws: nieuwsApi,
  tools: toolsApi,
  videos: videosApi,
  team: teamApi,
};

/**
 * Log welke API wordt gebruikt (client-side only)
 */
if (typeof window !== 'undefined') {
  console.log(`🔌 API Client initialized`);
  console.log(`📍 Base URL: ${baseUrl}/api`);
}

