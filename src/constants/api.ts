/**
 * API-related constants
 */

// Base API configuration
export const API_CONFIG = {
  get BASE_URL() { return process.env.NEXT_PUBLIC_API_URL || '/api'; },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BUILDINGS: {
    ROOT: '/api/buildings',
    SEARCH: '/api/buildings/search',
    BY_ID: (id: string) => `/api/buildings/${id}`,
    STATS: '/api/buildings/stats',
    TYPES: '/api/buildings/types',
  },
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API response types
export const API_RESPONSE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
} as const;