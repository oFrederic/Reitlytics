/**
 * Business domain constants for J-REIT properties
 */

// Asset types with Japanese labels
export const ASSET_TYPES = {
  OFFICE: {
    key: 'isOffice',
    label: 'オフィス',
    color: '#4285F4', // Blue
  },
  RETAIL: {
    key: 'isRetail', 
    label: '商業施設',
    color: '#EA4335', // Red
  },
  HOTEL: {
    key: 'isHotel',
    label: 'ホテル', 
    color: '#FBBC05', // Yellow
  },
  RESIDENTIAL: {
    key: 'isResidential',
    label: '住宅',
    color: '#34A853', // Green
  },
  LOGISTICS: {
    key: 'isLogistic',
    label: '物流施設',
    color: '#9C27B0', // Purple
  },
  PARKING: {
    key: 'isParking',
    label: '駐車場',
    color: '#FF9800', // Orange
  },
  INDUSTRIAL: {
    key: 'isIndustrial',
    label: '工業施設',
    color: '#795548', // Brown
  },
  HEALTHCARE: {
    key: 'isHealthCare',
    label: 'ヘルスケア',
    color: '#E91E63', // Pink
  },
  OTHER: {
    key: 'isOther',
    label: 'その他',
    color: '#607D8B', // Blue Grey
  },
} as const;

// Currency conversion constants
export const CURRENCY = {
  YEN_TO_MILLION_YEN: 1_000_000,
  YEN_TO_HUNDRED_MILLION_YEN: 100_000_000,
  MILLION_YEN_LABEL: '百万円',
  HUNDRED_MILLION_YEN_LABEL: '億円',
  PERCENTAGE_LABEL: '%',
} as const;

// Property field labels in Japanese
export const PROPERTY_LABELS = {
  NAME: '建物名',
  ADDRESS: '住所',
  ASSET_TYPE: 'アセット',
  ACQUISITION_DATE: '初回取得日',
  CAP_RATE: '最新実CR',
  APPRAISAL_VALUE: '最新鑑定評価額',
  OCCUPANCY_RATE: '現在の稼働率',
  NET_LEASABLE_AREA: '貸付可能面積',
  GROSS_FLOOR_AREA: '延床面積',
  TSUBO_UNIT: '坪',
} as const;

// Search form field labels
export const SEARCH_LABELS = {
  OCCUPANCY_RATE: '稼働率',
  APPRAISAL_VALUE: '最新鑑定評価額', 
  CAP_RATE: '最新CR',
  RANGE_SEPARATOR: '〜',
} as const;

// View mode labels
export const VIEW_MODES = {
  MAP: {
    key: 'map',
    label: '地図',
    icon: 'IoLocationOutline',
  },
  ANALYSIS: {
    key: 'analysis', 
    label: '分析',
    icon: 'IoStatsChartOutline',
  },
} as const;

// Validation limits for search filters
export const VALIDATION_LIMITS = {
  MIN_OCCUPANCY_RATE: 0,
  MAX_OCCUPANCY_RATE: 100,
  MIN_CAP_RATE: 0,
  MAX_CAP_RATE: 20,
  MIN_PRICE_MILLION_YEN: 0,
  MAX_PRICE_MILLION_YEN: 1_000_000,
} as const;