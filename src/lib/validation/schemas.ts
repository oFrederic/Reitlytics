/**
 * API validation schemas
 * 
 * Centralized validation schemas for API requests and responses
 * to ensure data integrity and provide clear error messages.
 */

import { VALIDATION_LIMITS } from '@/constants/business';
import type { BuildingSearchParams } from '@/types/api';
import { isValidNumberInput } from '@/utils/validation';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Field validation interface  
export interface FieldValidation {
  value: unknown;
  isValid: boolean;
  error?: string;
}

/**
 * Validate building search parameters
 */
export function validateBuildingSearchParams(params: Record<string, string>): ValidationResult {
  const errors: string[] = [];

  // Validate text search query
  if (params.q !== undefined) {
    if (typeof params.q !== 'string') {
      errors.push('Search query must be a string');
    } else if (params.q.length > 100) {
      errors.push('Search query must be less than 100 characters');
    }
  }

  // Validate occupancy rate parameters
  const yieldValidation = validateYieldRange(params.minYield, params.maxYield);
  if (!yieldValidation.isValid) {
    errors.push(...yieldValidation.errors);
  }

  // Validate price parameters
  const priceValidation = validatePriceRange(params.minPrice, params.maxPrice);
  if (!priceValidation.isValid) {
    errors.push(...priceValidation.errors);
  }

  // Validate cap rate parameters
  const capRateValidation = validateCapRateRange(params.minCap, params.maxCap);
  if (!capRateValidation.isValid) {
    errors.push(...capRateValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate building ID parameter
 */
export function validateBuildingId(id: string): ValidationResult {
  const errors: string[] = [];

  if (!id) {
    errors.push('Building ID is required');
  } else if (typeof id !== 'string') {
    errors.push('Building ID must be a string');
  } else if (id.trim() === '') {
    errors.push('Building ID cannot be empty');
  } else if (id.length < 10 || id.length > 100) {
    errors.push('Building ID must be between 10 and 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate asset type parameter
 */
export function validateAssetType(assetType: string): ValidationResult {
  const errors: string[] = [];
  const validAssetTypes = [
    'office',
    'retail', 
    'hotel',
    'parking',
    'industrial',
    'logistic',
    'residential',
    'healthCare',
    'other',
  ];

  if (!assetType) {
    errors.push('Asset type is required');
  } else if (!validAssetTypes.includes(assetType)) {
    errors.push(`Invalid asset type. Valid types: ${validAssetTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate yield (occupancy rate) range parameters
 */
function validateYieldRange(minYield?: string, maxYield?: string): ValidationResult {
  const errors: string[] = [];

  if (minYield !== undefined) {
    const minValidation = validateYieldValue(minYield, 'Minimum yield');
    if (!minValidation.isValid) {
      errors.push(minValidation.error!);
    }
  }

  if (maxYield !== undefined) {
    const maxValidation = validateYieldValue(maxYield, 'Maximum yield');
    if (!maxValidation.isValid) {
      errors.push(maxValidation.error!);
    }
  }

  // Validate range logic
  if (minYield && maxYield && isValidNumberInput(minYield) && isValidNumberInput(maxYield)) {
    const min = parseFloat(minYield);
    const max = parseFloat(maxYield);
    if (min > max) {
      errors.push('Minimum yield cannot be greater than maximum yield');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate price range parameters
 */
function validatePriceRange(minPrice?: string, maxPrice?: string): ValidationResult {
  const errors: string[] = [];

  if (minPrice !== undefined) {
    const minValidation = validatePriceValue(minPrice, 'Minimum price');
    if (!minValidation.isValid) {
      errors.push(minValidation.error!);
    }
  }

  if (maxPrice !== undefined) {
    const maxValidation = validatePriceValue(maxPrice, 'Maximum price');
    if (!maxValidation.isValid) {
      errors.push(maxValidation.error!);
    }
  }

  // Validate range logic
  if (minPrice && maxPrice && isValidNumberInput(minPrice) && isValidNumberInput(maxPrice)) {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (min > max) {
      errors.push('Minimum price cannot be greater than maximum price');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate cap rate range parameters
 */
function validateCapRateRange(minCap?: string, maxCap?: string): ValidationResult {
  const errors: string[] = [];

  if (minCap !== undefined) {
    const minValidation = validateCapRateValue(minCap, 'Minimum cap rate');
    if (!minValidation.isValid) {
      errors.push(minValidation.error!);
    }
  }

  if (maxCap !== undefined) {
    const maxValidation = validateCapRateValue(maxCap, 'Maximum cap rate');
    if (!maxValidation.isValid) {
      errors.push(maxValidation.error!);
    }
  }

  // Validate range logic
  if (minCap && maxCap && isValidNumberInput(minCap) && isValidNumberInput(maxCap)) {
    const min = parseFloat(minCap);
    const max = parseFloat(maxCap);
    if (min > max) {
      errors.push('Minimum cap rate cannot be greater than maximum cap rate');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate individual yield value
 */
function validateYieldValue(value: string, fieldName: string): FieldValidation {
  if (!isValidNumberInput(value)) {
    return {
      value,
      isValid: false,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (value === '') {
    return { value, isValid: true };
  }

  const numValue = parseFloat(value);
  if (numValue < VALIDATION_LIMITS.MIN_OCCUPANCY_RATE) {
    return {
      value,
      isValid: false,
      error: `${fieldName} cannot be less than ${VALIDATION_LIMITS.MIN_OCCUPANCY_RATE}%`,
    };
  }

  if (numValue > VALIDATION_LIMITS.MAX_OCCUPANCY_RATE) {
    return {
      value,
      isValid: false,
      error: `${fieldName} cannot be greater than ${VALIDATION_LIMITS.MAX_OCCUPANCY_RATE}%`,
    };
  }

  return { value, isValid: true };
}

/**
 * Validate individual price value
 */
function validatePriceValue(value: string, fieldName: string): FieldValidation {
  if (!isValidNumberInput(value)) {
    return {
      value,
      isValid: false,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (value === '') {
    return { value, isValid: true };
  }

  const numValue = parseFloat(value);
  if (numValue < VALIDATION_LIMITS.MIN_PRICE_MILLION_YEN) {
    return {
      value,
      isValid: false,
      error: `${fieldName} cannot be negative`,
    };
  }

  if (numValue > VALIDATION_LIMITS.MAX_PRICE_MILLION_YEN) {
    return {
      value,
      isValid: false,
      error: `${fieldName} exceeds maximum allowed value`,
    };
  }

  return { value, isValid: true };
}

/**
 * Validate individual cap rate value
 */
function validateCapRateValue(value: string, fieldName: string): FieldValidation {
  if (!isValidNumberInput(value)) {
    return {
      value,
      isValid: false,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (value === '') {
    return { value, isValid: true };
  }

  const numValue = parseFloat(value);
  if (numValue < VALIDATION_LIMITS.MIN_CAP_RATE) {
    return {
      value,
      isValid: false,
      error: `${fieldName} cannot be less than ${VALIDATION_LIMITS.MIN_CAP_RATE}%`,
    };
  }

  if (numValue > VALIDATION_LIMITS.MAX_CAP_RATE) {
    return {
      value,
      isValid: false,
      error: `${fieldName} cannot be greater than ${VALIDATION_LIMITS.MAX_CAP_RATE}%`,
    };
  }

  return { value, isValid: true };
}

/**
 * Sanitize and normalize search parameters
 */
export function sanitizeSearchParams(params: Record<string, string>): BuildingSearchParams {
  const sanitized: BuildingSearchParams = {};

  // Text search
  if (params.q) {
    sanitized.q = params.q.trim().substring(0, 100);
  }

  // Numeric parameters
  if (params.minYield && isValidNumberInput(params.minYield)) {
    sanitized.minYield = params.minYield.trim();
  }
  if (params.maxYield && isValidNumberInput(params.maxYield)) {
    sanitized.maxYield = params.maxYield.trim();
  }
  if (params.minPrice && isValidNumberInput(params.minPrice)) {
    sanitized.minPrice = params.minPrice.trim();
  }
  if (params.maxPrice && isValidNumberInput(params.maxPrice)) {
    sanitized.maxPrice = params.maxPrice.trim();
  }
  if (params.minCap && isValidNumberInput(params.minCap)) {
    sanitized.minCap = params.minCap.trim();
  }
  if (params.maxCap && isValidNumberInput(params.maxCap)) {
    sanitized.maxCap = params.maxCap.trim();
  }

  return sanitized;
}