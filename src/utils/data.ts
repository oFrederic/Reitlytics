/**
 * Data transformation utilities
 * 
 * Functions for transforming, filtering, and manipulating data structures
 * including building data mapping and chart data processing.
 */

import { ASSET_TYPES } from '@/constants/business';
import { convertYenToHundredMillionYen } from './currency';
import type { 
  JReitBuilding, 
  BuildingData, 
  AssetTypeFlags,
  TimeFilterOption,
  BaseChartDataPoint,
  DataGranularity,
} from '@/types';

/**
 * Transform JReitBuilding to UI-optimized BuildingData
 */
export function transformBuildingData(jReitBuilding: JReitBuilding): BuildingData {
  // Determine building type from asset type flags
  const assetType = getAssetTypeLabel(jReitBuilding.assetType);
  
  // Get latest occupancy rate or default to 0
  const occupancyRate = jReitBuilding.financials.length > 0
    ? parseFloat(jReitBuilding.financials[0].leasing.occupancyRate) || 0
    : 0;
  
  return {
    id: jReitBuilding.id,
    name: jReitBuilding.buildingSpec.name,
    type: assetType,
    acquisitionDate: jReitBuilding.acquisition.acquisitionDate,
    capRate: parseFloat(jReitBuilding.yieldEvaluation.capRate),
    evaluationAmount: convertYenToHundredMillionYen(jReitBuilding.yieldEvaluation.appraisedPrice),
    occupancyRate: occupancyRate,
  };
}

/**
 * Transform array of JReitBuilding to BuildingData
 */
export function transformBuildingsData(jReitBuildings: JReitBuilding[]): BuildingData[] {
  return jReitBuildings.map(transformBuildingData);
}

/**
 * Get asset type label from asset type flags
 */
export function getAssetTypeLabel(assetType: AssetTypeFlags): string {
  // Find the first true asset type flag
  for (const [, assetTypeInfo] of Object.entries(ASSET_TYPES)) {
    if (assetType[assetTypeInfo.key as keyof AssetTypeFlags]) {
      return assetTypeInfo.label;
    }
  }
  return ASSET_TYPES.OTHER.label;
}

/**
 * Get asset type color from asset type flags
 */
export function getAssetTypeColor(assetType: AssetTypeFlags): string {
  // Find the first true asset type flag
  for (const [, assetTypeInfo] of Object.entries(ASSET_TYPES)) {
    if (assetType[assetTypeInfo.key as keyof AssetTypeFlags]) {
      return assetTypeInfo.color;
    }
  }
  return ASSET_TYPES.OTHER.color;
}

/**
 * Sort buildings by specified criteria
 */
export function sortBuildings(
  buildings: BuildingData[],
  sortBy: 'name' | 'capRate' | 'occupancyRate' | 'evaluationAmount' | 'acquisitionDate',
  order: 'asc' | 'desc' = 'asc'
): BuildingData[] {
  return [...buildings].sort((a, b) => {
    let aValue: unknown;
    let bValue: unknown;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'acquisitionDate':
        aValue = new Date(a.acquisitionDate);
        bValue = new Date(b.acquisitionDate);
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if ((aValue as number) < (bValue as number)) return order === 'asc' ? -1 : 1;
    if ((aValue as number) > (bValue as number)) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter buildings based on search criteria
 */
export function filterBuildings(
  buildings: BuildingData[],
  filters: {
    searchText?: string;
    assetType?: string;
    minCapRate?: number;
    maxCapRate?: number;
    minOccupancyRate?: number;
    maxOccupancyRate?: number;
    minEvaluationAmount?: number;
    maxEvaluationAmount?: number;
  }
): BuildingData[] {
  return buildings.filter(building => {
    // Text search
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      if (!building.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Asset type filter
    if (filters.assetType && building.type !== filters.assetType) {
      return false;
    }

    // Cap rate range
    if (filters.minCapRate !== undefined && building.capRate < filters.minCapRate) {
      return false;
    }
    if (filters.maxCapRate !== undefined && building.capRate > filters.maxCapRate) {
      return false;
    }

    // Occupancy rate range
    if (filters.minOccupancyRate !== undefined && building.occupancyRate < filters.minOccupancyRate) {
      return false;
    }
    if (filters.maxOccupancyRate !== undefined && building.occupancyRate > filters.maxOccupancyRate) {
      return false;
    }

    // Evaluation amount range
    if (filters.minEvaluationAmount !== undefined && building.evaluationAmount < filters.minEvaluationAmount) {
      return false;
    }
    if (filters.maxEvaluationAmount !== undefined && building.evaluationAmount > filters.maxEvaluationAmount) {
      return false;
    }

    return true;
  });
}

/**
 * Group buildings by asset type
 */
export function groupBuildingsByAssetType(buildings: BuildingData[]): Record<string, BuildingData[]> {
  return buildings.reduce((groups, building) => {
    const assetType = building.type;
    if (!groups[assetType]) {
      groups[assetType] = [];
    }
    groups[assetType].push(building);
    return groups;
  }, {} as Record<string, BuildingData[]>);
}

/**
 * Calculate statistics for buildings array
 */
export function calculateBuildingStatistics(buildings: BuildingData[]) {
  if (buildings.length === 0) {
    return {
      count: 0,
      averageCapRate: 0,
      averageOccupancyRate: 0,
      totalEvaluationAmount: 0,
      minCapRate: 0,
      maxCapRate: 0,
      minOccupancyRate: 0,
      maxOccupancyRate: 0,
    };
  }

  const capRates = buildings.map(b => b.capRate);
  const occupancyRates = buildings.map(b => b.occupancyRate);
  const evaluationAmounts = buildings.map(b => b.evaluationAmount);

  return {
    count: buildings.length,
    averageCapRate: capRates.reduce((sum, rate) => sum + rate, 0) / capRates.length,
    averageOccupancyRate: occupancyRates.reduce((sum, rate) => sum + rate, 0) / occupancyRates.length,
    totalEvaluationAmount: evaluationAmounts.reduce((sum, amount) => sum + amount, 0),
    minCapRate: Math.min(...capRates),
    maxCapRate: Math.max(...capRates),
    minOccupancyRate: Math.min(...occupancyRates),
    maxOccupancyRate: Math.max(...occupancyRates),
  };
}

/**
 * Calculate months between two dates
 */
export function calculateMonthsBetween(date1: Date, date2: Date): number {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  const dayFactor = (date2.getDate() - date1.getDate()) / 30; // Approximate for partial months
  
  return yearDiff * 12 + monthDiff + dayFactor;
}

/**
 * Analyze data granularity for chart time filtering
 */
export function analyzeDataGranularity<T extends BaseChartDataPoint>(dataPoints: T[]): DataGranularity {
  if (dataPoints.length < 2) {
    return {
      minIntervalMonths: 0,
      isMonthlyAvailable: true,
      isQuarterlyAvailable: true,
      isHalfYearlyAvailable: true,
    };
  }

  // Sort by date
  const sorted = [...dataPoints].sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  
  // Calculate intervals between consecutive data points
  let minInterval = Infinity;
  for (let i = 1; i < sorted.length; i++) {
    const interval = calculateMonthsBetween(sorted[i-1].rawDate, sorted[i].rawDate);
    minInterval = Math.min(minInterval, interval);
  }

  return {
    minIntervalMonths: minInterval,
    isMonthlyAvailable: minInterval <= 1.1,
    isQuarterlyAvailable: minInterval <= 3.1,
    isHalfYearlyAvailable: minInterval <= 6.1,
  };
}

/**
 * Get time group key for data aggregation
 */
export function getTimeGroupKey(date: Date, timeFilter: TimeFilterOption): string {
  switch (timeFilter) {
    case 'Month' as TimeFilterOption:
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    case 'Quarter' as TimeFilterOption:
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      return `${date.getFullYear()}-Q${quarter}`;
    case 'Halfyear' as TimeFilterOption:
      const half = Math.floor(date.getMonth() / 6) + 1;
      return `${date.getFullYear()}-H${half}`;
    case 'Year' as TimeFilterOption:
    default:
      return `${date.getFullYear()}`;
  }
}

/**
 * Deep clone object (for immutable operations)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

/**
 * Debounce function for search/filter operations
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function for scroll/resize events
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      func(...args);
    }
  };
}

/**
 * Check if two objects are equal (shallow comparison)
 */
export function shallowEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}