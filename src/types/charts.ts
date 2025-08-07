/**
 * Chart and visualization type definitions
 * 
 * Types for chart components, data processing, and visualization
 * to ensure type safety in data visualization components.
 */

// Time filter options for charts
export enum TimeFilterOption {
  Month = '1month',
  Quarter = '3months', 
  Halfyear = '6months',
  Year = '1year',
}

// Data granularity analysis
export interface DataGranularity {
  minIntervalMonths: number;
  isMonthlyAvailable: boolean;
  isQuarterlyAvailable: boolean;
  isHalfYearlyAvailable: boolean;
}

// Chart data point interfaces
export interface BaseChartDataPoint {
  date: string;      // Display date string
  rawDate: Date;     // Actual date object for sorting
}

export interface CapRateDataPoint extends BaseChartDataPoint {
  capRate: number;
}

export interface OccupancyRateDataPoint extends BaseChartDataPoint {
  occupancyRate: number;
}

// Chart component configuration
export interface ChartConfiguration {
  width: number | string;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors: {
    primary: string;
    grid: string;
    text: string;
  };
}

// Chart legends and labels
export interface ChartLegendItem {
  color: string;
  label: string;
  dataKey: string;
}

// Tooltip configuration
export interface TooltipConfig {
  enabled: boolean;
  formatter?: (value: number, name: string) => [string, string];
  labelFormatter?: (label: string) => string;
  contentStyle?: React.CSSProperties;
}

// Chart filter button props
export interface FilterButtonProps {
  label: string;
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

// Time series data for charts  
export interface TimeSeriesData<T extends BaseChartDataPoint> {
  data: T[];
  timeFilter: TimeFilterOption;
  dataGranularity: DataGranularity;
}

// Chart event handlers
export interface ChartEventHandlers {
  onTimeFilterChange?: (filter: TimeFilterOption) => void;
  onDataPointClick?: (dataPoint: BaseChartDataPoint) => void;
  onDataPointHover?: (dataPoint: BaseChartDataPoint | null) => void;
}

// Chart loading and error states
export interface ChartState {
  loading: boolean;
  error: string | null;
  hasData: boolean;
}

// Historical data from API
export interface CapRateHistory {
  id: string;
  jReitBuildingId: string;
  capRate: string;
  closingDate: string;
}

export interface OccupancyRateHistory {
  leasing: {
    occupancyRate: string;
  };
  closingDate: string;
}

// Chart theme customization
export interface ChartTheme {
  colors: {
    primary: string;
    secondary: string;
    grid: string;
    text: string;
    background: string;
  };
  fonts: {
    family: string;
    size: {
      small: number;
      medium: number;
      large: number;
    };
  };
}

// Responsive chart dimensions
export interface ResponsiveChartDimensions {
  width: number;
  height: number;
  needsScrolling: boolean;
  containerWidth: string | number;
}