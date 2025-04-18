/**
 * Common Types for Chart Components
 */

// Shared time filter options
export enum TimeFilterOption {
  Month = '1month',
  Quarter = '3months',
  Halfyear = '6months',
  Year = '1year'
}

export const TIME_FILTER_LABELS: Record<TimeFilterOption, string> = {
  [TimeFilterOption.Month]: '1ヶ月',
  [TimeFilterOption.Quarter]: '4半期',
  [TimeFilterOption.Halfyear]: '半期',
  [TimeFilterOption.Year]: '1年'
};

// Data granularity status
export interface DataGranularity {
  minIntervalMonths: number;
  isMonthlyAvailable: boolean;
  isQuarterlyAvailable: boolean;
  isHalfYearlyAvailable: boolean;
}

// Chart theme constants
export const CHART_COLORS = {
  capRate: '#4F46E5',
  occupancyRate: '#3B82F6',
  grid: '#e0e0e0',
  text: '#666666',
  warning: {
    text: '#9a3412',
    bg: '#ffedd5',
    border: '#fed7aa'
  }
};

export const FILTER_STYLES = {
  active: 'bg-blue-500 text-white',
  inactive: 'bg-gray-200',
  disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed'
};

// Minimum interval thresholds (in months)
export const GRANULARITY_THRESHOLDS = {
  monthly: 1.1,     // Allow a little buffer for month-to-month data
  quarterly: 3.1,   // Allow a little buffer for quarterly data
  halfYearly: 6.1   // Allow a little buffer for half-yearly data
};

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
    case TimeFilterOption.Month:
      return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    case TimeFilterOption.Quarter:
    case TimeFilterOption.Halfyear:
      return `${year}/${month.toString().padStart(2, '0')}`;
    case TimeFilterOption.Year:
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
  switch (filter) {
    case TimeFilterOption.Month:
      return minInterval <= GRANULARITY_THRESHOLDS.monthly;
    case TimeFilterOption.Quarter:
      return minInterval <= GRANULARITY_THRESHOLDS.quarterly;
    case TimeFilterOption.Halfyear:
      return minInterval <= GRANULARITY_THRESHOLDS.halfYearly;
    case TimeFilterOption.Year:
      return true; // Year is always available
    default:
      return false;
  }
};

// Get time grouping key for a date based on selected filter
export const getTimeGroupKey = (date: Date, timeFilter: TimeFilterOption): string => {
  switch (timeFilter) {
    case TimeFilterOption.Month:
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    case TimeFilterOption.Quarter:
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `${date.getFullYear()}-Q${quarter}`;
    case TimeFilterOption.Halfyear:
      const half = Math.floor(date.getMonth() / 6) + 1;
      return `${date.getFullYear()}-H${half}`;
    case TimeFilterOption.Year:
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
  if (dataGranularity.isMonthlyAvailable) return TimeFilterOption.Month;
  if (dataGranularity.isQuarterlyAvailable) return TimeFilterOption.Quarter;
  if (dataGranularity.isHalfYearlyAvailable) return TimeFilterOption.Halfyear;
  return TimeFilterOption.Year;
};

// Calculate whether scrolling is needed based on data length
export const calculateChartWidth = (dataLength: number, needsScrolling: boolean): string | number => {
  const minWidth = Math.max(dataLength * 60, 800);
  return needsScrolling ? minWidth : '100%';
};

// Standard tooltip styles
export const TOOLTIP_STYLES = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: `1px solid ${CHART_COLORS.grid}`,
  borderRadius: '4px'
}; 