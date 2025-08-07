/**
 * Chart utilities and helper functions
 * 
 * Shared utilities for chart components including time filtering,
 * data granularity analysis, and formatting functions.
 */

import { TIME_FILTERS, CHART_COLORS, CHART_CONFIG, FILTER_STYLES } from '@/constants/charts';
import type { TimeFilterOption, DataGranularity } from '@/types/charts';

// Re-export types for backward compatibility
export type { TimeFilterOption, DataGranularity } from '@/types/charts';

// Re-export constants
export { CHART_COLORS, FILTER_STYLES };

// Time filter labels mapping
export const TIME_FILTER_LABELS: Record<string, string> = Object.entries(TIME_FILTERS).reduce(
  (acc, [, config]) => {
    acc[config.value] = config.label;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Utility Functions
 */

// Format date for display based on selected time period
export const formatDateForDisplay = (date: Date, filter: TimeFilterOption): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth is 0-indexed
  const day = date.getDate();
  
  // Format based on the time filter
  switch (filter) {
    case TIME_FILTERS.MONTH.value:
      return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    case TIME_FILTERS.QUARTER.value:
    case TIME_FILTERS.HALFYEAR.value:
      return `${year}/${month.toString().padStart(2, '0')}`;
    case TIME_FILTERS.YEAR.value:
    default:
      return `${year}`;
  }
};

// Calculate months between two dates
export const calculateMonthsBetween = (date1: Date, date2: Date): number => {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  const dayFactor = (date2.getDate() - date1.getDate()) / 30; // Approximate for partial months
  
  return yearDiff * 12 + monthDiff + dayFactor;
};

// Check if a filter option should be accessible based on data granularity
export const isFilterAvailable = (filter: TimeFilterOption, minInterval: number): boolean => {
  const timeFilterConfig = Object.values(TIME_FILTERS).find(config => config.value === filter);
  if (!timeFilterConfig) return false;
  
  // Year is always available
  if (filter === TIME_FILTERS.YEAR.value) return true;
  
  return minInterval <= timeFilterConfig.thresholdMonths;
};

// Get time grouping key for a date based on selected filter
export const getTimeGroupKey = (date: Date, timeFilter: TimeFilterOption): string => {
  switch (timeFilter) {
    case TIME_FILTERS.MONTH.value:
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    case TIME_FILTERS.QUARTER.value:
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `${date.getFullYear()}-Q${quarter}`;
    case TIME_FILTERS.HALFYEAR.value:
      const half = Math.floor(date.getMonth() / 6) + 1;
      return `${date.getFullYear()}-H${half}`;
    case TIME_FILTERS.YEAR.value:
    default:
      return `${date.getFullYear()}`;
  }
};

// Create initial data granularity object
export const createDefaultDataGranularity = (): DataGranularity => ({
  minIntervalMonths: 0,
  isMonthlyAvailable: true,
  isQuarterlyAvailable: true,
  isHalfYearlyAvailable: true
});

// Calculate appropriate time filter based on data granularity
export const calculateInitialTimeFilter = (dataGranularity: DataGranularity): TimeFilterOption => {
  if (dataGranularity.isMonthlyAvailable) return TIME_FILTERS.MONTH.value as TimeFilterOption;
  if (dataGranularity.isQuarterlyAvailable) return TIME_FILTERS.QUARTER.value as TimeFilterOption;
  if (dataGranularity.isHalfYearlyAvailable) return TIME_FILTERS.HALFYEAR.value as TimeFilterOption;
  return TIME_FILTERS.YEAR.value as TimeFilterOption;
};

// Calculate whether scrolling is needed based on data length
export const calculateChartWidth = (dataLength: number, needsScrolling: boolean): string | number => {
  const minWidth = Math.max(dataLength * CHART_CONFIG.DATA_POINT_WIDTH, CHART_CONFIG.MIN_CHART_WIDTH);
  return needsScrolling ? minWidth : '100%';
};

// Standard tooltip styles using chart configuration
export const TOOLTIP_STYLES = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: `1px solid ${CHART_COLORS.grid}`,
  borderRadius: '4px'
}; 