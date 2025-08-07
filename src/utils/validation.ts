/**
 * Validation utility functions
 * 
 * Centralized validation logic for forms, inputs, and data processing
 * to ensure consistent validation behavior across the application.
 */

import { VALIDATION_LIMITS } from '@/constants/business';
import type { FieldValidation, BuildingSearchParams } from '@/types';

// Regular expressions for validation
const VALIDATION_PATTERNS = {
  NUMBER: /^(\d+)?(\.\d+)?$/,
  POSITIVE_NUMBER: /^[0-9]*\.?[0-9]+$/,
  INTEGER: /^\d+$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  JAPANESE_TEXT: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/,
} as const;

/**
 * Validates if a string contains a valid number (including decimals)
 * Allows empty strings for optional fields
 */
export function isValidNumberInput(value: string): boolean {
  return value === '' || VALIDATION_PATTERNS.NUMBER.test(value);
}

/**
 * Validates if a string contains a positive number
 */
export function isPositiveNumber(value: string): boolean {
  if (value === '') return false;
  return VALIDATION_PATTERNS.POSITIVE_NUMBER.test(value) && parseFloat(value) > 0;
}

/**
 * Validates if a string contains a valid integer
 */
export function isInteger(value: string): boolean {
  return value === '' || VALIDATION_PATTERNS.INTEGER.test(value);
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_PATTERNS.EMAIL.test(email.trim());
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
  return VALIDATION_PATTERNS.URL.test(url.trim());
}

/**
 * Validates if text contains Japanese characters
 */
export function containsJapanese(text: string): boolean {
  return VALIDATION_PATTERNS.JAPANESE_TEXT.test(text);
}

/**
 * Validates occupancy rate (0-100%)
 */
export function validateOccupancyRate(value: string): FieldValidation {
  if (value === '') {
    return { isValid: true };
  }

  if (!isValidNumberInput(value)) {
    return { isValid: false, errorMessage: '数値を入力してください' };
  }

  const numValue = parseFloat(value);
  if (numValue < VALIDATION_LIMITS.MIN_OCCUPANCY_RATE) {
    return { isValid: false, errorMessage: `${VALIDATION_LIMITS.MIN_OCCUPANCY_RATE}%以上を入力してください` };
  }

  if (numValue > VALIDATION_LIMITS.MAX_OCCUPANCY_RATE) {
    return { isValid: false, errorMessage: `${VALIDATION_LIMITS.MAX_OCCUPANCY_RATE}%以下を入力してください` };
  }

  return { isValid: true };
}

/**
 * Validates cap rate (0-20%)
 */
export function validateCapRate(value: string): FieldValidation {
  if (value === '') {
    return { isValid: true };
  }

  if (!isValidNumberInput(value)) {
    return { isValid: false, errorMessage: '数値を入力してください' };
  }

  const numValue = parseFloat(value);
  if (numValue < VALIDATION_LIMITS.MIN_CAP_RATE) {
    return { isValid: false, errorMessage: `${VALIDATION_LIMITS.MIN_CAP_RATE}%以上を入力してください` };
  }

  if (numValue > VALIDATION_LIMITS.MAX_CAP_RATE) {
    return { isValid: false, errorMessage: `${VALIDATION_LIMITS.MAX_CAP_RATE}%以下を入力してください` };
  }

  return { isValid: true };
}

/**
 * Validates price in million yen
 */
export function validatePrice(value: string): FieldValidation {
  if (value === '') {
    return { isValid: true };
  }

  if (!isValidNumberInput(value)) {
    return { isValid: false, errorMessage: '数値を入力してください' };
  }

  const numValue = parseFloat(value);
  if (numValue < VALIDATION_LIMITS.MIN_PRICE_MILLION_YEN) {
    return { isValid: false, errorMessage: '0以上を入力してください' };
  }

  if (numValue > VALIDATION_LIMITS.MAX_PRICE_MILLION_YEN) {
    return { isValid: false, errorMessage: '最大値を超えています' };
  }

  return { isValid: true };
}

/**
 * Validates range inputs (min <= max)
 */
export function validateRange(
  minValue: string,
  maxValue: string,
  fieldName: string
): { minValid: FieldValidation; maxValid: FieldValidation } {
  const minValid = validateNumberField(minValue, fieldName);
  const maxValid = validateNumberField(maxValue, fieldName);

  // If both values are valid and not empty, check range
  if (minValid.isValid && maxValid.isValid && minValue && maxValue) {
    const min = parseFloat(minValue);
    const max = parseFloat(maxValue);
    
    if (min > max) {
      const errorMessage = '最小値は最大値以下である必要があります';
      return {
        minValid: { isValid: false, errorMessage },
        maxValid: { isValid: false, errorMessage },
      };
    }
  }

  return { minValid, maxValid };
}

/**
 * Generic number field validation
 */
function validateNumberField(value: string, fieldName: string): FieldValidation {
  if (value === '') {
    return { isValid: true };
  }

  if (!isValidNumberInput(value)) {
    return { isValid: false, errorMessage: '数値を入力してください' };
  }

  // Field-specific validation
  switch (fieldName) {
    case 'occupancyRate':
      return validateOccupancyRate(value);
    case 'capRate':
      return validateCapRate(value);
    case 'price':
      return validatePrice(value);
    default:
      return { isValid: true };
  }
}

/**
 * Validates complete search form
 */
export function validateSearchForm(params: BuildingSearchParams): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Validate yield range
  if (params.minYield || params.maxYield) {
    const { minValid, maxValid } = validateRange(
      params.minYield || '',
      params.maxYield || '',
      'occupancyRate'
    );
    
    if (!minValid.isValid) errors.minYield = minValid.errorMessage!;
    if (!maxValid.isValid) errors.maxYield = maxValid.errorMessage!;
  }

  // Validate price range
  if (params.minPrice || params.maxPrice) {
    const { minValid, maxValid } = validateRange(
      params.minPrice || '',
      params.maxPrice || '',
      'price'
    );
    
    if (!minValid.isValid) errors.minPrice = minValid.errorMessage!;
    if (!maxValid.isValid) errors.maxPrice = maxValid.errorMessage!;
  }

  // Validate cap rate range
  if (params.minCap || params.maxCap) {
    const { minValid, maxValid } = validateRange(
      params.minCap || '',
      params.maxCap || '',
      'capRate'
    );
    
    if (!minValid.isValid) errors.minCap = minValid.errorMessage!;
    if (!maxValid.isValid) errors.maxCap = maxValid.errorMessage!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates required fields
 */
export function validateRequired(value: string, fieldName: string): FieldValidation {
  if (!value || value.trim() === '') {
    return { isValid: false, errorMessage: `${fieldName}は必須項目です` };
  }
  return { isValid: true };
}

/**
 * Validates string length
 */
export function validateLength(
  value: string,
  minLength: number,
  maxLength?: number
): FieldValidation {
  if (value.length < minLength) {
    return { isValid: false, errorMessage: `${minLength}文字以上で入力してください` };
  }

  if (maxLength && value.length > maxLength) {
    return { isValid: false, errorMessage: `${maxLength}文字以下で入力してください` };
  }

  return { isValid: true };
}