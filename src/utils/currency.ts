/**
 * Currency conversion and formatting utilities
 * 
 * Handles conversions between yen, million yen (百万円), and hundred million yen (億円)
 * with proper formatting for Japanese business context.
 */

import { CURRENCY } from '@/constants/business';
import type { CurrencyAmounts } from '@/types/business';

/**
 * Convert value from yen to million yen (百万円)
 */
export function convertYenToMillionYen(valueInYen: number): number {
  return valueInYen / CURRENCY.YEN_TO_MILLION_YEN;
}

/**
 * Convert value from yen to hundred million yen (億円)
 */
export function convertYenToHundredMillionYen(valueInYen: number): number {
  return valueInYen / CURRENCY.YEN_TO_HUNDRED_MILLION_YEN;
}

/**
 * Convert value from million yen (百万円) to yen
 */
export function convertMillionYenToYen(valueInMillionYen: number): number {
  return valueInMillionYen * CURRENCY.YEN_TO_MILLION_YEN;
}

/**
 * Convert value from hundred million yen (億円) to yen
 */
export function convertHundredMillionYenToYen(valueInHundredMillionYen: number): number {
  return valueInHundredMillionYen * CURRENCY.YEN_TO_HUNDRED_MILLION_YEN;
}

/**
 * Get currency amounts in all formats
 */
export function getCurrencyAmounts(yenValue: number): CurrencyAmounts {
  return {
    yen: yenValue,
    millionYen: convertYenToMillionYen(yenValue),
    hundredMillionYen: convertYenToHundredMillionYen(yenValue),
  };
}

/**
 * Format number with Japanese comma separators
 */
export function formatNumberWithCommas(value: number, locale: string = 'ja-JP'): string {
  return value.toLocaleString(locale);
}

/**
 * Format currency amount with appropriate unit
 * Automatically chooses the most readable format
 */
export function formatCurrencyAmount(
  yenValue: number,
  options: {
    unit?: 'yen' | 'million' | 'hundred-million' | 'auto';
    decimals?: number;
    includeUnit?: boolean;
    compact?: boolean;
  } = {}
): string {
  const {
    unit = 'auto',
    decimals = 2,
    includeUnit = true,
    compact = false,
  } = options;

  let displayValue: number;
  let unitLabel: string;

  // Auto-select appropriate unit based on value size
  if (unit === 'auto') {
    if (yenValue >= CURRENCY.YEN_TO_HUNDRED_MILLION_YEN * 10) {
      displayValue = convertYenToHundredMillionYen(yenValue);
      unitLabel = compact ? '億' : CURRENCY.HUNDRED_MILLION_YEN_LABEL;
    } else if (yenValue >= CURRENCY.YEN_TO_MILLION_YEN * 10) {
      displayValue = convertYenToMillionYen(yenValue);
      unitLabel = compact ? '百万' : CURRENCY.MILLION_YEN_LABEL;
    } else {
      displayValue = yenValue;
      unitLabel = '円';
    }
  } else {
    // Use specified unit
    switch (unit) {
      case 'hundred-million':
        displayValue = convertYenToHundredMillionYen(yenValue);
        unitLabel = compact ? '億' : CURRENCY.HUNDRED_MILLION_YEN_LABEL;
        break;
      case 'million':
        displayValue = convertYenToMillionYen(yenValue);
        unitLabel = compact ? '百万' : CURRENCY.MILLION_YEN_LABEL;
        break;
      case 'yen':
      default:
        displayValue = yenValue;
        unitLabel = '円';
        break;
    }
  }

  // Format the number
  const formattedNumber = displayValue.toFixed(decimals);
  const formattedWithCommas = formatNumberWithCommas(parseFloat(formattedNumber));

  // Return with or without unit
  return includeUnit ? `${formattedWithCommas}${unitLabel}` : formattedWithCommas;
}

/**
 * Format percentage value
 */
export function formatPercentage(
  value: number,
  options: {
    decimals?: number;
    includeSymbol?: boolean;
  } = {}
): string {
  const { decimals = 1, includeSymbol = true } = options;
  const formatted = value.toFixed(decimals);
  return includeSymbol ? `${formatted}${CURRENCY.PERCENTAGE_LABEL}` : formatted;
}

/**
 * Format cap rate as percentage
 */
export function formatCapRate(capRate: string | number): string {
  const numValue = typeof capRate === 'string' ? parseFloat(capRate) : capRate;
  return formatPercentage(numValue, { decimals: 2 });
}

/**
 * Format occupancy rate as percentage
 */
export function formatOccupancyRate(occupancyRate: string | number): string {
  const numValue = typeof occupancyRate === 'string' ? parseFloat(occupancyRate) : occupancyRate;
  return formatPercentage(numValue, { decimals: 1 });
}

/**
 * Parse currency string to number (removes formatting)
 */
export function parseCurrencyString(currencyString: string): number {
  // Remove all non-numeric characters except decimal points
  const cleanedString = currencyString.replace(/[^\d.-]/g, '');
  const value = parseFloat(cleanedString);
  return isNaN(value) ? 0 : value;
}

/**
 * Convert user input to appropriate currency unit
 */
export function convertInputToCurrency(
  inputValue: string,
  inputUnit: 'yen' | 'million' | 'hundred-million'
): number {
  const numValue = parseCurrencyString(inputValue);
  
  switch (inputUnit) {
    case 'hundred-million':
      return convertHundredMillionYenToYen(numValue);
    case 'million':
      return convertMillionYenToYen(numValue);
    case 'yen':
    default:
      return numValue;
  }
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format percentage change with appropriate sign and color indication
 */
export function formatPercentageChange(
  change: number,
  options: {
    decimals?: number;
    showSign?: boolean;
    includeSymbol?: boolean;
  } = {}
): string {
  const { decimals = 1, showSign = true, includeSymbol = true } = options;
  
  const sign = showSign && change > 0 ? '+' : '';
  const formatted = change.toFixed(decimals);
  const symbol = includeSymbol ? '%' : '';
  
  return `${sign}${formatted}${symbol}`;
}