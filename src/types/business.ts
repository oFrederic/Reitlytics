/**
 * Business domain type definitions
 * 
 * Types specific to Japanese REIT (J-REIT) business domain including
 * property data, financial metrics, and asset classifications.
 */

// Building data optimized for UI display
export interface BuildingData {
  id: string;
  name: string;
  type: string;                    // Japanese asset type label
  acquisitionDate: string;         // Formatted acquisition date
  capRate: number;                 // Latest cap rate as number
  evaluationAmount: number;        // In hundred million yen (億円)
  occupancyRate: number;           // Current occupancy rate percentage
}

// Asset type classification
export interface AssetTypeFlags {
  isOffice: boolean;
  isRetail: boolean;
  isHotel: boolean;
  isParking: boolean;
  isIndustrial: boolean;
  isLogistic: boolean;
  isResidential: boolean;
  isHealthCare: boolean;
  isOther: boolean;
}

// Building acquisition information
export interface BuildingAcquisition {
  acquisitionPrice: number;        // Original acquisition price in yen
  acquisitionDate: string;         // ISO date string
  initialCapRate: string;          // Cap rate at time of acquisition
}

// Building physical specifications
export interface BuildingSpecification {
  name: string;                    // Building name
  address: string;                 // Full address in Japanese
  completedMonth: number;          // Construction completion month
  completedYear: number;           // Construction completion year
  grossFloorArea: string;          // Total floor area in tsubo
  netLeasableAreaTotal: string;    // Leasable area in tsubo
  latitude: string;                // GPS latitude coordinate
  longitude: string;               // GPS longitude coordinate
}

// Financial evaluation data
export interface YieldEvaluation {
  appraisedPrice: number;          // Latest appraisal value in yen
  capRate: string;                 // Latest capitalization rate
}

// Leasing and occupancy information
export interface LeasingData {
  occupancyRate: string;           // Current occupancy percentage
}

// Financial performance data
export interface FinancialData {
  leasing: LeasingData;
}

// Transfer/disposition information
export interface BuildingTransfer {
  transferDate: string | null;     // Disposition date if sold
}

// Geographic coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Asset type with metadata
export interface AssetTypeInfo {
  key: keyof AssetTypeFlags;
  label: string;                   // Japanese label
  color: string;                   // Display color hex code
  icon?: string;                   // Optional icon identifier
}

// Financial metrics for analysis
export interface FinancialMetrics {
  currentCapRate: number;
  averageCapRate?: number;
  capRateChange?: number;          // Percentage change
  occupancyRate: number;
  averageOccupancyRate?: number;
  appraisalValue: number;          // In yen
  appraisalValuePerTsubo?: number;
  yield?: number;                  // Annual yield percentage
}

// Search criteria for property filtering
export interface PropertySearchCriteria {
  assetTypes?: AssetTypeFlags;
  locationArea?: string;
  minCapRate?: number;
  maxCapRate?: number;
  minOccupancyRate?: number;
  maxOccupancyRate?: number;
  minAppraisalValue?: number;      // In yen
  maxAppraisalValue?: number;      // In yen
  minFloorArea?: number;           // In tsubo
  maxFloorArea?: number;           // In tsubo
}

// Property market analysis data
export interface MarketAnalysis {
  totalProperties: number;
  averageCapRate: number;
  averageOccupancyRate: number;
  totalMarketValue: number;        // In yen
  assetTypeDistribution: Record<string, number>;
  geographicDistribution: Record<string, number>;
}

// Currency conversion utilities
export interface CurrencyAmounts {
  yen: number;
  millionYen: number;              // 百万円
  hundredMillionYen: number;       // 億円
}

// Performance trend data
export interface PerformanceTrend {
  period: string;
  capRate: number;
  occupancyRate: number;
  appraisalValue: number;
  changeFromPrevious?: {
    capRate: number;
    occupancyRate: number; 
    appraisalValue: number;
  };
}