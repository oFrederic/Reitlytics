/**
 * Environment configuration
 * 
 * Centralized configuration for environment variables with validation
 * and fallback values for robust application behavior.
 */

// Environment validation helper
function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name];
  if (!value && !fallback) {
    console.warn(`Environment variable ${name} is not set`);
  }
  return value || fallback || '';
}

// Mapbox token protection and validation
function getProtectedMapboxToken(): string | null {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  
  if (!token) {
    console.warn('Mapbox token not found. Map functionality will be disabled.');
    return null;
  }

  // Basic token format validation
  if (!token.startsWith('pk.')) {
    console.error('Invalid Mapbox token format. Token should start with "pk."');
    return null;
  }

  return token;
}

// Environment configuration - evaluated when accessed
export const ENV_CONFIG = {
  get NODE_ENV() { return getEnvVar('NODE_ENV', 'development'); },
  get IS_DEVELOPMENT() { return process.env.NODE_ENV === 'development'; },
  get IS_PRODUCTION() { return process.env.NODE_ENV === 'production'; },
  get IS_TEST() { return process.env.NODE_ENV === 'test'; },
} as const;

// Logging configuration
export const LOGGING_CONFIG = {
  get LEVEL() { return getEnvVar('NEXT_PUBLIC_LOG_LEVEL', ENV_CONFIG.IS_PRODUCTION ? 'error' : 'debug'); },
  get ENABLE_CONSOLE() { return !ENV_CONFIG.IS_PRODUCTION || ENV_CONFIG.IS_DEVELOPMENT; },
} as const;

// Mapbox configuration with protection
export const MAPBOX_CONFIG = {
  get ACCESS_TOKEN() { return getProtectedMapboxToken(); },
  get STYLE() { return getEnvVar('NEXT_PUBLIC_MAPBOX_STYLE', 'mapbox://styles/mapbox/streets-v12'); },
  get IS_ENABLED() { return getProtectedMapboxToken() !== null; },
} as const;