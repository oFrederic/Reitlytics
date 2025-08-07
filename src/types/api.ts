/**
 * API-related type definitions
 * 
 * Centralized types for API requests, responses, and error handling
 * to ensure type safety across the entire application.
 */

import type { JReitBuilding } from '@/mocks/buildings.type';

// Base API response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// Success response type
export interface ApiSuccessResponse<T> extends ApiResponse<T> {
  success: true;
  data: T;
}

// Error response type  
export interface ApiErrorResponse extends ApiResponse {
  success: false;
  error: ApiError;
}

// API error structure
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

// API error codes
export enum ApiErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

// HTTP methods
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

// API request configuration
export interface ApiRequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
}

// Search parameters for buildings API
export interface BuildingSearchParams {
  q?: string;          // Text search query
  minYield?: string;   // Minimum occupancy rate
  maxYield?: string;   // Maximum occupancy rate  
  minPrice?: string;   // Minimum appraisal price (million yen)
  maxPrice?: string;   // Maximum appraisal price (million yen)
  minCap?: string;     // Minimum cap rate
  maxCap?: string;     // Maximum cap rate
}

// Search results response
export interface BuildingSearchResult {
  results: JReitBuilding[];
  count: number;
  filters: BuildingSearchParams;
}

// Building statistics response
export interface BuildingStatsResult {
  totalBuildings: number;
  assetTypes: {
    office: number;
    retail: number;
    hotel: number;
    parking: number;
    industrial: number;
    logistic: number;
    residential: number;
    healthCare: number;
    other: number;
  };
  averageCapRate: string | null;
}

// Building types filter response
export interface BuildingTypesResult {
  buildings: JReitBuilding[];
  count: number;
  assetType: string;
}

// Asset type keys (for type safety)
export type AssetTypeKey = 
  | 'office' 
  | 'retail' 
  | 'hotel' 
  | 'parking'
  | 'industrial'
  | 'logistic'
  | 'residential'
  | 'healthCare'
  | 'other';

// Re-export building types from mocks for consistency
export type { JReitBuilding, JReitData } from '@/mocks/buildings.type';