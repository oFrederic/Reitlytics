'use client';

import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

/**
 * Type Definitions
 */

// Raw cap rate history data from API
interface CapRateHistory {
  id: string;
  jReitBuildingId: string;
  capRate: string;
  closingDate: string;
}

// Processed data point for chart display
interface ChartDataPoint {
  date: string;      // Display date
  rawDate: Date;     // Actual date object for sorting
  capRate: number;
}

// Component props
interface CapRateChartProps {
  capRateHistories: CapRateHistory[];
  height?: number;
}

// Time filter options
enum TimeFilterOption {
  Month = '1month',
  Quarter = '3months',
  Halfyear = '6months',
  Year = '1year'
}

// Data granularity status
interface DataGranularity {
  minIntervalMonths: number;
  isMonthlyAvailable: boolean;
  isQuarterlyAvailable: boolean;
  isHalfYearlyAvailable: boolean;
}

/**
 * Constants
 */
const TIME_FILTER_LABELS: Record<TimeFilterOption, string> = {
  [TimeFilterOption.Month]: '1ヶ月',
  [TimeFilterOption.Quarter]: '4半期',
  [TimeFilterOption.Halfyear]: '半期',
  [TimeFilterOption.Year]: '1年'
};

const CHART_COLORS = {
  line: '#4F46E5',
  grid: '#e0e0e0',
  text: '#666666',
  warning: {
    text: '#9a3412',
    bg: '#ffedd5',
    border: '#fed7aa'
  }
};

const FILTER_STYLES = {
  active: 'bg-blue-500 text-white',
  inactive: 'bg-gray-200',
  disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed'
};

// Minimum interval thresholds (in months)
const GRANULARITY_THRESHOLDS = {
  monthly: 1.1,     // Allow a little buffer for month-to-month data
  quarterly: 3.1,   // Allow a little buffer for quarterly data
  halfYearly: 6.1   // Allow a little buffer for half-yearly data
};

/**
 * Sub-Components
 */

// Filter button for time period selection
const FilterButton = memo(({ 
  label, 
  isActive, 
  isDisabled,
  onClick 
}: { 
  label: string; 
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={isDisabled}
    className={`px-2 py-1 rounded ${
      isDisabled 
        ? FILTER_STYLES.disabled
        : isActive 
          ? FILTER_STYLES.active 
          : FILTER_STYLES.inactive
    }`}
    aria-pressed={isActive}
    title={isDisabled ? "データの粒度が不足しています" : undefined}
  >
    {label}
  </button>
));

FilterButton.displayName = 'FilterButton';

// Empty state when no data is available
const EmptyState = memo(({ height }: { height: number }) => (
  <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
    <p className="text-gray-500">データがありません</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

const ChartLegend = memo(() => (
  <div className="flex justify-center w-full mb-2">
    <div className="inline-flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.line }}></div>
      <span className="text-sm">キャップレート</span>
    </div>
  </div>
));

ChartLegend.displayName = 'ChartLegend';

const FilterButtons = memo(({ 
  timeFilter,
  dataGranularity,
  handleSetFilter
}: {
  timeFilter: TimeFilterOption;
  dataGranularity: DataGranularity;
  handleSetFilter: (filter: TimeFilterOption) => () => void;
}) => (
  <div className="flex justify-center gap-2 text-sm pt-2">
    {Object.entries(TIME_FILTER_LABELS).map(([filter, label]) => {
      const filterOption = filter as TimeFilterOption;
      const isDisabled = 
        (filterOption === TimeFilterOption.Month && !dataGranularity.isMonthlyAvailable) ||
        (filterOption === TimeFilterOption.Quarter && !dataGranularity.isQuarterlyAvailable) ||
        (filterOption === TimeFilterOption.Halfyear && !dataGranularity.isHalfYearlyAvailable);
      
      return (
        <FilterButton 
          key={filter}
          label={label} 
          isActive={timeFilter === filterOption} 
          isDisabled={isDisabled}
          onClick={handleSetFilter(filterOption)} 
        />
      );
    })}
  </div>
));

FilterButtons.displayName = 'FilterButtons';

/**
 * Utility Functions
 */

// Format date for display based on selected time period
const formatDateForDisplay = (date: Date, filter: TimeFilterOption): string => {
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
const calculateMonthsBetween = (date1: Date, date2: Date): number => {
  const yearDiff = date2.getFullYear() - date1.getFullYear();
  const monthDiff = date2.getMonth() - date1.getMonth();
  const dayFactor = (date2.getDate() - date1.getDate()) / 30; // Approximate for partial months
  
  return yearDiff * 12 + monthDiff + dayFactor;
};

// Check if a filter option should be accessible based on data granularity
const isFilterAvailable = (filter: TimeFilterOption, minInterval: number): boolean => {
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

/**
 * Main Component
 */
function CapRateChart({ capRateHistories = [], height = 300 }: CapRateChartProps) {
  // Process and sort the raw data chronologically
  const sortedHistories = useMemo(() => {
    if (!capRateHistories?.length) return [];
    
    return [...capRateHistories].sort((a, b) => 
      new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
    );
  }, [capRateHistories]);
  
  // Analyze data granularity to detect the minimum interval between data points
  const dataGranularity = useMemo((): DataGranularity => {
    // Default values if we don't have enough data points
    if (sortedHistories.length < 2) {
      return {
        minIntervalMonths: 0,
        isMonthlyAvailable: true,
        isQuarterlyAvailable: true,
        isHalfYearlyAvailable: true
      };
    }
    
    // Convert closing dates to Date objects
    const dates = sortedHistories.map(h => new Date(h.closingDate));
    
    // Calculate intervals between consecutive data points
    let minInterval = Infinity;
    for (let i = 1; i < dates.length; i++) {
      const interval = calculateMonthsBetween(dates[i-1], dates[i]);
      minInterval = Math.min(minInterval, interval);
    }
    
    return {
      minIntervalMonths: minInterval,
      isMonthlyAvailable: isFilterAvailable(TimeFilterOption.Month, minInterval),
      isQuarterlyAvailable: isFilterAvailable(TimeFilterOption.Quarter, minInterval),
      isHalfYearlyAvailable: isFilterAvailable(TimeFilterOption.Halfyear, minInterval)
    };
  }, [sortedHistories]);
  
  // Initialize time filter based on data granularity
  const initialTimeFilter = useMemo(() => {
    if (dataGranularity.isMonthlyAvailable) return TimeFilterOption.Month;
    if (dataGranularity.isQuarterlyAvailable) return TimeFilterOption.Quarter;
    if (dataGranularity.isHalfYearlyAvailable) return TimeFilterOption.Halfyear;
    return TimeFilterOption.Year;
  }, [dataGranularity]);
  
  // State for active time filter
  const [timeFilter, setTimeFilter] = useState<TimeFilterOption>(initialTimeFilter);
  
  // Ensure the selected filter is valid for the data granularity
  useEffect(() => {
    if (
      (timeFilter === TimeFilterOption.Month && !dataGranularity.isMonthlyAvailable) ||
      (timeFilter === TimeFilterOption.Quarter && !dataGranularity.isQuarterlyAvailable) ||
      (timeFilter === TimeFilterOption.Halfyear && !dataGranularity.isHalfYearlyAvailable)
    ) {
      setTimeFilter(initialTimeFilter);
    }
  }, [timeFilter, dataGranularity, initialTimeFilter]);
  
  // Process data for chart display
  const chartData = useMemo(() => {
    if (!sortedHistories.length) return [];
    
    // Group data points based on the time filter
    const groupedData: Record<string, { points: CapRateHistory[]; avgCapRate: number }> = {};
    
    // Group all data points based on the selected time filter
    sortedHistories.forEach(point => {
      const date = new Date(point.closingDate);
      let groupKey: string;
      
      // Create grouping key based on the time filter
      switch (timeFilter) {
        case TimeFilterOption.Month:
          groupKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case TimeFilterOption.Quarter:
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          groupKey = `${date.getFullYear()}-Q${quarter}`;
          break;
        case TimeFilterOption.Halfyear:
          const half = Math.floor(date.getMonth() / 6) + 1;
          groupKey = `${date.getFullYear()}-H${half}`;
          break;
        case TimeFilterOption.Year:
        default:
          groupKey = `${date.getFullYear()}`;
          break;
      }
      
      // Initialize group if it doesn't exist
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = { points: [], avgCapRate: 0 };
      }
      
      // Add point to the group
      groupedData[groupKey].points.push(point);
    });
    
    // Calculate average cap rate for each group and select representative data points
    const resultPoints: ChartDataPoint[] = Object.keys(groupedData).map(groupKey => {
      const group = groupedData[groupKey];
      
      // Calculate average cap rate
      const sum = group.points.reduce((total, point) => total + parseFloat(point.capRate), 0);
      group.avgCapRate = parseFloat((sum / group.points.length).toFixed(2));
      
      // Sort points by date
      const sortedPoints = [...group.points].sort(
        (a, b) => new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime()
      );
      
      // Pick a representative point (middle point)
      const midPointIndex = Math.floor(sortedPoints.length / 2);
      const representativePoint = sortedPoints[midPointIndex];
      
      // Create a chart point with actual date but average cap rate
      const actualDate = new Date(representativePoint.closingDate);
      
      return {
        date: formatDateForDisplay(actualDate, timeFilter),
        rawDate: actualDate,
        capRate: group.avgCapRate
      };
    });
    
    // Sort by date and return
    return resultPoints.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
  }, [sortedHistories, timeFilter]);
  
  // Chart configuration
  const needsScrolling = useMemo(() => chartData.length > 20, [chartData]);
  
  const chartWidth = useMemo(() => {
    const minWidth = Math.max(chartData.length * 60, 800);
    return needsScrolling ? minWidth : '100%';
  }, [chartData.length, needsScrolling]);
  
  const minInterval = useMemo(() => 
    dataGranularity?.minIntervalMonths || 0
  , [dataGranularity]);
  
  // Event handlers
  const handleSetFilter = useCallback((filter: TimeFilterOption) => () => {
    setTimeFilter(filter);
  }, []);
  
  // Formatters
  const formatTooltipValue = useCallback((value: number) => {
    return [`${value.toFixed(2)}%`, 'キャップレート'];
  }, []);
  
  const formatYAxisTick = useCallback((value: number) => {
    return `${value.toFixed(2)}%`;
  }, []);
  
  // Render
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-start mb-4">
        <h3 className="text-lg font-semibold">キャップレート推移</h3>
      </div>
      
      {chartData.length > 0 ? (
        <div className="flex flex-col h-full">
          {/* Chart container with fixed centered legend */}
          <div className="relative">
            {/* Fixed Legend - Always centered */}
            <ChartLegend />
            
            {/* Scrollable chart area */}
            <div 
              className={needsScrolling ? "overflow-x-auto" : ""}
              style={{ height: `${height}px` }}
            >
              <div style={{ 
                width: needsScrolling ? chartWidth : '100%', 
                height: '100%'
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 5, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke={CHART_COLORS.text}
                      angle={-45}
                      textAnchor="end"
                      tickMargin={10}
                      height={32}
                      padding={{ left: 10, right: 10 }}
                      tick={{ fontSize: 12 }}
                      interval={0} // Show all ticks, no skipping
                      axisLine={false} // Hide the X-axis line
                    />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tickFormatter={formatYAxisTick}
                      stroke={CHART_COLORS.text}
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: CHART_COLORS.grid }}
                    />
                    <Tooltip 
                      formatter={formatTooltipValue}
                      labelFormatter={(label) => {
                        // Find the full date for this data point
                        const dataPoint = chartData.find(point => point.date === label);
                        if (dataPoint) {
                          return dataPoint.rawDate.toLocaleDateString('ja-JP');
                        }
                        return label;
                      }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: `1px solid ${CHART_COLORS.grid}`,
                        borderRadius: '4px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="capRate"
                      name="キャップレート"
                      stroke={CHART_COLORS.line}
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Filter buttons */}
          <FilterButtons 
            timeFilter={timeFilter}
            dataGranularity={dataGranularity}
            handleSetFilter={handleSetFilter}
          />
        </div>
      ) : (
        <EmptyState height={height} />
      )}
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(CapRateChart); 