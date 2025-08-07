/**
 * Chart-related constants
 */

// Time filter options for charts
export const TIME_FILTERS = {
  MONTH: {
    value: '1month',
    label: '1ヶ月',
    thresholdMonths: 1.1,
  },
  QUARTER: {
    value: '3months', 
    label: '4半期',
    thresholdMonths: 3.1,
  },
  HALFYEAR: {
    value: '6months',
    label: '半期', 
    thresholdMonths: 6.1,
  },
  YEAR: {
    value: '1year',
    label: '1年',
    thresholdMonths: Infinity, // Always available
  },
} as const;

// Chart color scheme
export const CHART_COLORS = {
  CAP_RATE: '#4F46E5',
  OCCUPANCY_RATE: '#3B82F6',
  GRID: '#e0e0e0',
  TEXT: '#666666',
  WARNING: {
    TEXT: '#9a3412',
    BACKGROUND: '#ffedd5',
    BORDER: '#fed7aa',
  },
  
  // Legacy names for backward compatibility
  capRate: '#4F46E5',
  occupancyRate: '#3B82F6',
  grid: '#e0e0e0',
  text: '#666666',
} as const;

// Chart dimensions and layout
export const CHART_CONFIG = {
  DEFAULT_HEIGHT: 300,
  COMPACT_HEIGHT: 250,
  MAX_DATA_POINTS_BEFORE_SCROLL: 20,
  MIN_CHART_WIDTH: 800,
  DATA_POINT_WIDTH: 60,
  MARGINS: {
    TOP: 10,
    RIGHT: 20,
    BOTTOM: 20,
    LEFT: 2,
  },
  TICK: {
    FONT_SIZE: 11,
    Y_AXIS_FONT_SIZE: 12,
    ANGLE: -45,
    MARGIN: 5,
    HEIGHT: 28,
  },
} as const;

// Filter button styles
export const FILTER_STYLES = {
  active: 'bg-blue-500 text-white',
  inactive: 'bg-gray-200',
  disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed',
} as const;

// Tooltip configuration
export const TOOLTIP_CONFIG = {
  OFFSET: 25,
  STYLES: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
  },
} as const;

// Chart legends
export const CHART_LEGENDS = {
  CAP_RATE: 'キャップレート',
  OCCUPANCY_RATE: '稼働率',
} as const;