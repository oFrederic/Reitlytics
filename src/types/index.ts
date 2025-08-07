/**
 * Centralized type definitions export
 * 
 * This file provides a single point of import for all application types,
 * making it easy to import types and maintain consistency across the application.
 */

// API-related types
export * from './api';
export type {
  ApiResponse,
  ApiSuccessResponse, 
  ApiErrorResponse,
  ApiError,
  BuildingSearchParams,
  BuildingSearchResult,
  JReitBuilding,
  JReitData,
} from './api';

// UI component types
export * from './ui';
export type {
  BaseComponentProps,
  LoadingState,
  ClickHandler,
  ChangeHandler,
  ButtonProps,
  InputFieldProps,
  SelectFieldProps,
  LayoutProps,
} from './ui';

// Chart and visualization types
export * from './charts';
export type {
  TimeFilterOption,
  DataGranularity,
  CapRateDataPoint,
  OccupancyRateDataPoint,
  ChartConfiguration,
  CapRateHistory,
  OccupancyRateHistory,
} from './charts';

// Business domain types
export * from './business';
export type {
  BuildingData,
  AssetTypeFlags,
  BuildingAcquisition,
  BuildingSpecification,
  YieldEvaluation,
  FinancialMetrics,
  PropertySearchCriteria,
} from './business';

// Utility types
export * from './utilities';
export type {
  Nullable,
  Optional,
  Maybe,
  Dictionary,
  ID,
  Timestamp,
  ISODateString,
  Coordinates,
  ListResult,
  PaginationOptions,
} from './utilities';

// Legacy type imports for backward compatibility
export type { JReitBuilding as Building } from './api';
export type { BuildingData as UIBuilding } from './business';